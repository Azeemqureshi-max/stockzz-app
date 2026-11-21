import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleCheck,
  ClipboardList,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DemoBadge, Logo } from '@/components/stockzz/common'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-5 sm:px-6">
        <Logo />
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#trust" className="hover:text-foreground">Our data promise</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/login">Log in</Link></Button>
          <Button asChild><Link to="/signup">Get started</Link></Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-accent-foreground">
              <Sparkles className="size-3.5" aria-hidden /> Stock research for first-time investors
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Understand a stock before you invest in it.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Stockzz finds companies worth researching, explains their financial health in plain English, and keeps an
              eye on the investments you already own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/signup">Create a free account <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/login">Log in</Link></Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Research and monitoring only. Stockzz is not a broker and doesn’t give financial advice.
            </p>
          </div>
          <HeroPreview />
        </section>

        <section id="how" className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight">Just two places to go</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">No crowded dashboards. Start with ideas, or search for a company you’ve heard of.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <HowCard
                icon={<Sparkles className="size-5" aria-hidden />}
                title="Suggestions"
                body="Stock ideas matched to what you care about — market, sectors and comfort with ups and downs — each with a simple reason, key strengths and the main risks."
              />
              <HowCard
                icon={<LayoutGrid className="size-5" aria-hidden />}
                title="Analysis"
                body="Search by name or ticker across NSE, BSE, NYSE and NASDAQ. Open any company for a detailed page with charts, financials, news, technicals and an AI summary."
              />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Detailed when you choose a stock</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<BookOpenCheck />} title="Plain-English financials" body="Revenue, profit, debt, cash flow and P/E — each with a short explanation of what it means." />
            <Feature icon={<ClipboardList />} title="Investment thesis" body="Write down why you invested and what would change your mind. Every version is kept." />
            <Feature icon={<BriefcaseBusiness />} title="Portfolio tracking" body="Record shares you own elsewhere and see what you invested and what they’re worth." />
            <Feature icon={<BellRing />} title="Useful alerts" body="Choose which companies to monitor and which developments matter to you." />
          </div>
        </section>

        <section id="trust" className="dark bg-background text-foreground">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <ShieldCheck className="size-8 text-primary" aria-hidden />
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Our data promise</h2>
              <p className="mt-3 text-muted-foreground">
                Investing decisions deserve honest information. Stockzz is built around a few rules it never breaks.
              </p>
            </div>
            <ul className="grid gap-4 text-sm">
              {[
                'Every figure shows its source and when it was last updated.',
                'Live, delayed, historical and unavailable data are always labelled — delayed data is never called real-time.',
                'Verified facts, our calculations and AI interpretation are visibly separated.',
                'No invented prices, news or confidence scores. Sample content is marked DEMO DATA.',
              ].map((t) => (
                <li key={t} className="flex gap-3 rounded-xl border bg-card p-4">
                  <CircleCheck className="size-5 shrink-0 text-positive" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Start researching with confidence</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Free to start. Your saved stocks and portfolio stay private to your account.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/signup">Create your account <ArrowRight /></Link></Button>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between">
          <Logo className="text-base text-foreground" />
          <p className="max-w-2xl">
            Stockzz provides research and information, not financial advice. It does not execute trades or guarantee
            returns. Investments are subject to market risks.
          </p>
        </div>
      </footer>
    </div>
  )
}

function HowCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-background p-6">
      <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  )
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 [&_svg]:size-5">
      <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

/** Illustrative mock of a suggestion card. Values are DEMO DATA. */
function HeroPreview() {
  const points = [28, 34, 31, 40, 38, 46, 44, 52, 49, 58, 63, 60, 70, 68, 76]
  const max = Math.max(...points)
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 300},${100 - (p / max) * 90}`).join(' ')
  return (
    <div className="relative" aria-label="Preview of a Stockzz stock card with demo data">
      <div className="dark rounded-3xl border bg-background p-6 text-foreground shadow-2xl shadow-primary/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-[#0284c7] font-bold text-white">IN</span>
            <div>
              <p className="font-semibold">Infosys Limited</p>
              <p className="text-xs text-muted-foreground">INFY · NSE · Technology</p>
            </div>
          </div>
          <DemoBadge />
        </div>
        <svg viewBox="0 0 300 100" className="mt-6 h-32 w-full" aria-hidden>
          <defs>
            <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${path} 300,100`} fill="url(#hero-fill)" />
          <polyline points={path} fill="none" stroke="var(--positive)" strokeWidth="2.5" />
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {[
            ['P/E ratio', '26.3'],
            ['Debt to equity', '0.08'],
            ['Trend', 'Upward'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border bg-card p-2.5">
              <p className="text-muted-foreground">{k}</p>
              <p className="mt-0.5 text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <p className="flex gap-1.5 rounded-lg bg-emerald-500/10 p-2.5"><CircleCheck className="size-4 shrink-0 text-positive" aria-hidden /> Almost no debt</p>
          <p className="flex gap-1.5 rounded-lg bg-red-500/10 p-2.5"><TriangleAlert className="size-4 shrink-0 text-negative" aria-hidden /> Depends on global IT budgets</p>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border bg-card p-4 shadow-lg sm:block">
        <p className="text-xs text-muted-foreground">What’s a P/E ratio?</p>
        <p className="mt-1 max-w-56 text-sm">How many rupees investors pay for every ₹1 of yearly profit.</p>
      </div>
    </div>
  )
}
