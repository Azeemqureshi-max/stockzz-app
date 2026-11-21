import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Bell, ChevronsUpDown, LayoutGrid, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { AccountMenu, Avatar } from '@/components/stockzz/account-menu'
import { Logo } from '@/components/stockzz/common'
import { WorkspaceGate } from '@/components/stockzz/workspace-gate'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

const NAV = [
  { to: '/app/suggestions', label: 'Suggestions', icon: Sparkles },
  { to: '/app/analysis', label: 'Analysis', icon: LayoutGrid },
] as const

function AppLayout() {
  const { user } = useWorkspace()
  if (!user) return <WorkspaceGate />
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-sidebar px-4 py-6 lg:flex">
        <Logo to="/app/suggestions" className="px-2" />
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: 'bg-sidebar-accent text-sidebar-accent-foreground! font-semibold' }}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <AccountMenu align="start">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors hover:bg-muted"
            >
              <Avatar name={user.name} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{user.name}</span>
                <span className="block text-xs text-muted-foreground">Account & portfolio</span>
              </span>
              <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden />
            </button>
          </AccountMenu>
        </div>
      </aside>

      <div className="lg:pl-60">
        <TopBar />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:px-6 lg:pb-12">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t bg-background/95 backdrop-blur lg:hidden"
      >
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
            activeProps={{ className: 'text-primary! font-semibold' }}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

function TopBar() {
  const { user } = useWorkspace()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur lg:border-none lg:bg-transparent lg:backdrop-blur-none">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:justify-end lg:pt-6">
        <Logo to="/app/suggestions" className="lg:hidden" />
        <form
          role="search"
          className={cn('relative ml-auto hidden w-full max-w-xs sm:block lg:ml-0')}
          onSubmit={(e) => {
            e.preventDefault()
            navigate({ to: '/app/analysis', search: { q: q.trim() || undefined } })
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            aria-label="Search stocks or companies"
            placeholder="Search stocks, companies…"
            className="h-10 rounded-xl bg-card pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <Link
          to="/app/notifications"
          aria-label="Notifications"
          className="ml-auto grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:ml-0"
        >
          <Bell className="size-5" />
        </Link>
        <AccountMenu>
          <button type="button" aria-label="Open account menu" className="rounded-full focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar name={user?.name ?? 'Guest'} />
          </button>
        </AccountMenu>
      </div>
    </header>
  )
}
