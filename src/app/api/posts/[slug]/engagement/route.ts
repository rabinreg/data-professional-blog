import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type MemoryEngagement = {
  likes: number;
  comments: CommentItem[];
};

const memoryStore = new Map<string, MemoryEngagement>();

function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.KV_REST_API_READ_ONLY_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

function getKeys(slug: string) {
  const safeSlug = slug.toLowerCase();
  return {
    slugKey: safeSlug,
    likesKey: `post:${safeSlug}:likes`,
    commentsKey: `post:${safeSlug}:comments`,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const redis = getRedis();

  const { slug } = await params;
  const { slugKey, likesKey, commentsKey } = getKeys(slug);

  if (!redis) {
    const fallback = memoryStore.get(slugKey) ?? { likes: 0, comments: [] };
    return NextResponse.json({
      likes: fallback.likes,
      comments: fallback.comments,
      storage: 'memory',
    });
  }

  const [likesRaw, commentsRaw] = await Promise.all([
    redis.get<number>(likesKey),
    redis.lrange<string>(commentsKey, 0, 99),
  ]);

  const comments: CommentItem[] = commentsRaw
    .map((item) => {
      try {
        return JSON.parse(item) as CommentItem;
      } catch {
        return null;
      }
    })
    .filter((item): item is CommentItem => Boolean(item));

  return NextResponse.json({
    likes: likesRaw ?? 0,
    comments,
    storage: 'redis',
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const redis = getRedis();

  const { slug } = await params;
  const { slugKey, likesKey, commentsKey } = getKeys(slug);

  let body: { action?: 'like' | 'comment'; name?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (body.action === 'like') {
    if (!redis) {
      const fallback = memoryStore.get(slugKey) ?? { likes: 0, comments: [] };
      const likes = fallback.likes + 1;
      memoryStore.set(slugKey, {
        ...fallback,
        likes,
      });
      return NextResponse.json({ likes, storage: 'memory' });
    }

    const likes = await redis.incr(likesKey);
    return NextResponse.json({ likes, storage: 'redis' });
  }

  if (body.action === 'comment') {
    const name = (body.name ?? '').trim() || 'Anonymous';
    const message = (body.message ?? '').trim();

    if (!message) {
      return NextResponse.json({ error: 'Comment message is required.' }, { status: 400 });
    }

    if (name.length > 50 || message.length > 1000) {
      return NextResponse.json(
        { error: 'Comment is too long. Please shorten and try again.' },
        { status: 400 }
      );
    }

    const comment: CommentItem = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };

    if (!redis) {
      const fallback = memoryStore.get(slugKey) ?? { likes: 0, comments: [] };
      const comments = [comment, ...fallback.comments].slice(0, 200);
      memoryStore.set(slugKey, {
        ...fallback,
        comments,
      });
      return NextResponse.json({ comment, storage: 'memory' }, { status: 201 });
    }

    await redis.lpush(commentsKey, JSON.stringify(comment));
    await redis.ltrim(commentsKey, 0, 199);

    return NextResponse.json({ comment, storage: 'redis' }, { status: 201 });
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}
