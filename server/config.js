// Configuration for RepoEasy Server
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/auth/github/callback',
    token: process.env.GITHUB_TOKEN || '',
  },
  sessionSecret: process.env.SESSION_SECRET || 'repoeasy_dev_secret_key_2026',
  hasCustomSessionSecret: Boolean(process.env.SESSION_SECRET),
  paths: {
    root: path.resolve(__dirname, '..'),
    dataDir: path.resolve(__dirname, '..', 'data'),
    dbFile: path.resolve(__dirname, '..', 'data', 'db.json'),
    distDir: path.resolve(__dirname, '..', 'dist'),
  },
};
