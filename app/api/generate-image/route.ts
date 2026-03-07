import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export type ImageSize = 'square' | 'portrait' | 'landscape'

const SIZE_MAP: Record<ImageSize, '1024x1024' | '1024x1792' | '1792x1024'> = {
  square: '1024x1024',
  portrait: '1024x1792',
  landscape: '1792x1024'
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
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    const size: ImageSize = ['square', 'portrait', 'landscape'].includes(body.size)
      ? body.size
      : 'square'

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing or empty prompt' },
        { status: 400 }
      )
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: SIZE_MAP[size],
      quality: 'hd',
      style: 'vivid',
      response_format: 'b64_json'
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
    const status = err && typeof err === 'object' && 'status' in err
      ? (err as { status: number }).status
      : 500
    return NextResponse.json(
      { error: message },
      { status: typeof status === 'number' ? status : 500 }
    )
  }
}
