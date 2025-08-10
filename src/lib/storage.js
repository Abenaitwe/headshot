import { supabase } from './supabase.js'

const BUCKET = 'headshots'

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(',')
  const contentTypeMatch = /data:(.*?);base64/.exec(meta || '')
  const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream'
  const byteChars = atob(base64 || '')
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i)
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: contentType })
}

function buildPath(userId, type, extension) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2)
  const ts = Date.now()
  const ext = extension?.replace('.', '') || 'png'
  return `${userId}/${yyyy}/${mm}/${dd}/${ts}_${rand}_${type}.${ext}`
}

export async function uploadDataUrlToHeadshots(userId, dataUrl, type = 'original') {
  const blob = dataUrlToBlob(dataUrl)
  const ext = (blob.type || '').split('/')[1] || 'png'
  const path = buildPath(userId, type, ext)
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType: blob.type,
  })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadRemoteImageToHeadshots(userId, url, type = 'transformed') {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch transformed image')
  const contentType = res.headers.get('content-type') || 'image/png'
  const ext = contentType.split('/')[1] || 'png'
  const blob = await res.blob()
  const path = buildPath(userId, type, ext)
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, blob, {
    cacheControl: '3600',
    upsert: false,
    contentType,
  })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
} 