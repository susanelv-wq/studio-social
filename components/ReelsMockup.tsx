'use client'

import { ReelItem, BrandSettings, Task } from '@/lib/types'
import ReelCard from './ReelCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ReelsMockupProps {
  items: ReelItem[]
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onAddTasks: (tasks: Task[]) => void
  onItemUpdate?: (item: ReelItem) => void
  onAddItem?: () => void
}

export default function ReelsMockup({
  items,
  brandSettings,
  showDeviceFrame,
  onAddTasks,
  onItemUpdate,
  onAddItem
}: ReelsMockupProps) {
  if (items.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border text-center py-12">
        <p className="text-muted-foreground">
          No reels yet. Generate content from a prompt to create reels.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <ReelCard
          key={item.id}
          item={item}
          brandSettings={brandSettings}
          showDeviceFrame={showDeviceFrame}
          onCreateTasks={onAddTasks}
          onItemUpdate={onItemUpdate}
        />
      ))}
      {onAddItem && (
        <button
          onClick={onAddItem}
          className="w-full border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors py-8 flex items-center justify-center cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground">
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Add Reel</span>
          </div>
        </button>
      )}
    </div>
  )
}
