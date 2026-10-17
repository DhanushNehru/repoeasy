import React from 'react';
import { SlidersHorizontal, Sparkles, GitPullRequest, Clock, Flame, CheckCircle2, Star, RotateCcw } from 'lucide-react';

export default function FilterBar({
  sort,
  onSortChange,
  language,
  onLanguageChange,
  category,
  onCategoryChange,
  minMergeRate,
  onMinMergeRateChange,
  maxReplyHours,
  onMaxReplyHoursChange,
  hasGoodFirstIssues,
  onToggleGoodFirstIssues,
  onResetFilters,
  totalResults = 0,
}) {
  const sortTabs = [
    { id: 'easyScore', label: 'EasyScore™', icon: Sparkles },
    { id: 'mergeRate', label: 'PR Merge Rate', icon: GitPullRequest },
    { id: 'replyTime', label: 'Fastest Reply', icon: Clock },
    { id: 'commits', label: 'Velocity', icon: Flame },
    { id: 'goodFirstIssues', label: 'Starter Issues', icon: CheckCircle2 },
    { id: 'stars', label: 'Stars', icon: Star },
  ];

  const hasActiveFilters =
    language !== 'all' ||
    category !== 'all' ||
    minMergeRate !== 'all' ||
    maxReplyHours !== 'all' ||
    hasGoodFirstIssues;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
        {/* Top: Ranking Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              Rank By:
            </span>
            {sortTabs.map((tab) => {
              const Icon = tab.icon;
              const active = sort === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSortChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium shrink-0 flex items-center justify-between sm:justify-end gap-3">
            <span>
              Showing <strong className="text-emerald-400">{totalResults}</strong> welcoming repositories
            </span>
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom: Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-4">
          {/* Language */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Rust">Rust</option>
              <option value="Go">Go</option>
              <option value="C++">C++</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ecosystem</label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Frontend & UI">Frontend & UI</option>
              <option value="Backend & APIs">Backend & APIs</option>
              <option value="CLI & DevTools">CLI & DevTools</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Education & Learning">Education</option>
            </select>
          </div>

          {/* Min PR Merge Rate */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Merge Rate</label>
            <select
              value={minMergeRate}
              onChange={(e) => onMinMergeRateChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Any Rate</option>
              <option value="90">≥ 90% (Outstanding)</option>
              <option value="80">≥ 80% (High Acceptance)</option>
              <option value="70">≥ 70% (Welcoming)</option>
              <option value="50">≥ 50% (Active)</option>
            </select>
          </div>

          {/* Maintainer Response Time */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Reply Time</label>
            <select
              value={maxReplyHours}
              onChange={(e) => onMaxReplyHoursChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Any Time</option>
              <option value="4">Under 4 hours ⚡</option>
              <option value="12">Under 12 hours</option>
              <option value="24">Under 24 hours</option>
              <option value="72">Under 3 days</option>
            </select>
          </div>

          {/* Good First Issues Toggle */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end">
            <button
              onClick={onToggleGoodFirstIssues}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                hasGoodFirstIssues
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasGoodFirstIssues ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Has Starter Issues</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
