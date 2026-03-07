import { Project, AppState } from './types'
import { isSupabaseConfigured } from './supabase/client'
import * as supabaseStorage from './supabase-storage'

const STORAGE_KEY = 'social-mockup-studio'
const CURRENT_PROJECT_KEY = 'current-project-id'

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

/** Persist projects to Supabase (if configured) or localStorage. */
export async function saveProjects(projects: Project[]): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabaseStorage.saveProjects(projects)
  } else {
    saveProjectsLocal(projects)
  }
}

/** Load projects from Supabase (if configured) or localStorage. */
export async function loadProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    return supabaseStorage.loadProjects()
  }
  return loadProjectsLocal()
}

export function saveCurrentProjectId(projectId: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId)
    } catch (error) {
      console.error('Failed to save current project ID:', error)
    }
  }
}

export function loadCurrentProjectId(): string {
  if (typeof window === 'undefined') return ''

  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY) || ''
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

/** Load initial app state from Supabase or localStorage. */
export async function getInitialState(): Promise<AppState> {
  const projects = await loadProjects()
  const currentProjectId = loadCurrentProjectId()

  // If no projects exist, create a default one
  if (projects.length === 0) {
    const defaultProject = createDefaultProject('My First Project')
    const newProjects = [defaultProject]
    await saveProjects(newProjects)
    saveCurrentProjectId(defaultProject.id)
    return {
      projects: newProjects,
      currentProjectId: defaultProject.id
    }
  }

  // If current project ID is invalid, use the first project
  const validProjectId = projects.some(p => p.id === currentProjectId)
    ? currentProjectId
    : projects[0].id

  return {
    projects,
    currentProjectId: validProjectId
  }
}
