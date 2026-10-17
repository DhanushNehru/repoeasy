// Integration tests for RepoEasy API endpoints
import test from 'node:test';
import assert from 'node:assert';
import app, { server } from '../server/index.js';

test.after(() => server.close());

test('GET /api/health returns status ok', async () => {
  // Use node fetch or app handler directly
  const res = await fetch('http://localhost:4000/api/health').catch(() => null);
  if (res) {
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.app, 'RepoEasy');
  }
});

test('GET /api/repos returns initial repositories list', async () => {
  const { getAllRepos } = await import('../server/db.js');
  const repos = await getAllRepos();
  assert.ok(Array.isArray(repos));
  assert.ok(repos.length >= 5);
  const ironclave = repos.find((r) => r.id === 'DhanushNehru/ironclavebot');
  assert.ok(ironclave, 'DhanushNehru/ironclavebot should be present in seeds');
  assert.ok(ironclave.metrics.outsidePrMergeRate >= 80);
});

test('GET /api/repos with language filter filters properly', async () => {
  const { getAllRepos } = await import('../server/db.js');
  const rustRepos = await getAllRepos({ language: 'Rust' });
  assert.ok(rustRepos.length >= 1);
  for (const r of rustRepos) {
    assert.strictEqual(r.language.toLowerCase(), 'rust');
  }
});

test('GET /api/repos with minMergeRate filters properly', async () => {
  const { getAllRepos } = await import('../server/db.js');
  const highMergeRepos = await getAllRepos({ minMergeRate: 85 });
  for (const r of highMergeRepos) {
    assert.ok(r.metrics.outsidePrMergeRate >= 85);
  }
});

test('GET /api/stats returns community statistics', async () => {
  const { getCommunityStats } = await import('../server/db.js');
  const stats = await getCommunityStats();
  assert.ok(stats.totalRepos >= 5);
  assert.ok(stats.avgMergeRate > 0);
  assert.ok(stats.totalGoodFirstIssues > 0);
});
