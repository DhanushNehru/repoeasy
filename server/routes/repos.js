// Repositories API routes for RepoEasy
import express from 'express';
import {
  getAllRepos,
  getRepoById,
  addOrUpdateRepo,
  toggleVote,
  toggleBookmark,
  getUserBookmarks,
  getCommunityStats,
  getUserById,
} from '../db.js';
import { parseRepoInput, analyzeRepository } from '../githubAnalyzer.js';
import { getSessionUser } from './auth.js';

const router = express.Router();

// GET /api/repos - Filter, search, and rank repositories
router.get('/', async (req, res) => {
  try {
    const userId = getSessionUser(req);
    const repos = await getAllRepos({
      search: req.query.search,
      language: req.query.language,
      category: req.query.category,
      maxReplyHours: req.query.maxReplyHours,
      minMergeRate: req.query.minMergeRate,
      hasGoodFirstIssues: req.query.hasGoodFirstIssues,
      sort: req.query.sort || 'easyScore',
      order: req.query.order || 'desc',
      userId,
    });

    res.json({ success: true, count: repos.length, repos });
  } catch (err) {
    console.error('[RepoEasy Repos] Error listing repos:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve repositories' });
  }
});

// GET /api/stats - High-level directory statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getCommunityStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/user/bookmarks - Get bookmarked repos for the logged in user
router.get('/user/bookmarks', async (req, res) => {
  const userId = getSessionUser(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  try {
    const bookmarks = await getUserBookmarks(userId);
    res.json({ success: true, count: bookmarks.length, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/repos/analyze - Test & preview repository telemetry before submitting
router.post('/analyze', async (req, res) => {
  const { input } = req.body;
  const parsed = parseRepoInput(input);

  if (!parsed) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GitHub repository. Please provide a valid URL (e.g., https://github.com/owner/repo) or shorthand (owner/repo).',
    });
  }

  try {
    const userId = getSessionUser(req);
    let customToken = null;
    if (userId) {
      const user = await getUserById(userId);
      customToken = user?.githubToken || null;
    }

    const telemetry = await analyzeRepository(parsed.owner, parsed.repo, {
      customToken,
      submittedBy: userId || 'anonymous',
    });

    res.json({ success: true, telemetry });
  } catch (err) {
    console.error('[RepoEasy Repos] Analyze error:', err);
    res.status(500).json({ success: false, error: 'Analysis failed: ' + err.message });
  }
});

// POST /api/repos/submit - Submit and index a new repository
router.post('/submit', async (req, res) => {
  const { input } = req.body;
  const parsed = parseRepoInput(input);

  if (!parsed) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GitHub repository. Please provide a valid URL (e.g., https://github.com/owner/repo) or shorthand (owner/repo).',
    });
  }

  const userId = getSessionUser(req);
  let submitterName = 'Community Contributor';

  if (userId) {
    const user = await getUserById(userId);
    if (user) {
      submitterName = user.displayName || user.username;
    }
  }

  try {
    const telemetry = await analyzeRepository(parsed.owner, parsed.repo, {
      submittedBy: submitterName,
    });

    const saved = await addOrUpdateRepo(telemetry);
    res.status(201).json({ success: true, repo: saved, message: `Successfully analyzed and indexed ${telemetry.fullName}!` });
  } catch (err) {
    console.error('[RepoEasy Repos] Submission error:', err);
    res.status(500).json({ success: false, error: 'Submission failed: ' + err.message });
  }
});

// GET /api/repos/:owner/:repo - Fetch specific repository by ID
router.get('/:owner/:repo', async (req, res) => {
  const repoId = `${req.params.owner}/${req.params.repo}`;
  const userId = getSessionUser(req);

  try {
    const repo = await getRepoById(repoId, userId);
    if (!repo) {
      return res.status(404).json({ success: false, error: 'Repository not found in directory' });
    }
    res.json({ success: true, repo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/repos/:owner/:repo/vote - Upvote a repository
router.post('/:owner/:repo/vote', async (req, res) => {
  const userId = getSessionUser(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Please sign in with GitHub to upvote repositories.' });
  }

  const repoId = `${req.params.owner}/${req.params.repo}`;
  try {
    const result = await toggleVote(userId, repoId);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/repos/:owner/:repo/bookmark - Bookmark a repository for contributing
router.post('/:owner/:repo/bookmark', async (req, res) => {
  const userId = getSessionUser(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Please sign in with GitHub to save bookmarks.' });
  }

  const repoId = `${req.params.owner}/${req.params.repo}`;
  try {
    const result = await toggleBookmark(userId, repoId);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Repository not found' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
