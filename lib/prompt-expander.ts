import { FeedItem, ReelItem, StoryFrame } from './types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

function generateImageUrl(seed: string, type: 'feed' | 'reel' | 'story'): string {
  // Use placeholder image service with deterministic seeding
  const width = type === 'feed' ? 600 : type === 'reel' ? 400 : 500
  const height = type === 'feed' ? 600 : type === 'reel' ? 710 : 890
  const id = Math.abs(seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000
  return `https://picsum.photos/${width}/${height}?random=${id}`
}

function extractKeywords(prompt: string): string[] {
  // Simple keyword extraction: split by spaces, filter common words
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'how', 'what', 'when', 'where',
    'why', 'which', 'who', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ])

  const words = prompt
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))

  return [...new Set(words)].slice(0, 3)
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const feedTemplates = [
  (keyword: string) => ({
    title: `3 Mistakes About ${capitalizeWords(keyword)}`,
    hook: `You're probably doing this wrong`,
    visualStyle: 'Dark with accent highlight',
    headline: `3 Mistakes About ${capitalizeWords(keyword)}`,
    subheadline: `And how to fix them`,
    caption: `Most people get ${keyword} wrong. Here are the 3 mistakes I see every day.`,
    cta: 'Learn more',
    hashtags: [`#${keyword}`, '#tips', '#growth']
  }),
  (keyword: string) => ({
    title: `How to Start ${capitalizeWords(keyword)}`,
    hook: `Everything you need to know`,
    visualStyle: 'Minimalist guide',
    headline: `How to Start ${capitalizeWords(keyword)}`,
    subheadline: `A beginner's guide`,
    caption: `Starting your ${keyword} journey? Here's exactly what you need to do first.`,
    cta: 'Get started',
    hashtags: [`#${keyword}`, '#howto', '#tutorial']
  }),
  (keyword: string) => ({
    title: `${capitalizeWords(keyword)} Checklist`,
    hook: `Don't miss these essentials`,
    visualStyle: 'Clean checklist design',
    headline: `The Ultimate ${capitalizeWords(keyword)} Checklist`,
    subheadline: `Never forget a step again`,
    caption: `Use this ${keyword} checklist to ensure you don't miss anything important.`,
    cta: 'Download',
    hashtags: [`#${keyword}`, '#checklist', '#planning']
  }),
  (keyword: string) => ({
    title: `My ${capitalizeWords(keyword)} Story`,
    hook: `This changed everything`,
    visualStyle: 'Personal story format',
    headline: `How ${capitalizeWords(keyword)} Changed My Life`,
    subheadline: `A personal journey`,
    caption: `I want to share my ${keyword} journey with you and what I learned along the way.`,
    cta: 'Read more',
    hashtags: [`#${keyword}`, '#journey', '#story']
  }),
  (keyword: string) => ({
    title: `Proven ${capitalizeWords(keyword)} Tips`,
    hook: `These actually work`,
    visualStyle: 'Tips carousel',
    headline: `5 Proven ${capitalizeWords(keyword)} Tips`,
    subheadline: `That actually deliver results`,
    caption: `I've tested these ${keyword} strategies for years. Here are my top 5.`,
    cta: 'Discover',
    hashtags: [`#${keyword}`, '#tips', '#strategy']
  }),
  (keyword: string) => ({
    title: `Why ${capitalizeWords(keyword)} Matters`,
    hook: `This will surprise you`,
    visualStyle: 'Eye-catching stat',
    headline: `Why ${capitalizeWords(keyword)} Matters More Than Ever`,
    subheadline: `The stats don't lie`,
    caption: `${keyword} is more important than most people realize. Here's why.`,
    cta: 'Understand why',
    hashtags: [`#${keyword}`, '#insights', '#data']
  }),
  (keyword: string) => ({
    title: `${capitalizeWords(keyword)}: Before & After`,
    hook: `The transformation is real`,
    visualStyle: 'Before/after split',
    headline: `${capitalizeWords(keyword)}: Before & After`,
    subheadline: `See the incredible difference`,
    caption: `Here's what happened when I focused on ${keyword}. The results speak for themselves.`,
    cta: 'See results',
    hashtags: [`#${keyword}`, '#transformation', '#results']
  }),
  (keyword: string) => ({
    title: `Common ${capitalizeWords(keyword)} Questions`,
    hook: `Let me answer them`,
    visualStyle: 'Q&A format',
    headline: `5 Common ${capitalizeWords(keyword)} Questions Answered`,
    subheadline: `You've asked, I've answered`,
    caption: `Here are the most common questions I get about ${keyword}, answered.`,
    cta: 'Get answers',
    hashtags: [`#${keyword}`, '#faq', '#questions']
  }),
  (keyword: string) => ({
    title: `The Future of ${capitalizeWords(keyword)}`,
    hook: `Trends to watch`,
    visualStyle: 'Future-focused',
    headline: `The Future of ${capitalizeWords(keyword)} in 2025`,
    subheadline: `What's next`,
    caption: `${keyword} is evolving. Here's what I think comes next.`,
    cta: 'Explore trends',
    hashtags: [`#${keyword}`, '#trends', '#future']
  })
]

