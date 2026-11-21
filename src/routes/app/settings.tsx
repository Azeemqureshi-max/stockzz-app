import { createFileRoute } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { AlertCategory, AlertPrefs } from '@/lib/workspace'
import { useWorkspace } from '@/lib/workspace'

export const Route = createFileRoute('/app/settings')({
  head: () => ({ meta: [{ title: 'Settings · Stockzz' }] }),
  component: Settings,
})

const CATEGORIES: { key: AlertCategory; label: string; hint: string }[] = [
  { key: 'price', label: 'Big price moves', hint: 'When the price moves more than your threshold in a day' },
  { key: 'earnings', label: 'Earnings & results', hint: 'New results, especially surprises' },
  { key: 'announcements', label: 'Company announcements', hint: 'Deals, launches, dividends, buybacks' },
  { key: 'regulatory', label: 'Regulatory developments', hint: 'Investigations, rulings, new rules' },
  { key: 'management', label: 'Management changes', hint: 'CEO, CFO or board changes' },
  { key: 'negative', label: 'Major negative news', hint: 'Significant risks to the business' },
  { key: 'thesis', label: 'Thesis check-ins', hint: 'When news may contradict your thesis' },
]

function Settings() {
  const { user, prefs, updatePrefs } = useWorkspace()
  const [draft, setDraft] = useState<AlertPrefs>(prefs)
  const [emailError, setEmailError] = useState<string | null>(null)

  function save(e: React.FormEvent) {
    e.preventDefault()
    if (draft.emailEnabled && !/^\S+@\S+\.\S+$/.test(draft.notificationEmail)) {
      setEmailError('Enter a valid email address.')
      return
    }
    setEmailError(null)
    updatePrefs(draft)
    toast.success('Preferences saved', { description: 'Saved for this preview session.' })
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings & alerts</h1>
        <p className="mt-1 text-muted-foreground">Signed in as {user?.email}</p>
      </div>

      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">What should Stockzz alert you about?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <label key={c.key} className="flex cursor-pointer gap-3 rounded-xl border p-3 hover:bg-muted/50">
              <Checkbox
                checked={draft.categories[c.key]}
                onCheckedChange={(v) => setDraft({ ...draft, categories: { ...draft.categories, [c.key]: v === true } })}
                className="mt-0.5"
              />
              <span className="text-sm">
                <span className="block font-medium">{c.label}</span>
                <span className="text-muted-foreground">{c.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="grid max-w-xs gap-1.5">
          <Label htmlFor="threshold">Big price move threshold (%)</Label>
          <Input
            id="threshold"
            type="number"
            min={1}
            max={50}
            value={draft.priceMovePct}
            onChange={(e) => setDraft({ ...draft, priceMovePct: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-semibold"><Mail className="size-4" aria-hidden /> Email alerts</h2>
            <p className="text-sm text-muted-foreground">
              Get an email when something important affects a saved stock, holding or thesis. No emails are sent until
              email delivery is connected and you’ve switched this on.
            </p>
          </div>
          <Switch
            aria-label="Enable email alerts"
            checked={draft.emailEnabled}
            onCheckedChange={(v) => setDraft({ ...draft, emailEnabled: v })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="notif-email">Send alerts to</Label>
            <Input
              id="notif-email"
              type="email"
              value={draft.notificationEmail}
              onChange={(e) => setDraft({ ...draft, notificationEmail: e.target.value })}
              placeholder="you@gmail.com"
              aria-invalid={!!emailError}
            />
            {emailError && <p role="alert" className="text-sm text-destructive">{emailError}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="freq">How often</Label>
            <Select value={draft.frequency} onValueChange={(v) => setDraft({ ...draft, frequency: v as AlertPrefs['frequency'] })}>
              <SelectTrigger id="freq" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">As soon as it’s detected</SelectItem>
                <SelectItem value="daily">Daily summary</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          Email delivery status: <span className="font-semibold">not connected yet</span>. Stockzz will never ask for your
          Gmail password.
        </p>
      </section>

      <div className="flex gap-2">
        <Button type="submit">Save preferences</Button>
        <Button type="button" variant="ghost" onClick={() => setDraft(prefs)}>Reset</Button>
      </div>
    </form>
  )
}
