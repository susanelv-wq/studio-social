'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn, UserPlus } from 'lucide-react'

export default function AuthLanding() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setBusy(true)
    try {
      if (mode === 'forgot') {
        const { error: err } = await resetPassword(email)
        if (err) {
          const msg = err.message || String(err)
          setError(
            msg.toLowerCase().includes('recovery') || msg.toLowerCase().includes('sending')
              ? 'Email could not be sent. Enable Custom SMTP in Supabase (Project Settings → Authentication → SMTP).'
              : msg
          )
          return
        }
        setSuccess('Check your email for the password reset link.')
        setEmail('')
        return
      }
      const { error: err } = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password)
      if (err) {
        const msg = err.message || String(err)
        setError(
          msg.toLowerCase().includes('confirmation') || msg.toLowerCase().includes('sending')
            ? 'Sign-up email could not be sent. Enable Custom SMTP in Supabase. See EMAIL-SETUP.md.'
            : msg
        )
        return
      }
      if (mode === 'signup') {
        setSuccess('Account created. If your project requires email confirmation, check your inbox.')
      }
      setEmail('')
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Social Studio</h1>
          <p className="text-muted-foreground">Projects are saved on this device only. Sign in is not configured.</p>
          <Button asChild className="w-full" size="lg">
            <a href="/">Continue to app</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Social Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan feeds, reels & stories</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={mode === 'signin' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-1"
              onClick={() => { setMode('signin'); setError(null); setSuccess(null); }}
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === 'signup' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 gap-1"
              onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
            >
              <UserPlus className="w-4 h-4" />
              Sign up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-input"
              />
            </div>
            {mode !== 'forgot' && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-input"
                />
                {mode === 'signin' && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground mt-1"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            )}
            <div className="flex gap-2 pt-2">
              {mode === 'forgot' && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setMode('signin'); setSuccess(null); }}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className={mode === 'forgot' ? 'flex-1' : 'w-full'}
                disabled={busy}
              >
                {busy ? '…' : mode === 'forgot' ? 'Send reset link' : mode === 'signin' ? 'Sign in' : 'Sign up'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
