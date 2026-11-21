import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EXCHANGES, getStock, listStocks } from '@/lib/market'
import type { Currency, Exchange } from '@/lib/types'
import { useWorkspace } from '@/lib/workspace'

export function AddHoldingDialog({
  open,
  onOpenChange,
  defaultSymbol,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  defaultSymbol?: string
}) {
  const { addHolding } = useWorkspace()
  const initial = defaultSymbol ? getStock(defaultSymbol) : undefined
  const [symbol, setSymbol] = useState(initial?.profile.symbol ?? '')
  const [exchange, setExchange] = useState<Exchange>(initial?.profile.exchange ?? 'NSE')
  const [currency, setCurrency] = useState<Currency>(initial?.profile.currency ?? 'INR')
  const [date, setDate] = useState('')
  const [shares, setShares] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState<string | null>(null)

  function pickSymbol(sym: string) {
    setSymbol(sym)
    const s = getStock(sym)
    if (s) {
      setExchange(s.profile.exchange)
      setCurrency(s.profile.currency)
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(shares)
    const p = Number(price)
    if (!symbol) return setError('Choose a company.')
    if (!date) return setError('Enter the purchase date.')
    if (new Date(date) > new Date()) return setError('Purchase date can’t be in the future.')
    if (!(n > 0)) return setError('Number of shares must be more than 0.')
    if (!(p > 0)) return setError('Purchase price must be more than 0.')
    addHolding({ symbol, exchange, currency, purchaseDate: date, shares: n, pricePerShare: p })
    toast.success(`${symbol} added to your portfolio`, {
      description: 'Stockzz will track it for you. It can’t buy or sell shares.',
    })
    setError(null)
    setShares('')
    setPrice('')
    setDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add an investment you own</DialogTitle>
          <DialogDescription>
            Record shares you bought elsewhere so Stockzz can monitor them. This doesn’t place any trade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="h-symbol">Company</Label>
            <Select value={symbol} onValueChange={pickSymbol}>
              <SelectTrigger id="h-symbol" className="w-full">
                <SelectValue placeholder="Choose a company" />
              </SelectTrigger>
              <SelectContent>
                {listStocks().map((s) => (
                  <SelectItem key={s.profile.symbol} value={s.profile.symbol}>
                    {s.profile.name} ({s.profile.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="h-exchange">Exchange</Label>
              <Select value={exchange} onValueChange={(v) => setExchange(v as Exchange)}>
                <SelectTrigger id="h-exchange" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXCHANGES.map((x) => (
                    <SelectItem key={x} value={x}>{x}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="h-currency">Currency</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger id="h-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="h-date">Purchase date</Label>
            <Input id="h-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="h-shares">Number of shares</Label>
              <Input id="h-shares" inputMode="decimal" type="number" min="0" step="any" value={shares} onChange={(e) => setShares(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="h-price">Price per share</Label>
              <Input id="h-price" inputMode="decimal" type="number" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add to portfolio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
