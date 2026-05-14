'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import crypto from 'node:crypto'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAction(_prev, formData) {
  const password = formData.get('password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password. Please try again.' }
  }
  const token = crypto.randomBytes(32).toString('hex')
  const jar = await cookies()
  jar.set('hw-admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return { success: true }
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete('hw-admin-session')
}

// ── Storage ──────────────────────────────────────────────────────────────────

export async function ensureBucket() {
  const sb = adminClient()
  try {
    await sb.storage.createBucket('costume-photos', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760,
    })
  } catch {
    // Bucket already exists — that's fine
  }
}

// ── Costumes ─────────────────────────────────────────────────────────────────

export async function saveCostume(formData) {
  const sb = adminClient()
  const isNew = !formData.get('id')
  const name = formData.get('name')?.trim()
  const tagline = formData.get('tagline')?.trim() || null
  const bio = formData.get('bio')?.trim() || null
  const year = parseInt(formData.get('year')) || new Date().getFullYear()
  const keepUrls = formData.getAll('keep_url')

  if (!name) return { error: 'Costume name is required.' }

  let costumeId = formData.get('id') || null

  if (isNew) {
    await ensureBucket()
    const { data, error } = await sb
      .from('costumes')
      .insert({ name, tagline, bio, year, photo_urls: [] })
      .select('id')
      .single()
    if (error) return { error: error.message }
    costumeId = data.id
  }

  // Upload new photos
  const newUrls = []
  const photos = formData.getAll('photos').filter(f => f?.size > 0)
  for (const photo of photos) {
    const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${costumeId}/${Date.now()}-${safeName}`
    const { error: uploadErr } = await sb.storage
      .from('costume-photos')
      .upload(path, photo, { contentType: photo.type, upsert: false })
    if (!uploadErr) {
      const { data: urlData } = sb.storage.from('costume-photos').getPublicUrl(path)
      newUrls.push(urlData.publicUrl)
    }
  }

  const photoUrls = [...keepUrls, ...newUrls]
  const payload = { name, tagline, bio, photo_urls: photoUrls }
  if (isNew) payload.year = year

  const { error } = await sb.from('costumes').update(payload).eq('id', costumeId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/costumes')
  revalidatePath('/')
  return { success: true, costumeId }
}

export async function deleteCostume(id) {
  const sb = adminClient()

  const { data: costume } = await sb
    .from('costumes')
    .select('photo_urls')
    .eq('id', id)
    .single()

  if (costume?.photo_urls?.length) {
    const paths = costume.photo_urls
      .map(url => {
        try {
          const match = url.match(/\/costume-photos\/(.+)$/)
          return match ? match[1] : null
        } catch { return null }
      })
      .filter(Boolean)
    if (paths.length) await sb.storage.from('costume-photos').remove(paths)
  }

  const { error } = await sb.from('costumes').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/costumes')
  revalidatePath('/')
  return { success: true }
}

// ── Settings ─────────────────────────────────────────────────────────────────

export async function saveSetting(key, value) {
  const sb = adminClient()
  const { error } = await sb
    .from('settings')
    .upsert({ key, value: String(value) }, { onConflict: 'key' })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/costumes')
  return { success: true }
}
