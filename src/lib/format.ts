import type { Currency } from './types'

const SYMBOL: Record<Currency, string> = { INR: '₹', USD: '$' }

export function money(value: number, currency: Currency, digits = 2) {
  return `${SYMBOL[currency]}${value.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

/** Compact large numbers: $3.03T / ₹20.08 L Cr style. */
export function compact(value: number, currency: Currency) {
  const sym = SYMBOL[currency]
  const sign = value < 0 ? '-' : ''
  const v = Math.abs(value)
  if (currency === 'INR') {
    if (v >= 1e12) return `${sign}${sym}${(v / 1e12).toFixed(2)} L Cr`
    if (v >= 1e7) return `${sign}${sym}${(v / 1e7).toFixed(2)} Cr`
    if (v >= 1e5) return `${sign}${sym}${(v / 1e5).toFixed(2)} L`
    return `${sign}${sym}${v.toLocaleString('en-IN')}`
  }
  if (v >= 1e12) return `${sign}${sym}${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `${sign}${sym}${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `${sign}${sym}${(v / 1e6).toFixed(2)}M`
  return `${sign}${sym}${v.toLocaleString('en-US')}`
}

export function volume(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`
  return String(v)
}

export function signed(v: number, digits = 2) {
  return `${v >= 0 ? '+' : ''}${v.toFixed(digits)}`
}

export function pct(v: number, digits = 2) {
  return `${v >= 0 ? '+' : ''}${v.toFixed(digits)}%`
}

export function dateLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function dateTimeLabel(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}
