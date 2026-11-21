import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  BellRing,
  Bot,
  BriefcaseBusiness,
  Building2,
  ChartCandlestick,
  ChartLine,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  ClipboardList,
  Globe,
  Info,
  LayoutDashboard,
  Minus,
  Newspaper,
  Star,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { AddHoldingDialog } from '@/components/stockzz/add-holding-dialog'
import { CompanyMark, DemoBadge, EvidenceTag, InfoTip, Logo, SourceLine } from '@/components/stockzz/common'
import { PriceChart } from '@/components/stockzz/price-chart'
import { ThesisCard } from '@/components/stockzz/thesis-card'
import { WorkspaceGate } from '@/components/stockzz/workspace-gate'
import { compact, dateLabel, dateTimeLabel, money, pct, volume } from '@/lib/format'
import { getStock } from '@/lib/market'
import type { StockRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/stock/$symbol')({
  loader: ({ params }) => {
    const stock = getStock(params.symbol)
    if (!stock) throw notFound()
    return { symbol: stock.profile.symbol }
  },
  head: ({ loaderData }) => {
    const s = loaderData ? getStock(loaderData.symbol) : undefined
    return { meta: [{ title: s ? `${s.profile.name} (${s.profile.symbol}) analysis · Stockzz` : 'Stock analysis · Stockzz' }] }
  },
  component: StockPage,
})

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'financials', label: 'Financials', icon: Wallet },
  { id: 'chart', label: 'Chart', icon: ChartLine },
  { id: 'news', label: 'News & Updates', icon: Newspaper },
  { id: 'technical', label: 'Technical Analysis', icon: ChartCandlestick },
  { id: 'ai', label: 'AI Insights', icon: Bot },
  { id: 'thesis', label: 'My Thesis', icon: ClipboardList },
  { id: 'company', label: 'Company Info', icon: Building2 },
] as const

function StockPage() {
  const { symbol } = Route.useLoaderData()
  const stock = getStock(symbol)!
  const { user, markViewed } = useWorkspace()
  const [active, setActive] = useState<string>('overview')

  useEffect(() => {
    if (user) markViewed(symbol)
  }, [symbol, user, markViewed])

  if (!user) return <WorkspaceGate dark />

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r bg-sidebar px-3 py-5 lg:flex">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
          <Link to="/app/analysis" className="inline-flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="size-3.5" aria-hidden /> Analysis
          </Link>
          <ChevronRight className="size-3" aria-hidden />
          <span className="truncate text-foreground">{stock.profile.name}</span>
        </nav>
        <nav aria-label="Sections" className="mt-6 flex flex-col gap-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                active === id && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <Logo to="/app/suggestions" className="text-base" />
        </div>
      </aside>

      <div className="lg:pl-56">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/app/analysis" aria-label="Back to Analysis" className="grid size-9 place-items-center rounded-lg hover:bg-muted">
            <ChevronLeft className="size-5" />
          </Link>
          <span className="truncate font-semibold">{stock.profile.name}</span>
          <DemoBadge className="ml-auto" />
        </div>
        <nav aria-label="Sections" className="flex gap-2 overflow-x-auto border-b px-4 py-2 lg:hidden">
          {SECTIONS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {label}
            </a>
          ))}
        </nav>

        <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6">
          <Header stock={stock} />
          <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr_0.85fr]">
            <ChartCard stock={stock} />
            <FinancialsCard stock={stock} />
            <AboutCard stock={stock} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <NewsCard stock={stock} />
            <AiCard stock={stock} />
            <TechnicalCard stock={stock} />
          </div>
          <FinancialHealth stock={stock} />
          <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
            <ThesisCard stock={stock} />
            <MonitoringCard stock={stock} />
          </div>
          <p className="flex items-start gap-2 rounded-xl border px-4 py-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Stockzz is a research tool, not a broker or financial adviser. Figures on this page are DEMO DATA for
            previewing the experience — they are not real prices, results or news. Always verify with official sources
            before investing.
          </p>
        </main>
      </div>
    </div>
  )
}

