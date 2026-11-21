import { Info } from 'lucide-react'

import { Logo } from './common'

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          <p className="mt-8 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-px size-3.5 shrink-0" aria-hidden />
            Preview: secure accounts are being connected. For now, signing in opens a private preview workspace that
            resets when you close the tab — no password is stored.
          </p>
        </div>
      </div>
      <div className="dark hidden flex-col justify-between bg-background p-12 text-foreground lg:flex">
        <p className="text-sm font-medium text-accent-foreground">Research · Understand · Monitor</p>
        <div className="space-y-6">
          <p className="text-3xl font-bold leading-tight">“Simple at first glance. Detailed when you choose a stock.”</p>
          <ul className="space-y-3 text-muted-foreground">
            <li>✓ Plain-English explanations of every number</li>
            <li>✓ Clear labels for facts, calculations and AI opinions</li>
            <li>✓ Your saved stocks and portfolio stay private to you</li>
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">Stockzz is a research tool, not a broker. Not financial advice.</p>
      </div>
    </div>
  )
}
