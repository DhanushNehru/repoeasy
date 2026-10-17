# Contributing to RepoEasy 🚀

Thank you for your interest in contributing to **RepoEasy**! We believe in making open source welcoming, transparent, and rewarding. As a project built specifically to champion outside contributors, we hold ourselves to the highest standards of maintainer responsiveness.

---

## ⚡ Quickstart Development

RepoEasy is designed with a minimal, zero-friction architecture:

1. **Fork & Clone**
   ```bash
   git clone https://github.com/DhanushNehru/RepoEasy.git
   cd RepoEasy
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**
   ```bash
   cp .env.example .env
   ```
   *(RepoEasy includes full synthetic telemetry and 1-click Demo Login out-of-the-box, so you don't even need GitHub OAuth credentials to start developing!)*

4. **Run Development Server**
   ```bash
   # Terminal 1: Run Backend API & static server
   npm run dev

   # Terminal 2: Run Vite Frontend with Hot Module Replacement
   npx vite
   ```
   The client will be running at `http://localhost:5173` with automatic API proxying to `http://localhost:4000`.

5. **Run the Test Suite**
   ```bash
   npm test
   ```

---

## 🧩 Codebase Architecture

```
RepoEasy/
├── server/
│   ├── index.js               # Express application entrypoint
│   ├── config.js              # Environment settings
│   ├── db.js                  # Atomic file-backed JSON database engine
│   ├── githubAnalyzer.js      # PR merge rate & reply time algorithm
│   └── routes/
│       ├── auth.js            # GitHub OAuth & 1-click session management
│       ├── repos.js           # Filtering, ranking, submissions, voting
│       └── badges.js          # Dynamic SVG README badge generator
├── src/
│   ├── main.jsx               # React entrypoint
│   ├── App.jsx                # Main orchestration component
│   ├── components/            # UI components (Navbar, Hero, RepoCard, etc.)
│   ├── services/api.js        # Client API SDK
│   └── utils/formatters.js    # Data formatting helpers
└── test/
    ├── analyzer.test.js       # Scoring and algorithm tests
    └── server.test.js         # Integration tests
```

---

## 🎯 Starter Roadmap / "Good First Issues" for RepoEasy

Looking for something awesome to build? Here are planned features ready for outside contributors:

1. **Maintainer Sentiment Analysis** (`good first issue`)
   - Analyze review comment tone using lightweight keyword heuristics (e.g. "Thanks for the PR!", "Great catch!") to compute a Community Warmth score.
2. **GitLab & Codeberg Provider Adapters** (`enhancement`)
   - Expand beyond GitHub to index welcoming projects hosted on GitLab and Codeberg.
3. **Weekly Contributor Digest Webhook** (`good first issue`)
   - Allow contributors to subscribe to a weekly Discord / Slack / RSS feed of top new `good first issue`s in their favorite language.
4. **Dark / Light Theme Toggle** (`good first issue`)
   - Add light mode support while preserving the glowing futuristic palette.
5. **Interactive PR Merge Rate Time Series Chart** (`enhancement`)
   - Visualize monthly PR acceptance trends over the last 12 months using Chart.js or SVG sparklines.

---

## 📋 Pull Request Checklist

Before submitting a PR:
- [ ] Run `npm test` and ensure all tests pass.
- [ ] Run `npm run build` and ensure the frontend compiles without warnings.
- [ ] Write clear commit messages.
- [ ] If adding a new feature or algorithm tweak, add a corresponding test in `test/`.

We review every outside pull request within **24 hours**. Happy hacking!
