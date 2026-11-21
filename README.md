# Stockzz

Stockzz is a beginner-friendly stock research and investment-monitoring web app. It helps everyday
investors discover stocks worth researching, understand a company's financial health in plain
English, track investments they've made elsewhere, and (soon) get alerts about developments that
matter. Stockzz is a research tool — it is not a broker and doesn't give financial advice.

## What's in the app today

- **Landing page** with log in / sign up / password reset screens.
- **Suggestions** — stock ideas filtered by your market, sector and risk preferences, each with a
  plain-English reason, strengths, risks and recent developments.
- **Analysis** — search by company name or ticker, filter by exchange (NSE, BSE, NYSE, NASDAQ),
  save stocks, and jump back into recently analysed ones.
- **Stock analysis page** — a detailed dark-mode page with price chart (1D–5Y), key financials,
  company profile, news, AI insight summary, technical analysis, financial-health explainer,
  a versioned investment thesis and a monitoring toggle.
- **Account menu** — portfolio tracking, saved stocks, notifications, alert & email settings, help.

All market figures, news and AI text are currently **DEMO DATA** and are labelled as such in the
UI. Account state is kept in memory for the preview and resets on reload.

## Tech

TanStack Start (React 19 + Vite + TypeScript), Tailwind CSS 4, shadcn/ui components, Recharts,
Lucide icons, deployed on Netlify.

## Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
# or, with Netlify emulation:
netlify dev
```

## Roadmap

See [PLAN.md](PLAN.md). Next up: Supabase accounts with row-level security, a real market-data
provider, Gemini-powered analysis, scheduled monitoring with thesis checks, and email alerts.
