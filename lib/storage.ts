import { Project, AppState } from './types'
import { isSupabaseConfigured } from './supabase/client'
import * as supabaseStorage from './supabase-storage'

const STORAGE_KEY = 'social-mockup-studio'

function currentProjectKey(userId: string | null): string {
  if (typeof window === 'undefined') return 'current-project-id'
  return userId ? `current-project-id-${userId}` : 'current-project-id'
}

function saveProjectsLocal(projects: Project[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (error) {
      console.error('Failed to save projects:', error)
    }
  }
}

function loadProjectsLocal(): Project[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load projects:', error)
    return []
  }
}

/** Persist projects. When userId is set and Supabase configured, save to Supabase (per-user). Else localStorage. */
export async function saveProjects(projects: Project[], userId: string | null): Promise<void> {
  if (isSupabaseConfigured() && userId) {
    try {
      await supabaseStorage.saveProjects(projects, userId)
    } catch {
      saveProjectsLocal(projects)
    }
  } else {
    saveProjectsLocal(projects)
  }
}

/** Load projects. When userId is set and Supabase configured, load from Supabase (per-user). Else localStorage. */
export async function loadProjects(userId: string | null): Promise<Project[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      return await supabaseStorage.loadProjects(userId)
    } catch {
      return loadProjectsLocal()
    }
  }
  return loadProjectsLocal()
}

export function saveCurrentProjectId(projectId: string, userId: string | null): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(currentProjectKey(userId), projectId)
    } catch (error) {
      console.error('Failed to save current project ID:', error)
    }
  }
}

export function loadCurrentProjectId(userId: string | null): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(currentProjectKey(userId)) || ''
  } catch (error) {
    console.error('Failed to load current project ID:', error)
    return ''
  }
}

export function createDefaultProject(name: string): Project {
  const now = new Date().toISOString()
  return {
    id: Math.random().toString(36).substring(2, 11),
    name,
    brandSettings: {
      name: name,
      primaryColor: '#3b82f6', // blue
      secondaryColor: '#1f2937', // dark gray
      accentColor: '#f59e0b', // amber
      fontVibe: 'Bold & Modern'
    },
    feedItems: [],
    reelItems: [],
    storyFrames: [],
    tasks: [],
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Load initial app state for the given user.
 * userId: signed-in user id, or null for anonymous (localStorage only).
 */
export async function getInitialState(userId: string | null): Promise<AppState> {
  const projects = await loadProjects(userId)
  const storedCurrentId = loadCurrentProjectId(userId)

  if (projects.length === 0) {
    const defaultProject = createDefaultProject('My First Project')
    const newProjects = [defaultProject]
    await saveProjects(newProjects, userId)
    saveCurrentProjectId(defaultProject.id, userId)
    return {
      projects: newProjects,
      currentProjectId: defaultProject.id
    }
  }

  const validProjectId = projects.some(p => p.id === storedCurrentId)
    ? storedCurrentId
    : projects[0].id

  return {
    projects,
    currentProjectId: validProjectId
  }
}
