import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { getPriceHistory } from '@/lib/market'
import { money } from '@/lib/format'
import type { ChartRange, StockRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

const RANGES: ChartRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y']

function tickLabel(t: number, range: ChartRange) {
  const d = new Date(t)
  if (range === '1D') return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
  if (range === '5Y' || range === '1Y') return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function PriceChart({ stock }: { stock: StockRecord }) {
  const [range, setRange] = useState<ChartRange>('1M')
  const data = useMemo(() => getPriceHistory(stock, range), [stock, range])
  const first = data[0]?.price ?? 0
  const last = data[data.length - 1]?.price ?? 0
  const up = last >= first
  const color = up ? 'var(--positive)' : 'var(--negative)'
  const cur = stock.profile.currency
  const rangeChange = first ? ((last - first) / first) * 100 : 0

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Chart time range" className="flex flex-wrap gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              role="tab"
              type="button"
              aria-selected={range === r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                range === r ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <span className={cn('text-xs font-medium', up ? 'text-positive' : 'text-negative')}>
          {rangeChange >= 0 ? '+' : ''}
          {rangeChange.toFixed(2)}% over {range}
        </span>
      </div>
      <div className="h-56 w-full" role="img" aria-label={`Demo price chart for ${stock.profile.name} over ${range}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`fill-${stock.profile.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={(t: number) => tickLabel(t, range)}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => money(v, cur, 0)}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                color: 'var(--popover-foreground)',
                fontSize: 12,
              }}
              labelFormatter={(t) => new Date(Number(t)).toUTCString().slice(0, 22)}
              formatter={(v) => [money(Number(v), cur), 'Price (demo)']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#fill-${stock.profile.symbol})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
