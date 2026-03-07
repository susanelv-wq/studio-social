import { Project, AppState } from './types'
import { createClient } from './supabase/client'

const CLIENT_ID_KEY = 'supabase-client-id'

function getClientId(): string {
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

export async function loadProjects(): Promise<Project[]> {
  const supabase = createClient()
  if (!supabase) return []

  const clientId = getClientId()
  if (!clientId) return []

  const { data, error } = await supabase
    .from('projects')
    .select('data')
    .eq('client_id', clientId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Supabase loadProjects error:', error)
    return []
  }

  return (data ?? []).map((row) => row.data as Project)
}

export async function saveProjects(projects: Project[]): Promise<void> {
  const supabase = createClient()
  if (!supabase) return

  const clientId = getClientId()
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
    console.error('Supabase saveProjects error:', error)
  }
}
