import { getStock } from './market'
import type { Holding } from './workspace'

/** Valuation uses the latest price available from the provider layer. */
export function valueHolding(h: Holding) {
  const stock = getStock(h.symbol)
  const invested = h.shares * h.pricePerShare
  // Only value the holding if the quote is in the same currency the user entered.
  if (!stock || stock.profile.currency !== h.currency) {
    return { stock, invested, value: null as number | null, gain: null as number | null, gainPct: null as number | null }
  }
  const value = h.shares * stock.quote.price
  const gain = value - invested
  return { stock, invested, value, gain, gainPct: (gain / invested) * 100 }
}