function Card({ id, title, action, children, className }: { id?: string; title: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('scroll-mt-6 rounded-2xl border bg-card p-5', className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Header({ stock }: { stock: StockRecord }) {
  const { profile, quote } = stock
  const { isSaved, toggleSaved } = useWorkspace()
  const [addOpen, setAddOpen] = useState(false)
  const saved = isSaved(profile.symbol)
  const up = quote.change >= 0
  return (
    <section id="overview" className="scroll-mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <CompanyMark profile={profile} size="lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{profile.name}</h1>
          <p className="text-muted-foreground">
            {profile.symbol} · {profile.exchange}
          </p>
          <p className="text-sm text-muted-foreground">
            {profile.sector} · {profile.industry}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const now = toggleSaved(profile.symbol)
                toast(now ? `${profile.name} saved` : `${profile.name} removed from saved`, {
                  description: now ? 'It’s now in your saved stocks and monitoring list.' : undefined,
                })
              }}
              aria-pressed={saved}
            >
              <Star className={cn(saved && 'fill-amber-400 text-amber-400')} />
              {saved ? 'Saved' : 'Add to Watchlist'}
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <BriefcaseBusiness /> Add to Portfolio
            </Button>
          </div>
        </div>
      </div>
      <div className="md:text-right">
        <div className="flex items-center gap-2 md:justify-end">
          <p className="text-3xl font-bold tabular-nums sm:text-4xl">{money(quote.price, profile.currency)}</p>
          <DemoBadge className="hidden lg:inline-flex" />
        </div>
        <p className={cn('font-semibold tabular-nums', up ? 'text-positive' : 'text-negative')}>
          {up ? '+' : '-'}{Math.abs(quote.change).toFixed(2)} ({pct(quote.changePct)}) <span className="font-normal text-muted-foreground">Today</span>
        </p>
        <p className="text-sm text-muted-foreground">Last updated: {dateTimeLabel(quote.meta.asOf)} · {profile.currency}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className={cn('size-2 rounded-full', quote.marketStatus === 'open' ? 'bg-positive' : 'bg-muted-foreground')} aria-hidden />
          Market {quote.marketStatus === 'open' ? 'open' : 'closed'}
        </p>
      </div>
      <AddHoldingDialog key={profile.symbol} open={addOpen} onOpenChange={setAddOpen} defaultSymbol={profile.symbol} />
    </section>
  )
}

function ChartCard({ stock }: { stock: StockRecord }) {
  const { quote, profile } = stock
  const c = profile.currency
  const rows: [string, string][] = [
    ['Open', money(quote.open, c)],
    ['High', money(quote.high, c)],
    ['Low', money(quote.low, c)],
    ['Prev close', money(quote.prevClose, c)],
    ['Volume', volume(quote.volume)],
    ['Avg volume', volume(quote.avgVolume)],
    ['52W high', money(quote.week52High, c)],
    ['52W low', money(quote.week52Low, c)],
  ]
  return (
    <Card id="chart" title="Price Chart" action={<DemoBadge />}>
      <div className="grid gap-5 md:grid-cols-[1fr_170px]">
        <PriceChart stock={stock} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <SourceLine meta={quote.meta} className="mt-4" />
    </Card>
  )
}

const TERMS = {
  revenue: 'Revenue is all the money the company brought in from selling its products and services, before any costs.',
  netIncome: 'Net income is the profit left after paying every cost, interest and tax. It’s the “bottom line”.',
  eps: 'Earnings per share (EPS) is the net income divided by the number of shares. It shows how much profit each share earned.',
  pe: 'The P/E ratio compares the share price to earnings per share. A P/E of 30 means investors pay 30 for every 1 of yearly profit. Higher can mean high expectations — or an expensive stock.',
  roe: 'Return on equity (ROE) shows how much profit the company makes using shareholders’ money. Higher is generally better, but very high values can be caused by heavy debt or share buybacks.',
  de: 'Debt to equity compares what the company owes with what shareholders own. Below 1 usually means modest debt. For banks this measure isn’t meaningful because lending is their business.',
  ocf: 'Operating cash flow is the real cash generated by everyday business activities. Healthy companies usually turn most of their profit into cash.',
  margin: 'Profit margin is the share of revenue kept as profit. A 25% margin means 25 of every 100 earned is profit.',
}

function FinTile({ label, value, sub, tip }: { label: string; value: string; sub?: string; tip: string }) {
  const negative = sub?.startsWith('-')
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {label} <InfoTip label={label}>{tip}</InfoTip>
      </p>
      <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
      {sub && <p className={cn('text-xs font-medium', negative ? 'text-negative' : 'text-positive')}>{sub}</p>}
    </div>
  )
}

