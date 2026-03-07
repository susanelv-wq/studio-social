'use client'

import { Task, TaskType, TaskStatus, ChecklistItem } from '@/lib/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus } from 'lucide-react'

interface TaskDetailDrawerProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Task) => void
}

const TASK_TYPES: TaskType[] = ['feed', 'reel', 'story', 'general']
const TASK_STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'done']

export default function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
  onSave
}: TaskDetailDrawerProps) {
  const [formData, setFormData] = useState(task)
  const [newChecklistItem, setNewChecklistItem] = useState('')

  const handleChange = (field: keyof Task, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const item: ChecklistItem = {
        id: Math.random().toString(36).substring(2, 11),
        text: newChecklistItem,
        completed: false
      }
      setFormData({
        ...formData,
        checklist: [...formData.checklist, item]
      })
      setNewChecklistItem('')
    }
  }

  const handleToggleChecklistItem = (itemId: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    })
  }

  const handleRemoveChecklistItem = (itemId: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== itemId)
    })
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Task title"
              className="bg-input"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Type
            </label>
            <Select value={formData.type} onValueChange={value => handleChange('type', value)}>
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Status
            </label>
            <Select value={formData.status} onValueChange={value => handleChange('status', value)}>
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'to-do' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate || ''}
              onChange={e => handleChange('dueDate', e.target.value || undefined)}
              className="bg-input"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Assignee
            </label>
            <Input
              value={formData.assignee || ''}
              onChange={e => handleChange('assignee', e.target.value || undefined)}
              placeholder="Team member name"
              className="bg-input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Task notes and details..."
              className="w-full p-3 rounded border border-input bg-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              rows={3}
            />
          </div>

          {/* Checklist */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Checklist ({formData.checklist.filter(i => i.completed).length}/{formData.checklist.length})
            </label>

            <div className="space-y-2 mb-3">
              {formData.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleChecklistItem(item.id)}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      item.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Checklist Item */}
            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={e => setNewChecklistItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddChecklistItem()}
                placeholder="Add checklist item"
                className="bg-input text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddChecklistItem}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Task
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
