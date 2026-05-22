# AwareNet — Complete Production-Grade Implementation Guide

---

## FULL FILE STRUCTURE TREE

```
awareness-platform/
├── app/
│   ├── (app)/                          # Authenticated app routes group
│   │   ├── layout.tsx                  # App layout (Navbar + Footer)
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Home feed with personalized posts
│   │   │   └── loading.tsx             # Dashboard skeleton
│   │   ├── explore/
│   │   │   └── page.tsx                # Explore all issues with filters
│   │   ├── categories/
│   │   │   └── page.tsx                # All categories grid
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Dynamic category page
│   │   ├── awareness/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # Article page with chain system
│   │   │       └── loading.tsx         # Article skeleton
│   │   ├── impact/
│   │   │   └── page.tsx                # Impact dashboard with charts
│   │   └── profile/
│   │       └── [username]/
│   │           └── page.tsx            # Dynamic user profile
│   ├── (auth)/                         # Auth routes group (unauthenticated)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── api/
│   │   ├── posts/
│   │   │   └── route.ts                # GET posts with search/filter
│   │   └── chains/
│   │       └── route.ts                # GET/POST awareness chains
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                # OAuth callback handler
│   ├── onboarding/
│   │   └── page.tsx                    # Post-signup onboarding flow
│   ├── globals.css                     # Global styles + CSS variables
│   ├── layout.tsx                      # Root layout with providers
│   ├── page.tsx                        # Public landing page
│   └── not-found.tsx                   # 404 page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  # Responsive navbar with auth
│   │   └── Footer.tsx                  # Footer with links + social
│   ├── sections/                       # Landing page sections
│   │   ├── HeroSection.tsx             # Cinematic hero with stats
│   │   ├── NetworkVisualization.tsx    # React Flow awareness network
│   │   ├── TrendingTopics.tsx          # Post cards grid
│   │   ├── WhyAwarenessMatterSection.tsx
│   │   ├── StatsSection.tsx            # Animated counters
│   │   └── CallToAction.tsx            # CTA with signup
│   ├── article/
│   │   ├── ArticleHero.tsx             # Full-bleed hero with metadata
│   │   ├── ArticleContent.tsx          # Structured content sections
│   │   ├── ArticleShareSidebar.tsx     # Sticky share + chain sidebar
│   │   ├── ChainCTA.tsx                # Bottom CTA for chain creation
│   │   ├── RelatedPosts.tsx            # Related posts grid
│   │   └── ReadingProgressBar.tsx      # Fixed top reading progress
│   ├── auth/
│   │   ├── LoginForm.tsx               # Email + Google login form
│   │   └── SignupForm.tsx              # Registration form
│   ├── onboarding/
│   │   └── OnboardingFlow.tsx          # Multi-step onboarding
│   ├── dashboard/
│   │   ├── DashboardFeed.tsx           # Post grid with featured
│   │   └── DashboardStats.tsx          # Sidebar stats widget
│   ├── explore/
│   │   └── ExploreClient.tsx           # Search + filter + grid
│   ├── categories/
│   │   ├── CategoryGrid.tsx            # Categories overview grid
│   │   └── CategoryPageClient.tsx      # Category page with posts
│   ├── impact/
│   │   └── ImpactDashboardClient.tsx   # Charts + analytics dashboard
│   ├── profile/
│   │   └── ProfileClient.tsx           # Full user profile display
│   ├── providers/
│   │   ├── AuthProvider.tsx            # Supabase auth context
│   │   ├── ThemeProvider.tsx           # next-themes wrapper
│   │   └── ToastProvider.tsx           # Radix toast wrapper
│   └── ui/
│       ├── AnimatedCounter.tsx         # Scroll-triggered number counter
│       ├── ParticleBackground.tsx      # Canvas particle + connection system
│       ├── Skeletons.tsx               # Shimmer skeleton loaders
│       └── ThemeToggle.tsx             # Dark/light mode toggle
│
├── database/
│   └── schema.sql                      # Complete PostgreSQL schema
│
├── hooks/
│   └── useAuth.ts                      # Auth context hook
│
├── lib/
│   ├── actions.ts                      # All server actions
│   ├── utils.ts                        # Utility functions
│   ├── services/
│   │   └── posts.ts                    # Post data fetching services
│   └── supabase/
│       ├── client.ts                   # Browser Supabase client
│       └── server.ts                   # Server Supabase client
│
├── types/
│   └── database.ts                     # Full TypeScript DB types
│
├── middleware.ts                        # Route protection middleware
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
├── vercel.json
└── .env.example
```

---

## STEP-BY-STEP IMPLEMENTATION GUIDE

---

### STEP 1 — Prerequisites

