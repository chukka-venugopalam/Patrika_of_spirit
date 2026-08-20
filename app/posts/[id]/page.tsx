import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ShareSection from '@/components/ShareSection'

interface Post {
  id: string
  title: string
  body: string
  category: string
  created_by: string | null
  created_at: string
}

const CATEGORY_STYLES: Record<string, string> = {
  environment: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  education: 'bg-blue-50 text-blue-700 border-blue-200',
  health: 'bg-rose-50 text-rose-700 border-rose-200',
  poverty: 'bg-amber-50 text-amber-700 border-amber-200',
  'mental health': 'bg-violet-50 text-violet-700 border-violet-200',
  'technology ethics': 'bg-slate-50 text-slate-700 border-slate-200',
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('id, title, body, category, created_by, created_at')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  const typedPost = post as Post
  const badgeStyle =
    CATEGORY_STYLES[typedPost.category.toLowerCase()] ?? 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <span
        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${badgeStyle}`}
      >
        {typedPost.category}
      </span>

      <h1 className="mt-4 text-3xl font-semibold text-gray-900">{typedPost.title}</h1>

      <p className="mt-1 text-sm text-gray-400">
        {new Date(typedPost.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <article className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-gray-700">
        {typedPost.body}
      </article>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <Suspense fallback={<div className="h-10 w-40 animate-pulse rounded-lg bg-gray-100" />}>
          <ShareSection postId={typedPost.id} />
        </Suspense>
      </div>
    </main>
  )
}