function notApplicable(stock: StockRecord, v: number) {
  return stock.profile.industry === 'Banking' && v === 0
}

function FinancialsCard({ stock }: { stock: StockRecord }) {
  const f = stock.fundamentals
  const c = stock.profile.currency
  return (
    <Card id="financials" title="Key Financials (TTM)" action={<DemoBadge />}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <FinTile label="Revenue" value={compact(f.revenue, c)} sub={`${pct(f.revenueGrowthPct)} YoY`} tip={TERMS.revenue} />
        <FinTile label="Net income" value={compact(f.netIncome, c)} sub={`${pct(f.netIncomeGrowthPct)} YoY`} tip={TERMS.netIncome} />
        <FinTile label="EPS" value={money(f.eps, c)} sub={`${pct(f.epsGrowthPct)} YoY`} tip={TERMS.eps} />
        <FinTile label="P/E ratio" value={f.pe.toFixed(2)} tip={TERMS.pe} />
        <FinTile label="ROE" value={`${f.roePct.toFixed(1)}%`} tip={TERMS.roe} />
        <FinTile label="Debt to equity" value={notApplicable(stock, f.debtToEquity) ? 'N/A' : f.debtToEquity.toFixed(2)} tip={TERMS.de} />
      </div>
      <a href="#health" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:underline">
        View full financials, explained <ArrowRight className="size-4" aria-hidden />
      </a>
      <p className="mt-2 text-xs text-muted-foreground">TTM = trailing twelve months (the last four reported quarters).</p>
    </Card>
  )
}

