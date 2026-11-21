/**
 * Shared domain types for Stockzz.
 * These shapes are what the market-data provider layer (src/lib/market.ts)
 * returns, so swapping the demo fixtures for a real provider keeps the UI intact.
 */

export type Exchange = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ'
export type Currency = 'INR' | 'USD'

/** How fresh a piece of data is. Never label delayed data as live. */
export type Freshness = 'live' | 'delayed' | 'historical' | 'demo' | 'unavailable'

export interface DataMeta {
  source: string
  freshness: Freshness
  /** ISO timestamp of when the data was produced / retrieved */
  asOf: string
}

export interface Quote {
  price: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  prevClose: number
  volume: number
  avgVolume: number
  week52High: number
  week52Low: number
  marketCap: number
  marketStatus: 'open' | 'closed'
  meta: DataMeta
}

export interface Fundamentals {
  revenue: number
  revenueGrowthPct: number
  netIncome: number
  netIncomeGrowthPct: number
  eps: number
  epsGrowthPct: number
  pe: number
  roePct: number
  debtToEquity: number
  operatingCashFlow: number
  profitMarginPct: number
  meta: DataMeta
}

export interface NewsItem {
  id: string
  title: string
  publishedAt: string
  source: string
  url?: string
  kind: 'announcement' | 'earnings' | 'market' | 'risk'
}

export interface Technicals {
  trend: 'bullish' | 'bearish' | 'sideways'
  support: number
  resistance: number
  ma50: number
  ma200: number
  rsi14: number
  meta: DataMeta
}

export interface AiAssessment {
  summary: string
  positives: string[]
  concerns: string[]
  recentChanges: string[]
  investigate: string[]
  evidence: { label: string; kind: 'fact' | 'calculated' | 'ai' }[]
  meta: DataMeta
}

export interface SuggestionReason {
  why: string
  strengths: string[]
  risks: string[]
  developments: string
}

export interface CompanyProfile {
  symbol: string
  name: string
  exchange: Exchange
  currency: Currency
  sector: string
  industry: string
  capSize: 'Large Cap' | 'Mid Cap' | 'Small Cap'
  description: string
  ceo: string
  founded: string
  headquarters: string
  employees: string
  website: string
  brandColor: string
}

export interface StockRecord {
  profile: CompanyProfile
  quote: Quote
  fundamentals: Fundamentals
  technicals: Technicals
  news: NewsItem[]
  ai: AiAssessment
  suggestion: SuggestionReason
}

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'

export interface PricePoint {
  t: number
  price: number
}
