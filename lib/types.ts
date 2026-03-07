export type FontVibe = 'Bold & Modern' | 'Elegant' | 'Playful' | 'Minimal'
export type ItemType = 'feed' | 'reel' | 'story'
export type TaskType = 'feed' | 'reel' | 'story' | 'general'
export type TaskStatus = 'to-do' | 'in-progress' | 'done'

export interface BrandSettings {
  name: string
  primaryColor: string // hex
  secondaryColor: string // hex
  accentColor: string // hex
  fontVibe: FontVibe
}

export interface Schedule {
  itemId: string
  itemType: ItemType
  publishedAt: string | null // ISO date
}

export interface FeedItem {
  id: string
  title: string
  hook: string
  visualStyle: string
  headline: string
  subheadline: string
  caption: string
  cta: string
  hashtags: string[]
  imageUrl?: string
  /** Optional: exact description for AI image (e.g. "boss babe working at laptop") */
  imagePrompt?: string
  scheduledAt?: string // ISO date
}

export interface ReelItem {
  id: string
  title: string
  hook: string
  coverHeadline: string
  beats: string[] // 3-6 items
  onScreenText: string[]
  caption: string
  coverImageUrl?: string
  scheduledAt?: string // ISO date
}

export interface StoryFrame {
  id: string
  headline: string
  supportingText: string
  stickerIdea: string
  cta: string
  backgroundImageUrl?: string
  scheduledAt?: string // ISO date
  sequence: number
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  type: TaskType
  dueDate?: string // ISO date
  assignee?: string
  checklist: ChecklistItem[]
  notes: string
  linkedItemId?: string // references feed/reel/story item
}

export interface Project {
  id: string
  name: string
  brandSettings: BrandSettings
  feedItems: FeedItem[]
  reelItems: ReelItem[]
  storyFrames: StoryFrame[]
  tasks: Task[]
  createdAt: string // ISO date
  updatedAt: string // ISO date
}

export interface AppState {
  projects: Project[]
  currentProjectId: string
}
