import React from 'react';
import { Search, GitPullRequest, Clock, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { formatHours } from '../utils/formatters.js';

export default function HeroBanner({
  stats,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onSelectLanguage,
}) {
  const languages = ['all', 'TypeScript', 'Rust', 'Go', 'Python'];

  return (
    <div className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-indigo-600/15 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative text-center max-w-3xl mx-auto">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stop wasting time on ghost repos — contribute where maintainers care</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Find Open Source Repos That{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Actually Merge Your PRs
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Ranked by real outside contributor PR merge rates, maintainer triage times, and open Good First Issues. Jump straight into welcoming codebases with 1-click Codespaces & clone commands.
        </p>

        {/* Search Bar Input */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by repo name, topic, or keyword (e.g. react, fastapi, tui)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-xl text-sm sm:text-base backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 px-2 py-1 text-xs rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Language Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-400">Popular:</span>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => onSelectLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedLanguage.toLowerCase() === lang.toLowerCase()
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                }`}
              >
                {lang === 'all' ? 'All Languages' : lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Telemetry Highlights Strip */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span>Avg Outside PR Acceptance</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.avgMergeRate || 84.8}%
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-0.5">High outside success rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Median Maintainer Reply</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatHours(stats?.medianReplyHours || 4.2)}
          </div>
          <div className="text-[11px] text-cyan-400/90 mt-0.5">Fast first review triage</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Starter Issues Open</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalGoodFirstIssues || 83}+
          </div>
          <div className="text-[11px] text-indigo-400/90 mt-0.5">Unassigned Good First Issues</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Active Repositories</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.totalRepos || 10} Indexing
          </div>
          <div className="text-[11px] text-amber-400/90 mt-0.5">Analyzed & Community Ranked</div>
        </div>
      </div>
    </div>
  );
}
