# Freemius Webhook Server

- Endpoint: `POST /freemius/webhook`
- Healthcheck: `GET /health`

Environment variables:
- `FREEMIUS_WEBHOOK_SECRET` (required): HMAC secret used by Freemius to sign webhook payloads
- `SUPABASE_URL` (optional): Supabase instance URL
- `SUPABASE_SERVICE_ROLE_KEY` (optional): Service role key for server-side upserts
- `SUBSCRIPTIONS_TABLE` (optional, default `subscriptions`)
- `PORT` (optional, default `3001`)

Run locally:
```
pnpm add express morgan @supabase/supabase-js
node server/index.js
```

Register webhook URL in Freemius settings:
- Production: `https://YOUR_DOMAIN.com/freemius/webhook` 