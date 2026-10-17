import React, { useState } from 'react';
import { X, Code2, Copy, Check } from 'lucide-react';

export default function BadgeModal({ repo, onClose }) {
  const [style, setStyle] = useState('welcoming');
  const [format, setFormat] = useState('markdown');
  const [copied, setCopied] = useState(false);

  if (!repo) return null;

  const origin = window.location.origin;
  const badgeUrl = `${origin}/api/badges/${repo.fullName}.svg?style=${style}`;
  const repoPageUrl = `${origin}/?repo=${repo.fullName}`;

  let codeSnippet = '';
  if (format === 'markdown') {
    codeSnippet = `[![RepoEasy Welcoming Badge](${badgeUrl})](${repoPageUrl})`;
  } else if (format === 'html') {
    codeSnippet = `<a href="${repoPageUrl}"><img src="${badgeUrl}" alt="RepoEasy Contributor Welcoming Badge" /></a>`;
  } else {
    // asciidoc
    codeSnippet = `image:${badgeUrl}["RepoEasy Welcoming Badge", link="${repoPageUrl}"]`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Code2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Embed RepoEasy Badge
            </h2>
            <p className="text-xs text-slate-400">
              Display your contributor-welcoming score in your GitHub README
            </p>
          </div>
        </div>

        {/* Live Badge Preview */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center mb-6">
          <span className="text-[11px] font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Live Badge Preview
          </span>
          <img src={badgeUrl} alt="Badge Preview" className="h-6" />
        </div>

        {/* Badge Style Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Badge Metric</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'welcoming', label: 'PR Merge Rate' },
              { id: 'easyscore', label: 'EasyScore™' },
              { id: 'reply', label: 'Reply Speed' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStyle(opt.id)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  style === opt.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Format Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Code Format</label>
          <div className="flex gap-2">
            {['markdown', 'html', 'asciidoc'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  format === fmt
                    ? 'bg-slate-700 border-slate-600 text-white font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Snippet Box */}
        <div className="mb-6">
          <div className="relative">
            <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all pr-12">
              {codeSnippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Copy code snippet"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
