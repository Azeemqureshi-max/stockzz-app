/**
 * ============================================================================
 *  DEMO DATA — NOT REAL MARKET DATA
 * ============================================================================
 *  Every number, headline and assessment in this file is illustrative sample
 *  content used to preview the Stockzz interface. None of it is a real or
 *  current price, financial result, news item or opinion.
 *
 *  The UI labels every value sourced from here with a "DEMO DATA" badge.
 *  A later milestone replaces this module with a real market-data provider
 *  (see PLAN.md). Keep all stub content in this one file.
 * ============================================================================
 */
import type {
  CompanyProfile,
  DataMeta,
  NewsItem,
  StockRecord,
} from '@/lib/types'

export const DEMO_SOURCE = 'Stockzz demo dataset (sample values)'
export const DEMO_AS_OF = '2026-11-20T21:00:00.000Z'

const demoMeta: DataMeta = {
  source: DEMO_SOURCE,
  freshness: 'demo',
  asOf: DEMO_AS_OF,
}

interface Seed {
  profile: CompanyProfile
  price: number
  changePct: number
  marketCap: number
  volume: number
  f: {
    revenue: number
    revenueGrowthPct: number
    netIncome: number
    netIncomeGrowthPct: number
    eps: number
    epsGrowthPct: number
    roePct: number
    debtToEquity: number
    operatingCashFlow: number
  }
  trend: 'bullish' | 'bearish' | 'sideways'
  rsi14: number
  news: Omit<NewsItem, 'id' | 'source'>[]
  ai: {
    summary: string
    positives: string[]
    concerns: string[]
    recentChanges: string[]
    investigate: string[]
  }
  suggestion: StockRecord['suggestion']
}

function build(seed: Seed): StockRecord {
  const { price, changePct } = seed
  const prevClose = +(price / (1 + changePct / 100)).toFixed(2)
  const change = +(price - prevClose).toFixed(2)
  const pe = +(price / seed.f.eps).toFixed(2)
  const profitMarginPct = +((seed.f.netIncome / seed.f.revenue) * 100).toFixed(1)
  const ma50 = +(price * (seed.trend === 'bearish' ? 1.035 : 0.968)).toFixed(2)
  const ma200 = +(price * (seed.trend === 'bearish' ? 1.08 : 0.91)).toFixed(2)
  return {
    profile: seed.profile,
    quote: {
      price,
      change,
      changePct,
      open: +(prevClose * 1.002).toFixed(2),
      high: +(price * 1.006).toFixed(2),
      low: +(Math.min(price, prevClose) * 0.993).toFixed(2),
      prevClose,
      volume: seed.volume,
      avgVolume: Math.round(seed.volume * 0.92),
      week52High: +(price * 1.07).toFixed(2),
      week52Low: +(price * 0.78).toFixed(2),
      marketCap: seed.marketCap,
      marketStatus: 'closed',
      meta: demoMeta,
    },
    fundamentals: { ...seed.f, pe, profitMarginPct, meta: demoMeta },
    technicals: {
      trend: seed.trend,
      support: +(price * 0.955).toFixed(2),
      resistance: +(price * 1.035).toFixed(2),
      ma50,
      ma200,
      rsi14: seed.rsi14,
      meta: demoMeta,
    },
    news: seed.news.map((n, i) => ({
      ...n,
      id: `${seed.profile.symbol}-${i}`,
      source: 'Sample headline (DEMO)',
    })),
    ai: {
      ...seed.ai,
      evidence: [
        { label: `Revenue growth of ${seed.f.revenueGrowthPct}% year on year`, kind: 'fact' },
        { label: `Profit margin of ${profitMarginPct}% (net income ÷ revenue)`, kind: 'calculated' },
        { label: `P/E ratio of ${pe} (price ÷ earnings per share)`, kind: 'calculated' },
        { label: 'Overall tone of the summary above', kind: 'ai' },
      ],
      meta: { ...demoMeta, source: 'Sample assessment (DEMO) — AI analysis not yet connected' },
    },
    suggestion: seed.suggestion,
  }
}

