// Authentication routes for RepoEasy (GitHub OAuth & Demo session)
import express from 'express';
import axios from 'axios';
import cookie from 'cookie';
import { config } from '../config.js';
import { upsertUser, getUserById } from '../db.js';

const router = express.Router();

// Helper to get session user from cookies
export function getSessionUser(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userId = cookies.repoeasy_user_id;
  return userId || null;
}

// Set session cookie
export function setSessionCookie(res, userId) {
  const serialized = cookie.serialize('repoeasy_user_id', userId, {
    httpOnly: false, // Accessible to client-side JS for snappy UI state
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  });
  res.setHeader('Set-Cookie', serialized);
}

// Clear session cookie
export function clearSessionCookie(res) {
  const serialized = cookie.serialize('repoeasy_user_id', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', serialized);
}

// GET /api/auth/github/login
router.get('/github/login', (req, res) => {
  if (!config.github.clientId) {
    // If no OAuth App configured, provide informative response or redirect to demo login
    return res.status(200).json({
      configured: false,
      message: 'GitHub OAuth Client ID is not configured in .env. You can use the 1-Click Demo Login to experience all authenticated features immediately.',
      demoAvailable: true,
      demoLoginUrl: '/api/auth/demo-login',
    });
  }

  const state = Math.random().toString(36).substring(7);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${encodeURIComponent(config.github.callbackUrl)}&scope=read:user,user:email&state=${state}`;

  res.redirect(githubAuthUrl);
});

// GET /api/auth/github/callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect('/?error=missing_code');
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect('/?error=oauth_failed');
    }

    // Fetch user profile from GitHub
    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'RepoEasy-Auth',
      },
    });

    const ghUser = userRes.data;
    const user = {
      id: `gh_${ghUser.id}`,
      username: ghUser.login,
      displayName: ghUser.name || ghUser.login,
      avatarUrl: ghUser.avatar_url,
      profileUrl: ghUser.html_url,
      bio: ghUser.bio || 'Open Source Contributor',
      githubToken: accessToken,
      updatedAt: new Date().toISOString(),
    };

    await upsertUser(user);
    setSessionCookie(res, user.id);

    res.redirect('/?auth=success');
  } catch (err) {
    console.error('[RepoEasy Auth] GitHub OAuth callback error:', err.message);
    res.redirect('/?error=auth_failed');
  }
});

// POST or GET /api/auth/demo-login (1-Click Instant Sign In)
router.all('/demo-login', async (req, res) => {
  const username = req.body?.username || req.query?.username || 'DhanushNehru';

  const demoUser = {
    id: `gh_demo_${username.toLowerCase()}`,
    username,
    displayName: username === 'DhanushNehru' ? 'Dhanush Nehru' : username,
    avatarUrl: `https://github.com/${username}.png`,
    profileUrl: `https://github.com/${username}`,
    bio: 'Verified Contributor & Open Source Explorer',
    createdAt: new Date().toISOString(),
  };

  await upsertUser(demoUser);
  setSessionCookie(res, demoUser.id);

  if (req.method === 'GET') {
    return res.redirect('/?auth=demo_success');
  }
  return res.json({ success: true, user: demoUser });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const userId = getSessionUser(req);
  if (!userId) {
    return res.json({ authenticated: false, user: null });
  }

  const user = await getUserById(userId);
  if (!user) {
    clearSessionCookie(res);
    return res.json({ authenticated: false, user: null });
  }

  // Strip sensitive tokens before returning to client
  const { githubToken, ...safeUser } = user;
  res.json({ authenticated: true, user: safeUser });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