Make sure you have the following installed:

```bash
node --version   # >= 18.18.0
npm --version    # >= 9.0.0
git --version    # any recent version
```

---

### STEP 2 — Project Setup

```bash
# Clone / create the project
mkdir awareness-platform
cd awareness-platform

# If you received all files in a zip, extract them here.
# Otherwise scaffold with Next.js:
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

---

### STEP 3 — Install All Dependencies

```bash
npm install \
  @supabase/ssr @supabase/supabase-js \
  framer-motion \
  reactflow \
  recharts \
  next-themes \
  lucide-react \
  class-variance-authority clsx tailwind-merge tailwindcss-animate \
  zod \
  @radix-ui/react-avatar \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-label \
  @radix-ui/react-progress \
  @radix-ui/react-scroll-area \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip
```

---

### STEP 4 — Supabase Project Setup

1. Go to **https://supabase.com** and create a new project.
2. Choose a region close to your users.
3. Save your **database password** securely.
4. Wait for the project to be provisioned (~2 minutes).

---

### STEP 5 — Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find keys:**
- Supabase Dashboard → Project Settings → API
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role / secret** key → `SUPABASE_SERVICE_ROLE_KEY`

---

### STEP 6 — Run Database Migrations

1. In your Supabase project, go to **SQL Editor**.
2. Click **New Query**.
3. Open `database/schema.sql` from this project.
4. Paste the entire SQL content into the editor.
5. Click **Run**.

You should see:
- 11 tables created
- All indexes created
- All RLS policies applied
- Seed data inserted (10 categories + 8 badges)

**Verify in Table Editor:**
- `categories` → 10 rows
- `badges` → 8 rows
- All other tables → 0 rows (populated by users)

---

### STEP 7 — Configure Supabase Auth

#### Enable Google OAuth:

1. Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Go to **https://console.cloud.google.com**
4. Create OAuth 2.0 credentials (Web application)
5. Add Authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret** back to Supabase

#### Configure Email Auth:

1. Authentication → Settings → Email
2. Enable **Email confirmations** (recommended for production)
3. Set **Site URL**: `http://localhost:3000` (dev) or your domain (prod)
4. Add redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

---

### STEP 8 — Install shadcn/ui Components

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Install required components
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add select
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
```

---

### STEP 9 — Start Local Development

```bash
npm run dev
```

Open **http://localhost:3000** — you should see the cinematic landing page.

**Test the flow:**
1. Click "Get Started" → signup form
2. Create an account with email/password
3. Complete onboarding (select 3+ categories)
4. Land on `/dashboard`
5. Visit `/explore`, `/categories`, `/impact`

---

### STEP 10 — Seed Sample Posts (Optional)

To see the full UI with content, insert sample posts via Supabase SQL Editor:

```sql
-- First, get your user ID (after signing up)
SELECT id FROM auth.users LIMIT 1;

-- Get a category ID
SELECT id FROM public.categories WHERE slug = 'environment';

-- Insert a sample post (replace UUIDs with real ones from above)
INSERT INTO public.awareness_posts (
  slug, title, subtitle, hero_image,
  category_id, author_id, urgency, status,
  problem_explanation, why_it_matters, consequences,
  real_examples, solutions, reading_time, is_featured,
  published_at, tags
) VALUES (
  'plastic-ocean-crisis',
  'Every Minute, a Garbage Truck of Plastic Enters Our Oceans',
  'We''re poisoning the lifeblood of Earth at a scale that defies comprehension. Here''s what no one is telling you.',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80',
  '<your-environment-category-id>',
  '<your-user-id>',
  'critical', 'published',
  'Every year, 8 million metric tons of plastic enter our oceans. That is equivalent to dumping a full garbage truck of plastic into the sea every single minute, all day, every day. This plastic does not disappear — it breaks into microplastics that infiltrate every level of the marine food chain, from plankton to whales.',
  'The ocean produces over 50% of the world''s oxygen and regulates global climate patterns. When we poison the ocean, we poison ourselves. Microplastics have been found in human blood, lungs, placentas, and breast milk. The ocean crisis is not an environmental issue — it is a human survival issue.',
  'At current trajectories, there will be more plastic in the ocean than fish by weight by 2050. Coral reefs are dying. Fish populations are collapsing. Coastal communities that depend on fishing for food and income are being devastated. The economic cost exceeds $13 billion annually.',
  'The Great Pacific Garbage Patch is now three times the size of France. Indonesia''s rivers carry so much plastic that you can walk across them. Beach communities in the Philippines have renamed their shores "Plastic Beach." Scientists sampling the deepest point on Earth — the Mariana Trench — found plastic bags.',
  'Individual actions matter but systemic change is essential. Support Extended Producer Responsibility legislation that holds corporations accountable. Advocate for a Global Plastics Treaty. Choose products with minimal packaging. Support organizations like Ocean Conservancy and Surfrider Foundation. But most importantly: make noise. Share this. Create a chain.',
  8, TRUE, NOW(),
  ARRAY['ocean', 'plastic', 'environment', 'pollution', 'climate']
);
```

---

### STEP 11 — Deployment to Vercel

#### Option A — Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to existing project? No → create new
# - Project name: awareness-platform
# - Framework: Next.js (auto-detected)
```

