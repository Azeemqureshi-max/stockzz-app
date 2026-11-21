# Stockzz roadmap

Stockzz is a beginner-friendly stock research and monitoring app. The guiding principle:
**simple to use at first glance, detailed when the user chooses a stock.**

The visual direction is `docs/design-reference.png` (Suggestions dashboard, Analysis search, dark
detailed stock page). Every milestone keeps that design.

Non-negotiables carried through every milestone:
- Research and monitoring only — no trading, no brokerage connections, no guaranteed returns.
- Never invent prices, financials, news or scores. Every figure shows source, timestamp and
  freshness (live / delayed / historical / unavailable). Sample content is labelled DEMO DATA.
- Facts, calculated metrics and AI interpretation stay visibly separated.
- ₹0 to run initially: free tiers only, no paid services without the owner's approval.

---

## Milestone 1 — Product surface ✅ (done)

Branded, clickable product with stubbed data in one module (`src/data/demo-fixtures.ts`) behind a
provider layer (`src/lib/market.ts`).

- Public landing page, log in, sign up, password reset screens.
- Workspace shell: main nav limited to **Suggestions** and **Analysis**; portfolio, saved stocks,
  notifications, settings and help live in the account menu.
- Suggestions with editable preferences (market, sectors, risk comfort), reasons, strengths, risks.
- Analysis with name/ticker search, exchange filter, save (star), recently analysed list.
- Dark detailed stock page: overview, price chart with 1D–5Y ranges, key financials, about,
  news, AI insight summary, technical analysis, plain-English financial health, investment thesis
  (versioned, never overwritten), per-stock monitoring toggle.
- Portfolio (manual holdings, per-currency totals), saved stocks with monitoring switches,
  notifications empty state + example layout, alert & email preferences.
- State is in-memory (`src/lib/workspace.tsx`) and resets on reload.

## Milestone 2 — Accounts and private data (Supabase)

- Connect Supabase (free tier). Add `@supabase/supabase-js` and `@supabase/ssr`; keep the service
  key server-side only.
- Real sign up / log in / log out / password reset, persistent sessions, route protection.
- Tables: `profiles`, `saved_stocks`, `holdings`, `theses` (append-only versions),
  `alert_preferences`, `alerts`, `alert_deliveries`, `monitoring_runs`. Every user-owned table has
  `user_id` + RLS policies (`auth.uid() = user_id`); `theses` allows insert/select only.
- Replace `WorkspaceProvider` internals with Supabase queries, keeping the `useWorkspace()` API.
- Test: two accounts can't read each other's rows (RLS checks).

## Milestone 3 — Real market data

- Evaluate free providers against actual current limits and coverage (NSE/BSE/NYSE/NASDAQ):
  quotes, history, fundamentals, company news. Document chosen provider + limits in README.
- Implement providers server-side (TanStack Start server functions / API routes) behind the
  `src/lib/market.ts` interface; cache responses (Netlify Blobs) to respect quotas.
- Freshness labels from provider metadata (delayed vs live), unavailable-data states, real
  source links and publication dates for news.
- Remove demo fixtures from user-facing pages once real data works; keep them only for tests.

## Milestone 4 — Stockzz AI (Gemini)

- Gemini through the Netlify AI Gateway, server-side only.
- Input = verified structured data from Milestone 3; output = JSON (positives, concerns, what
  changed, investigate, evidence references). Reject claims without evidence references.
- Suggestions ranking grounded in user preferences + verified metrics (no confidence scores).

## Milestone 5 — Monitoring, thesis checks and alerts

- Scheduled Netlify Function (periodic, e.g. hourly during market hours — not real-time) that
  checks monitored companies: price moves vs user threshold, earnings, announcements, regulatory,
  management, negative news.
- Dedupe by (user, company, source URL/event hash). Store alert history with published and
  retrieved timestamps and source.
- Thesis evaluation: AI compares new verified developments with the latest thesis version and
  marks *Thesis appears intact / Needs review / Contradictory evidence found*, with sources.
- Notifications page lists real alerts; clearly labelled test events for QA only.

## Milestone 6 — Email notifications

- Preferred: Gmail via OAuth consent (send scope only, tokens server-side, never passwords).
  Fallback: a free-tier transactional email provider behind the same `EmailSender` interface.
- Subject `Stockzz Alert — [Company] ([Ticker])`; body with what happened, why it matters,
  thesis impact, verified data, sources, timestamps, link to the stock page.
- Respect user frequency (instant / daily / weekly digest), categories and quotas; log
  deliveries and failures; no duplicate sends.

## Milestone 7 — Testing and launch

- End-to-end journey: sign up → save stock → write thesis → test event → alert → email → visible
  in app. Duplicate prevention, RLS isolation, email failure, missing market data.
- Responsive and accessibility pass on mobile, tablet and desktop.
