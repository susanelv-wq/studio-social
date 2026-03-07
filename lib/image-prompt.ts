/**
 * Build a strong image prompt for AI generation (Canva-style / amazing photo).
 * If imagePrompt is provided, use it so the image matches what the user asked for (e.g. "boss babe working").
 */
export function buildFeedImagePrompt(
  headline: string,
  subheadline: string,
  visualStyle: string,
  imagePrompt?: string
): string {
  if (imagePrompt && imagePrompt.trim()) {
    return `Photorealistic, high-quality photograph for Instagram feed. Subject: ${imagePrompt.trim()}. Confident, professional, modern. No text, logos, or words in the image. Vibrant, eye-catching, social media style.`
  }
  // Auto prompt: make it clear we want a real scene that matches the topic (e.g. boss babe working)
  return `Photorealistic photograph for Instagram. The post is about: "${headline}". Show a scene that fits this topic - e.g. a confident professional woman working in a modern setting, or a clear visual that represents the theme. Style: ${visualStyle}. No text or logos in the image. High quality, vibrant, professional.`
}

export function buildReelCoverPrompt(
  title: string,
  coverHeadline: string,
  hook: string
): string {
  return `Vertical video cover art: ${title}. ${coverHeadline}. Mood: ${hook}. Bold, scroll-stopping, 9:16 format, high contrast, professional social media style. No text in image.`
}

export function buildStoryBackgroundPrompt(
  headline: string,
  supportingText: string,
  stickerIdea: string
): string {
  return `Story background image: theme "${headline}". ${supportingText}. Visual vibe: ${stickerIdea}. Full-bleed vertical background, atmospheric, high quality, 9:16. No text or logos.`
}
