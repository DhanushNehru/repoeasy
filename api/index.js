// Vercel serverless entry: the whole Express app as one function.
// Requests to /api/* are routed here by the rewrite in vercel.json.
import app from '../server/index.js';

export default app;
