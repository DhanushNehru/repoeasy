import React from 'react';
import { RotateCcw, Check } from 'lucide-react';

const selectClass =
  'h-9 bg-white/4 hover:bg-white/6 border border-white/8 rounded-full pl-3.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer transition-colors';

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
    { id: 'easyScore', label: 'EasyScore' },
    { id: 'mergeRate', label: 'Merge rate' },
    { id: 'replyTime', label: 'Fastest reply' },
    { id: 'commits', label: 'Velocity' },
    { id: 'goodFirstIssues', label: 'Starter issues' },
    { id: 'stars', label: 'Stars' },
  ];

  const hasActiveFilters =
    language !== 'all' ||
    category !== 'all' ||
    minMergeRate !== 'all' ||
    maxReplyHours !== 'all' ||
    hasGoodFirstIssues;

  return (
    <div id="directory" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">Directory</h2>
          <p className="mt-2 text-sm text-slate-500">
            <span className="text-white font-medium tabular-nums">{totalResults}</span> welcoming repositories
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset filters
          </button>
        )}
      </div>

      <div className="py-1">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Sort: segmented control */}
          <div className="flex items-center p-1 rounded-full surface overflow-x-auto scrollbar-none max-w-full self-start">
            {sortTabs.map((tab) => {
              const active = sort === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSortChange(tab.id)}
                  className={`h-8 px-3.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select value={language} onChange={(e) => onLanguageChange(e.target.value)} className={selectClass} aria-label="Language">
              <option value="all">All languages</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Rust">Rust</option>
              <option value="Go">Go</option>
              <option value="C++">C++</option>
            </select>

            <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass} aria-label="Ecosystem">
              <option value="all">All ecosystems</option>
              <option value="Frontend & UI">Frontend & UI</option>
              <option value="Backend & APIs">Backend & APIs</option>
              <option value="CLI & DevTools">CLI & DevTools</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Education & Learning">Education</option>
            </select>

            <select value={minMergeRate} onChange={(e) => onMinMergeRateChange(e.target.value)} className={selectClass} aria-label="Minimum merge rate">
              <option value="all">Any merge rate</option>
              <option value="90">≥ 90% merged</option>
              <option value="80">≥ 80% merged</option>
              <option value="70">≥ 70% merged</option>
              <option value="50">≥ 50% merged</option>
            </select>

            <select value={maxReplyHours} onChange={(e) => onMaxReplyHoursChange(e.target.value)} className={selectClass} aria-label="Maximum reply time">
              <option value="all">Any reply time</option>
              <option value="4">Reply &lt; 4h</option>
              <option value="12">Reply &lt; 12h</option>
              <option value="24">Reply &lt; 24h</option>
              <option value="72">Reply &lt; 3 days</option>
            </select>

            <button
              onClick={onToggleGoodFirstIssues}
              className={`h-9 shrink-0 flex items-center gap-1.5 px-3.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                hasGoodFirstIssues
                  ? 'bg-accent/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-white/4 border-white/8 text-slate-300 hover:bg-white/6'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                  hasGoodFirstIssues ? 'bg-accent border-transparent' : 'border-slate-600'
                }`}
              >
                {hasGoodFirstIssues && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              Has starter issues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
