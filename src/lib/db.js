import { supabase } from './supabase.js'

// User settings
export async function getUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function upsertUserSettings(userId, updates) {
  const payload = { user_id: userId, ...updates }
  const { data, error } = await supabase
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

// Transformations
export async function listTransformations(userId) {
  const { data, error } = await supabase
    .from('transformations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function listTransformationsPage(userId, { page = 1, pageSize = 10 } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await supabase
    .from('transformations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function addTransformation({
  userId,
  originalImageUrl,
  transformedImageUrl,
  status = 'completed',
  processingTime,
  jobId,
}) {
  const { data, error } = await supabase
    .from('transformations')
    .insert({
      user_id: userId,
      original_image_url: originalImageUrl || null,
      transformed_image_url: transformedImageUrl,
      status,
      processing_time: processingTime || null,
      job_id: jobId || null,
    })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function deleteTransformation(userId, id) {
  const { error } = await supabase
    .from('transformations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
} 