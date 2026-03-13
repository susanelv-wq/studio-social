/**
 * Canva-style AI image generation: rich prompts + style presets for high-quality,
 * social-ready images. Optimized for DALL·E 3 (detail, no text, professional look).
 */

export type ImageStyle =
  | 'photorealistic'
  | 'modern'
  | 'minimal'
  | 'vibrant'
  | 'soft'
  | 'bold'
  | 'illustration'

const STYLE_SUFFIX: Record<ImageStyle, string> = {
  photorealistic:
    'Professional photography, sharp focus, natural lighting, high resolution, 8k, photorealistic, no text or watermarks.',
  modern:
    'Modern aesthetic, clean composition, contemporary style, professional, crisp details, editorial quality, no text or logos.',
  minimal:
    'Minimalist design, clean lines, simple composition, subtle colors, elegant, uncluttered, no text in image.',
  vibrant:
    'Vibrant colors, bold contrast, eye-catching, high saturation, dynamic, Instagram-worthy, no text or watermarks.',
  soft:
    'Soft lighting, pastel tones, dreamy atmosphere, gentle gradient, ethereal, warm and inviting, no text in image.',
  bold:
    'Bold graphic style, strong contrast, striking composition, impactful, attention-grabbing, no text or logos.',
  illustration:
    'Premium digital illustration, polished vector style, professional design, cohesive colors, no text in image.',
}

const QUALITY_PREFIX =
  'High-quality, professional, suitable for social media. No text, words, letters, logos, or watermarks in the image. '

/**
 * Build a Canva-quality prompt for Instagram feed images.
 */
export function buildFeedImagePrompt(
  headline: string,
  subheadline: string,
  visualStyle: string,
  imagePrompt?: string,
  style: ImageStyle = 'photorealistic'
): string {
  const subject = imagePrompt?.trim()
    ? imagePrompt.trim()
    : `Scene that fits the topic: "${headline}". ${subheadline ? subheadline + '. ' : ''}Show a clear, engaging visual that represents this theme.`
  const styleHint = STYLE_SUFFIX[style]
  return (
    QUALITY_PREFIX +
    `Instagram feed image. Subject: ${subject} ` +
    `Overall vibe: ${visualStyle}. ` +
    styleHint
  )
}

/**
 * Build a Canva-quality prompt for Reel cover art (9:16, scroll-stopping).
 */
export function buildReelCoverPrompt(
  title: string,
  coverHeadline: string,
  hook: string,
  style: ImageStyle = 'bold'
): string {
  const styleHint = STYLE_SUFFIX[style]
  return (
    QUALITY_PREFIX +
    `Vertical video cover art, 9:16 format. Topic: ${title}. ${coverHeadline}. Mood: ${hook}. ` +
    `Scroll-stopping, high impact, thumbnail-ready. ` +
    styleHint
  )
}

/**
 * Build a Canva-quality prompt for Story background (full-bleed 9:16).
 */
export function buildStoryBackgroundPrompt(
  headline: string,
  supportingText: string,
  stickerIdea: string,
  style: ImageStyle = 'vibrant'
): string {
  const styleHint = STYLE_SUFFIX[style]
  return (
    QUALITY_PREFIX +
    `Story background image, full-bleed vertical 9:16. Theme: "${headline}". ${supportingText}. Visual vibe: ${stickerIdea}. ` +
    `Atmospheric, works behind text overlay, cohesive. ` +
    styleHint
  )
}

/** Human-readable labels for the style selector UI */
export const IMAGE_STYLE_LABELS: Record<ImageStyle, string> = {
  photorealistic: 'Photorealistic',
  modern: 'Modern',
  minimal: 'Minimal',
  vibrant: 'Vibrant',
  soft: 'Soft & dreamy',
  bold: 'Bold',
  illustration: 'Illustration',
}
