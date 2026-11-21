import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CircleAlert, CircleCheck, Megaphone, SlidersHorizontal, Star } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Change, CompanyMark, DemoBadge, Disclaimer } from '@/components/stockzz/common'
import { DEMO_MARKET_MOOD } from '@/data/demo-fixtures'
import { money } from '@/lib/format'
import { listStocks } from '@/lib/market'
import { valueHolding } from '@/lib/portfolio'
import type { Currency, StockRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app/suggestions')({
  head: () => ({ meta: [{ title: 'Suggestions · Stockzz' }] }),
  component: Suggestions,
})

type Market = 'All' | 'India' | 'US'
type Risk = 'Lower' | 'Balanced' | 'Higher'
const SECTORS = ['Technology', 'Financials', 'Energy', 'Automobile', 'Healthcare']

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function fitsRisk(s: StockRecord, risk: Risk) {
  if (risk === 'Higher') return true
  const steady = s.technicals.trend !== 'bearish' && s.fundamentals.debtToEquity <= 1
  if (risk === 'Lower') return steady && s.fundamentals.netIncomeGrowthPct >= 0 && s.fundamentals.revenueGrowthPct < 60
  return steady || s.fundamentals.netIncomeGrowthPct > 10
}

function Suggestions() {
  const { user, holdings, saved } = useWorkspace()
  const [market, setMarket] = useState<Market>('All')
  const [risk, setRisk] = useState<Risk>('Balanced')
  const [sectors, setSectors] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [hello] = useState(greeting)

  const results = useMemo(
    () =>
      listStocks().filter((s) => {
        const india = s.profile.exchange === 'NSE' || s.profile.exchange === 'BSE'
        if (market === 'India' && !india) return false
        if (market === 'US' && india) return false
        if (sectors.length && !sectors.includes(s.profile.sector)) return false
        return fitsRisk(s, risk)
      }),
    [market, risk, sectors],
  )
  const visible = showAll ? results : results.slice(0, 3)

  // Totals per currency — never mix ₹ and $ into one number.
  const totals = holdings.reduce<Partial<Record<Currency, number>>>((acc, h) => {
    const v = valueHolding(h)
    acc[h.currency] = (acc[h.currency] ?? 0) + (v.value ?? v.invested)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {hello}, {user?.name.split(' ')[0]}! <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Here are today’s stock ideas to research, based on what you told us you like.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Markets" demo>
          <p className="text-xl font-bold text-positive">{DEMO_MARKET_MOOD.label}</p>
          <p className="text-sm text-muted-foreground">
            {DEMO_MARKET_MOOD.index}{' '}
            <span className="font-medium text-positive">+{DEMO_MARKET_MOOD.changePct}%</span>
          </p>
        </StatCard>
        <StatCard label="Your portfolio" demo={holdings.length > 0}>
          {holdings.length === 0 ? (
            <>
              <p className="text-xl font-bold">No investments yet</p>
              <Link to="/app/portfolio" className="text-sm font-medium text-primary hover:underline">Add one you own →</Link>
            </>
          ) : (
            <>
              <p className="text-xl font-bold tabular-nums">
                {(Object.entries(totals) as [Currency, number][]).map(([c, v]) => money(v, c, 0)).join(' · ')}
              </p>
              <p className="text-sm text-muted-foreground">
                {holdings.length} holding{holdings.length > 1 ? 's' : ''} ·{' '}
                <Link to="/app/portfolio" className="font-medium text-primary hover:underline">View</Link>
              </p>
            </>
          )}
        </StatCard>
        <StatCard label="Saved stocks">
          <p className="text-xl font-bold">{saved.length}</p>
          <p className="text-sm text-muted-foreground">
            Stocks you follow · <Link to="/app/saved" className="font-medium text-primary hover:underline">View</Link>
          </p>
        </StatCard>
      </div>

      <section aria-labelledby="sugg-h" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="sugg-h" className="text-lg font-semibold">Top stock ideas for you</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPrefs((v) => !v)} aria-expanded={showPrefs}>
              <SlidersHorizontal /> Your preferences
            </Button>
            {results.length > 3 && (
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : `View all (${results.length})`}
              </Button>
            )}
          </div>
        </div>

        {showPrefs && (
          <div className="grid gap-5 rounded-2xl border bg-card p-5 sm:grid-cols-3">
            <PrefGroup label="Market">
              {(['All', 'India', 'US'] as Market[]).map((m) => (
                <Chip key={m} active={market === m} onClick={() => setMarket(m)}>{m}</Chip>
              ))}
            </PrefGroup>
            <PrefGroup label="Comfort with ups and downs">
              {(['Lower', 'Balanced', 'Higher'] as Risk[]).map((r) => (
                <Chip key={r} active={risk === r} onClick={() => setRisk(r)}>{r}</Chip>
              ))}
            </PrefGroup>
            <PrefGroup label="Sectors you’re curious about">
              {SECTORS.map((s) => (
                <Chip
                  key={s}
                  active={sectors.includes(s)}
                  onClick={() => setSectors((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))}
                >
                  {s}
                </Chip>
              ))}
            </PrefGroup>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <p className="font-semibold">No ideas match these preferences yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Try choosing more sectors or a different market.</p>
            <Button className="mt-4" variant="outline" onClick={() => { setSectors([]); setMarket('All'); setRisk('Balanced') }}>
              Reset preferences
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((s) => (
              <SuggestionCard key={s.profile.symbol} stock={s} />
            ))}
          </div>
        )}
      </section>

      <Disclaimer />
    </div>
  )
}

function StatCard({ label, demo, children }: { label: string; demo?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {demo && <DemoBadge />}
      </div>
      {children}
    </div>
  )
}

function PrefGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

function SuggestionCard({ stock }: { stock: StockRecord }) {
  const { profile, quote, suggestion } = stock
  const { isSaved, toggleSaved } = useWorkspace()
  const saved = isSaved(profile.symbol)
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <CompanyMark profile={profile} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{profile.name}</h3>
          <p className="text-xs text-muted-foreground">{profile.symbol} · {profile.exchange}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(profile.symbol)}
          aria-label={saved ? `Remove ${profile.name} from saved` : `Save ${profile.name}`}
          aria-pressed={saved}
          className="rounded-md p-1.5 hover:bg-muted"
        >
          <Star className={cn('size-4', saved ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{profile.sector}</span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{profile.capSize}</span>
        <DemoBadge className="ml-auto" />
      </div>

      <p className="mt-3 text-sm leading-relaxed">
        <span className="font-medium">Why it’s here: </span>
        {suggestion.why}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="mb-1.5 font-semibold">Key strengths</p>
          <ul className="space-y-1">
            {suggestion.strengths.map((x) => (
              <li key={x} className="flex gap-1.5"><CircleCheck className="mt-px size-3.5 shrink-0 text-positive" aria-hidden />{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 font-semibold">Key risks</p>
          <ul className="space-y-1">
            {suggestion.risks.map((x) => (
              <li key={x} className="flex gap-1.5"><CircleAlert className="mt-px size-3.5 shrink-0 text-negative" aria-hidden />{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 flex gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        <Megaphone className="size-3.5 shrink-0" aria-hidden /> {suggestion.developments}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold tabular-nums">{money(quote.price, profile.currency)}</span>
        <Change value={quote.change} pct={quote.changePct} className="text-xs" />
      </div>

      <Button asChild className="mt-4 w-full">
        <Link to="/stock/$symbol" params={{ symbol: profile.symbol }}>
          View analysis <ArrowRight />
        </Link>
      </Button>
    </article>
  )
}

