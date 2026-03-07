'use client'

import { FeedItem, BrandSettings } from '@/lib/types'
import FeedCard from './FeedCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FeedMockupProps {
  items: FeedItem[]
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onItemUpdate: (item: FeedItem) => void
  onAddItem?: () => void
}

export default function FeedMockup({
  items,
  brandSettings,
  showDeviceFrame,
  onItemUpdate,
  onAddItem
}: FeedMockupProps) {
  if (items.length === 0) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border text-center">
        <p className="text-muted-foreground">
          No feed posts yet. Enter a prompt above to generate content.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <FeedCard
            key={item.id}
            item={item}
            brandSettings={brandSettings}
            showDeviceFrame={showDeviceFrame}
            onUpdate={onItemUpdate}
          />
        ))}
        {onAddItem && (
          <button
            onClick={onAddItem}
            className="border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors flex items-center justify-center min-h-96 cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground">
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Feed Post</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
