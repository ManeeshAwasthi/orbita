# Contributing

## Development Checks

Run these before merging or deploying:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Code Style

- Prefer typed domain functions over ad hoc UI logic.
- Keep files focused.
- Validate user input at API boundaries.
- Do not add external integrations without a safety review.
- Avoid product behavior that pushes spam or low-quality engagement.

## Pull Request Expectations

- Explain user-facing behavior changes.
- Include tests for important logic.
- Note any new environment variables.
- Confirm that no secrets were committed.