function AboutCard({ stock }: { stock: StockRecord }) {
  const p = stock.profile
  const rows: [string, React.ReactNode][] = [
    ['CEO', p.ceo],
    ['Founded', p.founded],
    ['Headquarters', p.headquarters],
    ['Employees', p.employees],
    [
      'Website',
      <a key="w" href={`https://${p.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
        <Globe className="size-3.5" aria-hidden /> {p.website}
      </a>,
    ],
  ]
  return (
    <Card id="company" title={`About ${p.name}`}>
      <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-muted-foreground">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">Company profile is a preview and should be verified with the company’s official filings.</p>
    </Card>
  )
}

const NEWS_KIND = {
  announcement: ['Announcement', 'bg-sky-400/15 text-sky-300'],
  earnings: ['Earnings', 'bg-violet-400/15 text-violet-300'],
  market: ['Market', 'bg-muted text-muted-foreground'],
  risk: ['Risk', 'bg-red-400/15 text-red-300'],
} as const

function NewsCard({ stock }: { stock: StockRecord }) {
  return (
    <Card id="news" title="Recent News & Updates" action={<DemoBadge />}>
      <ul className="space-y-4">
        {stock.news.map((n) => {
          const [label, cls] = NEWS_KIND[n.kind]
          return (
            <li key={n.id} className="flex gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted">
                <Newspaper className="size-5 text-muted-foreground" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-medium leading-snug">{n.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className={cn('rounded px-1.5 py-0.5 font-semibold', cls)}>{label}</span>
                  {dateLabel(n.publishedAt)} · {n.source}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        These are sample headlines. Real articles with source links and publication dates appear here once a news
        provider is connected.
      </p>
    </Card>
  )
}

function AiCard({ stock }: { stock: StockRecord }) {
  const ai = stock.ai
  const [more, setMore] = useState(false)
  return (
    <Card id="ai" title={<><Bot className="size-4" aria-hidden /> AI Insight Summary</>} action={<DemoBadge />}>
      <p className="text-sm leading-relaxed">{ai.summary}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3">
          <p className="mb-2 text-sm font-semibold text-positive">What looks positive</p>
          <ul className="space-y-1.5 text-sm">
            {ai.positives.map((x) => (
              <li key={x} className="flex gap-2"><CircleCheck className="mt-0.5 size-4 shrink-0 text-positive" aria-hidden />{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
          <p className="mb-2 text-sm font-semibold text-negative">What looks concerning</p>
          <ul className="space-y-1.5 text-sm">
            {ai.concerns.map((x) => (
              <li key={x} className="flex gap-2"><TriangleAlert className="mt-0.5 size-4 shrink-0 text-negative" aria-hidden />{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="mt-3 text-sm font-medium text-sky-400 hover:underline">
        {more ? 'Hide details' : 'What changed, what to check & evidence'}
      </button>
      {more && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <p className="font-semibold">What changed recently</p>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">{ai.recentChanges.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-semibold"><CircleHelp className="size-4" aria-hidden /> Worth investigating further</p>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">{ai.investigate.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <p className="font-semibold">Evidence behind this summary</p>
            <ul className="mt-2 space-y-1.5">
              {ai.evidence.map((e) => (
                <li key={e.label} className="flex flex-wrap items-center gap-2 text-muted-foreground"><EvidenceTag kind={e.kind} /> {e.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-px size-3.5 shrink-0" aria-hidden /> AI insights are for education only, not financial advice. {ai.meta.source}.
      </p>
    </Card>
  )
}

function TechnicalCard({ stock }: { stock: StockRecord }) {
  const t = stock.technicals
  const c = stock.profile.currency
  const price = stock.quote.price
  const TrendIcon = t.trend === 'bullish' ? ArrowUpRight : t.trend === 'bearish' ? ArrowDownRight : Minus
  const trendText = { bullish: 'Upward', bearish: 'Downward', sideways: 'Sideways' }[t.trend]
  const above50 = price > t.ma50
  const above200 = price > t.ma200
  const rsiText = t.rsi14 >= 70 ? 'may be overbought (risen fast)' : t.rsi14 <= 30 ? 'may be oversold (fallen fast)' : 'is in a normal range'
  const tiles: [string, string, string][] = [
    ['Support', money(t.support, c), 'A price level where buying has tended to stop falls.'],
    ['Resistance', money(t.resistance, c), 'A price level where selling has tended to stop rises.'],
    ['50-day MA', money(t.ma50, c), 'Average closing price over the last 50 trading days — the short-to-medium trend.'],
    ['200-day MA', money(t.ma200, c), 'Average closing price over the last 200 trading days — the long-term trend.'],
    ['RSI (14)', t.rsi14.toFixed(1), 'Relative Strength Index, 0–100. Above 70 suggests the price rose very quickly; below 30 suggests it fell very quickly.'],
  ]
  return (
    <Card id="technical" title="Technical Analysis" action={<DemoBadge />}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-xl border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Trend</p>
          <p className={cn('mt-1 inline-flex items-center gap-1 text-lg font-bold', t.trend === 'bullish' ? 'text-positive' : t.trend === 'bearish' ? 'text-negative' : '')}>
            {trendText} <TrendIcon className="size-4" aria-hidden />
          </p>
        </div>
        {tiles.map(([k, v, tip]) => (
          <div key={k} className="rounded-xl border bg-muted/40 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">{k} <InfoTip label={k}>{tip}</InfoTip></p>
            <p className="mt-1 text-lg font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <EvidenceTag kind="calculated" />{' '}
        The price is {above50 ? 'above' : 'below'} its 50-day average and {above200 ? 'above' : 'below'} its 200-day
        average, {above50 && above200 ? 'which usually signals an upward medium-term trend' : !above50 && !above200 ? 'which usually signals a downward trend' : 'which suggests a mixed or changing trend'}. RSI {rsiText}.
        Technical signals describe past price behaviour and don’t predict the future.
      </p>
    </Card>
  )
}

function FinancialHealth({ stock }: { stock: StockRecord }) {
  const f = stock.fundamentals
  const c = stock.profile.currency
  const bank = stock.profile.industry === 'Banking'
  const items = [
    {
      title: 'Is the company growing?',
      value: `Revenue ${compact(f.revenue, c)} (${pct(f.revenueGrowthPct, 1)} vs last year)`,
      good: f.revenueGrowthPct > 0,
      plain: f.revenueGrowthPct > 10 ? 'Sales are growing quickly.' : f.revenueGrowthPct > 0 ? 'Sales are growing slowly but steadily.' : 'Sales are shrinking — worth understanding why.',
      tip: TERMS.revenue,
    },
    {
      title: 'Is it profitable?',
      value: `Net income ${compact(f.netIncome, c)} · margin ${f.profitMarginPct}%`,
      good: f.netIncome > 0,
      plain: f.profitMarginPct > 20 ? 'Keeps a large share of each sale as profit.' : f.profitMarginPct > 8 ? 'Makes a healthy profit on its sales.' : 'Profit margins are thin.',
      tip: TERMS.margin,
    },
    {
      title: 'Does it turn profit into cash?',
      value: bank || f.operatingCashFlow === 0 ? 'Not meaningful for banks' : `Operating cash flow ${compact(f.operatingCashFlow, c)}`,
      good: bank || f.operatingCashFlow >= f.netIncome * 0.8,
      plain: bank ? 'Bank cash flows mix customer deposits and loans, so this measure is skipped.' : f.operatingCashFlow >= f.netIncome ? 'Generates more cash than its reported profit — a good sign.' : 'Generates less cash than its reported profit.',
      tip: TERMS.ocf,
    },
    {
      title: 'How much debt does it carry?',
      value: bank ? 'Not meaningful for banks' : `Debt to equity ${f.debtToEquity.toFixed(2)}`,
      good: bank || f.debtToEquity < 1,
      plain: bank ? 'Banks borrow and lend as their core business.' : f.debtToEquity < 0.5 ? 'Very little debt compared with shareholder money.' : f.debtToEquity < 1 ? 'Moderate debt.' : 'Relatively high debt — check whether it can comfortably repay.',
      tip: TERMS.de,
    },
    {
      title: 'Is the share price expensive?',
      value: `P/E ratio ${f.pe.toFixed(1)}`,
      good: f.pe < 35,
      plain: f.pe > 35 ? 'Investors are paying a lot for each unit of profit — expectations are high.' : f.pe > 18 ? 'Priced in a moderate range for a profitable company.' : 'Priced relatively low compared with its profits.',
      tip: TERMS.pe,
    },
  ]
  return (
    <section id="health" className="scroll-mt-6 rounded-2xl border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Financial health, in plain English</h2>
          <p className="text-sm text-muted-foreground">Five simple questions every investor should ask.</p>
        </div>
        <DemoBadge />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border bg-muted/30 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              {it.good ? <CircleCheck className="size-4 text-positive" aria-label="Looks healthy" /> : <TriangleAlert className="size-4 text-amber-400" aria-label="Worth a closer look" />}
              {it.title}
            </p>
            <p className="mt-2 text-sm tabular-nums">{it.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{it.plain}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><EvidenceTag kind="calculated" /> <InfoTip label={it.title}>{it.tip}</InfoTip></p>
          </div>
        ))}
      </div>
      <SourceLine meta={f.meta} className="mt-4" />
    </section>
  )
}

function MonitoringCard({ stock }: { stock: StockRecord }) {
  const { isMonitored, toggleMonitored } = useWorkspace()
  const on = isMonitored(stock.profile.symbol)
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="flex items-center gap-2 font-semibold"><BellRing className="size-4" aria-hidden /> Alerts for {stock.profile.symbol}</h2>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border p-3">
        <label htmlFor="monitor-switch" className="text-sm">
          <span className="block font-medium">Monitor this company</span>
          <span className="text-muted-foreground">Include it when Stockzz checks for important developments.</span>
        </label>
        <Switch id="monitor-switch" checked={on} onCheckedChange={() => toggleMonitored(stock.profile.symbol)} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Monitoring status: <span className="font-medium text-foreground">{on ? 'On your list' : 'Not monitored'}</span>.
        Automatic checks start once verified news and price data are connected — until then no alerts are sent.
      </p>
      <Button asChild variant="link" className="mt-1 h-auto px-0 text-sky-400">
        <Link to="/app/settings">Choose alert types & email settings <ArrowRight /></Link>
      </Button>
    </section>
  )
}
