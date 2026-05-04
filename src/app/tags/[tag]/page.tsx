import { getAllTags, getPostsByTag } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div>
      <Link href="/" className="text-sm text-violet-500 hover:text-violet-700 mb-8 inline-block transition-colors">
        ← All articles
      </Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Topic: <span className="text-violet-600">#{tag.replace(/-/g, ' ')}</span>
      </h1>
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts for this topic yet.</p>
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
