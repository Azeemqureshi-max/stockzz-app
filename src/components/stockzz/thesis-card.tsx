import { useState } from 'react'
import { toast } from 'sonner'
import { ClipboardList, History, Hourglass, PencilLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { dateLabel, dateTimeLabel } from '@/lib/format'
import type { StockRecord } from '@/lib/types'
import { useWorkspace } from '@/lib/workspace'

export function ThesisCard({ stock }: { stock: StockRecord }) {
  const { theses, saveThesis } = useWorkspace()
  const history = theses[stock.profile.symbol] ?? []
  const current = history[history.length - 1]
  const [editing, setEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [form, setForm] = useState({ why: '', expectations: '', invalidators: '', reviewDate: '' })
  const [error, setError] = useState<string | null>(null)

  function start() {
    setForm(
      current
        ? { why: current.why, expectations: current.expectations, invalidators: current.invalidators, reviewDate: current.reviewDate ?? '' }
        : { why: '', expectations: '', invalidators: '', reviewDate: '' },
    )
    setError(null)
    setEditing(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.why.trim().length < 10) return setError('Tell us a little more about why you invested or are interested (at least 10 characters).')
    if (!form.invalidators.trim()) return setError('Add at least one thing that would make you rethink this investment.')
    saveThesis(stock.profile.symbol, {
      why: form.why.trim(),
      expectations: form.expectations.trim(),
      invalidators: form.invalidators.trim(),
      reviewDate: form.reviewDate || undefined,
    })
    toast.success(current ? 'New thesis version saved' : 'Investment thesis saved', {
      description: current ? 'Your earlier version is kept in the history.' : undefined,
    })
    setEditing(false)
  }

  return (
    <section id="thesis" aria-labelledby="thesis-h" className="scroll-mt-6 rounded-2xl border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="thesis-h" className="flex items-center gap-2 font-semibold"><ClipboardList className="size-4" aria-hidden /> My investment thesis</h2>
          <p className="text-sm text-muted-foreground">Write down why you like {stock.profile.name}. Stockzz keeps every version.</p>
        </div>
        {!editing && (
          <Button size="sm" variant={current ? 'outline' : 'default'} onClick={start}>
            <PencilLine /> {current ? 'Update thesis' : 'Write my thesis'}
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" noValidate>
          <div className="grid gap-1.5 md:col-span-2">
            <Label htmlFor="t-why">Why did you invest, or why are you interested?</Label>
            <Textarea id="t-why" rows={3} value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} placeholder="e.g. Strong brand, growing services revenue, very little debt" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-exp">What do you expect to happen?</Label>
            <Textarea id="t-exp" rows={3} value={form.expectations} onChange={(e) => setForm({ ...form, expectations: e.target.value })} placeholder="e.g. Revenue keeps growing around 8% a year" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-inv">What would prove you wrong?</Label>
            <Textarea id="t-inv" rows={3} value={form.invalidators} onChange={(e) => setForm({ ...form, invalidators: e.target.value })} placeholder="e.g. Two quarters of falling revenue, or a major regulatory ruling" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-date">Review date (optional)</Label>
            <Input id="t-date" type="date" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive md:col-span-2">{error}</p>}
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">{current ? 'Save as new version' : 'Save thesis'}</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : current ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-dashed p-3 text-sm">
            <Hourglass className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            <p>
              <span className="font-semibold">Status: Not yet checked.</span>{' '}
              <span className="text-muted-foreground">
                Once verified news and results are connected, Stockzz will mark this as “Thesis appears intact”,
                “Needs review” or “Contradictory evidence found”, with sources.
              </span>
            </p>
          </div>
          <dl className="grid gap-4 text-sm md:grid-cols-3">
            <ThesisField label="Why I’m interested" value={current.why} />
            <ThesisField label="What I expect" value={current.expectations || '—'} />
            <ThesisField label="What would prove me wrong" value={current.invalidators} />
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Version {current.version} · saved {dateTimeLabel(current.createdAt)}
              {current.reviewDate && <> · review on {dateLabel(current.reviewDate)}</>}
            </span>
            {history.length > 1 && (
              <button type="button" className="inline-flex items-center gap-1 font-medium text-primary hover:underline" onClick={() => setShowHistory((v) => !v)}>
                <History className="size-3.5" aria-hidden /> {showHistory ? 'Hide' : 'Show'} history ({history.length} versions)
              </button>
            )}
          </div>
          {showHistory && (
            <ol className="space-y-2 border-l pl-4">
              {[...history].reverse().slice(1).map((v) => (
                <li key={v.version} className="text-sm">
                  <p className="text-xs text-muted-foreground">Version {v.version} · {dateTimeLabel(v.createdAt)}</p>
                  <p>{v.why}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          You haven’t written a thesis for this company yet. A thesis is a short note on why you invested and what would
          change your mind — it helps you stay objective when the price moves.
        </p>
      )}
    </section>
  )
}

function ThesisField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  )
}
