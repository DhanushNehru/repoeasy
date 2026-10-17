import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Loader2,
  GitPullRequest,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { analyzeRepo, submitRepo } from '../services/api.js';
import { formatHours, getScoreBadgeColor } from '../utils/formatters.js';

export default function SubmitRepoModal({ onClose, onRepoSubmitted }) {
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!repoInput.trim()) return;

    setError(null);
    setPreview(null);
    setAnalyzing(true);

    try {
      const data = await analyzeRepo(repoInput.trim());
      setPreview(data.telemetry);
    } catch (err) {
      setError(err.message || 'Failed to analyze repository. Check the URL and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!repoInput.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const data = await submitRepo(repoInput.trim());
      setSuccessMsg(`Successfully indexed ${data.repo.fullName}!`);
      setTimeout(() => {
        onRepoSubmitted(data.repo);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit repository');
    } finally {
      setLoading(false);
    }
  };

  const scoreBadge = preview ? getScoreBadgeColor(preview.easyScore) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white">
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
            <PlusCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Submit an Open Source Repo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Live GitHub PR telemetry & maintainer responsiveness analysis
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              GitHub Repository URL or Shorthand
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="e.g. facebook/react or https://github.com/astral-sh/uv"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                required
              />
              <button
                type="submit"
                disabled={analyzing || !repoInput.trim()}
                className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              RepoEasy will inspect the last 60+ pull requests, review response timestamps, and open starter issues.
            </p>
          </div>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Analysis Preview Card */}
        {preview && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>{preview.fullName}</span>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-emerald-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{preview.description}</p>
              </div>

              {scoreBadge && (
                <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${scoreBadge.bg}`}>
                  EasyScore {preview.easyScore}
                </div>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400">PR Merge Rate</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {preview.metrics?.outsidePrMergeRate || 0}%
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Median Reply</span>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">
                  {formatHours(preview.metrics?.medianResponseTimeHours || 0)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Starter Issues</span>
                <div className="text-sm font-bold text-indigo-400 mt-0.5">
                  {preview.metrics?.goodFirstIssuesCount || 0} Open
                </div>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="flex flex-wrap gap-1.5">
              {(preview.badges || []).map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* Confirm Submit Button */}
            <button
              onClick={handleConfirmSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding to Directory...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Add to Directory</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
