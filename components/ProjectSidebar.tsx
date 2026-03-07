'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { createDefaultProject } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react'

interface ProjectSidebarProps {
  projects: Project[]
  currentProjectId: string
  onProjectSelect: (projectId: string) => void
  onProjectsChange: (projects: Project[]) => void
}

export default function ProjectSidebar({
  projects,
  currentProjectId,
  onProjectSelect,
  onProjectsChange
}: ProjectSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleCreateProject = () => {
    const newProject = createDefaultProject('New Project')
    const updated = [...projects, newProject]
    onProjectsChange(updated)
    onProjectSelect(newProject.id)
  }

  const handleRenameProject = (projectId: string, newName: string) => {
    if (newName.trim()) {
      const updated = projects.map(p =>
        p.id === projectId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
      )
      onProjectsChange(updated)
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleDeleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId)
    onProjectsChange(updated)
    if (currentProjectId === projectId && updated.length > 0) {
      onProjectSelect(updated[0].id)
    }
  }

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id)
    setEditingName(project.name)
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground mb-4">Social Studio</h1>
        <Button onClick={handleCreateProject} className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No projects yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(project => (
              <div
                key={project.id}
                className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentProjectId === project.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => onProjectSelect(project.id)}
              >
                {editingId === project.id ? (
                  <input
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleRenameProject(project.id, editingName)
                      } else if (e.key === 'Escape') {
                        setEditingId(null)
                      }
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                  </div>
                )}

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={e => {
                      e.stopPropagation()
                      handleStartEdit(project)
                    }} className="gap-2">
                      <Edit2 className="w-4 h-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteProject(project.id)
                      }}
                      className="gap-2 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
      </div>
    </aside>
  )
}
