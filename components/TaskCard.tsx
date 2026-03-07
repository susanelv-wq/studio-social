'use client'

import { Task } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react'
import { useState } from 'react'
import TaskDetailDrawer from './TaskDetailDrawer'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  onDragStart: () => void
}

const TYPE_COLORS: Record<Task['type'], string> = {
  'feed': 'bg-blue-500/20 text-blue-600',
  'reel': 'bg-purple-500/20 text-purple-600',
  'story': 'bg-pink-500/20 text-pink-600',
  'general': 'bg-gray-500/20 text-gray-600'
}

export default function TaskCard({
  task,
  onUpdate,
  onDelete,
  onDragStart
}: TaskCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const checkedItems = task.checklist.filter(item => item.completed).length

  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done'

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={() => setShowDetail(true)}
        className="group bg-background border border-border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
      >
        {/* Title */}
        <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
          {task.title}
        </p>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className={`text-xs ${TYPE_COLORS[task.type]}`}>
            {task.type}
          </Badge>
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className={`flex items-center gap-1 text-xs mb-2 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Calendar className="w-3 h-3" />
            {format(dueDate, 'MMM d')}
          </div>
        )}

        {/* Checklist Progress */}
        {task.checklist.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1 mb-1">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(checkedItems / task.checklist.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {checkedItems}/{task.checklist.length}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
            onClick={e => {
              e.stopPropagation()
              onDelete(task.id)
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <TaskDetailDrawer
        task={task}
        open={showDetail}
        onOpenChange={setShowDetail}
        onSave={onUpdate}
      />
    </>
  )
}
