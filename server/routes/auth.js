// Authentication routes for RepoEasy (GitHub OAuth & Demo session)
import express from 'express';
import axios from 'axios';
import cookie from 'cookie';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { upsertUser, getUserById } from '../db.js';

const router = express.Router();

const SESSION_COOKIE = 'repoeasy_session';
const STATE_COOKIE = 'repoeasy_oauth_state';
const isProduction = config.nodeEnv === 'production';

// Demo login lets anyone sign in as any username, so it is dev-only
export const demoLoginEnabled = !isProduction;

function sign(value) {
  return crypto.createHmac('sha256', config.sessionSecret).update(value).digest('base64url');
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function serializeCookie(name, value, maxAge) {
  return cookie.serialize(name, value, {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
}

// Helper to get session user from the signed session cookie
export function getSessionUser(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;

  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const userId = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  return safeEqual(signature, sign(userId)) ? userId : null;
}

// Set session cookie
export function setSessionCookie(res, userId) {
  res.append('Set-Cookie', serializeCookie(SESSION_COOKIE, `${userId}.${sign(userId)}`, 60 * 60 * 24 * 30)); // 30 days
}

// Clear session cookie
export function clearSessionCookie(res) {
  res.append('Set-Cookie', serializeCookie(SESSION_COOKIE, '', 0));
}

// GET /api/auth/github/login
router.get('/github/login', (req, res) => {
  if (!config.github.clientId || !config.github.clientSecret) {
    return res.redirect('/?error=oauth_not_configured');
  }

  // Random state, echoed back by GitHub and checked against this cookie to block login CSRF
  const state = crypto.randomBytes(16).toString('hex');
  res.append('Set-Cookie', serializeCookie(STATE_COOKIE, state, 60 * 10));

  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: config.github.callbackUrl,
    scope: 'read:user',
    state,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// GET /api/auth/github/callback
router.get('/github/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const expectedState = cookie.parse(req.headers.cookie || '')[STATE_COOKIE];
  res.append('Set-Cookie', serializeCookie(STATE_COOKIE, '', 0));

  if (error === 'access_denied') {
    return res.redirect('/?error=access_denied');
  }
  if (!code) {
    return res.redirect('/?error=missing_code');
  }
  if (!state || !expectedState || !safeEqual(String(state), expectedState)) {
    return res.redirect('/?error=invalid_state');
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: config.github.callbackUrl,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.error('[RepoEasy Auth] Token exchange failed:', tokenRes.data.error_description || tokenRes.data.error);
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
      // Kept server-side only: used for higher GitHub API rate limits when this user analyzes repos
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

// POST or GET /api/auth/demo-login (1-Click Instant Sign In, development only)
router.all('/demo-login', async (req, res) => {
  if (!demoLoginEnabled) {
    return res.status(404).json({ error: 'Demo login is disabled in production' });
  }

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
  const authOptions = {
    githubConfigured: Boolean(config.github.clientId && config.github.clientSecret),
    demoLoginEnabled,
  };

  const userId = getSessionUser(req);
  if (!userId) {
    return res.json({ authenticated: false, user: null, ...authOptions });
  }

  const user = await getUserById(userId);
  if (!user) {
    clearSessionCookie(res);
    return res.json({ authenticated: false, user: null, ...authOptions });
  }

  // Strip sensitive tokens before returning to client
  const { githubToken, ...safeUser } = user;
  res.json({ authenticated: true, user: safeUser, ...authOptions });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
