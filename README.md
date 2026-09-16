# دعوة الزفاف — Wedding Invitation System

A simple digital wedding invitation system: add guests, generate a unique QR
invitation for each, share it over WhatsApp, and check guests in at the door
by scanning their QR code.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres) ·
`qrcode` · `html5-qrcode` · deployed on Vercel.

## Routes

- `/admin` — dashboard (add/edit/delete/search guests, share links, stats). Protected by `ADMIN_PASSWORD`.
- `/invite/[token]` — a guest's personal invitation page with their QR code.
- `/scanner` — entrance check-in scanner. Protected by a separate `STAFF_PASSCODE` so door staff don't need the admin password.

## Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev
```

### Environment variables (`.env.local`)

| Variable | Where to get it |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (service_role, never expose to the client) |
| `ADMIN_PASSWORD` | Pick your own — protects `/admin` |
| `STAFF_PASSCODE` | Pick your own — protects `/scanner` |
| `SESSION_SECRET` | Generate with `openssl rand -hex 32` |

### Database

Run `supabase/migrations/0001_init.sql` once in the Supabase SQL Editor
(Project → SQL Editor → New query). It creates the `guests` table, indexes,
locks the table down with RLS (only the service role key can touch it — the
browser never talks to Supabase directly), and a `check_in_guest` function
that does the check-in atomically so two scanners can't double-check-in the
same guest.

## Editing the wedding details

Placeholder names/date/time/venue live in [`src/lib/wedding-config.ts`](src/lib/wedding-config.ts).
The WhatsApp message template is also there.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables as above in Vercel → Project Settings → Environment Variables.
4. Deploy. Camera-based scanning requires HTTPS, which Vercel provides automatically.
