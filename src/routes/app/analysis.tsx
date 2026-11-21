import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, ChartLine, Filter, History, Search, SearchX, Star } from 'lucide-react'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Change, CompanyMark, DemoBadge, SourceLine } from '@/components/stockzz/common'
import { compact, money } from '@/lib/format'
import { EXCHANGES, MARKET_PROVIDER, getStock, listStocks, searchStocks } from '@/lib/market'
import type { Exchange, StockRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

const searchSchema = z.object({
  q: z.string().optional(),
  exchange: z.enum(['All', 'NSE', 'BSE', 'NYSE', 'NASDAQ']).optional(),
})

export const Route = createFileRoute('/app/analysis')({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: 'Analysis · Stockzz' }] }),
  component: Analysis,
})

const EXCHANGE_HELP: Record<Exchange, string> = {
  NSE: 'National Stock Exchange of India',
  BSE: 'BSE (Bombay Stock Exchange), India',
  NYSE: 'New York Stock Exchange, USA',
  NASDAQ: 'Nasdaq Stock Market, USA',
}

function Analysis() {
  const { q = '', exchange = 'All' } = Route.useSearch()
  const navigate = useNavigate({ from: '/app/analysis' })
  const { recent, saved } = useWorkspace()
  const results = searchStocks(q, exchange)
  const recentStocks = recent.map(getStock).filter((s): s is StockRecord => !!s)

  const setSearch = (next: { q?: string; exchange?: Exchange | 'All' }) =>
    navigate({
      search: (prev) => ({
        q: (next.q ?? prev.q) || undefined,
        exchange: (next.exchange ?? prev.exchange) === 'All' ? undefined : (next.exchange ?? prev.exchange),
      }),
      replace: true,
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analysis</h1>
          <p className="mt-1 text-muted-foreground">Search for any company and open its full, plain-English analysis.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            autoFocus
            aria-label="Search by company name or ticker"
            placeholder="Search by company name or ticker, e.g. Infosys or AAPL"
            value={q}
            onChange={(e) => setSearch({ q: e.target.value })}
            className="h-12 rounded-xl bg-card pl-12 text-base"
          />
        </div>
        <Select value={exchange} onValueChange={(v) => setSearch({ exchange: v as Exchange | 'All' })}>
          <SelectTrigger aria-label="Filter by exchange" className="data-[size=default]:h-12 w-full rounded-xl bg-card sm:w-48">
            <Filter className="size-4" aria-hidden />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All exchanges</SelectItem>
            {EXCHANGES.map((x) => (
              <SelectItem key={x} value={x}>{x}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Exchange">
        {(['All', ...EXCHANGES] as const).map((x) => (
          <Tooltip key={x}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-pressed={exchange === x}
                onClick={() => setSearch({ exchange: x })}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  exchange === x ? 'border-primary bg-accent text-accent-foreground' : 'bg-card hover:bg-muted',
                )}
              >
                {x}
              </button>
            </TooltipTrigger>
            <TooltipContent>{x === 'All' ? 'Show every exchange' : EXCHANGE_HELP[x]}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <section aria-label="Search results" className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'company' : 'companies'}
            {q && <> matching “{q}”</>}
          </p>
          {!MARKET_PROVIDER.connected && <DemoBadge />}
        </div>
        <div className="hidden grid-cols-[1fr_120px_150px_120px_88px] gap-4 border-b px-5 py-2.5 text-xs font-medium text-muted-foreground md:grid">
          <span>Company</span><span>Price</span><span>Today’s change</span><span>Market value</span><span className="sr-only">Actions</span>
        </div>
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden />
            <p className="font-semibold">No companies found</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Check the spelling or try the ticker symbol. During the preview, search covers a small demo list of
              companies; full exchange coverage arrives when live market data connects.
            </p>
          </div>
        ) : (
          <ul>
            {results.map((s) => (
              <ResultRow key={s.profile.symbol} stock={s} />
            ))}
          </ul>
        )}
        <div className="border-t px-5 py-3">
          <SourceLine meta={listStocks()[0].quote.meta} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><History className="size-4" aria-hidden /> Recently analysed</h2>
          {recentStocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Stocks you open will appear here so you can jump back in.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {recentStocks.map((s) => (
                <li key={s.profile.symbol}>
                  <Link to="/stock/$symbol" params={{ symbol: s.profile.symbol }} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-muted">
                    <CompanyMark profile={s.profile} size="sm" />
                    {s.profile.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <Link to="/app/saved" className="group flex items-center justify-between rounded-2xl border bg-card p-5 transition-colors hover:bg-muted">
          <span>
            <span className="flex items-center gap-2 font-semibold"><Star className="size-4" aria-hidden /> Saved stocks</span>
            <span className="mt-1 block text-sm text-muted-foreground">{saved.length} saved · see their monitoring status</span>
          </span>
          <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

function ResultRow({ stock }: { stock: StockRecord }) {
  const { profile, quote } = stock
  const { isSaved, toggleSaved } = useWorkspace()
  const saved = isSaved(profile.symbol)
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-4 border-b px-5 py-4 last:border-b-0 md:grid-cols-[1fr_120px_150px_120px_88px]">
      <Link to="/stock/$symbol" params={{ symbol: profile.symbol }} className="flex min-w-0 items-center gap-3">
        <CompanyMark profile={profile} />
        <span className="min-w-0">
          <span className="block truncate font-semibold hover:underline">{profile.name}</span>
          <span className="block text-xs text-muted-foreground">
            {profile.symbol} · {profile.exchange} · {profile.sector}
          </span>
          <span className="mt-1 block text-sm tabular-nums md:hidden">
            {money(quote.price, profile.currency)} <Change value={quote.change} pct={quote.changePct} className="text-xs" />
          </span>
        </span>
      </Link>
      <span className="hidden tabular-nums md:block">{money(quote.price, profile.currency)}</span>
      <Change value={quote.change} pct={quote.changePct} className="hidden text-sm md:block" />
      <span className="hidden text-sm tabular-nums md:block">{compact(quote.marketCap, profile.currency)}</span>
      <div className="flex justify-end gap-1">
        <Link
          to="/stock/$symbol"
          params={{ symbol: profile.symbol }}
          aria-label={`Analyse ${profile.name}`}
          className="grid size-9 place-items-center rounded-lg border hover:bg-muted"
        >
          <ChartLine className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => toggleSaved(profile.symbol)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${profile.name} from saved` : `Save ${profile.name}`}
          className="grid size-9 place-items-center rounded-lg hover:bg-muted"
        >
          <Star className={cn('size-4', saved ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
        </button>
      </div>
    </li>
  )
}
