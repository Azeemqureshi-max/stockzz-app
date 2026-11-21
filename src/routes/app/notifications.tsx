import { Link, createFileRoute } from '@tanstack/react-router'
import { BellOff, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app/notifications')({
  head: () => ({ meta: [{ title: 'Notifications · Stockzz' }] }),
  component: Notifications,
})

function Notifications() {
  const { monitored } = useWorkspace()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
        <p className="mt-1 text-muted-foreground">Important developments about the companies you save or own.</p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted"><BellOff className="size-5 text-muted-foreground" aria-hidden /></span>
        <p className="text-lg font-semibold">No alerts yet</p>
        <p className="max-w-lg text-sm text-muted-foreground">
          You’re monitoring {monitored.length} {monitored.length === 1 ? 'company' : 'companies'}. Automatic alerts start once
          verified news, results and price sources are connected. Stockzz never shows invented alerts.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline"><Link to="/app/saved">Choose monitored stocks</Link></Button>
          <Button asChild variant="outline"><Link to="/app/settings">Alert preferences</Link></Button>
        </div>
      </div>

      <section aria-labelledby="example-h" className="space-y-3">
        <h2 id="example-h" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Example — what an alert will look like</h2>
        <article className="rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-amber-400/60 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">Example only</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Earnings</span>
            <span className="text-xs text-muted-foreground">Published · Retrieved timestamps appear here</span>
          </div>
          <h3 className="mt-3 font-semibold">[Company] ([Ticker]) reported quarterly results below expectations</h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-medium">What happened</dt><dd className="text-muted-foreground">A short, factual summary of the verified development.</dd></div>
            <div><dt className="font-medium">Why it may matter</dt><dd className="text-muted-foreground">A plain-English explanation of the possible impact.</dd></div>
            <div><dt className="font-medium">Your thesis</dt><dd className="text-muted-foreground">Whether it supports, weakens or contradicts what you wrote.</dd></div>
            <div><dt className="font-medium">Source</dt><dd className="inline-flex items-center gap-1 text-muted-foreground">Original publisher link <ExternalLink className="size-3" aria-hidden /></dd></div>
          </dl>
        </article>
      </section>
    </div>
  )
}
