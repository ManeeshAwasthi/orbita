# Security

## Secrets

Never commit API keys, tokens, passwords, `.env.local`, credential exports, or generated secret files. `.env*` is ignored by Git. `.env.example` contains names only.

## Authentication

The MVP includes a simple access-code flow for demo usage. Production should set `ORBITA_ACCESS_CODE` immediately and later replace this with a robust auth provider or hardened single-user auth.

## Platform Safety

Orbita must not implement:

- CAPTCHA solving
- anti-bot bypasses
- fingerprint spoofing
- fake engagement
- account farming
- mass following/unfollowing
- mass messaging
- automated comment spam
- deceptive identity behavior

## Data Controls

Memory should remain inspectable, editable, and deletable. External tokens must never be exposed to the frontend.

## Audit Logs

Any account-changing integration action should write an audit record containing who initiated it, what was requested, what platform was affected, and whether it succeeded.
