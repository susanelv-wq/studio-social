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
import { Plus, MoreVertical, Trash2, Edit2, Check, X } from 'lucide-react'

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

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Projects</p>
        <Button onClick={handleCreateProject} className="w-full gap-2 rounded-lg h-10 font-medium shadow-sm" size="sm">
          <Plus className="w-4 h-4" />
          New project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {projects.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No projects yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(project => (
              <div
                key={project.id}
                className={`group relative flex items-center gap-2 p-2.5 rounded-xl transition-colors ${
                  editingId === project.id
                    ? 'bg-accent cursor-default ring-1 ring-primary/20'
                    : currentProjectId === project.id
                      ? 'bg-primary text-primary-foreground cursor-pointer shadow-sm'
                      : 'hover:bg-accent cursor-pointer'
                }`}
                onClick={() => editingId !== project.id && onProjectSelect(project.id)}
              >
                {editingId === project.id ? (
                  <div className="flex-1 min-w-0 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <Input
                      autoFocus
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameProject(project.id, editingName)
                        else if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="h-8 flex-1 min-w-0 text-sm bg-background border-input rounded-lg"
                      placeholder="Project name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-foreground hover:bg-background/20"
                      onClick={() => handleRenameProject(project.id, editingName)}
                      disabled={!editingName.trim()}
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-foreground hover:bg-background/20"
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                  </div>
                )}

                {/* Action Menu (only when not editing) */}
                {editingId !== project.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10">
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground bg-muted/30">
        <p>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
      </div>
    </aside>
  )
}
