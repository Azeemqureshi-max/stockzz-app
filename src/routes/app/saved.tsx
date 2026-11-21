import { Link, createFileRoute } from '@tanstack/react-router'
import { Search, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Change, CompanyMark } from '@/components/stockzz/common'
import { money } from '@/lib/format'
import { getStock } from '@/lib/market'
import type { StockRecord } from '@/lib/types'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app/saved')({
  head: () => ({ meta: [{ title: 'Saved stocks · Stockzz' }] }),
  component: Saved,
})

function Saved() {
  const { saved, toggleSaved, isMonitored, toggleMonitored, theses } = useWorkspace()
  const stocks = saved.map(getStock).filter((s): s is StockRecord => !!s)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Saved stocks</h1>
        <p className="mt-1 text-muted-foreground">Companies you follow. Choose which ones Stockzz should monitor for alerts.</p>
      </div>
      {stocks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <Star className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-lg font-semibold">Nothing saved yet</p>
          <p className="text-sm text-muted-foreground">Tap the star on any stock to keep it here.</p>
          <Button asChild><Link to="/app/analysis"><Search /> Find a stock</Link></Button>
        </div>
      ) : (
        <ul className="grid gap-3">
          {stocks.map((s) => {
            const sym = s.profile.symbol
            const thesis = theses[sym]
            return (
              <li key={sym} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4">
                <CompanyMark profile={s.profile} />
                <div className="min-w-40 flex-1">
                  <Link to="/stock/$symbol" params={{ symbol: sym }} className="font-semibold hover:underline">{s.profile.name}</Link>
                  <p className="text-xs text-muted-foreground">
                    {sym} · {s.profile.exchange} · {money(s.quote.price, s.profile.currency)}{' '}
                    <Change value={s.quote.change} pct={s.quote.changePct} /> <span className="font-semibold">(demo)</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Thesis: {thesis ? `version ${thesis.length} · not yet checked` : 'not written yet'}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={isMonitored(sym)} onCheckedChange={() => toggleMonitored(sym)} aria-label={`Monitor ${s.profile.name}`} />
                  {isMonitored(sym) ? 'Monitoring' : 'Not monitored'}
                </label>
                <Button variant="ghost" size="sm" onClick={() => toggleSaved(sym)}>Remove</Button>
              </li>
            )
          })}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">
        Monitoring runs as periodic checks (not real-time) once verified data sources are connected.
      </p>
    </div>
  )
}
