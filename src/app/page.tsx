import { getAllPosts, getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return (
    <div>
      {/* Hero */}
      <section className="mb-12 pb-10 border-b border-gray-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full mb-5 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Data Engineering &amp; Technology
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-[1.15] tracking-tight">
          Insights for the
          <span className="text-violet-700"> Modern Data</span>
          <br />Professional
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
          Deep-dives into data pipelines, cloud infrastructure, streaming systems,
          and the modern data stack — written by a practicing data engineer.
        </p>
      </section>

      {/* Tags filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-violet-300 hover:text-violet-600 transition-colors"
            >
              {tag.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No posts yet — check back soon!</p>
      ) : (
        <div className="grid gap-5">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
