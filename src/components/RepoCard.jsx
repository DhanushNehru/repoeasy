import React from 'react';
import {
  GitPullRequest,
  Clock,
  CheckCircle2,
  Flame,
  Star,
  GitFork,
  ExternalLink,
  ThumbsUp,
  Bookmark,
  Rocket,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { formatNumber, formatHours, getScoreBadgeColor, getLanguageColor } from '../utils/formatters.js';

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
  const commits30d = repo.metrics?.recentCommitsCount30d || 0;

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 sm:p-6 transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={`https://github.com/${repo.owner}.png`}
              alt={repo.owner}
              className="w-10 h-10 rounded-2xl bg-slate-800 ring-1 ring-slate-700/80 object-cover shrink-0"
              onError={(e) => {
                e.target.src = 'https://github.com/github.png';
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{repo.fullName}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {formatNumber(repo.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-slate-400" />
                  {formatNumber(repo.forks)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${langColor}`} />
                  {repo.language}
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                  {repo.category}
                </span>
              </div>
            </div>
          </div>

          {/* EasyScore Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div
              className={`px-3 py-1.5 rounded-2xl border flex items-center gap-1.5 ${scoreBadge.bg} shadow-sm`}
              title="EasyScore™: Contributor Friendliness Index"
            >
              <span className="text-xs font-semibold text-slate-400">EasyScore</span>
              <span className={`text-base font-extrabold ${scoreBadge.fill}`}>
                {repo.easyScore}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              {scoreBadge.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {repo.description}
        </p>

        {/* Telemetry Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-4">
          {/* PR Merge Rate */}
          <div className="p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                Outside PR Merge Rate
              </span>
              <span className="font-bold text-white text-xs">{mergeRate}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, mergeRate))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {repo.metrics?.mergedOutsidePrs || 0} of {repo.metrics?.totalOutsidePrsSampled || 0} PRs merged
            </span>
          </div>

          {/* Maintainer Reply Time */}
          <div className="p-2 border-l border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Median Reply Time
              </span>
              <span className="font-bold text-white text-xs">{formatHours(replyTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  replyTime <= 4.5 ? 'bg-emerald-400 animate-pulse' : replyTime <= 24 ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-[10px] text-slate-300">
                {replyTime <= 4.5 ? '⚡ Lightning fast review' : replyTime <= 24 ? 'Within 24 hours' : 'Regular review cycle'}
              </span>
            </div>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {(repo.badges || []).slice(0, 3).map((badge, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
              title={badge.desc}
            >
              {badge.label}
            </span>
          ))}
          {gfiCount > 0 && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {gfiCount} Good First Issues
            </span>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Quick Contribute Button */}
        <button
          onClick={() => onQuickContribute(repo)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Rocket className="w-4 h-4" />
          <span>Quick Contribute</span>
        </button>

        {/* Upvote Button */}
        <button
          onClick={() => onVote(repo)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            repo.isVoted
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700/80 text-slate-300'
          }`}
          title="Upvote repository"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${repo.isVoted ? 'fill-emerald-400' : ''}`} />
          <span>{repo.upvotes || 0}</span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => onBookmark(repo)}
          className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
            repo.isBookmarked
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700/80 text-slate-400 hover:text-white'
          }`}
          title={repo.isBookmarked ? 'Remove from Watchlist' : 'Add to Contributor Watchlist'}
        >
          <Bookmark className={`w-4 h-4 ${repo.isBookmarked ? 'fill-emerald-400' : ''}`} />
        </button>

        {/* Badge Generator Trigger */}
        <button
          onClick={() => onOpenBadgeModal(repo)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Get embeddable README badge"
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
