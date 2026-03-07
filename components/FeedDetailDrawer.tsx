'use client'

import { useState } from 'react'
import { FeedItem } from '@/lib/types'
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
import { buildFeedImagePrompt } from '@/lib/image-prompt'
import { ScheduleDatePicker } from '@/components/ScheduleDatePicker'

interface FeedDetailDrawerProps {
  item: FeedItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: FeedItem) => void
}

export default function FeedDetailDrawer({
  item,
  open,
  onOpenChange,
  onSave
}: FeedDetailDrawerProps) {
  const [formData, setFormData] = useState(item)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { generate, loading, error } = useGenerateImage()

  const handleGenerateImage = async () => {
    const prompt = buildFeedImagePrompt(
      formData.headline,
      formData.subheadline,
      formData.visualStyle,
      formData.imagePrompt
    )
    const imageUrl = await generate(prompt, 'square')
    if (imageUrl) handleChange('imageUrl', imageUrl)
  }

  const handleChange = (field: keyof FeedItem, value: any) => {
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

  const handleAddHashtag = (tag: string) => {
    if (!formData.hashtags.includes(tag)) {
      handleChange('hashtags', [...formData.hashtags, tag])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        handleChange('imageUrl', imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{formData.headline}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Image
            </label>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground block mb-1">
                What should the image show? (optional – e.g. &quot;boss babe working at laptop&quot;)
              </label>
              <Input
                value={formData.imagePrompt ?? ''}
                onChange={e => handleChange('imagePrompt', e.target.value || undefined)}
                placeholder="e.g. boss babe working at laptop, confident woman in office"
                className="bg-input text-sm"
              />
            </div>
            {formData.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-border">
                <img
                  src={formData.imageUrl}
                  alt="Feed preview"
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
                onClick={handleGenerateImage}
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
              {formData.imageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange('imageUrl', undefined)}
                >
                  Remove
                </Button>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>

          {/* Headline */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Headline
            </label>
            <Input
              value={formData.headline}
              onChange={e => handleChange('headline', e.target.value)}
              placeholder="Headline"
              className="bg-input"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Subheadline
            </label>
            <Input
              value={formData.subheadline}
              onChange={e => handleChange('subheadline', e.target.value)}
              placeholder="Subheadline"
              className="bg-input"
            />
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

          {/* CTA */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Call-to-Action
            </label>
            <Input
              value={formData.cta}
              onChange={e => handleChange('cta', e.target.value)}
              placeholder="E.g., 'Learn more', 'Shop now'"
              className="bg-input"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.hashtags.map((tag, idx) => (
                <div
                  key={idx}
                  className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleChange(
                      'hashtags',
                      formData.hashtags.filter((_, i) => i !== idx)
                    )}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {['#growth', '#tips', '#trending', '#marketing', '#socialmedia'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddHashtag(tag)}
                    className="text-xs px-2 py-1 rounded border border-border hover:bg-accent"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule post */}
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

          {/* Other fields */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Visual Style
            </label>
            <Input
              value={formData.visualStyle}
              onChange={e => handleChange('visualStyle', e.target.value)}
              placeholder="E.g., 'Minimalist', 'Bold with accent'"
              className="bg-input"
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