const SEEDS: Seed[] = [
  {
    profile: {
      symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', currency: 'USD',
      sector: 'Technology', industry: 'Consumer Electronics', capSize: 'Large Cap',
      description: 'Apple designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories, and sells a growing range of subscription services.',
      ceo: 'Tim Cook', founded: 'April 1, 1976', headquarters: 'Cupertino, California, USA',
      employees: '160,000+', website: 'www.apple.com', brandColor: '#1f2937',
    },
    price: 195.89, changePct: 0.73, marketCap: 3.03e12, volume: 52_320_000,
    f: { revenue: 394.33e9, revenueGrowthPct: 7.8, netIncome: 99.8e9, netIncomeGrowthPct: 5.4, eps: 6.4, epsGrowthPct: 5.4, roePct: 147.4, debtToEquity: 1.73, operatingCashFlow: 110.5e9 },
    trend: 'bullish', rsi14: 61.4,
    news: [
      { title: 'Sample: Company unveils new on-device AI features', publishedAt: '2026-11-13T15:00:00Z', kind: 'announcement' },
      { title: 'Sample: Quarterly results beat expectations', publishedAt: '2026-11-02T20:30:00Z', kind: 'earnings' },
      { title: 'Sample: Regulators review app-store fee rules', publishedAt: '2026-10-25T10:00:00Z', kind: 'risk' },
    ],
    ai: {
      summary: 'Sample assessment: the business shows steady revenue growth and very high profitability, supported by a loyal customer base and a growing services segment.',
      positives: ['Strong brand and ecosystem', 'High profitability and cash flow', 'Growing services segment'],
      concerns: ['High dependency on one flagship product', 'Regulatory pressure in several regions', 'Supply-chain concentration'],
      recentChanges: ['Latest quarter showed services growing faster than hardware'],
      investigate: ['How much revenue depends on the flagship phone', 'Outcome of app-store regulation cases'],
    },
    suggestion: {
      why: 'Fits your interest in large, established technology companies with consistent profits.',
      strengths: ['High profit margins', 'Large cash reserves', 'Loyal customer base'],
      risks: ['Regulatory pressure', 'Premium valuation'],
      developments: 'Sample: new AI features announced this month.',
    },
  },
  {
    profile: {
      symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', currency: 'USD',
      sector: 'Technology', industry: 'Software', capSize: 'Large Cap',
      description: 'Microsoft develops software, cloud computing services, devices and gaming products used by consumers and businesses worldwide.',
      ceo: 'Satya Nadella', founded: 'April 4, 1975', headquarters: 'Redmond, Washington, USA',
      employees: '220,000+', website: 'www.microsoft.com', brandColor: '#2563eb',
    },
    price: 415.32, changePct: 0.58, marketCap: 3.08e12, volume: 21_400_000,
    f: { revenue: 245.1e9, revenueGrowthPct: 15.7, netIncome: 88.1e9, netIncomeGrowthPct: 21.8, eps: 11.8, epsGrowthPct: 21.6, roePct: 35.6, debtToEquity: 0.29, operatingCashFlow: 118.5e9 },
    trend: 'bullish', rsi14: 57.9,
    news: [
      { title: 'Sample: Cloud revenue growth accelerates', publishedAt: '2026-10-30T21:00:00Z', kind: 'earnings' },
      { title: 'Sample: New enterprise AI assistant pricing announced', publishedAt: '2026-11-10T14:00:00Z', kind: 'announcement' },
    ],
    ai: {
      summary: 'Sample assessment: diversified revenue across cloud, software and gaming with strong margins and low debt.',
      positives: ['Recurring cloud revenue', 'Low debt', 'Diversified businesses'],
      concerns: ['Heavy AI infrastructure spending', 'Competition in cloud'],
      recentChanges: ['Capital spending increased noticeably'],
      investigate: ['Return on AI infrastructure spending'],
    },
    suggestion: {
      why: 'Matches your preference for stable large-cap companies with recurring revenue.',
      strengths: ['Recurring revenue', 'Low debt', 'Strong cash flow'],
      risks: ['High capital spending', 'Cloud competition'],
      developments: 'Sample: cloud growth highlighted in latest results.',
    },
  },
  {
    profile: {
      symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', currency: 'INR',
      sector: 'Energy', industry: 'Conglomerate', capSize: 'Large Cap',
      description: 'Reliance operates across oil-to-chemicals, retail, and digital services including telecom, making it one of India’s largest conglomerates.',
      ceo: 'Mukesh Ambani', founded: '1973', headquarters: 'Mumbai, India',
      employees: '340,000+', website: 'www.ril.com', brandColor: '#b45309',
    },
    price: 2978.45, changePct: 0.83, marketCap: 20.08e12, volume: 6_100_000,
    f: { revenue: 9.0e12, revenueGrowthPct: 2.6, netIncome: 0.79e12, netIncomeGrowthPct: 4.4, eps: 102.9, epsGrowthPct: 4.4, roePct: 9.2, debtToEquity: 0.44, operatingCashFlow: 1.59e12 },
    trend: 'sideways', rsi14: 52.1,
    news: [
      { title: 'Sample: Retail arm expands store network', publishedAt: '2026-11-08T08:00:00Z', kind: 'announcement' },
      { title: 'Sample: Refining margins under pressure', publishedAt: '2026-10-19T07:30:00Z', kind: 'risk' },
    ],
    ai: {
      summary: 'Sample assessment: a diversified business where retail and digital growth offsets cyclical energy earnings.',
      positives: ['Diversified revenue', 'Large digital subscriber base'],
      concerns: ['Energy earnings are cyclical', 'Large ongoing investments'],
      recentChanges: ['Retail contributed a larger share of profit'],
      investigate: ['Timeline of planned business listings'],
    },
    suggestion: {
      why: 'Fits your interest in Indian large caps with exposure to consumer growth.',
      strengths: ['Diversified businesses', 'Strong market position'],
      risks: ['Cyclical energy margins', 'High capital spending'],
      developments: 'Sample: retail expansion announced.',
    },
  },
  {
    profile: {
      symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', currency: 'INR',
      sector: 'Technology', industry: 'IT Services', capSize: 'Large Cap',
      description: 'Infosys provides consulting, technology, outsourcing and digital transformation services to businesses around the world.',
      ceo: 'Salil Parekh', founded: '1981', headquarters: 'Bengaluru, India',
      employees: '315,000+', website: 'www.infosys.com', brandColor: '#0284c7',
    },
    price: 1665.3, changePct: 0.78, marketCap: 6.91e12, volume: 5_800_000,
    f: { revenue: 1.54e12, revenueGrowthPct: 4.7, netIncome: 0.26e12, netIncomeGrowthPct: 8.9, eps: 63.4, epsGrowthPct: 8.9, roePct: 31.2, debtToEquity: 0.08, operatingCashFlow: 0.29e12 },
    trend: 'bullish', rsi14: 58.3,
    news: [
      { title: 'Sample: Large multi-year deal win announced', publishedAt: '2026-11-05T09:00:00Z', kind: 'announcement' },
      { title: 'Sample: Revenue guidance kept unchanged', publishedAt: '2026-10-17T11:00:00Z', kind: 'earnings' },
    ],
    ai: {
      summary: 'Sample assessment: a cash-rich IT services firm with almost no debt, but growth depends on global tech spending.',
      positives: ['Very low debt', 'High return on equity', 'Regular dividends'],
      concerns: ['Slow client spending', 'Currency movements'],
      recentChanges: ['Deal wins improved in the latest quarter'],
      investigate: ['Client concentration in North America'],
    },
    suggestion: {
      why: 'Matches your preference for low-debt companies in technology.',
      strengths: ['Almost no debt', 'High return on equity'],
      risks: ['Dependence on global IT budgets'],
      developments: 'Sample: large deal win announced.',
    },
  },
  {
    profile: {
      symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', currency: 'INR',
      sector: 'Technology', industry: 'IT Services', capSize: 'Large Cap',
      description: 'TCS is an IT services, consulting and business solutions company serving large enterprises globally.',
      ceo: 'K. Krithivasan', founded: '1968', headquarters: 'Mumbai, India',
      employees: '600,000+', website: 'www.tcs.com', brandColor: '#4338ca',
    },
    price: 3597.1, changePct: -0.15, marketCap: 12.95e12, volume: 2_300_000,
    f: { revenue: 2.41e12, revenueGrowthPct: 6.8, netIncome: 0.46e12, netIncomeGrowthPct: 9.0, eps: 126.9, epsGrowthPct: 9.0, roePct: 50.7, debtToEquity: 0.1, operatingCashFlow: 0.44e12 },
    trend: 'sideways', rsi14: 47.6,
    news: [{ title: 'Sample: Hiring slows as clients delay projects', publishedAt: '2026-11-11T06:00:00Z', kind: 'risk' }],
    ai: {
      summary: 'Sample assessment: highly profitable with a strong balance sheet; near-term growth looks muted.',
      positives: ['Industry-leading margins', 'Strong balance sheet'],
      concerns: ['Slowing growth', 'Client project delays'],
      recentChanges: ['Hiring slowed this quarter'],
      investigate: ['Order book trend over the next two quarters'],
    },
    suggestion: {
      why: 'Fits your interest in stable, dividend-paying technology companies.',
      strengths: ['High margins', 'Strong balance sheet'],
      risks: ['Slowing growth'],
      developments: 'Sample: hiring slowdown reported.',
    },
  },
  {
    profile: {
      symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE', currency: 'INR',
      sector: 'Financials', industry: 'Banking', capSize: 'Large Cap',
      description: 'ICICI Bank is a private-sector bank offering retail, corporate and digital banking services across India.',
      ceo: 'Sandeep Bakhshi', founded: '1994', headquarters: 'Mumbai, India',
      employees: '130,000+', website: 'www.icicibank.com', brandColor: '#c2410c',
    },
    price: 1248.6, changePct: 1.12, marketCap: 8.8e12, volume: 14_200_000,
    f: { revenue: 1.86e12, revenueGrowthPct: 18.4, netIncome: 0.44e12, netIncomeGrowthPct: 17.1, eps: 63.2, epsGrowthPct: 16.8, roePct: 17.8, debtToEquity: 0, operatingCashFlow: 0 },
    trend: 'bullish', rsi14: 63.2,
    news: [{ title: 'Sample: Loan growth stays strong in latest quarter', publishedAt: '2026-10-26T10:00:00Z', kind: 'earnings' }],
    ai: {
      summary: 'Sample assessment: consistent loan growth and improving profitability, with asset quality worth monitoring.',
      positives: ['High return on equity', 'Strong balance sheet', 'Digital leadership'],
      concerns: ['Interest-rate risk', 'Asset-quality pressure in unsecured loans'],
      recentChanges: ['Profit grew faster than loans'],
      investigate: ['Trend in bad-loan ratios'],
    },
    suggestion: {
      why: 'Matches your interest in Indian banking and large-cap stability.',
      strengths: ['High ROE', 'Strong balance sheet', 'Digital leadership'],
      risks: ['Interest-rate risk', 'Asset-quality pressure'],
      developments: 'Sample: strong loan growth reported.',
    },
  },
  {
    profile: {
      symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', currency: 'INR',
      sector: 'Financials', industry: 'Banking', capSize: 'Large Cap',
      description: 'HDFC Bank is one of India’s largest private-sector banks, known for its retail franchise and deposit base.',
      ceo: 'Sashidhar Jagdishan', founded: '1994', headquarters: 'Mumbai, India',
      employees: '210,000+', website: 'www.hdfcbank.com', brandColor: '#1d4ed8',
    },
    price: 1712.4, changePct: 0.41, marketCap: 13.1e12, volume: 11_900_000,
    f: { revenue: 2.83e12, revenueGrowthPct: 12.2, netIncome: 0.65e12, netIncomeGrowthPct: 10.4, eps: 85.4, epsGrowthPct: 10.1, roePct: 16.1, debtToEquity: 0, operatingCashFlow: 0 },
    trend: 'sideways', rsi14: 50.8,
    news: [{ title: 'Sample: Deposit growth improves after merger integration', publishedAt: '2026-11-03T08:00:00Z', kind: 'earnings' }],
    ai: {
      summary: 'Sample assessment: robust retail franchise and low bad loans; margins are still recovering after a merger.',
      positives: ['Strong retail network', 'Low bad loans'],
      concerns: ['Margin recovery taking time', 'Regulatory changes'],
      recentChanges: ['Deposit growth improved'],
      investigate: ['Net interest margin trend'],
    },
    suggestion: {
      why: 'Fits your preference for large, conservative Indian banks.',
      strengths: ['Strong retail network', 'Stable margins', 'Low bad loans'],
      risks: ['Regulatory changes', 'Economic slowdown'],
      developments: 'Sample: deposit growth improving.',
    },
  },
  {
    profile: {
      symbol: 'TATAMOTORS', name: 'Tata Motors', exchange: 'NSE', currency: 'INR',
      sector: 'Automobile', industry: 'Automobiles', capSize: 'Large Cap',
      description: 'Tata Motors makes passenger cars, commercial vehicles and electric vehicles, and owns a luxury car brand.',
      ceo: 'Girish Wagh', founded: '1945', headquarters: 'Mumbai, India',
      employees: '90,000+', website: 'www.tatamotors.com', brandColor: '#0f766e',
    },
    price: 912.25, changePct: -1.24, marketCap: 3.36e12, volume: 18_700_000,
    f: { revenue: 4.37e12, revenueGrowthPct: 26.6, netIncome: 0.31e12, netIncomeGrowthPct: 42.0, eps: 81.0, epsGrowthPct: 41.2, roePct: 26.4, debtToEquity: 1.12, operatingCashFlow: 0.67e12 },
    trend: 'bearish', rsi14: 38.9,
    news: [
      { title: 'Sample: EV sales share rises in domestic market', publishedAt: '2026-11-07T07:00:00Z', kind: 'announcement' },
      { title: 'Sample: Luxury unit warns on demand in Europe', publishedAt: '2026-11-14T12:00:00Z', kind: 'risk' },
    ],
    ai: {
      summary: 'Sample assessment: strong SUV and EV momentum at home, offset by debt and global demand uncertainty.',
      positives: ['Strong SUV demand', 'Leading EV position', 'Improving margins'],
      concerns: ['Commodity costs', 'Global slowdown', 'Debt levels'],
      recentChanges: ['Price has fallen below its 50-day average'],
      investigate: ['Debt reduction progress', 'Luxury unit demand outlook'],
    },
    suggestion: {
      why: 'Fits your interest in electric vehicles and Indian growth stories.',
      strengths: ['Strong brand', 'EV growth potential', 'Healthy cash flow'],
      risks: ['Commodity prices', 'Global slowdown'],
      developments: 'Sample: EV sales share rising.',
    },
  },
  {
    profile: {
      symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', currency: 'USD',
      sector: 'Technology', industry: 'Semiconductors', capSize: 'Large Cap',
      description: 'NVIDIA designs graphics processors and computing platforms used in gaming, data centres and artificial intelligence.',
      ceo: 'Jensen Huang', founded: 'April 5, 1993', headquarters: 'Santa Clara, California, USA',
      employees: '30,000+', website: 'www.nvidia.com', brandColor: '#65a30d',
    },
    price: 138.4, changePct: 2.05, marketCap: 3.39e12, volume: 240_000_000,
    f: { revenue: 113.3e9, revenueGrowthPct: 152.0, netIncome: 63.1e9, netIncomeGrowthPct: 168.0, eps: 2.53, epsGrowthPct: 167.0, roePct: 123.8, debtToEquity: 0.17, operatingCashFlow: 64.1e9 },
    trend: 'bullish', rsi14: 68.7,
    news: [{ title: 'Sample: Export restrictions on advanced chips discussed', publishedAt: '2026-11-12T16:00:00Z', kind: 'risk' }],
    ai: {
      summary: 'Sample assessment: exceptional growth driven by AI demand; valuation and export rules are key risks.',
      positives: ['Very fast revenue growth', 'Dominant market position'],
      concerns: ['Concentrated customer base', 'Export restrictions', 'High expectations priced in'],
      recentChanges: ['RSI is close to overbought territory'],
      investigate: ['Customer concentration', 'Supply constraints'],
    },
    suggestion: {
      why: 'Matches your interest in fast-growing technology and AI companies.',
      strengths: ['Rapid growth', 'Market leadership'],
      risks: ['High valuation', 'Export restrictions'],
      developments: 'Sample: export rules under discussion.',
    },
  },
  {
    profile: {
      symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', currency: 'USD',
      sector: 'Healthcare', industry: 'Pharmaceuticals', capSize: 'Large Cap',
      description: 'Johnson & Johnson develops pharmaceuticals and medical devices sold worldwide.',
      ceo: 'Joaquin Duato', founded: '1886', headquarters: 'New Brunswick, New Jersey, USA',
      employees: '130,000+', website: 'www.jnj.com', brandColor: '#dc2626',
    },
    price: 156.2, changePct: -0.32, marketCap: 3.76e11, volume: 7_100_000,
    f: { revenue: 88.8e9, revenueGrowthPct: 4.3, netIncome: 14.1e9, netIncomeGrowthPct: -3.2, eps: 5.8, epsGrowthPct: -3.0, roePct: 20.1, debtToEquity: 0.52, operatingCashFlow: 22.8e9 },
    trend: 'sideways', rsi14: 45.2,
    news: [{ title: 'Sample: Ongoing litigation update', publishedAt: '2026-11-09T13:00:00Z', kind: 'risk' }],
    ai: {
      summary: 'Sample assessment: a defensive healthcare business with steady dividends; litigation remains an overhang.',
      positives: ['Long dividend history', 'Diversified drug portfolio'],
      concerns: ['Litigation costs', 'Patent expiries'],
      recentChanges: ['Net income declined slightly year on year'],
      investigate: ['Litigation settlement size', 'Upcoming patent expiries'],
    },
    suggestion: {
      why: 'Fits your preference for lower-volatility, defensive companies.',
      strengths: ['Defensive sector', 'Consistent dividends'],
      risks: ['Litigation', 'Patent expiries'],
      developments: 'Sample: litigation update published.',
    },
  },
]

export const DEMO_STOCKS: StockRecord[] = SEEDS.map(build)

/** Demo market mood shown on the Suggestions page. DEMO DATA. */
export const DEMO_MARKET_MOOD = {
  label: 'Positive',
  index: 'S&P 500',
  changePct: 0.52,
  meta: demoMeta,
}

/** Simple seeded random so demo charts are stable between renders. */
export function seededRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
