'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface CommentsProps {
  slug: string;
}

type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export default function Comments({ slug }: CommentsProps) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [liked, setLiked] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setError('');
        setLiked(localStorage.getItem(`liked:${slug}`) === '1');
        const res = await fetch(`/api/posts/${slug}/engagement`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? 'Failed to load engagement data.');
        }

        if (!isMounted) return;
        setLikes(data.likes ?? 0);
        setComments(data.comments ?? []);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load engagement data.');
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  async function handleLike() {
    if (liked || isSubmittingLike) return;

    try {
      setIsSubmittingLike(true);
      setError('');

      const res = await fetch(`/api/posts/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to submit like.');
      }

      setLikes(data.likes ?? likes + 1);
      localStorage.setItem(`liked:${slug}`, '1');
      setLiked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit like.');
    } finally {
      setIsSubmittingLike(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      setError('');

      const res = await fetch(`/api/posts/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          name,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to post comment.');
      }

      setComments((prev) => [data.comment as CommentItem, ...prev]);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked || isSubmittingLike}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {liked ? 'Liked' : isSubmittingLike ? 'Liking...' : 'Like this article'}
        </button>
        <span className="text-sm text-gray-500">{likes} likes</span>
      </div>

      <form onSubmit={handleCommentSubmit} className="space-y-3 rounded-xl border border-gray-200 p-4 bg-white">
        <h3 className="text-sm font-semibold text-gray-800">Leave a comment</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={50}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your comment..."
          required
          maxLength={1000}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={isSubmittingComment}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmittingComment ? 'Posting...' : 'Post comment'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{comment.name}</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
