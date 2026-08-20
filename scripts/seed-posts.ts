/**
 * Seed script: inserts 12 sample awareness posts into public.posts.
 *
 * Usage:
 *   npm run seed
 *
 * Requires (in your environment / .env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY     (preferred — bypasses RLS for seeding)
 *   or NEXT_PUBLIC_SUPABASE_ANON_KEY (fallback; insert will fail if RLS on
 *   public.posts blocks anonymous writes)
 *
 * Note: `created_by` is intentionally omitted (assumes the column is
 * nullable). If it's NOT NULL in your schema, set a valid user uuid below.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

type SeedPost = {
  title: string
  body: string
  category:
    | 'environment'
    | 'education'
    | 'health'
    | 'poverty'
    | 'mental health'
    | 'technology ethics'
}

const posts: SeedPost[] = [
  {
    title: 'Coastal Plastic: A Rising Tide We Can Still Turn Back',
    body: 'Every year, millions of tonnes of plastic waste enter the ocean through rivers and coastlines, breaking down into microplastics that enter the food chain. Local cleanup drives and better waste segregation at the source can meaningfully reduce this flow before it reaches the sea.',
    category: 'environment',
  },
  {
    title: 'Why Urban Trees Do More Than Look Nice',
    body: 'A single mature tree can absorb roughly 20kg of carbon dioxide a year while cooling the surrounding air through shade and transpiration. Cities that invest in tree cover see measurable drops in summer temperatures and air pollution levels.',
    category: 'environment',
  },
  {
    title: 'The Quiet Crisis in Rural Classrooms',
    body: 'In many rural districts, a shortage of trained teachers means one educator often covers multiple grades at once. Simple interventions like peer-teaching models and shared digital resources can help bridge the gap until more staff can be hired.',
    category: 'education',
  },
  {
    title: 'Closing the Digital Learning Gap',
    body: 'Remote learning tools only help students who can reliably access them. Community-run device libraries and offline-first learning apps are proving effective in areas where internet connectivity remains unstable.',
    category: 'education',
  },
  {
    title: 'Antibiotic Resistance Is Not a Future Problem',
    body: 'Overuse of antibiotics in both healthcare and agriculture is accelerating the rise of drug-resistant infections. Responsible prescribing and public awareness about finishing prescribed courses are simple but crucial defenses.',
    category: 'health',
  },
  {
    title: 'The Overlooked Cost of Skipping Preventive Care',
    body: 'Routine screenings catch conditions like hypertension and diabetes long before symptoms appear, when treatment is simplest and cheapest. Yet many people delay checkups until a problem becomes urgent, which raises both health risk and cost.',
    category: 'health',
  },
  {
    title: 'Breaking the Cycle: Microloans and Local Trust',
    body: 'Small, community-backed loans have helped many low-income households start modest businesses without falling into predatory debt. The key ingredient is often not the money itself but the trust and accountability built within local lending circles.',
    category: 'poverty',
  },
  {
    title: 'Food Deserts Are a Design Problem, Not Just a Poverty Problem',
    body: 'Many low-income neighborhoods lack easy access to affordable, fresh food, not because demand is absent but because grocery infrastructure was never built there. Mobile markets and cooperative grocery models are starting to fill that gap.',
    category: 'poverty',
  },
  {
    title: 'The Weight of Silence Around Burnout',
    body: 'Chronic workplace stress often goes unaddressed until it becomes a full breakdown, partly because admitting to struggling still carries stigma in many workplaces. Normalizing regular check-ins can catch burnout while it is still manageable.',
    category: 'mental health',
  },
  {
    title: 'Loneliness Is a Public Health Issue, Not Just a Personal One',
    body: 'Chronic social isolation has been linked to health risks comparable to smoking. Community spaces, from shared gardens to neighborhood clubs, play a measurable role in reducing loneliness at a population level.',
    category: 'mental health',
  },
  {
    title: 'Who Owns the Data Your Face Generates?',
    body: 'Facial recognition systems are increasingly deployed in public spaces with little disclosure to the people being scanned. Clear consent frameworks and public audits of these systems are necessary to keep pace with how widely the technology has spread.',
    category: 'technology ethics',
  },
  {
    title: "Algorithms Don't Discriminate on Their Own — We Train Them To",
    body: 'Machine learning models trained on biased historical data can reproduce and even amplify that bias at scale, from hiring tools to loan approvals. Regular audits and diverse training data are essential, not optional, safeguards.',
    category: 'technology ethics',
  },
]

async function seed() {
  console.log(`Seeding ${posts.length} posts...`)

  const { data, error } = await supabase.from('posts').insert(posts).select('id, title')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Inserted ${data?.length ?? 0} posts:`)
  data?.forEach((p) => console.log(`  - ${p.title} (${p.id})`))
}

seed()
