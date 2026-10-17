import React, { useState, useEffect, useTransition } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import FilterBar from './components/FilterBar.jsx';
import RepoCard from './components/RepoCard.jsx';
import QuickContributeModal from './components/QuickContributeModal.jsx';
import SubmitRepoModal from './components/SubmitRepoModal.jsx';
import BadgeModal from './components/BadgeModal.jsx';
import UserProfileModal from './components/UserProfileModal.jsx';
import {
  fetchRepos,
  fetchStats,
  getCurrentUser,
  demoLogin,
  logoutUser,
  toggleVote,
  toggleBookmark,
  fetchUserBookmarks,
} from './services/api.js';
import GithubIcon from './components/GithubIcon.jsx';
import { Heart, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('easyScore');
  const [language, setLanguage] = useState('all');
  const [category, setCategory] = useState('all');
  const [minMergeRate, setMinMergeRate] = useState('all');
  const [maxReplyHours, setMaxReplyHours] = useState('all');
  const [hasGoodFirstIssues, setHasGoodFirstIssues] = useState(false);

  // Modals state
  const [activeModalRepo, setActiveModalRepo] = useState(null); // for QuickContribute
  const [badgeModalRepo, setBadgeModalRepo] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial Load
  useEffect(() => {
    loadUser();
    loadStats();
  }, []);

  // Fetch repos whenever filter parameters change
  useEffect(() => {
    loadRepos();
  }, [searchQuery, sort, language, category, minMergeRate, maxReplyHours, hasGoodFirstIssues]);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      if (data.authenticated) {
        setUser(data.user);
        loadBookmarks();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  };

  const loadBookmarks = async () => {
    try {
      const data = await fetchUserBookmarks();
      if (data.success) {
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.warn('Failed to load bookmarks:', err);
    }
  };

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRepos({
        search: searchQuery,
        sort,
        language,
        category,
        minMergeRate,
        maxReplyHours,
        hasGoodFirstIssues: hasGoodFirstIssues ? 'true' : undefined,
      });
      if (data.success) {
        setRepos(data.repos);
      }
    } catch (err) {
      setError('Could not connect to directory server. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (username = 'DhanushNehru') => {
    try {
      const data = await demoLogin(username);
      if (data.success) {
        setUser(data.user);
        loadBookmarks();
        loadRepos();
        showToast(`Signed in as @${data.user.username}! Welcome to RepoEasy.`);
      }
    } catch (err) {
      showToast('Login failed: ' + err.message, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setBookmarks([]);
      loadRepos();
      showToast('Signed out successfully.');
    } catch (err) {
      showToast('Logout failed: ' + err.message, 'error');
    }
  };

  const handleVote = async (targetRepo) => {
    if (!user) {
      showToast('Please sign in with GitHub to upvote repositories.', 'error');
      return;
    }

    // Optimistic UI update
    const prevVoted = targetRepo.isVoted;
    const delta = prevVoted ? -1 : 1;

    setRepos((prev) =>
      prev.map((r) =>
        r.id === targetRepo.id
          ? { ...r, isVoted: !prevVoted, upvotes: Math.max(0, (r.upvotes || 0) + delta) }
          : r
      )
    );

    try {
      const res = await toggleVote(targetRepo.owner, targetRepo.name);
      showToast(res.voted ? `Upvoted ${targetRepo.fullName}!` : `Removed upvote.`);
    } catch (err) {
      // Revert on error
      setRepos((prev) =>
        prev.map((r) =>
          r.id === targetRepo.id
            ? { ...r, isVoted: prevVoted, upvotes: Math.max(0, (r.upvotes || 0) - delta) }
            : r
        )
      );
      showToast(err.message, 'error');
    }
  };

  const handleBookmark = async (targetRepo) => {
    if (!user) {
      showToast('Please sign in with GitHub to save bookmarks.', 'error');
      return;
    }

    const prevBookmarked = targetRepo.isBookmarked;
    setRepos((prev) =>
      prev.map((r) =>
        r.id === targetRepo.id ? { ...r, isBookmarked: !prevBookmarked } : r
      )
    );

    try {
      const res = await toggleBookmark(targetRepo.owner, targetRepo.name);
      if (res.bookmarked) {
        setBookmarks((prev) => [...prev, targetRepo]);
        showToast(`Saved ${targetRepo.fullName} to your Contributor Watchlist!`);
      } else {
        setBookmarks((prev) => prev.filter((b) => b.id !== targetRepo.id));
        showToast(`Removed from Watchlist.`);
      }
    } catch (err) {
      setRepos((prev) =>
        prev.map((r) =>
          r.id === targetRepo.id ? { ...r, isBookmarked: prevBookmarked } : r
        )
      );
      showToast(err.message, 'error');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSort('easyScore');
    setLanguage('all');
    setCategory('all');
    setMinMergeRate('all');
    setMaxReplyHours('all');
    setHasGoodFirstIssues(false);
  };

  const handleRepoSubmitted = (newRepo) => {
    setRepos((prev) => [newRepo, ...prev.filter((r) => r.id !== newRepo.id)]);
    loadStats();
    showToast(`Indexed ${newRepo.fullName} into directory!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs sm:text-sm font-medium text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        user={user}
        bookmarkCount={bookmarks.length}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onDemoLogin={handleDemoLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner
          stats={stats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={language}
          onSelectLanguage={setLanguage}
        />

        {/* Filters and Sorting */}
        <FilterBar
          sort={sort}
          onSortChange={setSort}
          language={language}
          onLanguageChange={setLanguage}
          category={category}
          onCategoryChange={setCategory}
          minMergeRate={minMergeRate}
          onMinMergeRateChange={setMinMergeRate}
          maxReplyHours={maxReplyHours}
          onMaxReplyHoursChange={setMaxReplyHours}
          hasGoodFirstIssues={hasGoodFirstIssues}
          onToggleGoodFirstIssues={() => setHasGoodFirstIssues(!hasGoodFirstIssues)}
          onResetFilters={handleResetFilters}
          totalResults={repos.length}
        />

        {/* Repositories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
              <p className="text-sm font-medium">Analyzing repositories & response metrics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/50 border border-slate-800 max-w-lg mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-semibold mb-1">Failed to load repositories</p>
              <p className="text-xs text-slate-500 mb-4">{error}</p>
              <button
                onClick={loadRepos}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No repositories matched your criteria</h3>
              <p className="text-xs text-slate-400 mb-6">
                Try widening your merge rate threshold or clearing language filters. Or submit a new repo!
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsSubmitOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-slate-950 cursor-pointer"
                >
                  Submit a Repo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onQuickContribute={(r) => setActiveModalRepo(r)}
                  onVote={handleVote}
                  onBookmark={handleBookmark}
                  onOpenBadgeModal={(r) => setBadgeModalRepo(r)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {activeModalRepo && (
        <QuickContributeModal
          repo={activeModalRepo}
          onClose={() => setActiveModalRepo(null)}
        />
      )}

      {isSubmitOpen && (
        <SubmitRepoModal
          onClose={() => setIsSubmitOpen(false)}
          onRepoSubmitted={handleRepoSubmitted}
        />
      )}

      {badgeModalRepo && (
        <BadgeModal
          repo={badgeModalRepo}
          onClose={() => setBadgeModalRepo(null)}
        />
      )}

      {isBookmarksOpen && (
        <UserProfileModal
          user={user}
          bookmarks={bookmarks}
          onClose={() => setIsBookmarksOpen(false)}
          onQuickContribute={(r) => setActiveModalRepo(r)}
          onRemoveBookmark={handleBookmark}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">RepoEasy</span>
            <span>— The open-source contributor intelligence directory</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/DhanushNehru"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Created by Dhanush Nehru</span>
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="https://github.com/DhanushNehru/RepoEasy"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
