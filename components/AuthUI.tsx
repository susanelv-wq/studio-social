'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LogIn, LogOut, UserPlus } from 'lucide-react'

export default function AuthUI() {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useAuth()
  const [open, setOpen] = useState(false)
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
              ? 'Email could not be sent. In Supabase: enable Custom SMTP (Project Settings → Authentication → SMTP) or disable "Confirm email" and use Sign in only.'
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
        setError(err.message)
        return
      }
      setOpen(false)
      setEmail('')
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="text-sm text-muted-foreground px-2">Projects saved on this device only</div>
    )
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground px-2">Loading…</div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground truncate max-w-[140px]" title={user.email}>
          {user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-1">
          <LogOut className="w-4 h-4" />
          Log out
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => { setMode('signin'); setError(null); setOpen(true); }} className="gap-1">
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setMode('signup'); setError(null); setOpen(true); }} className="gap-1">
          <UserPlus className="w-4 h-4" />
          Sign up
        </Button>
      </div>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setMode('signin'); setSuccess(null); setError(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === 'forgot' ? 'Reset password' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'forgot'
                ? 'Enter your email and we’ll send you a link to reset your password.'
                : mode === 'signin'
                  ? 'Sign in to save and sync your projects across devices.'
                  : 'Create an account to save your projects to the cloud.'}
            </DialogDescription>
          </DialogHeader>
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
            <DialogFooter>
              {mode === 'forgot' && (
                <Button type="button" variant="ghost" onClick={() => { setMode('signin'); setSuccess(null); }}>
                  Back to sign in
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? '…' : mode === 'forgot' ? 'Send reset link' : mode === 'signin' ? 'Sign in' : 'Sign up'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
