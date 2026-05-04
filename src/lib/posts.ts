import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostMeta(slug))
    .filter(Boolean)
    .sort((a, b) => (a!.date < b!.date ? 1 : -1)) as PostMeta[];
}

export function getPostMeta(slug: string): PostMeta | null {
  const filePath = resolveFilePath(slug);
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    readingTime: stats.text,
    coverImage: data.coverImage,
  };
}

export function getPost(slug: string): Post | null {
  const filePath = resolveFilePath(slug);
  if (!filePath) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    readingTime: stats.text,
    coverImage: data.coverImage,
    content,
  };
}

function resolveFilePath(slug: string): string | null {
  for (const ext of ['.mdx', '.md']) {
    const p = path.join(postsDirectory, slug + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()));
}

export function getAllTags(): string[] {
  const all = getAllPosts().flatMap((p) => p.tags);
  return Array.from(new Set(all));
}
