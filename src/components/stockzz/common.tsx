import { Info, ShieldAlert, Sprout } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { dateTimeLabel } from '@/lib/format'
import type { CompanyProfile, DataMeta } from '@/lib/types'

export function Logo({ className, to = '/' }: { className?: string; to?: '/' | '/app/suggestions' }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-bold text-lg tracking-tight', className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sprout className="size-4" aria-hidden />
      </span>
      Stockzz
    </Link>
  )
}

/** Letter monogram used instead of company logos. */
export function CompanyMark({ profile, size = 'md' }: { profile: CompanyProfile; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'size-9 text-xs', md: 'size-11 text-sm', lg: 'size-16 text-xl' }[size]
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-xl font-bold text-white', dims)}
      style={{ backgroundColor: profile.brandColor }}
    >
      {profile.symbol.slice(0, 2)}
    </span>
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            'inline-flex items-center rounded-md border border-amber-400/60 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
            className,
          )}
        >
          Demo data
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">
        Sample values for previewing Stockzz. Not real prices, results or news.
      </TooltipContent>
    </Tooltip>
  )
}

const FRESHNESS_TEXT: Record<DataMeta['freshness'], string> = {
  live: 'Live',
  delayed: 'Delayed',
  historical: 'Historical',
  demo: 'Demo data',
  unavailable: 'Unavailable',
}

export function SourceLine({ meta, className }: { meta: DataMeta; className?: string }) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {FRESHNESS_TEXT[meta.freshness]} · Source: {meta.source} · As of {dateTimeLabel(meta.asOf)}
    </p>
  )
}

export function Change({ value, pct, currencyPrefix = '', className }: { value: number; pct: number; currencyPrefix?: string; className?: string }) {
  const up = value >= 0
  return (
    <span className={cn('font-medium tabular-nums', up ? 'text-positive' : 'text-negative', className)}>
      {up ? '+' : '-'}
      {currencyPrefix}
      {Math.abs(value).toFixed(2)} ({Math.abs(pct).toFixed(2)}%)
    </span>
  )
}

export function InfoTip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={`What is ${label}?`} className="inline-flex text-muted-foreground hover:text-foreground">
          <Info className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-72 leading-relaxed">{children}</TooltipContent>
    </Tooltip>
  )
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-2 rounded-xl border border-primary/25 bg-accent px-4 py-3 text-xs text-accent-foreground', className)}>
      <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <strong>Disclaimer:</strong> Stockzz provides research and information, not financial advice. Suggestions are
        starting points for your own research. Investments are subject to market risks and Stockzz cannot buy or sell
        shares for you.
      </p>
    </div>
  )
}

export function EvidenceTag({ kind }: { kind: 'fact' | 'calculated' | 'ai' }) {
  const map = {
    fact: ['Reported figure', 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300'],
    calculated: ['Calculated', 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300'],
    ai: ['AI interpretation', 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'],
  } as const
  const [label, cls] = map[kind]
  return <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', cls)}>{label}</span>
}
