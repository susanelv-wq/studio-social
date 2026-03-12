import { Project, AppState } from './types'
import { createClient } from './supabase/client'

const CLIENT_ID_KEY = 'supabase-client-id'

function getAnonymousId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(CLIENT_ID_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

/** When signed in: use user id so projects are per-user. When signed out: use anonymous id (per device). */
async function getStorageId(): Promise<string> {
  const supabase = createClient()
  if (!supabase) return getAnonymousId()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? getAnonymousId()
}

export async function loadProjects(): Promise<Project[]> {
  const supabase = createClient()
  if (!supabase) return []

  const clientId = await getStorageId()
  if (!clientId) return []

  const { data, error } = await supabase
    .from('projects')
    .select('data')
    .eq('client_id', clientId)
    .order('updated_at', { ascending: false })

  if (error) {
    const msg = error?.message ?? (error as { code?: string })?.code ?? JSON.stringify(error)
    console.warn('Supabase loadProjects failed (using localStorage fallback):', msg)
    throw error
  }

  return (data ?? []).map((row) => row.data as Project)
}

export async function saveProjects(projects: Project[]): Promise<void> {
  const supabase = createClient()
  if (!supabase) return

  const clientId = await getStorageId()
  if (!clientId) return

  const rows = projects.map((p) => ({
    id: p.id,
    client_id: clientId,
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
    console.warn('Supabase saveProjects failed (using localStorage fallback):', msg)
    throw error
  }
}
