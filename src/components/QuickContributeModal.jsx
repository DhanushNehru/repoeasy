import React, { useState } from 'react';
import {
  X,
  Rocket,
  GitPullRequest,
  Clock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  FileText,
  Sparkles,
} from 'lucide-react';
import { formatHours } from '../utils/formatters.js';

export default function QuickContributeModal({ repo, onClose }) {
  const [copiedClone, setCopiedClone] = useState(false);

  if (!repo) return null;

  const cloneCommand = `git clone https://github.com/${repo.fullName}.git && cd ${repo.name}`;
  const codespacesUrl = `https://github.com/codespaces/new?hide_repo_select=true&repo=${repo.fullName}`;
  const gitpodUrl = `https://gitpod.io/#https://github.com/${repo.fullName}`;
  const contributingUrl = `https://github.com/${repo.fullName}/blob/main/CONTRIBUTING.md`;

  const copyCloneCmd = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Rocket className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Quick Contribute: {repo.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Verified Maintainer Acceptance · EasyScore™ {repo.easyScore}/100
            </p>
          </div>
        </div>

        {/* Maintainer Telemetry Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6">
          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
              PR Merge Rate
            </span>
            <div className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
              {repo.metrics?.outsidePrMergeRate || 80}%
            </div>
            <span className="text-[10px] text-slate-500">Outside PRs merged</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Median Reply Time
            </span>
            <div className="text-base sm:text-lg font-bold text-cyan-400 mt-0.5">
              {formatHours(repo.metrics?.medianResponseTimeHours || 4)}
            </div>
            <span className="text-[10px] text-slate-500">Fast review feedback</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Starter Issues
            </span>
            <div className="text-base sm:text-lg font-bold text-indigo-400 mt-0.5">
              {repo.metrics?.goodFirstIssuesCount || 0} Open
            </div>
            <span className="text-[10px] text-slate-500">Available to tackle</span>
          </div>
        </div>

        {/* 1-Click Cloud Launchers */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            1-Click Development Workspaces
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={codespacesUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">GitHub Codespaces</div>
                  <div className="text-[11px] text-slate-400">Launch in browser instant container</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </a>

            <a
              href={gitpodUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white">Gitpod Cloud Dev</div>
                  <div className="text-[11px] text-slate-400">Pre-built automated dev workspace</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Clone Snippet */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Local Setup
          </label>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 font-mono text-xs border border-slate-800">
            <span className="text-emerald-400 truncate mr-2">{cloneCommand}</span>
            <button
              onClick={copyCloneCmd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              {copiedClone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Good First Issues List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Open Good First Issues ({repo.goodFirstIssues?.length || 0})
            </label>
            <a
              href={`${repo.url}/issues?q=is%3Aissue+is%3Aopen+label%3A"good+first+issue"`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              View all on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(repo.goodFirstIssues || []).map((issue, idx) => (
              <a
                key={idx}
                href={issue.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    #{issue.number} {issue.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(issue.labels || []).slice(0, 3).map((lbl, lIdx) => (
                      <span
                        key={lIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg shrink-0">
                  Claim Issue →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Guidelines / Tips Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <a
            href={contributingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Read CONTRIBUTING.md Guidelines</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