#### Option B — GitHub Integration

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AwareNet platform"
   git remote add origin https://github.com/yourusername/awareness-platform.git
   git push -u origin main
   ```

2. Go to **https://vercel.com/new**
3. Import your GitHub repository
4. Configure environment variables (same as `.env.local` but with production values)
5. Click **Deploy**

#### Add Production Environment Variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL         = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    = your-anon-key
SUPABASE_SERVICE_ROLE_KEY        = your-service-role-key
NEXT_PUBLIC_APP_URL              = https://your-vercel-domain.vercel.app
```

---

### STEP 12 — Post-Deployment Configuration

After deploying, update Supabase settings with your production URL:

1. **Authentication → Settings → Site URL**: `https://your-domain.vercel.app`
2. **Authentication → Settings → Redirect URLs**: Add `https://your-domain.vercel.app/auth/callback`
3. **Google OAuth Redirect URI**: Add `https://your-project-id.supabase.co/auth/v1/callback` (already set)

---

### STEP 13 — Production Optimizations

#### Enable Supabase Connection Pooling:
- Dashboard → Database → Connection Pooling → Enable
- Use the **Transaction** mode URL for serverless environments

#### Add Image Domains in next.config.ts:
```ts
// Already configured for: unsplash, supabase, google, github avatars
// Add your CDN domain if using custom storage
```

#### Enable Vercel Edge Caching:
```ts
// In route handlers, use:
export const runtime = 'edge'; // for lightweight API routes

// In page components:
export const revalidate = 60; // ISR: revalidate every 60 seconds
```

#### Add ISR to Category/Article Pages:
```tsx
// app/(app)/category/[slug]/page.tsx
export const revalidate = 3600; // 1 hour

// app/(app)/awareness/[slug]/page.tsx
export const revalidate = 300;  // 5 minutes
```

---

### STEP 14 — Adding Content (Admin Workflow)

Until you build an admin dashboard, add posts via Supabase SQL Editor or the Table Editor UI:

1. Go to Supabase → Table Editor → `awareness_posts`
2. Click **Insert Row**
3. Fill in all required fields
4. Set `status = 'published'` and `published_at = NOW()`
5. Set `is_featured = true` for the main featured post

**Required fields checklist:**
- `slug` — URL-friendly ID (e.g. `ai-job-displacement`)
- `title` — Compelling headline
- `category_id` — UUID from categories table
- `author_id` — Your user UUID
- `urgency` — `critical | high | medium | low`
- `hero_image` — Unsplash URL or your CDN URL
- `problem_explanation` — 2-3 paragraphs
- `why_it_matters` — Emotional hook
- `consequences` — What happens if ignored
- `real_examples` — 2-3 real-world cases
- `solutions` — Actionable steps
- `reading_time` — Estimated minutes
- `tags` — Array like `ARRAY['climate', 'ocean']`

---

## ARCHITECTURE DECISIONS & BEST PRACTICES

### Why This Architecture

| Decision | Reasoning |
|----------|-----------|
| Next.js App Router | Streaming SSR, server components, parallel data fetching |
| Supabase | Full-stack: auth + database + RLS + real-time in one service |
| Server Components by default | Reduces client JS bundle, better SEO, faster TTFB |
| `(app)` route group | Separates authenticated routes with shared layout without affecting URL |
| `(auth)` route group | Clean auth pages without navbar/footer |
| Middleware for auth | Centralized route protection, prevents flash of unprotected content |
| RLS policies | Database-level security — even if API is compromised, data is safe |
| Server actions | Type-safe mutations with automatic CSRF protection |
| Zod validation | Runtime validation on all inputs, front and back |

### Performance Architecture

```
Landing Page (/ )
  └── Static + Server Component (no client JS for initial load)
      ├── ParticleBackground (client, lazy)
      ├── HeroSection (client, Framer Motion)
      └── NetworkVisualization (client, lazy — React Flow)

Dashboard (/dashboard)
  └── Server Component (data fetched on server)
      ├── DashboardFeed (client, animated cards)
      └── DashboardStats (client, counters)

Article (/awareness/[slug])
  └── Server Component (full SSR with ISR)
      ├── ArticleHero (client, parallax)
      ├── ArticleContent (client, scroll reveals)
      └── ArticleShareSidebar (client, chain generation)
```

