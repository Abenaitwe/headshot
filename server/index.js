import express from 'express'
import morgan from 'morgan'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Capture raw body for signature verification (JSON and URL-encoded)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf
    },
  })
)
app.use(
  express.urlencoded({
    extended: true,
    verify: (req, _res, buf) => {
      req.rawBody = buf
    },
  })
)

// Simple request logging
app.use(morgan('combined'))

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}
const logFile = path.join(logsDir, 'freemius.log')

function appendLog(line) {
  fs.appendFile(logFile, line + '\n', () => {})
}

// Environment variables
const FREEMIUS_WEBHOOK_SECRET = process.env.FREEMIUS_WEBHOOK_SECRET || process.env.VITE_FREEMIUS_SECRET_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE || 'subscriptions'

// Initialize Supabase (server-side) if service role key is provided
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// Map Freemius plan IDs to internal plan keys and transformation limits
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
  return (
    req.get('x-freemius-signature') ||
    req.get('x-fs-signature') ||
    req.get('x-freemius-webhook-signature') ||
    ''
  )
}

function verifyFreemiusSignature(req) {
  if (!FREEMIUS_WEBHOOK_SECRET) return false
  const providedSig = getSignatureFromHeaders(req)
  if (!providedSig) return false

  const expected = crypto
    .createHmac('sha256', FREEMIUS_WEBHOOK_SECRET)
    .update(req.rawBody || Buffer.from(''))
    .digest('base64')

  return timingSafeEqual(providedSig, expected)
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
  // Try to get stable identifiers from Freemius payload
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
    appendLog(`[skip-db] No Supabase service key configured. Would upsert: email=${userEmail}, userId=${userId}, status=${status}, planId=${planId}`)
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

  // Try to upsert by subscription_id, else by license_id, else by user_email
  const upsertKeys = ['subscription_id', 'license_id', 'user_email']
  for (const key of upsertKeys) {
    if (!payload[key]) continue
    const { error } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .upsert(payload, { onConflict: key })
    if (!error) return
    appendLog(`[db-error] upsert on ${key} failed: ${error.message}`)
  }

  // If all failed, attempt insert
  const { error: insertError } = await supabase.from(SUBSCRIPTIONS_TABLE).insert(payload)
  if (insertError) {
    appendLog(`[db-error] insert failed: ${insertError.message}`)
  }
}

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.post('/freemius/webhook', async (req, res) => {
  const verified = verifyFreemiusSignature(req)
  const eventName = normalizeEventName(req.body || {})

  appendLog(`[recv] verified=${verified} event=${eventName} headers=${JSON.stringify(req.headers)} body=${JSON.stringify(req.body)}`)

  if (!verified) {
    // Always return 200 to avoid retries when misconfigured, but log verification failure
    // Optionally, you can return 400 to force retries while configuring
    return res.status(200).json({ received: true, verified: false })
  }

  const payload = req.body || {}
  const { userEmail, userId, licenseId, subscriptionId, planId } = extractIdentifiers(payload)
  const planMeta = PLAN_MAP[planId] || null

  // Default values
  let status = 'unknown'
  let renewsAt = payload?.subscription?.next_payment || payload?.subscription?.trial_ends || null
  let transformationsLimit = planMeta?.transformations || null

  const normalized = String(eventName).toLowerCase()

  if (
    normalized.includes('payment.completed') ||
    normalized.includes('payment.succeeded') ||
    normalized.includes('purchase.completed') ||
    normalized === 'after_payment'
  ) {
    status = 'active'
  } else if (
    normalized.includes('subscription.renewed') ||
    normalized.includes('renewal_payment_succeeded')
  ) {
    status = 'active'
  } else if (
    normalized.includes('subscription.canceled') ||
    normalized.includes('subscription.cancelled') ||
    normalized === 'after_subscription_cancellation'
  ) {
    status = 'canceled'
    renewsAt = null
  } else if (
    normalized.includes('refund') ||
    normalized.includes('payment.refunded')
  ) {
    status = 'refunded'
  } else if (
    normalized.includes('trial.started') ||
    normalized.includes('trial_activated')
  ) {
    status = 'trialing'
  } else if (
    normalized.includes('trial.ended') ||
    normalized.includes('trial_expired')
  ) {
    status = 'past_due'
  } else if (
    normalized.includes('license.upgraded') ||
    normalized.includes('plan.upgraded')
  ) {
    status = 'active'
  } else if (
    normalized.includes('license.downgraded') ||
    normalized.includes('plan.downgraded')
  ) {
    status = 'active'
  } else if (normalized.includes('payment.failed')) {
    status = 'past_due'
  }

  // Upsert subscription state
  await upsertSubscription({
    userEmail,
    userId,
    licenseId,
    subscriptionId,
    planId,
    status,
    renewsAt,
    transformationsLimit,
    rawPayload: payload,
  })

  return res.status(200).json({ received: true, verified: true })
})

// CORS (adjust origin as needed)
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))

app.get('/api/subscription', async (req, res) => {
  if (!supabase) return res.status(200).json({})
  const email = (req.query.email || '').toString().toLowerCase()
  if (!email) return res.status(400).json({ error: 'email required' })
  const { data, error } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select('*')
    .eq('user_email', email)
    .maybeSingle()
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data || {})
})

app.post('/api/subscription/increment', async (req, res) => {
  if (!supabase) return res.status(200).json({})
  const email = (req.body?.email || '').toString().toLowerCase()
  if (!email) return res.status(400).json({ error: 'email required' })

  // Fetch subscription
  const { data: sub, error: fetchErr } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select('*')
    .eq('user_email', email)
    .maybeSingle()
  if (fetchErr) return res.status(500).json({ error: fetchErr.message })
  if (!sub) return res.status(404).json({ error: 'subscription not found' })

  const used = Number(sub.transformations_used || 0)
  const limit = Number(sub.transformations_limit || 0)
  if (limit && used >= limit) {
    return res.status(403).json({ error: 'usage limit reached' })
  }

  const { data: updated, error: updErr } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .update({ transformations_used: used + 1 })
    .eq('id', sub.id)
    .select()
    .maybeSingle()
  if (updErr) return res.status(500).json({ error: updErr.message })
  return res.status(200).json(updated)
})

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`)
  appendLog(`[start] listening on ${PORT} at ${new Date().toISOString()}`)
}) 