'use client'

import { StoryFrame as StoryFrameType, BrandSettings } from '@/lib/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Upload, Sparkles } from 'lucide-react'
import { useGenerateImage } from '@/hooks/use-generate-image'
import { buildStoryBackgroundPrompt } from '@/lib/image-prompt'
import { ScheduleDatePicker } from '@/components/ScheduleDatePicker'

interface StoryFrameProps {
  frame: StoryFrameType
  brandSettings: BrandSettings
  showDeviceFrame: boolean
  onItemUpdate?: (item: StoryFrameType) => void
}

export default function StoryFrame({
  frame,
  brandSettings,
  showDeviceFrame,
  onItemUpdate
}: StoryFrameProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const { generate, loading, error } = useGenerateImage()

  const handleGenerateBackground = async () => {
    if (!onItemUpdate) return
    const prompt = buildStoryBackgroundPrompt(
      frame.headline,
      frame.supportingText,
      frame.stickerIdea
    )
    const imageUrl = await generate(prompt, 'portrait')
    if (imageUrl) onItemUpdate({ ...frame, backgroundImageUrl: imageUrl })
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onItemUpdate) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        onItemUpdate({ ...frame, backgroundImageUrl: imageUrl })
        setShowUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // 9:16 aspect ratio for mobile story
  const frameWidth = showDeviceFrame ? 200 : 180
  const frameHeight = (frameWidth / 9) * 16

  const style = {
    background: `linear-gradient(135deg, ${brandSettings.primaryColor}, ${brandSettings.secondaryColor})`,
    width: frameWidth,
    height: frameHeight,
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center text-center p-4 relative"
        style={{
          ...style,
          backgroundImage: frame.backgroundImageUrl ? `url('${frame.backgroundImageUrl}')` : undefined,
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
        <div className="relative z-10 space-y-2 w-full">
          <p className="text-xs text-white/60 font-medium">
            {frame.stickerIdea}
          </p>
          <h4 className="font-bold text-white text-xs leading-tight">
            {frame.headline}
          </h4>
          <p className="text-white/70 text-[10px] line-clamp-2">
            {frame.supportingText}
          </p>
          <p className="text-white/90 text-[10px] font-semibold pt-1">
            {frame.cta}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">
          Frame {frame.sequence}
        </p>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => handleCopy(frame.headline, 'headline')}
            className="text-xs text-muted-foreground hover:text-foreground gap-1 flex items-center flex-1"
          >
            {copiedField === 'headline' ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy text
              </>
            )}
          </button>
          {onItemUpdate && (
            <>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1 flex items-center"
                title="Upload image"
              >
                <Upload className="w-3 h-3" />
              </button>
              <button
                onClick={handleGenerateBackground}
                disabled={loading}
                className="text-xs text-muted-foreground hover:text-foreground gap-1 flex items-center"
                title="Generate with AI"
              >
                {loading ? (
                  <span className="animate-pulse">…</span>
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
              </button>
            </>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
        {showUpload && onItemUpdate && (
          <label className="flex items-center justify-center gap-1 px-2 py-1 border border-input rounded cursor-pointer hover:bg-accent/50 transition-colors text-xs">
            <Upload className="w-3 h-3" />
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
        {onItemUpdate && (
          <div className="mt-2">
            <ScheduleDatePicker
              value={frame.scheduledAt}
              onChange={d => onItemUpdate({ ...frame, scheduledAt: d })}
              placeholder="Date to post"
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  )
}
