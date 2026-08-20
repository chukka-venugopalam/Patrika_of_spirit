# AwareNet — V1

Fresh-start rebuild. See `AWARENET-V1-SPEC.md` (if you have it from earlier) for product scope.

## Setup

1. **Create a Supabase project** (Settings → General → New Project, or reuse an existing empty one).
2. **Run the migrations** in the Supabase SQL editor, in order:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_create_share_rpc.sql`
3. **Copy `.env.example` to `.env.local`** and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Settings → API)
   - `NEXT_PUBLIC_SITE_URL` (leave as `http://localhost:3000` for local dev)
   - `SUPABASE_SERVICE_ROLE_KEY` (only needed to run the seed script)
4. **Install and run:**
   ```
   npm install
   npm run dev
   ```
5. **Seed sample posts** (optional but recommended for testing the flow):
   ```
   npm run seed
   ```

## Notes

- Built for **Next.js 14** (App Router). If you upgrade to Next.js 15+, `lib/supabase/server.ts`'s `createClient()` needs to become `async` (Next 15 makes `cookies()` async). If you upgrade to Next.js 16+, `middleware.ts` needs to be renamed to `proxy.ts` with an exported `proxy` function instead of `middleware`.
- Auth: email/password + magic link via Supabase Auth. `/auth/callback` handles both signup confirmation and magic-link redirects.
- The share flow: `ShareSection` (on a post page) calls `POST /api/share`, which validates the requester against their session, rate-limits to 20 shares/hour, and calls the `create_share` Postgres function for an atomic insert. Opening a share link (`GET /share/[token]`) records a view event and redirects back to the post with `?viaEvent=` attached, so a reshare from that visit chains correctly.
- "Reach," not "Impact" — deliberate framing throughout the UI. See spec for why.
