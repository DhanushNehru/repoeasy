import React, { useState } from 'react';
import { Plus, Bookmark, LogOut, ChevronDown, UserCheck, ArrowUpRight } from 'lucide-react';
import GithubIcon from './GithubIcon.jsx';

export const GITHUB_LOGIN_URL = '/api/auth/github/login';

export function BrandMark({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="re-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#66c2ff" />
          <stop offset="0.5" stopColor="#0099ff" />
          <stop offset="1" stopColor="#7b6bff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#re-mark)" />
      <path d="M10 22V10h6.2a3.8 3.8 0 0 1 0 7.6H10m6.2 0L22 22" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dropdown({ open, onClose, className = '', children }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute right-0 mt-2 z-50 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-xl p-1.5 text-sm animate-fade-up ${className}`}
        style={{ animationDuration: '0.25s' }}
        onClick={onClose}
      >
        {children}
      </div>
    </>
  );
}

export default function Navbar({
  user,
  authOptions = {},
  bookmarkCount = 0,
  onOpenSubmit,
  onOpenBookmarks,
  onDemoLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authDropdown, setAuthDropdown] = useState(false);

  const itemClass =
    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left';
  const ghostButton =
    'flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium text-slate-200 hover:text-white bg-white/4 hover:bg-white/8 border border-white/10 transition-colors cursor-pointer';

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/6 bg-black/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5 group">
            <BrandMark className="w-7 h-7 transition-transform duration-300 group-hover:-rotate-6" />
            <span className="font-display text-[17px] font-semibold tracking-tight text-white">RepoEasy</span>
          </a>

          <div className="hidden md:flex items-center gap-1 text-sm text-slate-400">
            <a href="#directory" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              Directory
            </a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-full hover:text-white transition-colors">
              How it works
            </a>
            <a
              href="https://github.com/DhanushNehru/RepoEasy"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full hover:text-white transition-colors inline-flex items-center gap-1"
            >
              GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button onClick={onOpenSubmit} className={ghostButton}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Submit repo</span>
          </button>

          {user && (
            <button onClick={onOpenBookmarks} className={ghostButton} title="View Contributor Watchlist">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist</span>
              {bookmarkCount > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold bg-accent text-white flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 h-9 pl-1 pr-1 sm:pr-3 rounded-full bg-white/4 hover:bg-white/8 border border-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatarUrl || 'https://github.com/ghost.png'}
                  alt={user.username}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">{user.username}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              </button>

              <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} className="w-60">
                <div className="px-3 py-2.5 mb-1 border-b border-white/6 flex items-center gap-3">
                  <img src={user.avatarUrl || 'https://github.com/ghost.png'} alt="" className="w-9 h-9 rounded-full" />
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{user.displayName || user.username}</p>
                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                  </div>
                </div>
                <button onClick={onOpenBookmarks} className={itemClass}>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  Contributor watchlist
                </button>
                <a
                  href={user.profileUrl || `https://github.com/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className={itemClass}
                >
                  <GithubIcon className="w-4 h-4 text-slate-500" />
                  GitHub profile
                </a>
                <div className="my-1 h-px bg-white/6" />
                <button onClick={onLogout} className={`${itemClass} hover:text-rose-300`}>
                  <LogOut className="w-4 h-4 text-slate-500" />
                  Sign out
                </button>
              </Dropdown>
            </div>
          ) : authOptions.demoLoginEnabled ? (
            <div className="relative">
              <button
                onClick={() => setAuthDropdown(!authDropdown)}
                className="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Sign in</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <Dropdown open={authDropdown} onClose={() => setAuthDropdown(false)} className="w-72">
                <a href={GITHUB_LOGIN_URL} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                    <GithubIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-medium text-white">Continue with GitHub</div>
                    <div className="text-xs text-slate-500">
                      {authOptions.githubConfigured ? 'Sign in with your GitHub account' : 'OAuth app not configured yet'}
                    </div>
                  </div>
                </a>
                <button
                  onClick={() => onDemoLogin('DhanushNehru')}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                >
                  <span className="w-9 h-9 rounded-lg bg-accent/15 text-emerald-300 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-medium text-white">Demo sign-in</div>
                    <div className="text-xs text-slate-500">Development only · @DhanushNehru</div>
                  </div>
                </button>
              </Dropdown>
            </div>
          ) : (
            <a
              href={GITHUB_LOGIN_URL}
              className="flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium bg-white text-black hover:bg-slate-200 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Sign in with GitHub</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
