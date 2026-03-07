'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { FeedItem, BrandSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import FeedDetailDrawer from './FeedDetailDrawer'
import { Edit2, Calendar } from 'lucide-react'

interface FeedCardProps {
  item: FeedItem
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onUpdate: (item: FeedItem) => void
}

export default function FeedCard({
  item,
  brandSettings,
  showDeviceFrame,
  onUpdate
}: FeedCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  // Device frame dimensions (Instagram post: square)
  const frameWidth = showDeviceFrame ? 320 : 300
  const frameHeight = showDeviceFrame ? 320 : 300

  const style = {
    background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})`,
    width: frameWidth,
    height: frameHeight,
  }

  return (
    <>
      <div className="group flex flex-col gap-2">
        <div
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center justify-center text-center p-4 relative"
          style={{
            ...style,
            backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: frameWidth,
            height: frameHeight,
          }}
          onClick={() => setShowDetail(true)}
        >
          {showDeviceFrame && (
            <div className="absolute inset-0 border-8 border-background rounded-lg pointer-events-none" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 space-y-2">
            <h3 className="font-bold text-white text-sm leading-tight">
              {item.headline}
            </h3>
            <p className="text-white/80 text-xs leading-tight">
              {item.subheadline}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {item.scheduledAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Post: {format(new Date(item.scheduledAt + 'T12:00:00'), 'MMM d, yyyy')}
            </p>
          )}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.caption}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowDetail(true)}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      <FeedDetailDrawer
        item={item}
        open={showDetail}
        onOpenChange={setShowDetail}
        onSave={onUpdate}
      />
    </>
  )
}
