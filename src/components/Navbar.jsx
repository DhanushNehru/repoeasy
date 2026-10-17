import React, { useState } from 'react';
import { Sparkles, PlusCircle, Bookmark, LogOut, ChevronDown, CheckCircle2, UserCheck } from 'lucide-react';
import GithubIcon from './GithubIcon.jsx';

export default function Navbar({
  user,
  bookmarkCount = 0,
  onOpenSubmit,
  onOpenBookmarks,
  onDemoLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authDropdown, setAuthDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                RepoEasy
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Contributor-First Open Source Index
            </p>
          </div>
        </a>

        {/* Center / Stats Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Ranked by Real PR Merge Rates & Maintainer Reply Times</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Submit Repo CTA */}
          <button
            onClick={onOpenSubmit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Submit Repo</span>
            <span className="sm:hidden">Submit</span>
          </button>

          {/* Bookmarks Pill */}
          {user && (
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
              title="View Contributor Watchlist"
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Watchlist</span>
              {bookmarkCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {bookmarkCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || 'https://github.com/ghost.png'}
                  alt={user.username}
                  className="w-7 h-7 rounded-lg ring-1 ring-emerald-500/40 object-cover"
                />
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                  {user.displayName || user.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-semibold text-white">{user.displayName}</p>
                    <p className="text-xs text-slate-400">@{user.username}</p>
                  </div>
                  <button
                    onClick={onOpenBookmarks}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    Contributor Watchlist
                  </button>
                  <a
                    href={user.profileUrl || `https://github.com/${user.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    <GithubIcon className="w-4 h-4 text-slate-400" />
                    GitHub Profile
                  </a>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setAuthDropdown(!authDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white shadow-sm transition-colors cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>Sign In with GitHub</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {authDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2.5 z-50 text-sm"
                  onClick={() => setAuthDropdown(false)}
                >
                  <a
                    href="/api/auth/github/login"
                    className="flex items-center gap-3 p-2.5 rounded-xl text-white bg-slate-800 hover:bg-slate-700 font-medium transition-colors mb-2"
                  >
                    <GithubIcon className="w-5 h-5 text-white" />
                    <div>
                      <div className="font-semibold">GitHub OAuth</div>
                      <div className="text-xs text-slate-400">Sign in with official credentials</div>
                    </div>
                  </a>

                  <button
                    onClick={() => onDemoLogin('DhanushNehru')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-slate-200 hover:bg-slate-800 font-medium transition-colors text-left cursor-pointer border border-emerald-500/20 bg-emerald-500/5"
                  >
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-emerald-300">1-Click Contributor Sign-in</div>
                      <div className="text-xs text-slate-400">Instant test login as @DhanushNehru</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
