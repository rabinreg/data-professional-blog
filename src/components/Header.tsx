import Link from 'next/link';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="Data Professional">
      {/* Icon mark: stacked bar chart representing data */}
      <div className="flex items-end gap-[3px] h-7">
        <span className="w-[5px] h-3 rounded-sm bg-violet-400 group-hover:bg-violet-500 transition-colors" />
        <span className="w-[5px] h-5 rounded-sm bg-violet-600 group-hover:bg-violet-700 transition-colors" />
        <span className="w-[5px] h-7 rounded-sm bg-violet-800 group-hover:bg-violet-900 transition-colors" />
        <span className="w-[5px] h-4 rounded-sm bg-violet-500 group-hover:bg-violet-600 transition-colors" />
      </div>
      {/* Wordmark */}
      <span className="text-[1.15rem] font-bold tracking-tight">
        <span className="text-violet-700">Data</span>
        <span className="text-gray-800"> Professional</span>
      </span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/70 shadow-sm">
      <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <Link href="/" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors">Articles</Link>
          <Link href="/tags" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors">Topics</Link>
          <Link href="/about" className="px-3 py-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors">About</Link>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <a
            href="https://linkedin.com/in/rabinreg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a
            href="https://github.com/rabinreg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
