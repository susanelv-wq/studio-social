'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import { expandPrompt } from '@/lib/prompt-expander'
import { Button } from '@/components/ui/button'
import { Wand2, Loader } from 'lucide-react'

interface PromptInputProps {
  project: Project
  onProjectChange: (project: Project) => void
}

export default function PromptInput({ project, onProjectChange }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))

    const expanded = expandPrompt(prompt, project.brandSettings.name)

    onProjectChange({
      ...project,
      feedItems: expanded.feedItems,
      reelItems: expanded.reelItems,
      storyFrames: expanded.storyFrames,
      updatedAt: new Date().toISOString()
    })

    setIsGenerating(false)
    setPrompt('')
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground block">
          Describe your content idea
        </label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey && !isGenerating) {
              handleGenerate()
            }
          }}
          placeholder="E.g., 'How to grow your audience' or 'Best productivity tips'"
          className="w-full p-3 rounded border border-input bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          disabled={isGenerating}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Content
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground flex items-center">
            Creates 9 posts, 3-6 reels & 5-10 stories
          </p>
        </div>
      </div>
    </div>
  )
}
