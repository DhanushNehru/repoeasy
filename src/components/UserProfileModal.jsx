import React from 'react';
import { X, Bookmark, ExternalLink, Rocket, Trash2 } from 'lucide-react';

export default function UserProfileModal({
  user,
  bookmarks = [],
  onClose,
  onQuickContribute,
  onRemoveBookmark,
}) {
  if (!user) return null;

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

        {/* User Card */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <img
            src={user.avatarUrl || 'https://github.com/ghost.png'}
            alt={user.username}
            className="w-14 h-14 rounded-2xl ring-2 ring-emerald-500/40 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{user.displayName || user.username}</h2>
            <p className="text-xs text-slate-400">@{user.username}</p>
            <p className="text-xs text-emerald-400 font-medium mt-1">Verified Open Source Explorer</p>
          </div>
        </div>

        {/* Watchlist Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              Contributor Watchlist ({bookmarks.length})
            </h3>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-950 border border-slate-800">
              <p className="text-xs text-slate-400">No bookmarked repositories yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click the bookmark icon on any repo card to track repos you plan to contribute to!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {bookmarks.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 mr-3">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>{repo.fullName}</span>
                      <span className="text-[10px] text-emerald-400 font-normal">
                        ({repo.metrics?.outsidePrMergeRate || 80}% merge rate)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {repo.language} · {repo.metrics?.goodFirstIssuesCount || 0} starter issues
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onQuickContribute(repo);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-semibold border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Rocket className="w-3 h-3" />
                      <span>Contribute</span>
                    </button>

                    <button
                      onClick={() => onRemoveBookmark(repo)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800 text-right mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
