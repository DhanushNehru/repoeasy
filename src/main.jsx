import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Sparkles, GitPullRequest, Clock, CheckCircle2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center gap-3">
      <Sparkles className="w-6 h-6 text-emerald-400" />
      <span className="text-xl font-semibold">RepoEasy Icons Test</span>
      <GitPullRequest className="w-5 h-5 text-indigo-400" />
      <Clock className="w-5 h-5 text-amber-400" />
      <CheckCircle2 className="w-5 h-5 text-green-400" />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
