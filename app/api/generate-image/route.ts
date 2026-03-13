import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export type ImageSize = 'square' | 'portrait' | 'landscape'

const SIZE_MAP: Record<ImageSize, '1024x1024' | '1024x1792' | '1792x1024'> = {
  square: '1024x1024',
  portrait: '1024x1792',
  landscape: '1792x1024',
}

/** Canva-style: refine a short prompt for DALL·E 3 to get better, more detailed images */
async function refinePromptForDalle(rawPrompt: string): Promise<string> {
  const { data } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert at writing image generation prompts for social media. ' +
          'Given a short idea, output ONE improved prompt (2-4 sentences) that is detailed, visual, and will produce a high-quality image. ' +
          'Include: subject, setting, lighting/mood, style. Do NOT add any text, words, or letters that should appear in the image. ' +
          'Output only the prompt, no explanation.',
      },
      { role: 'user', content: rawPrompt },
    ],
    max_tokens: 200,
  })
  const refined = data.choices[0]?.message?.content?.trim()
  return refined && refined.length > 50 ? refined : rawPrompt
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured. Add it to .env.local.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    let prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    const size: ImageSize = ['square', 'portrait', 'landscape'].includes(body.size)
      ? body.size
      : 'square'
    const enhance = body.enhance === true

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing or empty prompt' },
        { status: 400 }
      )
    }

    if (enhance && prompt.length < 300) {
      try {
        prompt = await refinePromptForDalle(prompt)
      } catch {
        // keep original prompt if refinement fails
      }
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: SIZE_MAP[size],
      quality: 'hd',
      style: 'vivid',
      response_format: 'b64_json',
    })

    const b64 = response.data[0]?.b64_json
    if (!b64) {
      return NextResponse.json(
        { error: 'No image data in response' },
        { status: 502 }
      )
    }

    const dataUrl = `data:image/png;base64,${b64}`
    return NextResponse.json({ imageUrl: dataUrl })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Image generation failed'
    const status =
      err && typeof err === 'object' && 'status' in err
        ? (err as { status: number }).status
        : 500
    return NextResponse.json(
      { error: message },
      { status: typeof status === 'number' ? status : 500 }
    )
  }
}
