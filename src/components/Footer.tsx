export default function Footer() {
  return (
    <footer className="border-t border-gray-200/70 mt-24 py-10 bg-white">
      <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <div className="flex items-end gap-[3px] h-5">
            <span className="w-[4px] h-2 rounded-sm bg-violet-300" />
            <span className="w-[4px] h-3.5 rounded-sm bg-violet-500" />
            <span className="w-[4px] h-5 rounded-sm bg-violet-700" />
            <span className="w-[4px] h-3 rounded-sm bg-violet-400" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            <span className="text-violet-700">Data</span> Professional
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400 text-center">© 2026 Data Professional</p>

        {/* Social links */}
        <div className="flex items-center gap-5 text-sm text-gray-400 justify-center sm:justify-end">
          <a href="https://linkedin.com/in/rabinreg" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">LinkedIn</a>
          <a href="https://github.com/rabinreg" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
