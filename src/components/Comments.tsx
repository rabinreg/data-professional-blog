'use client';

import { useEffect, useRef } from 'react';

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', 'rabinreg/data-professional-blog');
    script.setAttribute('issue-term', slug);
    script.setAttribute('label', 'blog-comment');
    script.setAttribute('theme', 'github-light');
    script.setAttribute('reactions-enabled', '1');

    containerRef.current.appendChild(script);
  }, [slug]);

  return <div ref={containerRef} className="mt-4" />;
}
