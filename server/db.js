// JSON database for RepoEasy.
// On Vercel (KV_REST_API_URL / KV_REST_API_TOKEN set by the connected Upstash
// store) the whole document lives in a single Redis key. Locally it falls back
// to the original atomic file-backed store at data/db.json.
import fs from 'node:fs/promises';
import seedRepos from './seeds/repos.json' with { type: 'json' };
import { config } from './config.js';

let dbCache = null;

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
const useKv = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
const KV_KEY = 'repoeasy:db';

async function kvCommand(...args) {
  const res = await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    throw new Error(`[RepoEasy DB] KV command ${args[0]} failed with HTTP ${res.status}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(`[RepoEasy DB] KV command ${args[0]} error: ${data.error}`);
  }
  return data.result;
}

async function ensureDataDirectory() {
  await fs.mkdir(config.paths.dataDir, { recursive: true });
}

// Imported statically so the file is always bundled with the deployment;
// deep-cloned because the db mutates this array at runtime.
function loadInitialSeeds() {
  return JSON.parse(JSON.stringify(seedRepos));
}

export async function initDb() {
  if (useKv) {
    try {
      const raw = await kvCommand('GET', KV_KEY);
      if (raw) {
        dbCache = JSON.parse(raw);
        return dbCache;
      }
    } catch (err) {
      console.error('[RepoEasy DB] KV read failed, seeding a fresh document:', err.message);
    }
    dbCache = await buildInitialDb();
    try {
      await persistDb();
    } catch (err) {
      // Stay up in a degraded in-memory mode rather than failing every request.
      console.error('[RepoEasy DB] KV write failed, continuing in memory only:', err.message);
    }
    return dbCache;
  }
  await ensureDataDirectory();
  try {
    const content = await fs.readFile(config.paths.dbFile, 'utf8');
    dbCache = JSON.parse(content);
  } catch {
    // DB does not exist yet; populate with curated seed
    dbCache = await buildInitialDb();
    await persistDb();
  }
  return dbCache;
}

async function buildInitialDb() {
    const initialRepos = loadInitialSeeds();
    return {
      repos: initialRepos,
      users: [
        {
          id: 'gh_demo_contributor',
          username: 'DhanushNehru',
          displayName: 'Dhanush Nehru',
          avatarUrl: 'https://github.com/DhanushNehru.png',
          profileUrl: 'https://github.com/DhanushNehru',
          bio: 'Creator of RepoEasy & open source enthusiast',
          createdAt: new Date().toISOString()
        }
      ],
      votes: {
        'gh_demo_contributor:DhanushNehru/ironclavebot': true,
        'gh_demo_contributor:shadcn-ui/ui': true
      },
      bookmarks: {
        'gh_demo_contributor:DhanushNehru/ironclavebot': true,
        'gh_demo_contributor:rust-lang/rustlings': true
      },
      sessions: {}
    };
}

async function persistDb() {
  if (!dbCache) return;
  if (useKv) {
    await kvCommand('SET', KV_KEY, JSON.stringify(dbCache));
    return;
  }
  await ensureDataDirectory();
  const tmpPath = `${config.paths.dbFile}.tmp.${Date.now()}`;
  const data = JSON.stringify(dbCache, null, 2);
  await fs.writeFile(tmpPath, data, 'utf8');
  await fs.rename(tmpPath, config.paths.dbFile);
}

export async function getDb() {
  if (!dbCache) {
    await initDb();
  }
  return dbCache;
}

export async function getAllRepos(options = {}) {
  const db = await getDb();
  let results = [...db.repos];

  const {
    search,
    language,
    category,
    maxReplyHours,
    minMergeRate,
    hasGoodFirstIssues,
    sort = 'easyScore',
    order = 'desc',
    userId
  } = options;

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.fullName.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.language?.toLowerCase().includes(q) ||
      (r.topics && r.topics.some((t) => t.toLowerCase().includes(q)))
    );
  }

  // Language filter
  if (language && language !== 'all') {
    results = results.filter((r) => r.language?.toLowerCase() === language.toLowerCase());
  }

  // Category filter
  if (category && category !== 'all') {
    results = results.filter((r) => r.category?.toLowerCase() === category.toLowerCase());
  }

  // Max reply time filter
  if (maxReplyHours && maxReplyHours !== 'all') {
    const maxH = parseFloat(maxReplyHours);
    if (!Number.isNaN(maxH)) {
      results = results.filter((r) => r.metrics?.medianResponseTimeHours <= maxH);
    }
  }

  // Min merge rate filter
  if (minMergeRate && minMergeRate !== 'all') {
    const minR = parseFloat(minMergeRate);
    if (!Number.isNaN(minR)) {
      results = results.filter((r) => r.metrics?.outsidePrMergeRate >= minR);
    }
  }

  // Has good first issues filter
  if (hasGoodFirstIssues === 'true' || hasGoodFirstIssues === true) {
    results = results.filter((r) => (r.metrics?.goodFirstIssuesCount || 0) > 0);
  }

  // Sorting
  results.sort((a, b) => {
    let valA = 0;
    let valB = 0;

    switch (sort) {
      case 'easyScore':
        valA = a.easyScore || 0;
        valB = b.easyScore || 0;
        break;
      case 'mergeRate':
        valA = a.metrics?.outsidePrMergeRate || 0;
        valB = b.metrics?.outsidePrMergeRate || 0;
        break;
      case 'replyTime':
        // For reply time, smaller (faster) is better when descending ranking!
        // We invert so "fastest reply" appears top
        valA = -(a.metrics?.medianResponseTimeHours || 9999);
        valB = -(b.metrics?.medianResponseTimeHours || 9999);
        break;
      case 'commits':
        valA = a.metrics?.recentCommitsCount30d || 0;
        valB = b.metrics?.recentCommitsCount30d || 0;
        break;
      case 'goodFirstIssues':
        valA = a.metrics?.goodFirstIssuesCount || 0;
        valB = b.metrics?.goodFirstIssuesCount || 0;
        break;
      case 'stars':
        valA = a.stars || 0;
        valB = b.stars || 0;
        break;
      case 'recent':
        valA = new Date(a.submittedAt || 0).getTime();
        valB = new Date(b.submittedAt || 0).getTime();
        break;
      default:
        valA = a.easyScore || 0;
        valB = b.easyScore || 0;
    }

    return order === 'asc' ? valA - valB : valB - valA;
  });

  // Attach user specific flags (isVoted, isBookmarked)
  if (userId) {
    results = results.map((r) => ({
      ...r,
      isVoted: !!db.votes[`${userId}:${r.id}`],
      isBookmarked: !!db.bookmarks[`${userId}:${r.id}`]
    }));
  }

  return results;
}

export async function getRepoById(id, userId = null) {
  const db = await getDb();
  const repo = db.repos.find((r) => r.id === id || r.fullName.toLowerCase() === id.toLowerCase());
  if (!repo) return null;

  if (userId) {
    return {
      ...repo,
      isVoted: !!db.votes[`${userId}:${repo.id}`],
      isBookmarked: !!db.bookmarks[`${userId}:${repo.id}`]
    };
  }
  return repo;
}

export async function addOrUpdateRepo(repoData) {
  const db = await getDb();
  const idx = db.repos.findIndex(
    (r) => r.id === repoData.id || r.fullName.toLowerCase() === repoData.fullName.toLowerCase()
  );

  if (idx >= 0) {
    // Preserve existing upvotes unless updated
    const existing = db.repos[idx];
    db.repos[idx] = {
      ...existing,
      ...repoData,
      upvotes: repoData.upvotes !== undefined ? repoData.upvotes : existing.upvotes
    };
  } else {
    db.repos.unshift(repoData);
  }

  await persistDb();
  return db.repos.find((r) => r.id === repoData.id || r.fullName.toLowerCase() === repoData.fullName.toLowerCase());
}

export async function toggleVote(userId, repoId) {
  const db = await getDb();
  const key = `${userId}:${repoId}`;
  const repo = db.repos.find((r) => r.id === repoId);
  if (!repo) return null;

  let voted = false;
  if (db.votes[key]) {
    delete db.votes[key];
    repo.upvotes = Math.max(0, (repo.upvotes || 1) - 1);
    voted = false;
  } else {
    db.votes[key] = true;
    repo.upvotes = (repo.upvotes || 0) + 1;
    voted = true;
  }

  await persistDb();
  return { voted, upvotes: repo.upvotes };
}

export async function toggleBookmark(userId, repoId) {
  const db = await getDb();
  const key = `${userId}:${repoId}`;
  let bookmarked = false;

  if (db.bookmarks[key]) {
    delete db.bookmarks[key];
    bookmarked = false;
  } else {
    db.bookmarks[key] = true;
    bookmarked = true;
  }

  await persistDb();
  return { bookmarked };
}

export async function getUserBookmarks(userId) {
  const db = await getDb();
  const bookmarkedIds = Object.keys(db.bookmarks)
    .filter((k) => k.startsWith(`${userId}:`))
    .map((k) => k.replace(`${userId}:`, ''));

  return db.repos
    .filter((r) => bookmarkedIds.includes(r.id))
    .map((r) => ({
      ...r,
      isVoted: !!db.votes[`${userId}:${r.id}`],
      isBookmarked: true
    }));
}

export async function upsertUser(user) {
  const db = await getDb();
  const idx = db.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    db.users[idx] = { ...db.users[idx], ...user };
  } else {
    db.users.push(user);
  }
  await persistDb();
  return user;
}

export async function getUserById(userId) {
  const db = await getDb();
  return db.users.find((u) => u.id === userId) || null;
}

export async function getCommunityStats() {
  const db = await getDb();
  const totalRepos = db.repos.length;
  if (totalRepos === 0) {
    return {
      totalRepos: 0,
      avgMergeRate: 0,
      medianReplyHours: 0,
      totalGoodFirstIssues: 0,
      topLanguages: []
    };
  }

  const sumMergeRate = db.repos.reduce((acc, r) => acc + (r.metrics?.outsidePrMergeRate || 0), 0);
  const avgMergeRate = Math.round((sumMergeRate / totalRepos) * 10) / 10;

  const replyTimes = db.repos
    .map((r) => r.metrics?.medianResponseTimeHours || 0)
    .filter((h) => h > 0)
    .sort((a, b) => a - b);
  const medianReplyHours =
    replyTimes.length > 0
      ? replyTimes[Math.floor(replyTimes.length / 2)]
      : 4.5;

  const totalGoodFirstIssues = db.repos.reduce(
    (acc, r) => acc + (r.metrics?.goodFirstIssuesCount || 0),
    0
  );

  const langMap = {};
  for (const r of db.repos) {
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  }

  const topLanguages = Object.entries(langMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalRepos,
    avgMergeRate,
    medianReplyHours,
    totalGoodFirstIssues,
    topLanguages
  };
}
