import { Link, useNavigate } from '@tanstack/react-router'
import { Bell, Bookmark, BriefcaseBusiness, CircleHelp, LogOut, Settings } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span className={cn('grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-accent-foreground', className)}>
      {initials || 'G'}
    </span>
  )
}

export function AccountMenu({ align = 'end', children }: { align?: 'start' | 'end'; children: React.ReactNode }) {
  const { user, signOut } = useWorkspace()
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/app/portfolio"><BriefcaseBusiness /> My portfolio</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/saved"><Bookmark /> Saved stocks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/notifications"><Bell /> Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/settings"><Settings /> Settings & alerts</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/help"><CircleHelp /> Help</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut()
            navigate({ to: '/' })
          }}
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
