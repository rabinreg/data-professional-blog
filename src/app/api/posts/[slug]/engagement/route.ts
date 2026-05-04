import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

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
    likesKey: `post:${safeSlug}:likes`,
    commentsKey: `post:${safeSlug}:comments`,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'Engagement storage is not configured on the server.' },
      { status: 503 }
    );
  }

  const { slug } = await params;
  const { likesKey, commentsKey } = getKeys(slug);

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
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'Engagement storage is not configured on the server.' },
      { status: 503 }
    );
  }

  const { slug } = await params;
  const { likesKey, commentsKey } = getKeys(slug);

  let body: { action?: 'like' | 'comment'; name?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (body.action === 'like') {
    const likes = await redis.incr(likesKey);
    return NextResponse.json({ likes });
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

    await redis.lpush(commentsKey, JSON.stringify(comment));
    await redis.ltrim(commentsKey, 0, 199);

    return NextResponse.json({ comment }, { status: 201 });
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}
