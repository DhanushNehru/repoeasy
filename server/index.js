// Main Express Server for RepoEasy
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import reposRoutes from './routes/repos.js';
import badgesRoutes from './routes/badges.js';

// Session cookies are signed with this secret, so a public default would let anyone forge logins
if (config.nodeEnv === 'production' && !config.hasCustomSessionSecret) {
  console.error('[RepoEasy] SESSION_SECRET must be set in production.');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize persistent database
await initDb();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', reposRoutes);
app.use('/api/badges', badgesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'RepoEasy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static files if built
const distPath = config.paths.distDir;
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If dist doesn't exist yet, provide helpful landing instructions
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.send(`
      <html>
        <head><title>RepoEasy API</title></head>
        <body style="font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 2rem;">
          <h1>RepoEasy Server is Running ⚡</h1>
          <p>API endpoints are active at <code>/api/*</code>.</p>
          <p>Run <code>npm run build</code> to compile the frontend, or run Vite dev server on port 5173.</p>
        </body>
      </html>
    `);
  });
}

// On Vercel the app is exported and served as a serverless function
// (see api/index.js); only start a listener when running directly.
let server = null;
if (!process.env.VERCEL) {
  server = app.listen(config.port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 RepoEasy Server is live on http://localhost:${config.port}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - Auth:   http://localhost:${config.port}/api/auth/me`);
    console.log(`   - Repos:  http://localhost:${config.port}/api/repos`);
    console.log(`   - Badges: http://localhost:${config.port}/api/badges/owner/repo.svg`);
    console.log(`=================================================\n`);
  });
}

export default app;
export { server };
