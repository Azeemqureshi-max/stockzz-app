import { Link, createFileRoute } from '@tanstack/react-router'
import { BellRing, BriefcaseBusiness, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { AddHoldingDialog } from '@/components/stockzz/add-holding-dialog'
import { CompanyMark, DemoBadge } from '@/components/stockzz/common'
import { dateLabel, money, pct } from '@/lib/format'
import { valueHolding } from '@/lib/portfolio'
import type { Currency } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app/portfolio')({
  head: () => ({ meta: [{ title: 'My portfolio · Stockzz' }] }),
  component: Portfolio,
})

function Portfolio() {
  const { holdings, removeHolding, isMonitored } = useWorkspace()
  const [open, setOpen] = useState(false)
  const rows = holdings.map((h) => ({ h, ...valueHolding(h) }))

  const byCurrency = rows.reduce<Partial<Record<Currency, { invested: number; value: number; complete: boolean }>>>((acc, r) => {
    const t = (acc[r.h.currency] ??= { invested: 0, value: 0, complete: true })
    t.invested += r.invested
    if (r.value === null) t.complete = false
    else t.value += r.value
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My portfolio</h1>
          <p className="mt-1 text-muted-foreground">Track investments you’ve made elsewhere. Stockzz never buys or sells for you.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus /> Add investment</Button>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"><BriefcaseBusiness className="size-5" aria-hidden /></span>
          <p className="text-lg font-semibold">No investments yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Add shares you already own — company, purchase date, number of shares and price — and Stockzz will show their
            value and watch for important news.
          </p>
          <Button onClick={() => setOpen(true)}><Plus /> Add your first investment</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(byCurrency) as [Currency, { invested: number; value: number; complete: boolean }][]).map(([cur, t]) => {
              const gain = t.value - t.invested
              return (
                <div key={cur} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{cur} holdings</p>
                    <DemoBadge />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Total invested</p>
                  <p className="text-xl font-bold tabular-nums">{money(t.invested, cur)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Latest value</p>
                  {t.complete ? (
                    <p className="text-xl font-bold tabular-nums">
                      {money(t.value, cur)}{' '}
                      <span className={cn('text-sm', gain >= 0 ? 'text-positive' : 'text-negative')}>
                        {gain >= 0 ? '+' : '-'}{money(Math.abs(gain), cur)} ({pct((gain / t.invested) * 100)})
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Price unavailable for one or more holdings</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card">
            <ul>
              {rows.map(({ h, stock, invested, value, gain, gainPct }) => (
                <li key={h.id} className="flex flex-wrap items-center gap-4 border-b px-5 py-4 last:border-b-0">
                  {stock && <CompanyMark profile={stock.profile} />}
                  <div className="min-w-40 flex-1">
                    <Link to="/stock/$symbol" params={{ symbol: h.symbol }} className="font-semibold hover:underline">
                      {stock?.profile.name ?? h.symbol}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {h.symbol} · {h.exchange} · {h.shares} shares @ {money(h.pricePerShare, h.currency)} · bought {dateLabel(h.purchaseDate)}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <BellRing className="size-3" aria-hidden /> Monitoring: {isMonitored(h.symbol) ? 'on your list' : 'off'}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">Invested {money(invested, h.currency)}</p>
                    {value === null ? (
                      <p className="text-muted-foreground">Latest price unavailable</p>
                    ) : (
                      <p className="font-semibold tabular-nums">
                        {money(value, h.currency)}{' '}
                        <span className={cn(gain! >= 0 ? 'text-positive' : 'text-negative')}>({pct(gainPct!)})</span>
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Remove ${h.symbol} holding`} onClick={() => removeHolding(h.id)}>
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Values use the latest demo price. Gains and losses become real once live market data is connected.
          </p>
        </>
      )}
      <AddHoldingDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
