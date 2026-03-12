'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const { user, updatePassword } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  // After clicking the email link, Supabase sets the session from the URL hash.
  // If there's no user and we're not in "done" state, they might not have come from the link yet.
  useEffect(() => {
    // Give Supabase a moment to recover session from hash
    const t = setTimeout(() => {
      if (!user && !done) {
        // No session - maybe they opened the page directly; redirect to home
        router.replace('/')
      }
    }, 1500)
    return () => clearTimeout(t)
  }, [user, done, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setBusy(true)
    try {
      const { error: err } = await updatePassword(password)
      if (err) {
        setError(err.message)
        return
      }
      setDone(true)
      setTimeout(() => router.replace('/'), 2000)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <p className="text-foreground font-medium">Password updated. Redirecting you to the app…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center text-muted-foreground">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Set new password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">New password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-input"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Confirm password</label>
            <Input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-input"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? '…' : 'Update password'}
          </Button>
        </form>
        <p className="text-center">
          <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => router.push('/')}>
            Back to app
          </button>
        </p>
      </div>
    </div>
  )
}
