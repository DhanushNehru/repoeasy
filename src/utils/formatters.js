// Utility formatters for RepoEasy UI

export function formatNumber(num) {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function formatHours(hours) {
  if (!hours && hours !== 0) return 'N/A';
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = Math.round((hours / 24) * 10) / 10;
  return `${days} days`;
}

export function getScoreBadgeColor(score) {
  if (score >= 90) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      fill: 'text-emerald-400',
      label: 'Legendary',
    };
  }
  if (score >= 80) {
    return {
      bg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      fill: 'text-teal-400',
      label: 'Welcoming',
    };
  }
  if (score >= 70) {
    return {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      fill: 'text-blue-400',
      label: 'Good',
    };
  }
  return {
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    fill: 'text-amber-400',
    label: 'Moderate',
  };
}

export function getLanguageColor(lang) {
  const map = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-emerald-500',
    Rust: 'bg-orange-500',
    Go: 'bg-cyan-500',
    'C++': 'bg-pink-500',
    C: 'bg-slate-400',
    Java: 'bg-red-500',
    Kotlin: 'bg-purple-500',
    Swift: 'bg-orange-600',
    Zig: 'bg-amber-600',
  };
  return map[lang] || 'bg-slate-400';
}