const reelHooks = [
  'Watch this 30-second trick',
  'This blew my mind',
  'You need to see this',
  'I tested this so you don\'t have to',
  'This changed how I work',
  'The fastest way to',
  'Nobody talks about this'
]

const beatTemplates = [
  'Hook them with a question',
  'Show the problem',
  'Reveal the solution',
  'Prove it works',
  'Call them to action'
]

const storyBeats = [
  'The Problem: Why this matters',
  'The Insight: What most people miss',
  'The Solution: How to fix it',
  'The Proof: Social proof or case study',
  'The CTA: What to do next'
]

export interface ExpandedContent {
  feedItems: FeedItem[]
  reelItems: ReelItem[]
  storyFrames: StoryFrame[]
}

export function expandPrompt(prompt: string, brandName: string): ExpandedContent {
  const keywords = extractKeywords(prompt)
  const primaryKeyword = keywords[0] || 'content'

  // Use the user's full prompt as the image theme so "boss babe working" etc. generates matching photos
  const imageTheme = prompt.trim().slice(0, 200) || undefined

  // Generate 9 feed items
  const feedItems: FeedItem[] = feedTemplates.map((template, index) => {
    const item = template(primaryKeyword)
    const itemId = generateId()
    return {
      id: itemId,
      title: item.title,
      hook: item.hook,
      visualStyle: item.visualStyle,
      headline: item.headline,
      subheadline: item.subheadline,
      caption: item.caption,
      cta: item.cta,
      hashtags: item.hashtags,
      imageUrl: generateImageUrl(`${brandName}-feed-${index}`, 'feed'),
      imagePrompt: imageTheme
    }
  })

  // Generate 3-6 reels
  const numReels = Math.floor(Math.random() * 4) + 3 // 3-6 reels
  const reelItems: ReelItem[] = Array.from({ length: numReels }).map((_, index) => {
    const hookIndex = index % reelHooks.length
    const beats = beatTemplates.slice(0, Math.floor(Math.random() * 2) + 3)
    
    return {
      id: generateId(),
      title: `Reel ${index + 1}: ${capitalizeWords(primaryKeyword)}`,
      hook: reelHooks[hookIndex],
      coverHeadline: `${capitalizeWords(primaryKeyword)} in 30 seconds`,
      beats: beats,
      onScreenText: [
        `${capitalizeWords(primaryKeyword)}`,
        beats[0] || 'Hook',
        beats[Math.floor(beats.length / 2)] || 'Solution'
      ],
      caption: `The complete guide to ${primaryKeyword} in one minute. Follow along and let me know what you think.`,
      coverImageUrl: generateImageUrl(`${brandName}-reel-${index}`, 'reel')
    }
  })

  // Generate 5-10 story frames
  const numStories = Math.floor(Math.random() * 6) + 5 // 5-10 stories
  const storyFrames: StoryFrame[] = Array.from({ length: numStories }).map((_, index) => {
    const beat = storyBeats[index % storyBeats.length]
    const beatTitle = beat.split(':')[0].trim()
    const beatDescription = beat.split(':')[1]?.trim() || ''

    return {
      id: generateId(),
      headline: beatTitle,
      supportingText: beatDescription,
      stickerIdea: `${index + 1}/${numStories}`,
      cta: index === numStories - 1 ? 'Learn more' : 'Next →',
      backgroundImageUrl: generateImageUrl(`${brandName}-story-${index}`, 'story'),
      sequence: index + 1
    }
  })

  return {
    feedItems,
    reelItems,
    storyFrames
  }
}
