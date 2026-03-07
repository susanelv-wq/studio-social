'use client'

import { Project, FontVibe } from '@/lib/types'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BrandSettingsPanelProps {
  project: Project
  onProjectChange: (project: Project) => void
}

const FONT_VIBES: FontVibe[] = ['Bold & Modern', 'Elegant', 'Playful', 'Minimal']

export default function BrandSettingsPanel({ project, onProjectChange }: BrandSettingsPanelProps) {
  const { brandSettings } = project

  const handleUpdate = (key: keyof typeof brandSettings, value: string) => {
    onProjectChange({
      ...project,
      brandSettings: {
        ...brandSettings,
        [key]: value
      },
      updatedAt: new Date().toISOString()
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-bold text-foreground mb-4">Brand Settings</h3>
      </div>

      {/* Brand Name */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Brand Name
        </label>
        <Input
          value={brandSettings.name}
          onChange={e => handleUpdate('name', e.target.value)}
          placeholder="Your brand name"
          className="bg-input"
        />
      </div>

      {/* Primary Color */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Primary Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={brandSettings.primaryColor}
            onChange={e => handleUpdate('primaryColor', e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <Input
            value={brandSettings.primaryColor}
            onChange={e => handleUpdate('primaryColor', e.target.value)}
            placeholder="#3b82f6"
            className="flex-1 bg-input text-sm font-mono"
          />
        </div>
      </div>

      {/* Secondary Color */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Secondary Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={brandSettings.secondaryColor}
            onChange={e => handleUpdate('secondaryColor', e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <Input
            value={brandSettings.secondaryColor}
            onChange={e => handleUpdate('secondaryColor', e.target.value)}
            placeholder="#1f2937"
            className="flex-1 bg-input text-sm font-mono"
          />
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Accent Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={brandSettings.accentColor}
            onChange={e => handleUpdate('accentColor', e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <Input
            value={brandSettings.accentColor}
            onChange={e => handleUpdate('accentColor', e.target.value)}
            placeholder="#f59e0b"
            className="flex-1 bg-input text-sm font-mono"
          />
        </div>
      </div>

      {/* Font Vibe */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Typography Style
        </label>
        <Select value={brandSettings.fontVibe} onValueChange={value => handleUpdate('fontVibe', value)}>
          <SelectTrigger className="bg-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_VIBES.map(vibe => (
              <SelectItem key={vibe} value={vibe}>
                {vibe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Preview */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">Color Preview</p>
        <div className="space-y-2">
          <div
            className="h-12 rounded flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: brandSettings.primaryColor }}
          >
            Primary
          </div>
          <div
            className="h-12 rounded flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: brandSettings.secondaryColor }}
          >
            Secondary
          </div>
          <div
            className="h-12 rounded flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: brandSettings.accentColor }}
          >
            Accent
          </div>
        </div>
      </div>
    </div>
  )
}
