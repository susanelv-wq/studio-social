'use client'

import { useState } from 'react'
import { ReelItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Copy, Check, Upload, Sparkles } from 'lucide-react'
import { useGenerateImage } from '@/hooks/use-generate-image'
import {
  buildReelCoverPrompt,
  type ImageStyle,
  IMAGE_STYLE_LABELS,
} from '@/lib/image-prompt'
import { ScheduleDatePicker } from '@/components/ScheduleDatePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReelDetailDrawerProps {
  item: ReelItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: ReelItem) => void
}

export default function ReelDetailDrawer({
  item,
  open,
  onOpenChange,
  onSave
}: ReelDetailDrawerProps) {
  const [formData, setFormData] = useState(item)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [coverStyle, setCoverStyle] = useState<ImageStyle>('bold')
  const { generate, loading, error } = useGenerateImage()

  const handleGenerateCover = async () => {
    const prompt = buildReelCoverPrompt(
      formData.title,
      formData.coverHeadline,
      formData.hook,
      coverStyle
    )
    const imageUrl = await generate(prompt, 'portrait')
    if (imageUrl) handleChange('coverImageUrl', imageUrl)
  }

  const handleChange = (field: keyof ReelItem, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        handleChange('coverImageUrl', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{formData.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Cover Image
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-xs text-muted-foreground">Style:</span>
              <Select value={coverStyle} onValueChange={(v) => setCoverStyle(v as ImageStyle)}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(IMAGE_STYLE_LABELS) as ImageStyle[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {IMAGE_STYLE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.coverImageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-border">
                <img
                  src={formData.coverImageUrl}
                  alt="Reel cover"
                  className="w-full h-auto max-h-60 object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <label className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 border border-input rounded cursor-pointer hover:bg-accent/50 transition-colors text-sm">
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                onClick={handleGenerateCover}
                disabled={loading}
              >
                {loading ? (
                  <>Generating…</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </Button>
              {formData.coverImageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange('coverImageUrl', undefined)}
                >
                  Remove
                </Button>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Title"
              className="bg-input"
            />
          </div>

          {/* Hook */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Hook
            </label>
            <Input
              value={formData.hook}
              onChange={e => handleChange('hook', e.target.value)}
              placeholder="Opening hook"
              className="bg-input"
            />
          </div>

          {/* Cover Headline */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Cover Headline
            </label>
            <Input
              value={formData.coverHeadline}
              onChange={e => handleChange('coverHeadline', e.target.value)}
              placeholder="Text shown on cover"
              className="bg-input"
            />
          </div>

          {/* Beats */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Story Beats
            </label>
            <div className="space-y-2">
              {formData.beats.map((beat, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={beat}
                    onChange={e => {
                      const newBeats = [...formData.beats]
                      newBeats[idx] = e.target.value
                      handleChange('beats', newBeats)
                    }}
                    placeholder={`Beat ${idx + 1}`}
                    className="bg-input"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChange('beats', formData.beats.filter((_, i) => i !== idx))
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => handleChange('beats', [...formData.beats, ''])}
            >
              Add Beat
            </Button>
          </div>

          {/* Caption */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Caption
            </label>
            <textarea
              value={formData.caption}
              onChange={e => handleChange('caption', e.target.value)}
              placeholder="Caption text"
              className="w-full p-3 rounded border border-input bg-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            <button
              onClick={() => handleCopy(formData.caption, 'caption')}
              className="text-xs text-muted-foreground hover:text-foreground gap-1 flex items-center mt-2"
            >
              {copiedField === 'caption' ? (
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
          </div>

          {/* Date to post */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Date to post
            </label>
            <ScheduleDatePicker
              value={formData.scheduledAt}
              onChange={d => handleChange('scheduledAt', d)}
              placeholder="Pick date to post"
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
