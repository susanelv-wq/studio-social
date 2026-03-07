'use client'

import { useState } from 'react'
import { Project, FeedItem, ReelItem, StoryFrame } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BrandSettingsPanel from './BrandSettingsPanel'
import PromptInput from './PromptInput'
import FeedMockup from './FeedMockup'
import ReelsMockup from './ReelsMockup'
import StoriesMockup from './StoriesMockup'
import TaskBoard from './TaskBoard'

interface MainCanvasProps {
  project: Project
  onProjectChange: (project: Project) => void
}

export default function MainCanvas({ project, onProjectChange }: MainCanvasProps) {
  const [showBrandSettings, setShowBrandSettings] = useState(false)
  const [showDeviceFrame, setShowDeviceFrame] = useState(true)

  const generateId = () => Math.random().toString(36).substring(2, 11)

  const handleAddFeedItem = () => {
    const newFeedItem: FeedItem = {
      id: generateId(),
      title: 'New Feed Post',
      hook: 'Hook your audience',
      visualStyle: 'Modern',
      headline: 'Enter your headline',
      subheadline: 'Add supporting text here',
      caption: 'Write your caption here',
      cta: 'Learn More',
      hashtags: [],
      imageUrl: undefined
    }
    onProjectChange({
      ...project,
      feedItems: [...project.feedItems, newFeedItem],
      updatedAt: new Date().toISOString()
    })
  }

  const handleAddReelItem = () => {
    const newReelItem: ReelItem = {
      id: generateId(),
      title: 'New Reel',
      hook: 'Start with a hook',
      coverHeadline: 'Your reel headline',
      beats: ['Intro', 'Main Point', 'Conclusion'],
      onScreenText: ['Hook', 'Content', 'CTA'],
      caption: 'Write your reel description here',
      coverImageUrl: undefined
    }
    onProjectChange({
      ...project,
      reelItems: [...project.reelItems, newReelItem],
      updatedAt: new Date().toISOString()
    })
  }

  const handleAddStoryFrame = () => {
    const nextSequence = project.storyFrames.length + 1
    const newStoryFrame: StoryFrame = {
      id: generateId(),
      headline: 'Story Headline',
      supportingText: 'Add supporting text',
      stickerIdea: 'Emoji or sticker idea',
      cta: 'Next →',
      backgroundImageUrl: undefined,
      sequence: nextSequence
    }
    onProjectChange({
      ...project,
      storyFrames: [...project.storyFrames, newStoryFrame],
      updatedAt: new Date().toISOString()
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{project.name}</h2>
          <p className="text-sm text-muted-foreground">
            {project.brandSettings.name} • {project.feedItems.length} posts
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDeviceFrame}
              onChange={e => setShowDeviceFrame(e.target.checked)}
              className="rounded"
            />
            Device Frame
          </label>
          <button
            onClick={() => setShowBrandSettings(!showBrandSettings)}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            {showBrandSettings ? 'Hide' : 'Brand Settings'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden gap-4 p-6">
        {/* Brand Settings Panel */}
        {showBrandSettings && (
          <div className="w-80 overflow-y-auto border border-border rounded-lg">
            <BrandSettingsPanel
              project={project}
              onProjectChange={onProjectChange}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="feed" className="flex flex-col h-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger value="feed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Feed
              </TabsTrigger>
              <TabsTrigger value="reels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Reels
              </TabsTrigger>
              <TabsTrigger value="stories" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Stories
              </TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Tasks
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="feed" className="h-full overflow-auto">
                <div className="space-y-4">
                  <PromptInput project={project} onProjectChange={onProjectChange} />
                  <FeedMockup
                    items={project.feedItems}
                    brandSettings={project.brandSettings}
                    showDeviceFrame={showDeviceFrame}
                    onItemUpdate={(updatedItem) => {
                      onProjectChange({
                        ...project,
                        feedItems: project.feedItems.map(item =>
                          item.id === updatedItem.id ? updatedItem : item
                        ),
                        updatedAt: new Date().toISOString()
                      })
                    }}
                    onAddItem={handleAddFeedItem}
                  />
                </div>
              </TabsContent>

              <TabsContent value="reels" className="h-full overflow-auto p-6">
                <ReelsMockup
                  items={project.reelItems}
                  brandSettings={project.brandSettings}
                  showDeviceFrame={showDeviceFrame}
                  onAddTasks={(tasks) => {
                    onProjectChange({
                      ...project,
                      tasks: [...project.tasks, ...tasks],
                      updatedAt: new Date().toISOString()
                    })
                  }}
                  onItemUpdate={(updatedItem) => {
                    onProjectChange({
                      ...project,
                      reelItems: project.reelItems.map(item =>
                        item.id === updatedItem.id ? updatedItem : item
                      ),
                      updatedAt: new Date().toISOString()
                    })
                  }}
                  onAddItem={handleAddReelItem}
                />
              </TabsContent>

              <TabsContent value="stories" className="h-full overflow-auto p-6">
                <StoriesMockup
                  items={project.storyFrames}
                  brandSettings={project.brandSettings}
                  showDeviceFrame={showDeviceFrame}
                  onItemUpdate={(updatedItem) => {
                    onProjectChange({
                      ...project,
                      storyFrames: project.storyFrames.map(frame =>
                        frame.id === updatedItem.id ? updatedItem : frame
                      ),
                      updatedAt: new Date().toISOString()
                    })
                  }}
                  onAddItem={handleAddStoryFrame}
                />
              </TabsContent>

              <TabsContent value="tasks" className="h-full overflow-auto p-6">
                <TaskBoard
                  tasks={project.tasks}
                  onTasksChange={(updatedTasks) => {
                    onProjectChange({
                      ...project,
                      tasks: updatedTasks,
                      updatedAt: new Date().toISOString()
                    })
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
