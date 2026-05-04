import { getAllTags } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Topics' };

export default function TagsPage() {
  const tags = getAllTags();
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">All Topics</h1>
      {tags.length === 0 ? (
        <p className="text-gray-400">No topics yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:border-violet-300 hover:text-violet-600 transition-colors font-medium"
            >
              {tag.replace(/-/g, ' ')}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
