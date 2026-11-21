/**
 * Market-data provider layer.
 *
 * The UI only talks to these functions. Today they read from the DEMO
 * fixtures in src/data/demo-fixtures.ts. A later milestone swaps the
 * implementation for server-side calls to a real provider (see PLAN.md)
 * without the screens needing to change.
 */
import { DEMO_STOCKS, seededRandom } from '@/data/demo-fixtures'
import type { ChartRange, Exchange, PricePoint, StockRecord } from './types'

export const MARKET_PROVIDER = {
  name: 'Demo dataset',
  connected: false,
} as const

export const EXCHANGES: Exchange[] = ['NSE', 'BSE', 'NYSE', 'NASDAQ']

export function listStocks(): StockRecord[] {
  return DEMO_STOCKS
}

export function getStock(symbol: string): StockRecord | undefined {
  const s = symbol.toUpperCase()
  return DEMO_STOCKS.find((r) => r.profile.symbol === s)
}

export function searchStocks(query: string, exchange: Exchange | 'All' = 'All') {
  const q = query.trim().toLowerCase()
  return DEMO_STOCKS.filter((r) => {
    if (exchange !== 'All' && r.profile.exchange !== exchange) return false
    if (!q) return true
    return (
      r.profile.symbol.toLowerCase().includes(q) ||
      r.profile.name.toLowerCase().includes(q) ||
      r.profile.sector.toLowerCase().includes(q)
    )
  })
}

const RANGE_POINTS: Record<ChartRange, { points: number; stepMs: number; vol: number }> = {
  '1D': { points: 78, stepMs: 5 * 60_000, vol: 0.0016 },
  '1W': { points: 35, stepMs: 4 * 3_600_000, vol: 0.004 },
  '1M': { points: 22, stepMs: 86_400_000, vol: 0.009 },
  '3M': { points: 64, stepMs: 86_400_000, vol: 0.01 },
  '6M': { points: 26, stepMs: 7 * 86_400_000, vol: 0.022 },
  '1Y': { points: 52, stepMs: 7 * 86_400_000, vol: 0.024 },
  '5Y': { points: 60, stepMs: 30 * 86_400_000, vol: 0.05 },
}

/** DEMO DATA: deterministic illustrative price path ending at the demo price. */
export function getPriceHistory(stock: StockRecord, range: ChartRange): PricePoint[] {
  const cfg = RANGE_POINTS[range]
  const rand = seededRandom(stock.profile.symbol + range)
  const drift = stock.technicals.trend === 'bearish' ? 0.0012 : stock.technicals.trend === 'bullish' ? -0.0018 : 0
  const end = new Date(stock.quote.meta.asOf).getTime()
  const out: PricePoint[] = []
  let p = stock.quote.price
  for (let i = 0; i < cfg.points; i++) {
    out.push({ t: end - i * cfg.stepMs, price: +p.toFixed(2) })
    p = p * (1 + drift * (cfg.vol / 0.01) + (rand() - 0.5) * 2 * cfg.vol)
  }
  return out.reverse()
}
