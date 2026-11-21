import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/lib/workspace'
import { Logo } from './common'

/** Shown when someone opens a workspace page without signing in. */
export function WorkspaceGate({ dark = false }: { dark?: boolean }) {
  const { signIn } = useWorkspace()
  return (
    <div className={dark ? 'dark min-h-screen bg-background text-foreground' : 'min-h-screen bg-background'}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <Logo />
        <div className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Lock className="size-5" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sign in to open your workspace</h1>
          <p className="text-muted-foreground">
            Your saved stocks, portfolio and alerts are private to your account.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1"><Link to="/login">Log in</Link></Button>
          <Button asChild variant="outline" className="flex-1"><Link to="/signup">Create account</Link></Button>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
          onClick={() => signIn({ name: 'Guest', email: 'guest@preview.stockzz' })}
        >
          Explore the preview as a guest
        </button>
      </div>
    </div>
  )
}
