# Architecture

Orbita is a Vercel-oriented Next.js application using TypeScript, React, Tailwind CSS, and typed domain modules.

## Product Layers

- Interface: responsive command-center UI in `src/components/orbita-app.tsx`.
- Domain logic: strategist, writer fallback, platform detection, and analytics helpers in `src/lib/orbita-engine.ts`.
- Data: demo seed data in `src/lib/demo-data.ts`; future production data should move to Postgres through a repository layer.
- API: route handlers in `src/app/api`.

## Future Database Tables

- `users`
- `profiles`
- `platform_accounts`
- `campaigns`
- `campaign_targets`
- `content_items`
- `content_versions`
- `publishing_jobs`
- `people`
- `relationships`
- `interactions`
- `topics`
- `opportunities`
- `analytics_events`
- `analytics_snapshots`
- `memories`
- `user_preferences`
- `experiments`
- `research_sources`
- `system_metrics`
- `audit_logs`

## AI Design

Keep AI behind simple service functions:

- Strategist
- Writer
- Researcher
- Audience matcher
- Discovery ranker
- Relationship assistant
- Analytics interpreter
- Memory manager

Use structured outputs for saved data, validate before persistence, and degrade to demo/manual mode when credentials are missing.

## Integration Philosophy

Use official platform APIs where practical and permitted. For unsupported actions, Orbita should prepare work and open a human-assisted workflow. It must not bypass platform protections.
