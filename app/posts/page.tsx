import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'

interface Post {
  id: string
  title: string
  body: string
  category: string
  created_by: string | null
  created_at: string
}

export default async function PostsPage() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, body, category, created_by, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900">Awareness posts</h1>
        <p className="mt-4 text-sm text-red-600">
          Something went wrong loading posts: {error.message}
        </p>
      </main>
    )
  }

  const typedPosts = (posts ?? []) as Post[]

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Awareness posts</h1>
        <p className="mt-1 text-sm text-gray-500">
          {typedPosts.length} post{typedPosts.length === 1 ? '' : 's'} across environment,
          education, health, poverty, mental health, and technology ethics.
        </p>
      </header>

      {typedPosts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
