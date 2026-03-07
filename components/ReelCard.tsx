'use client'

import { format } from 'date-fns'
import { ReelItem, BrandSettings, Task } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Copy, Check, Calendar } from 'lucide-react'
import { useState } from 'react'
import ReelDetailDrawer from './ReelDetailDrawer'

interface ReelCardProps {
  item: ReelItem
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onCreateTasks: (tasks: Task[]) => void
  onItemUpdate?: (item: ReelItem) => void
}

export default function ReelCard({
  item,
  brandSettings,
  showDeviceFrame,
  onCreateTasks,
  onItemUpdate
}: ReelCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleCreateTasks = () => {
    const taskTypes: Array<'Script' | 'Record' | 'Edit' | 'Post'> = ['Script', 'Record', 'Edit', 'Post']
    const newTasks: Task[] = taskTypes.map((type, idx) => ({
      id: Math.random().toString(36).substring(2, 11),
      title: `${type}: ${item.title}`,
      type: 'reel',
      status: 'to-do',
      checklist: [],
      notes: '',
      linkedItemId: item.id,
      dueDate: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
    onCreateTasks(newTasks)
  }

  const scriptText = `Hook: ${item.hook}\n\nBeats:\n${item.beats.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\nOn-Screen Text:\n${item.onScreenText.join(', ')}`

  // 9:16 aspect ratio for vertical video
  const frameWidth = showDeviceFrame ? 180 : 160
  const frameHeight = (frameWidth / 9) * 16

  const style = {
    background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})`,
    width: frameWidth,
    height: frameHeight,
  }

  return (
    <>
      <ReelDetailDrawer
        item={item}
        open={showDetail}
        onOpenChange={setShowDetail}
        onSave={(updatedItem) => {
          onItemUpdate?.(updatedItem)
        }}
      />
      <div className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setShowDetail(true)}>
        <div className="flex gap-6">
        {/* Video Preview */}
        <div
          className="rounded-lg overflow-hidden shadow-md flex items-center justify-center text-center p-3 relative flex-shrink-0"
          style={{
            ...style,
            backgroundImage: item.coverImageUrl ? `url('${item.coverImageUrl}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: frameWidth,
            height: frameHeight,
          }}
        >
          {showDeviceFrame && (
            <div className="absolute inset-0 border-4 border-background rounded-lg pointer-events-none" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 space-y-1">
            <p className="font-bold text-white text-xs leading-tight">
              {item.coverHeadline}
            </p>
            <p className="text-white/70 text-[10px]">
              {item.beats.length} beats
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.hook}</p>
            {item.scheduledAt && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                Post: {format(new Date(item.scheduledAt + 'T12:00:00'), 'MMM d, yyyy')}
              </p>
            )}
          </div>

          {/* Beats */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Story Beats:</p>
            <ul className="text-xs text-foreground space-y-1">
              {item.beats.map((beat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground">{idx + 1}.</span>
                  <span>{beat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Caption */}
          <div>
            <p className="text-xs text-foreground line-clamp-2">{item.caption}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={() => handleCopy(scriptText, 'script')}
            >
              {copiedField === 'script' ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Script
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="text-xs"
              onClick={handleCreateTasks}
            >
              Create Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