### Security Checklist

- [x] All mutations use server actions (CSRF-protected)
- [x] JWT session validation in middleware
- [x] RLS policies on all tables
- [x] Zod validation on all API inputs
- [x] Environment variables never exposed to client (service role key)
- [x] Image remote patterns whitelist in next.config.ts
- [x] Authenticated-only data fetched server-side

---

## DEBUGGING TIPS

### "Supabase client not found"
```bash
# Verify env vars are loaded
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# If undefined, restart dev server after editing .env.local
```

### "RLS policy violation" errors
```sql
-- Check which policies exist:
SELECT * FROM pg_policies WHERE tablename = 'awareness_posts';

-- Temporarily disable RLS for testing (NEVER in production):
ALTER TABLE public.awareness_posts DISABLE ROW LEVEL SECURITY;
```

### Auth redirect loop
```ts
// Check middleware.ts matcher pattern
// Make sure /auth/callback is NOT protected
// Ensure NEXT_PUBLIC_APP_URL matches your actual domain exactly
```

### React Flow not rendering
```bash
# reactflow requires the dist CSS:
import 'reactflow/dist/style.css'; # Already in NetworkVisualization.tsx
# If still broken, check if you're importing from 'reactflow' (v11) not 'react-flow-renderer'
```

### Particles not visible
```tsx
// ParticleBackground uses a canvas element
// Ensure the canvas has z-index: 0 and pointer-events: none
// Check that it's inside a position: relative parent
// Canvas renders below all content via z-index layering
```

### Chains not incrementing
```sql
-- Verify the trigger is active:
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_new_chain';

-- Check the function exists:
SELECT * FROM pg_proc WHERE proname = 'handle_new_chain';
```

### Build errors on Vercel
```bash
# Run locally first:
npm run build

# Common fixes:
# 1. Add "use client" to components using hooks
# 2. Wrap client-only imports (ReactFlow, tsparticles) in dynamic()
# 3. Check all env vars are set in Vercel dashboard
```

---

## EXTENDING THE PLATFORM

### Add an AI Microservice (FastAPI)

```python
# fastapi_service/main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Post(BaseModel):
    title: str
    content: str

@app.post("/analyze-urgency")
async def analyze_urgency(post: Post):
    # Use OpenAI/Claude to classify urgency
    # Return: { urgency: "critical"|"high"|"medium"|"low", reasoning: str }
    return {"urgency": "high", "reasoning": "AI analysis..."}

@app.post("/generate-summary")
async def generate_summary(post: Post):
    # Generate emotional subtitle
    return {"subtitle": "Generated subtitle..."}
```

```bash
# Run with:
pip install fastapi uvicorn openai
uvicorn main:app --reload --port 8000

# Connect from Next.js:
# NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

### Add Real-Time Chain Updates

```tsx
// In ArticleShareSidebar.tsx, add:
useEffect(() => {
  const channel = supabase
    .channel('chain-updates')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'awareness_chains',
      filter: `post_id=eq.${post.id}`,
    }, (payload) => {
      setChainCount(c => c + 1);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [post.id]);
```

### Add Comments Section

```tsx
// Fetch comments in article page:
const { data: comments } = await supabase
  .from("comments")
  .select("*, users(id, username, avatar_url)")
  .eq("post_id", post.id)
  .eq("is_deleted", false)
  .is("parent_id", null)
  .order("created_at", { ascending: false });

// Use createComment server action from lib/actions.ts
```

---

## COST ESTIMATE (Production)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Supabase | 500MB DB, 2GB bandwidth | $25/mo (Pro) |
| Vercel | 100GB bandwidth | $20/mo (Pro) |
| Total | **$0/mo** to start | **~$45/mo** at scale |

Supabase free tier supports ~10,000 monthly active users before upgrade is needed.

---

## WHAT TO BUILD NEXT

1. **Admin Dashboard** — Create/edit/delete posts with rich text editor (TipTap)
2. **Comments System** — Thread discussions on each post
3. **Real-time Notifications** — When someone joins your chain
4. **Email Digests** — Weekly awareness digest using Resend
5. **Mobile App** — React Native with same Supabase backend
6. **Search with Algolia** — Full-text search at scale
7. **Analytics** — PostHog for product analytics
8. **AI Content Generation** — FastAPI + GPT-4 for article drafting

---

*Generated for AwareNet — the interactive awareness ecosystem.*
*Stack: Next.js 15 · TypeScript · Tailwind CSS · Supabase · Framer Motion · React Flow*
