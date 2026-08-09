# Orbita

Orbita is a personal AI-powered digital presence operating system. It helps one user turn ideas into platform-aware content, campaigns, relationship tracking, memory, analytics, and opportunity discovery across LinkedIn, X, and Reddit.

This MVP is built as a responsive Next.js app for Vercel. It currently runs in demo/manual mode so the product is usable before database, AI, and platform API credentials are connected.

## What Works

- Secure-by-default project structure with no committed secrets.
- Responsive authenticated app shell.
- Home command center with natural-language planning.
- Create workspace for LinkedIn, X, and Reddit drafts.
- Campaign dashboard.
- Discover surface for people/topics/opportunities.
- Lightweight network CRM.
- Inspectable and editable memory.
- Analytics dashboard with opportunity yield.
- Settings with integration health and manual/assisted mode.
- Browser-local demo persistence with export/reset controls.
- API routes for assistant plans, content drafts, auth, and health.
- Unit tests for core Orbita decision logic.

## Architecture

- `src/app` contains Next.js app routes and API routes.
- `src/components` contains product UI.
- `src/lib` contains typed domain models, demo data, auth helpers, and Orbita logic.
- `src/lib/orbita-engine.ts` is the current deterministic strategist/writer fallback. It is designed to sit behind an AI service abstraction later.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js. In local demo mode, any non-empty access code works. In production, set `ORBITA_ACCESS_CODE`.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Do not commit `.env.local`.

- `ORBITA_ACCESS_CODE`: private app access code.
- `DATABASE_URL`: managed Postgres connection string.
- `OPENAI_API_KEY`: AI generation and reasoning.
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`: future official LinkedIn integration.
- `X_CLIENT_ID` / `X_CLIENT_SECRET`: future official X integration.
- `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET`: future Reddit integration.
- `VERCEL_TOKEN`: deployment automation when available.

## Database Setup

The MVP runs without a database using isolated browser-local demo state. A production Postgres baseline is included at `db/migrations/001_initial_schema.sql`, covering users, profiles, platform accounts, campaigns, content items, content versions, publishing jobs, people, relationships, interactions, topics, opportunities, analytics events, analytics snapshots, memories, preferences, experiments, research sources, system metrics, and audit logs.

## Deployment

Target platform: Vercel.

Required before production deployment:

1. Add `ORBITA_ACCESS_CODE`.
2. Add `DATABASE_URL` when persistent multi-session data is required.
3. Add `OPENAI_API_KEY` when live AI generation is enabled.
4. Connect GitHub repository to Vercel.

## Testing

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Security Notes

- Never commit secrets.
- All `.env*` files are ignored by Git.
- API routes validate input with Zod.
- External account-changing actions must remain explicit, audited, and user-approved.
- Orbita must not automate spam, scraping abuse, CAPTCHA bypasses, fake engagement, mass messaging, or deceptive platform behavior.

## Known Limitations

- Demo state is not yet persisted to Postgres.
- Live OpenAI generation is not connected yet.
- LinkedIn, X, and Reddit are manual/assisted placeholders until official API setup.
- Vercel deployment and private GitHub repository creation require connected credentials.

## Roadmap

1. Add Postgres schema and migrations.
2. Replace demo auth with production auth provider or hardened single-user auth.
3. Add OpenAI-backed strategist/writer/research abstractions with structured outputs.
4. Persist campaigns, content, people, memory, analytics, and audit logs.
5. Add official platform connectors where permitted.
6. Add Playwright end-to-end tests for login, onboarding, content, campaign, network, memory, and analytics.
