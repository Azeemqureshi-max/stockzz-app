/**
 * Preview workspace state.
 *
 * Milestone 1 keeps the signed-in user's saved stocks, holdings, theses and
 * alert preferences in React memory so every screen is clickable. Nothing is
 * written to localStorage or a server, and it resets on reload. Milestone 2
 * replaces this provider with authenticated, per-user persistence (PLAN.md);
 * the hook's shape is designed so screens don't need to change.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Currency, Exchange } from './types'

export interface PreviewUser {
  name: string
  email: string
}

export interface Holding {
  id: string
  symbol: string
  exchange: Exchange
  purchaseDate: string
  shares: number
  pricePerShare: number
  currency: Currency
}

export interface ThesisVersion {
  version: number
  createdAt: string
  why: string
  expectations: string
  invalidators: string
  reviewDate?: string
}

export type AlertCategory =
  | 'price'
  | 'earnings'
  | 'announcements'
  | 'regulatory'
  | 'management'
  | 'negative'
  | 'thesis'

export interface AlertPrefs {
  emailEnabled: boolean
  notificationEmail: string
  frequency: 'instant' | 'daily' | 'weekly'
  categories: Record<AlertCategory, boolean>
  priceMovePct: number
}

interface WorkspaceState {
  user: PreviewUser | null
  saved: string[]
  monitored: string[]
  recent: string[]
  holdings: Holding[]
  theses: Record<string, ThesisVersion[]>
  prefs: AlertPrefs
}

interface WorkspaceApi extends WorkspaceState {
  signIn: (user: PreviewUser) => void
  signOut: () => void
  toggleSaved: (symbol: string) => boolean
  isSaved: (symbol: string) => boolean
  toggleMonitored: (symbol: string) => void
  isMonitored: (symbol: string) => boolean
  markViewed: (symbol: string) => void
  addHolding: (h: Omit<Holding, 'id'>) => void
  removeHolding: (id: string) => void
  saveThesis: (symbol: string, v: Omit<ThesisVersion, 'version' | 'createdAt'>) => void
  updatePrefs: (p: Partial<AlertPrefs>) => void
}

const defaultPrefs: AlertPrefs = {
  emailEnabled: false,
  notificationEmail: '',
  frequency: 'daily',
  priceMovePct: 5,
  categories: {
    price: true,
    earnings: true,
    announcements: true,
    regulatory: true,
    management: true,
    negative: true,
    thesis: true,
  },
}

const Ctx = createContext<WorkspaceApi | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({
    user: null,
    saved: ['MSFT', 'INFY'],
    monitored: ['MSFT', 'INFY'],
    recent: [],
    holdings: [],
    theses: {},
    prefs: defaultPrefs,
  })

  const signIn = useCallback((user: PreviewUser) => {
    setState((s) => ({
      ...s,
      user,
      prefs: { ...s.prefs, notificationEmail: s.prefs.notificationEmail || user.email },
    }))
  }, [])
  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), [])

  const toggleSaved = useCallback(
    (symbol: string) => {
      const willSave = !state.saved.includes(symbol)
      setState((s) => ({
        ...s,
        saved: willSave ? [...s.saved, symbol] : s.saved.filter((x) => x !== symbol),
        monitored: willSave
          ? Array.from(new Set([...s.monitored, symbol]))
          : s.monitored.filter((x) => x !== symbol),
      }))
      return willSave
    },
    [state.saved],
  )

  const toggleMonitored = useCallback((symbol: string) => {
    setState((s) => ({
      ...s,
      monitored: s.monitored.includes(symbol)
        ? s.monitored.filter((x) => x !== symbol)
        : [...s.monitored, symbol],
    }))
  }, [])

  const markViewed = useCallback((symbol: string) => {
    setState((s) =>
      s.recent[0] === symbol
        ? s
        : { ...s, recent: [symbol, ...s.recent.filter((x) => x !== symbol)].slice(0, 8) },
    )
  }, [])

  const addHolding = useCallback((h: Omit<Holding, 'id'>) => {
    setState((s) => ({
      ...s,
      holdings: [...s.holdings, { ...h, id: crypto.randomUUID() }],
      monitored: Array.from(new Set([...s.monitored, h.symbol])),
    }))
  }, [])

  const removeHolding = useCallback((id: string) => {
    setState((s) => ({ ...s, holdings: s.holdings.filter((h) => h.id !== id) }))
  }, [])

  // Theses are append-only: a new version is added, earlier ones are kept.
  const saveThesis = useCallback(
    (symbol: string, v: Omit<ThesisVersion, 'version' | 'createdAt'>) => {
      setState((s) => {
        const history = s.theses[symbol] ?? []
        const next: ThesisVersion = {
          ...v,
          version: history.length + 1,
          createdAt: new Date().toISOString(),
        }
        return { ...s, theses: { ...s.theses, [symbol]: [...history, next] } }
      })
    },
    [],
  )

  const updatePrefs = useCallback((p: Partial<AlertPrefs>) => {
    setState((s) => ({ ...s, prefs: { ...s.prefs, ...p } }))
  }, [])

  const api = useMemo<WorkspaceApi>(
    () => ({
      ...state,
      signIn,
      signOut,
      toggleSaved,
      isSaved: (sym) => state.saved.includes(sym),
      toggleMonitored,
      isMonitored: (sym) => state.monitored.includes(sym),
      markViewed,
      addHolding,
      removeHolding,
      saveThesis,
      updatePrefs,
    }),
    [state, signIn, signOut, toggleSaved, toggleMonitored, markViewed, addHolding, removeHolding, saveThesis, updatePrefs],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useWorkspace() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}

export function nameFromEmail(email: string) {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Investor'
}
