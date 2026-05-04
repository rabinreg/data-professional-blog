import { getPost, getAllPostSlugs } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Comments from '@/components/Comments';

const mdxComponents = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <span className="block my-8">
      <Image
        src={String(props.src ?? '')}
        alt={props.alt ?? ''}
        width={900}
        height={500}
        className="rounded-xl border border-gray-100 shadow-sm w-full h-auto"
        style={{ objectFit: 'contain' }}
      />
      {props.alt && (
        <span className="block text-center text-sm text-gray-400 mt-2 italic">{props.alt}</span>
      )}
    </span>
  ),
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link href="/" className="text-sm text-violet-500 hover:text-violet-700 mb-8 inline-block transition-colors">
        ← All articles
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-10 border-b border-gray-100 pb-6">
        <time dateTime={post.date}>
          {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : ''}
        </time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      {/* MDX Content */}
      <div className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-a:text-violet-600 prose-code:text-violet-700 prose-code:bg-violet-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      {/* Comments and reactions */}
      <section className="mt-14 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-gray-900">Comments & Reactions</h2>
        <p className="text-sm text-gray-500 mt-1">No sign-in needed — readers can like and comment directly.</p>
        <Comments slug={post.slug} />
      </section>
    </article>
  );
}
