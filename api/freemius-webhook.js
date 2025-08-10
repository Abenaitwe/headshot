import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Env
const FREEMIUS_WEBHOOK_SECRET = process.env.FREEMIUS_WEBHOOK_SECRET || process.env.VITE_FREEMIUS_SECRET_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE || 'subscriptions'

// Initialize Supabase client once per lambda cold start
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// Plan mapping (Freemius plan_id -> internal key & limits)
const PLAN_MAP = {
  '33343': { key: 'starter', transformations: 15 },
  '33378': { key: 'pro', transformations: 50 },
  '33379': { key: 'premium', transformations: 100 },
}

function timingSafeEqual(a, b) {
  try {
    const aBuf = Buffer.from(a)
    const bBuf = Buffer.from(b)
    if (aBuf.length !== bBuf.length) return false
    return crypto.timingSafeEqual(aBuf, bBuf)
  } catch {
    return false
  }
}

function getSignatureFromHeaders(req) {
  const headers = req.headers || {}
  return (
    headers['x-freemius-signature'] ||
    headers['x-fs-signature'] ||
    headers['x-freemius-webhook-signature'] ||
    ''
  )
}

function verifyFreemiusSignature(rawBody, req) {
  if (!FREEMIUS_WEBHOOK_SECRET) return false
  const providedSig = String(getSignatureFromHeaders(req) || '')
  if (!providedSig) return false
  const expected = crypto
    .createHmac('sha256', FREEMIUS_WEBHOOK_SECRET)
    .update(rawBody || Buffer.from(''))
    .digest('base64')
  return timingSafeEqual(providedSig, expected)
}

async function bufferFromRequest(req) {
  return await new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function normalizeEventName(payload) {
  return (
    payload?.event ||
    payload?.action ||
    payload?.type ||
    payload?.topic ||
    'unknown'
  )
}

function extractIdentifiers(payload) {
  const userEmail = payload?.user?.email || payload?.customer?.email || payload?.email || null
  const userId = payload?.user?.id || payload?.user_id || null
  const licenseId = payload?.license?.id || payload?.license_id || null
  const subscriptionId = payload?.subscription?.id || payload?.subscription_id || null
  const planId = String(
    payload?.plan?.id || payload?.subscription?.plan_id || payload?.license?.plan_id || payload?.plan_id || ''
  )
  return { userEmail, userId, licenseId, subscriptionId, planId }
}

async function upsertSubscription({
  userEmail,
  userId,
  licenseId,
  subscriptionId,
  planId,
  status,
  renewsAt,
  transformationsLimit,
  rawPayload,
}) {
  if (!supabase) {
    console.log('[skip-db] No Supabase service key configured. Would upsert:', {
      userEmail,
      userId,
      licenseId,
      subscriptionId,
      planId,
      status,
      renewsAt,
      transformationsLimit,
    })
    return
  }

  const payload = {
    user_email: userEmail,
    user_id: userId,
    license_id: licenseId,
    subscription_id: subscriptionId,
    plan_id: planId,
    plan_key: PLAN_MAP[planId]?.key || null,
    status,
    renews_at: renewsAt || null,
    transformations_limit: transformationsLimit || null,
    last_event_at: new Date().toISOString(),
    raw_payload: rawPayload || null,
  }

  const upsertKeys = ['subscription_id', 'license_id', 'user_email']
  for (const key of upsertKeys) {
    if (!payload[key]) continue
    const { error } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .upsert(payload, { onConflict: key })
    if (!error) return
    console.log(`[db-error] upsert on ${key} failed: ${error.message}`)
  }

  const { error: insertError } = await supabase.from(SUBSCRIPTIONS_TABLE).insert(payload)
  if (insertError) {
    console.log(`[db-error] insert failed: ${insertError.message}`)
  }
}

function determineStatusAndMeta(normalizedEvent, payload, planMeta) {
  let status = 'unknown'
  let renewsAt = payload?.subscription?.next_payment || payload?.subscription?.trial_ends || null
  let transformationsLimit = planMeta?.transformations || null

  if (
    normalizedEvent.includes('payment.completed') ||
    normalizedEvent.includes('payment.succeeded') ||
    normalizedEvent.includes('purchase.completed') ||
    normalizedEvent === 'after_payment'
  ) {
    status = 'active'
  } else if (
    normalizedEvent.includes('subscription.renewed') ||
    normalizedEvent.includes('license.renewed')
  ) {
    status = 'active'
  } else if (
    normalizedEvent.includes('payment.failed') ||
    normalizedEvent.includes('charge.failed') ||
    normalizedEvent.includes('payment.refunded') ||
    normalizedEvent.includes('refund')
  ) {
    status = 'past_due'
  } else if (
    normalizedEvent.includes('subscription.canceled') ||
    normalizedEvent.includes('license.canceled') ||
    normalizedEvent.includes('cancellation')
  ) {
    status = 'canceled'
  } else if (
    normalizedEvent.includes('trial.started') ||
    normalizedEvent.includes('trialing')
  ) {
    status = 'trialing'
  }

  return { status, renewsAt, transformationsLimit }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  let rawBody
  try {
    rawBody = await bufferFromRequest(req)
  } catch (e) {
    console.log('[error] failed to read body:', e?.message)
    return res.status(400).json({ error: 'Invalid body' })
  }

  const verified = verifyFreemiusSignature(rawBody, req)

  let body = {}
  try {
    body = JSON.parse(rawBody.toString('utf8') || '{}')
  } catch {
    body = {}
  }

  const eventName = normalizeEventName(body)
  const normalized = String(eventName).toLowerCase()
  const { userEmail, userId, licenseId, subscriptionId, planId } = extractIdentifiers(body)
  const planMeta = PLAN_MAP[planId] || null

  const { status, renewsAt, transformationsLimit } = determineStatusAndMeta(normalized, body, planMeta)

  console.log('[freemius-webhook]', {
    verified,
    eventName,
    normalized,
    headers: req.headers,
    identifiers: { userEmail, userId, licenseId, subscriptionId, planId },
  })

  // Upsert in background but don't block response excessively
  try {
    await upsertSubscription({
      userEmail,
      userId,
      licenseId,
      subscriptionId,
      planId,
      status,
      renewsAt,
      transformationsLimit,
      rawPayload: body,
    })
  } catch (e) {
    console.log('[upsert-error]', e?.message)
  }

  // Always 200 to avoid webhook retries while configuring, include verification flag
  return res.status(200).json({ received: true, verified })
} 