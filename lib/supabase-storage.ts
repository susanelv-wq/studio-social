import { Project } from './types'
import { createClient } from './supabase/client'

/**
 * Load projects from Supabase for the given user id (must be signed-in user).
 * Call only when userId is non-null; otherwise use localStorage in storage.ts.
 */
export async function loadProjects(userId: string): Promise<Project[]> {
  const supabase = createClient()
  if (!supabase || !userId) return []

  const { data, error } = await supabase
    .from('projects')
    .select('data')
    .eq('client_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    const msg = error?.message ?? (error as { code?: string })?.code ?? JSON.stringify(error)
    console.warn('Supabase loadProjects failed:', msg)
    throw error
  }

  return (data ?? []).map((row) => row.data as Project)
}

/**
 * Save projects to Supabase for the given user id (must be signed-in user).
 * Call only when userId is non-null; otherwise use localStorage in storage.ts.
 */
export async function saveProjects(projects: Project[], userId: string): Promise<void> {
  const supabase = createClient()
  if (!supabase || !userId) return

  const rows = projects.map((p) => ({
    id: p.id,
    client_id: userId,
    name: p.name,
    data: p,
    created_at: p.createdAt,
    updated_at: p.updatedAt
  }))

  const { error } = await supabase.from('projects').upsert(rows, {
    onConflict: 'id',
    ignoreDuplicates: false
  })

  if (error) {
    const msg = error?.message ?? (error as { code?: string })?.code ?? JSON.stringify(error)
    console.warn('Supabase saveProjects failed:', msg)
    throw error
  }
}
