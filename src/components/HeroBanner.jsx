import React from 'react';
import { Search, ArrowRight, ArrowDown, X } from 'lucide-react';
import { formatHours } from '../utils/formatters.js';
import GithubIcon from './GithubIcon.jsx';
import { GITHUB_LOGIN_URL } from './Navbar.jsx';

const SIGNALS = [
  {
    step: '01',
    title: 'Outside PR merge rate',
    body: 'We separate maintainer PRs from outside contributions, so self-merges never inflate the score.',
  },
  {
    step: '02',
    title: 'Maintainer reply time',
    body: 'Median hours from opening a PR to the first human review. No more waiting on ghost repos.',
  },
  {
    step: '03',
    title: 'Ready-to-claim issues',
    body: 'Unassigned good first issues plus onboarding health: CONTRIBUTING, templates, code of conduct.',
  },
];

export default function HeroBanner({
  user,
  stats,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onSelectLanguage,
}) {
  const languages = ['all', 'TypeScript', 'Rust', 'Go', 'Python'];

  const metrics = [
    { value: `${stats?.avgMergeRate ?? 84.8}%`, label: 'Avg. outside PR acceptance' },
    { value: formatHours(stats?.medianReplyHours ?? 4.2), label: 'Median maintainer reply' },
    { value: `${stats?.totalGoodFirstIssues ?? 83}+`, label: 'Open starter issues' },
    { value: stats?.totalRepos ?? 10, label: 'Repositories ranked' },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="absolute inset-x-0 -top-40 h-[640px] hero-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <a
            href="#how-it-works"
            className="animate-fade-up inline-flex items-center gap-2 h-8 pl-1 pr-3 rounded-full surface text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span className="h-6 px-2.5 rounded-full bg-accent text-white font-medium flex items-center">New</span>
            Ranked by real merge rates, not stars
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <h1
            className="animate-fade-up mt-7 font-display font-semibold tracking-[-0.045em] leading-[0.95] text-5xl sm:text-7xl lg:text-[88px] text-headline"
            style={{ animationDelay: '60ms' }}
          >
            Contribute where
            <br />
            you're <span className="text-accent-gradient">actually welcome.</span>
          </h1>

          <p
            className="animate-fade-up mt-7 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
            style={{ animationDelay: '120ms' }}
          >
            RepoEasy ranks open-source projects by how often they merge outside PRs and how fast maintainers
            reply, so your first contribution lands instead of rotting in a queue.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            {user ? (
              <a
                href="#directory"
                className="h-12 px-6 rounded-full bg-white text-black text-sm font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors"
              >
                Welcome back, @{user.username}
                <ArrowDown className="w-4 h-4" />
              </a>
            ) : (
              <a
                href={GITHUB_LOGIN_URL}
                className="h-12 px-6 rounded-full bg-white text-black text-sm font-medium flex items-center gap-2.5 hover:bg-slate-200 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_-8px_rgba(0,153,255,0.6)]"
              >
                <GithubIcon className="w-[18px] h-[18px]" />
                Continue with GitHub
              </a>
            )}
            <a
              href="#directory"
              className="h-12 px-6 rounded-full surface text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              Browse repositories
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Search */}
          <div className="animate-fade-up mt-14 max-w-2xl mx-auto" style={{ animationDelay: '240ms' }}>
            <div className="relative group">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-400/40 via-white/10 to-violet-400/40 opacity-0 group-focus-within:opacity-100 transition-opacity blur-[1px]" />
              <div className="relative flex items-center rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
                <Search className="w-5 h-5 ml-4 text-slate-500 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search repos, topics or keywords — react, fastapi, tui…"
                  className="w-full bg-transparent px-3 py-4 text-[15px] text-white placeholder-slate-500 focus:outline-none"
                  style={{ outline: 'none' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="mr-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-xs">
              {languages.map((lang) => {
                const active = selectedLanguage.toLowerCase() === lang.toLowerCase();
                return (
                  <button
                    key={lang}
                    onClick={() => onSelectLanguage(lang)}
                    className={`h-7 px-3 rounded-full font-medium transition-colors cursor-pointer ${
                      active ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang === 'all' ? 'All languages' : lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 rounded-2xl surface overflow-hidden max-w-5xl mx-auto">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`px-6 py-6 ${i % 2 === 1 ? 'border-l border-white/6' : ''} ${
                i >= 2 ? 'border-t lg:border-t-0 border-white/6' : ''
              } ${i === 2 ? 'lg:border-l' : ''}`}
            >
              <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white tabular-nums">
                {m.value}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div id="how-it-works" className="scroll-mt-24 mt-24 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">EasyScore™</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Three signals. One honest score.
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Computed from live GitHub telemetry, weighted 0–100 and refreshed whenever a repo is analyzed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {SIGNALS.map((s) => (
              <div key={s.step} className="rounded-2xl surface p-6">
                <span className="font-mono text-xs text-slate-600">{s.step}</span>
                <h3 className="mt-6 text-base font-medium text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
