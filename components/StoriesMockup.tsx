'use client'

import { StoryFrame, BrandSettings } from '@/lib/types'
import { default as StoryFrameComponent } from './StoryFrame'
import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'

interface StoriesMockupProps {
  items: StoryFrame[]
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onItemUpdate?: (item: StoryFrame) => void
  onAddItem?: () => void
}

export default function StoriesMockup({
  items,
  brandSettings,
  showDeviceFrame,
  onItemUpdate,
  onAddItem
}: StoriesMockupProps) {
  const handleExport = () => {
    const data = JSON.stringify({
      brand: brandSettings.name,
      storyFrames: items.map(frame => ({
        sequence: frame.sequence,
        headline: frame.headline,
        supportingText: frame.supportingText,
        stickerIdea: frame.stickerIdea,
        cta: frame.cta
      }))
    }, null, 2)

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', `${brandSettings.name}-stories-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border text-center py-12">
        <p className="text-muted-foreground">
          No stories yet. Generate content from a prompt to create story frames.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">
          {items.length} Story Frames
        </h3>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export Sequence
        </Button>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {items.map(frame => (
          <div key={frame.id} className="flex-shrink-0 snap-center">
            <StoryFrameComponent
              frame={frame}
              brandSettings={brandSettings}
              showDeviceFrame={showDeviceFrame}
              onItemUpdate={onItemUpdate}
            />
          </div>
        ))}
        {onAddItem && (
          <button
            onClick={onAddItem}
            className="flex-shrink-0 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors flex items-center justify-center cursor-pointer w-56 h-96"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground">
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Story</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
