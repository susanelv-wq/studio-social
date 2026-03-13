'use client'

import { useState, useEffect, useRef } from 'react'
import { Project } from '@/lib/types'
import { getInitialState, saveProjects, saveCurrentProjectId } from '@/lib/storage'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import ProjectSidebar from '@/components/ProjectSidebar'
import MainCanvas from '@/components/MainCanvas'
import AuthUI from '@/components/AuthUI'
import AuthLanding from '@/components/AuthLanding'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const lastLoadedUserIdRef = useRef<string | null | undefined>(undefined)

  const userId = user?.id ?? null

  // Load projects once per user (so renames/edits are never overwritten by a duplicate load)
  useEffect(() => {
    if (authLoading) return
    if (lastLoadedUserIdRef.current === userId) return
    lastLoadedUserIdRef.current = userId
    getInitialState(userId).then((state) => {
      setProjects(state.projects)
      setCurrentProjectId(state.currentProjectId)
      setIsLoaded(true)
    })
  }, [authLoading, userId])

  // Save projects whenever they change (debounced; renames persist quickly)
  useEffect(() => {
    if (!isLoaded || projects.length === 0) return
    const t = setTimeout(() => {
      saveProjects(projects, userId)
    }, 200)
    return () => clearTimeout(t)
  }, [projects, isLoaded, userId])

  // Save current project ID per user
  useEffect(() => {
    if (isLoaded && currentProjectId) {
      saveCurrentProjectId(currentProjectId, userId)
    }
  }, [currentProjectId, isLoaded, userId])

  const currentProject = projects.find(p => p.id === currentProjectId)
  const showAuthLanding = isSupabaseConfigured() && !authLoading && !user

  // Sidebar list changes (rename, add, delete): update state and persist immediately
  const handleProjectsChange = (next: Project[]) => {
    setProjects(next)
    if (isLoaded && next.length > 0) saveProjects(next, userId)
  }

  // When Supabase auth is configured and user is not signed in: show sign-in/sign-up only
  if (showAuthLanding) {
    return <AuthLanding />
  }

  if (authLoading || !isLoaded || !currentProject) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col w-full h-screen bg-background">
      <header className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border bg-card shrink-0">
        <AuthUI />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar
          projects={projects}
          currentProjectId={currentProjectId}
          onProjectSelect={setCurrentProjectId}
          onProjectsChange={handleProjectsChange}
        />
        {currentProject && (
          <MainCanvas project={currentProject} onProjectChange={(updatedProject) => {
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
          }} />
        )}
      </div>
    </main>
  )
}
