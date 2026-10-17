import React from 'react';
import { Star, GitFork, ArrowUpRight, ThumbsUp, Bookmark, Code2 } from 'lucide-react';
import { formatNumber, formatHours, getScoreBadgeColor, getLanguageColor } from '../utils/formatters.js';

function ScoreRing({ score }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score || 0)) / 100;
  const color = score >= 90 ? '#3fb0ff' : score >= 80 ? '#6cc2ff' : score >= 70 ? '#a39bff' : '#f5b04c';

  return (
    <div className="relative w-14 h-14 shrink-0" title="EasyScore™: contributor friendliness index">
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[15px] font-semibold text-white tabular-nums">
        {score}
      </span>
    </div>
  );
}

function Metric({ label, value, hint, children }) {
  return (
    <div className="p-4">
      <div className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-white tabular-nums">{value}</div>
      {children}
      <div className="mt-1.5 text-[11px] text-slate-500">{hint}</div>
    </div>
  );
}

export default function RepoCard({
  repo,
  onQuickContribute,
  onVote,
  onBookmark,
  onOpenBadgeModal,
}) {
  const scoreBadge = getScoreBadgeColor(repo.easyScore);
  const langColor = getLanguageColor(repo.language);
  const mergeRate = Math.round((repo.metrics?.outsidePrMergeRate || 0) * 10) / 10;
  const replyTime = repo.metrics?.medianResponseTimeHours || 0;
  const gfiCount = repo.metrics?.goodFirstIssuesCount || 0;

  const replyHint = replyTime <= 4.5 ? 'Lightning-fast reviews' : replyTime <= 24 ? 'Within a day' : 'Regular review cycle';
  const iconButton = (active) =>
    `h-9 flex items-center justify-center gap-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
      active
        ? 'bg-accent/15 border-emerald-500/40 text-emerald-300'
        : 'bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8'
    }`;

  return (
    <article className="group relative rounded-3xl surface p-6 flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_24px_60px_-24px_rgba(0,153,255,0.25)]">
      {/* Top hairline highlight on hover */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <img
            src={`https://github.com/${repo.owner}.png`}
            alt={repo.owner}
            className="w-11 h-11 rounded-xl bg-slate-800 ring-1 ring-white/10 object-cover shrink-0"
            onError={(e) => {
              e.target.src = 'https://github.com/github.png';
            }}
          />
          <div className="min-w-0">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-base font-medium text-white hover:text-emerald-300 transition-colors max-w-full"
            >
              <span className="truncate">
                <span className="text-slate-500">{repo.owner}/</span>
                {repo.name || repo.fullName?.split('/')[1]}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
            <div className="mt-1.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${langColor}`} />
                {repo.language}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {formatNumber(repo.stars)}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" />
                {formatNumber(repo.forks)}
              </span>
              {repo.category && <span className="hidden sm:inline text-slate-600">· {repo.category}</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <ScoreRing score={repo.easyScore} />
          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{scoreBadge.label}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-2">{repo.description}</p>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 rounded-2xl bg-black/40 border border-white/6 divide-x divide-white/6">
        <Metric
          label="Outside PRs merged"
          value={`${mergeRate}%`}
          hint={`${repo.metrics?.mergedOutsidePrs || 0} of ${repo.metrics?.totalOutsidePrsSampled || 0} sampled PRs`}
        >
          <div className="mt-2.5 h-1 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(4, mergeRate))}%` }}
            />
          </div>
        </Metric>
        <Metric label="Median reply" value={formatHours(replyTime)} hint={replyHint}>
          <div className="mt-2.5 flex gap-1">
            {[4.5, 12, 24, 72].map((threshold) => (
              <span
                key={threshold}
                className={`h-1 flex-1 rounded-full ${replyTime <= threshold ? 'bg-emerald-400' : 'bg-white/8'}`}
              />
            ))}
          </div>
        </Metric>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {gfiCount > 0 && (
          <span className="h-6 px-2.5 rounded-full text-[11px] font-medium bg-accent/12 text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {gfiCount} good first issues
          </span>
        )}
        {(repo.badges || []).slice(0, 3).map((badge, idx) => (
          <span
            key={idx}
            className="h-6 px-2.5 rounded-full text-[11px] text-slate-400 border border-white/8 flex items-center"
            title={badge.desc}
          >
            {badge.label}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-auto pt-6 flex items-center gap-2">
        <button
          onClick={() => onQuickContribute(repo)}
          className="flex-1 h-10 rounded-full bg-white text-black text-sm font-medium hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          Start contributing
          <ArrowUpRight className="w-4 h-4" />
        </button>
        <button onClick={() => onVote(repo)} className={`${iconButton(repo.isVoted)} px-3.5 h-10`} title="Upvote repository">
          <ThumbsUp className={`w-3.5 h-3.5 ${repo.isVoted ? 'fill-current' : ''}`} />
          <span className="tabular-nums">{repo.upvotes || 0}</span>
        </button>
        <button
          onClick={() => onBookmark(repo)}
          className={`${iconButton(repo.isBookmarked)} w-10 h-10`}
          title={repo.isBookmarked ? 'Remove from Watchlist' : 'Add to Contributor Watchlist'}
        >
          <Bookmark className={`w-4 h-4 ${repo.isBookmarked ? 'fill-current' : ''}`} />
        </button>
        <button onClick={() => onOpenBadgeModal(repo)} className={`${iconButton(false)} w-10 h-10`} title="Get embeddable README badge">
          <Code2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
