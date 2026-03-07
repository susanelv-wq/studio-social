'use client'

import { Task, TaskStatus } from '@/lib/types'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TaskBoardProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

const COLUMNS: TaskStatus[] = ['to-do', 'in-progress', 'done']
const COLUMN_LABELS: Record<TaskStatus, string> = {
  'to-do': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done'
}

export default function TaskBoard({ tasks, onTasksChange }: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnColumn = (status: TaskStatus) => {
    if (!draggedTask) return

    const updated = tasks.map(t =>
      t.id === draggedTask.id ? { ...t, status } : t
    )
    onTasksChange(updated)
    setDraggedTask(null)
  }

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status)

  const handleAddTask = (status: TaskStatus) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 11),
      title: 'New Task',
      status,
      type: 'general',
      checklist: [],
      notes: ''
    }
    onTasksChange([...tasks, newTask])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    onTasksChange(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const handleDeleteTask = (taskId: string) => {
    onTasksChange(tasks.filter(t => t.id !== taskId))
  }

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {COLUMNS.map(status => (
        <div
          key={status}
          className="bg-card border border-border rounded-lg flex flex-col"
        >
          {/* Column Header */}
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {COLUMN_LABELS[status]}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tasksByStatus(status).length} tasks
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className="flex-1 p-3 space-y-3 overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={() => handleDropOnColumn(status)}
          >
            {tasksByStatus(status).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onDragStart={() => handleDragStart(task)}
              />
            ))}

            {/* Add Task Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => handleAddTask(status)}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
