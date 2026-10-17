// Client API service for RepoEasy
const API_BASE = '/api';

export async function fetchRepos(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const res = await fetch(`${API_BASE}/repos?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch repositories');
  return res.json();
}

export async function fetchRepoById(owner, repo) {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`);
  if (!res.ok) throw new Error('Failed to fetch repository details');
  return res.json();
}

export async function analyzeRepo(input) {
  const res = await fetch(`${API_BASE}/repos/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to analyze repository');
  return data;
}

export async function submitRepo(input) {
  const res = await fetch(`${API_BASE}/repos/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit repository');
  return data;
}

export async function toggleVote(owner, repo) {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/vote`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update vote');
  return data;
}

export async function toggleBookmark(owner, repo) {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/bookmark`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update bookmark');
  return data;
}

export async function fetchUserBookmarks() {
  const res = await fetch(`${API_BASE}/repos/user/bookmarks`);
  if (!res.ok) throw new Error('Failed to fetch bookmarks');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/repos/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function demoLogin(username = 'DhanushNehru') {
  const res = await fetch(`${API_BASE}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to demo login');
  return data;
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
  });
  return res.json();
}
