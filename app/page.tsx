'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'
import { getInitialState, saveProjects, saveCurrentProjectId } from '@/lib/storage'
import ProjectSidebar from '@/components/ProjectSidebar'
import MainCanvas from '@/components/MainCanvas'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial state from Supabase or localStorage
  useEffect(() => {
    getInitialState().then((state) => {
      setProjects(state.projects)
      setCurrentProjectId(state.currentProjectId)
      setIsLoaded(true)
    })
  }, [])

  // Save projects to Supabase or localStorage whenever they change
  useEffect(() => {
    if (isLoaded && projects.length > 0) {
      saveProjects(projects)
    }
  }, [projects, isLoaded])

  // Save current project ID to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && currentProjectId) {
      saveCurrentProjectId(currentProjectId)
    }
  }, [currentProjectId, isLoaded])

  const currentProject = projects.find(p => p.id === currentProjectId)

  if (!isLoaded || !currentProject) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex w-full h-screen bg-background">
      {/* Left Sidebar */}
      <ProjectSidebar
        projects={projects}
        currentProjectId={currentProjectId}
        onProjectSelect={setCurrentProjectId}
        onProjectsChange={setProjects}
      />

      {/* Main Canvas */}
      {currentProject && (
        <MainCanvas project={currentProject} onProjectChange={(updatedProject) => {
          setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
        }} />
      )}
    </main>
  )
}
