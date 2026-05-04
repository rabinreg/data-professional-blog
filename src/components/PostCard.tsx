import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { format } from 'date-fns';

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-violet-100 transition-all bg-white">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag.toLowerCase()}`}
            className="text-xs font-medium px-2.5 py-1 bg-violet-50 text-violet-600 rounded-full hover:bg-violet-100 transition-colors"
          >
            {tag.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors mb-2 leading-snug">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.description}</p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <time dateTime={post.date}>
          {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : ''}
        </time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </article>
  );
}
