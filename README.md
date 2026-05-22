Awareness Network Platform

An interactive awareness ecosystem built with Next.js, Supabase, and modern web technologies.

The platform helps users:

- understand important global and local issues
- spread awareness through chain-reaction sharing
- explore interactive awareness content
- contribute to a growing awareness network

---

Features

Core Features

- Cinematic landing page
- Interactive awareness feeds
- Awareness chain propagation system
- User onboarding and personalization
- Category-based awareness hubs
- Animated awareness cards
- Interactive impact dashboard
- User profiles and contribution tracking
- Dark mode futuristic UI
- Realtime engagement systems

---

Tech Stack

Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Flow
- Lucide React

Backend

- Next.js Route Handlers
- Server Actions
- Supabase

Database

- PostgreSQL (Supabase)

Deployment

- Vercel

Optional AI Services

- FastAPI (Python)

---

Project Structure

app/
components/
lib/
hooks/
services/
types/
styles/
database/
public/
middleware.ts

---

Setup Guide

1. Clone Repository

git clone <your-repo-url>
cd awareness-platform

---

2. Install Dependencies

npm install

or

pnpm install

---

3. Setup Supabase

Create a project in Supabase:
https://supabase.com

After creating the project:

- copy Project URL
- copy anon public key
- copy service role key

---

4. Configure Environment Variables

Create:

.env.local

Add:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

---

5. Run Database SQL

Open Supabase SQL Editor and run:

-- paste generated schema.sql

This will create:

- tables
- relationships
- RLS policies
- indexes
- seed data

---

6. Run Development Server

npm run dev

Open:

http://localhost:3000

---

Authentication Setup

Google OAuth

In Supabase:

1. Open Authentication
2. Providers
3. Enable Google
4. Add credentials

Create OAuth credentials here:
https://console.cloud.google.com

Add redirect URL:

https://<your-project>.supabase.co/auth/v1/callback

---

Main Pages

Route| Description
"/"| Landing page
"/login"| Login page
"/signup"| Signup page
"/onboarding"| User interests setup
"/home"| Main awareness feed
"/category/[slug]"| Category pages
"/awareness/[slug]"| Awareness article page
"/impact"| Awareness analytics
"/profile/[id]"| User profile

---

Awareness Chain System

Users can:

- share awareness topics
- generate unique chain links
- track awareness propagation
- contribute to awareness spread

Visualization includes:

- awareness nodes
- chain graphs
- engagement paths
- propagation depth

---

UI/UX Design Goals

The platform is designed to feel:

- cinematic
- futuristic
- immersive
- emotionally engaging

Core design principles:

- smooth animations
- dark mode first
- interactive storytelling
- motion-heavy UI
- premium startup aesthetics

---

Deployment

Deploy Frontend to Vercel

Install Vercel CLI:

npm i -g vercel

Deploy:

vercel

Or connect GitHub repository directly:
https://vercel.com

---

Deploy Python Services (Optional)

Recommended:

- Render
- Railway
- Fly.io

Useful for:

- AI summarization
- recommendation systems
- moderation pipelines
- analytics processing

---

Recommended Architecture

MVP Architecture

Next.js
   ↓
Supabase

Scalable Architecture

Next.js Frontend
   ↓
Supabase Backend
   ↓
FastAPI AI Services

---

Future Features

Planned Features

- AI-generated summaries
- multilingual support
- awareness recommendation engine
- misinformation detection
- realtime community discussions
- NGO partnerships
- mobile applications

---

Security

Implemented:

- Supabase Auth
- Row Level Security
- protected routes
- secure environment variables
- middleware route guards
- server-side validation

---

Performance Optimizations

Includes:

- App Router
- Server Components
- lazy loading
- image optimization
- metadata generation
- caching
- skeleton loaders
- code splitting

---

Development Recommendations

Best Practices

- use TypeScript strictly
- keep components reusable
- separate UI and business logic
- use server actions where possible
- avoid unnecessary client components

---

Recommended Libraries

Purpose| Library
Animations| Framer Motion
Graph Visualization| React Flow
UI Components| shadcn/ui
Icons| Lucide React
Forms| React Hook Form
Validation| Zod
Charts| Recharts

---

Contribution Guidelines

When adding awareness content:

- verify sources
- avoid misinformation
- use emotionally engaging thumbnails
- keep explanations concise
- focus on actionable awareness

---

License

MIT License

---

Vision

The goal is to build a living awareness network where:

- knowledge spreads socially
- awareness becomes interactive
- users contribute to meaningful education
- communities become more informed

One informed person can influence thousands.- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
