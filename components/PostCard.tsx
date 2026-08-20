import Link from 'next/link'

interface Post {
  id: string
  title: string
  body: string
  category: string
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

function excerpt(text: string, length = 140) {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

export default function PostCard({ post }: { post: Post }) {
  const badgeStyle =
    CATEGORY_STYLES[post.category.toLowerCase()] ?? 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <Link href={`/posts/${post.id}`} className="group block h-full">
      <article className="h-full rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
        <span
          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${badgeStyle}`}
        >
          {post.category}
        </span>
        <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:underline">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{excerpt(post.body)}</p>
      </article>
    </Link>
  )
}
