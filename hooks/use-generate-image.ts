'use client'

import { useState, useCallback } from 'react'

export type ImageSize = 'square' | 'portrait' | 'landscape'

export function useGenerateImage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (prompt: string, size: ImageSize = 'square'): Promise<string | null> => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, size })
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to generate image')
          return null
        }
        return data.imageUrl ?? null
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Network error'
        setError(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { generate, loading, error }
}
