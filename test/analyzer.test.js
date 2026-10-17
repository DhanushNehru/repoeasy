// Unit tests for RepoEasy scoring & analyzer algorithms
import test from 'node:test';
import assert from 'node:assert';
import {
  parseRepoInput,
  calculateEasyScore,
  generateBadges,
  inferCategory,
  generateSyntheticTelemetry
} from '../server/githubAnalyzer.js';

test('parseRepoInput handles full HTTPS GitHub URLs', () => {
  const parsed = parseRepoInput('https://github.com/DhanushNehru/RepoEasy');
  assert.deepStrictEqual(parsed, { owner: 'DhanushNehru', repo: 'RepoEasy' });
});

test('parseRepoInput handles shorthand owner/repo syntax', () => {
  const parsed = parseRepoInput('astral-sh/uv');
  assert.deepStrictEqual(parsed, { owner: 'astral-sh', repo: 'uv' });
});

test('parseRepoInput handles URLs with .git suffix and trailing slash', () => {
  const parsed = parseRepoInput('https://github.com/tiangolo/fastapi.git/');
  assert.deepStrictEqual(parsed, { owner: 'tiangolo', repo: 'fastapi' });
});

test('parseRepoInput returns null on invalid inputs', () => {
  assert.strictEqual(parseRepoInput(''), null);
  assert.strictEqual(parseRepoInput('invalid-string'), null);
  assert.strictEqual(parseRepoInput('https://google.com'), null);
});

test('calculateEasyScore awards high scores for high PR merge rates and fast response', () => {
  const highMetrics = {
    outsidePrMergeRate: 92,
    medianResponseTimeHours: 2.0,
    goodFirstIssuesCount: 8,
    recentCommitsCount30d: 90,
    hasContributingMd: true,
    hasCodeOfConduct: true,
    hasLicense: true,
    hasIssueTemplates: true,
    hasPullRequestTemplate: true
  };
  const score = calculateEasyScore(highMetrics);
  assert.ok(score >= 90, `Expected score >= 90, got ${score}`);
});

test('calculateEasyScore discounts slow maintainer replies and low merge rates', () => {
  const lowMetrics = {
    outsidePrMergeRate: 35,
    medianResponseTimeHours: 140,
    goodFirstIssuesCount: 0,
    recentCommitsCount30d: 2,
    hasContributingMd: false,
    hasCodeOfConduct: false,
    hasLicense: true,
    hasIssueTemplates: false
  };
  const score = calculateEasyScore(lowMetrics);
  assert.ok(score <= 50, `Expected score <= 50, got ${score}`);
});

test('generateBadges includes Lightning Maintainer when reply time <= 4.5 hours', () => {
  const badges = generateBadges(
    {
      outsidePrMergeRate: 85,
      medianResponseTimeHours: 3.2,
      goodFirstIssuesCount: 5,
      recentCommitsCount30d: 70,
      hasContributingMd: true,
      hasIssueTemplates: true
    },
    92
  );

  const lightning = badges.find((b) => b.id === 'lightning-reply');
  assert.ok(lightning, 'Lightning Maintainer badge should be present');
  const highAcceptance = badges.find((b) => b.id === 'high-acceptance');
  assert.ok(highAcceptance, 'High Acceptance badge should be present');
});

test('inferCategory correctly categorizes tools', () => {
  assert.strictEqual(inferCategory(['react', 'tailwind'], 'TypeScript', 'ui'), 'Frontend & UI');
  assert.strictEqual(inferCategory(['api', 'postgres'], 'Python', 'backend'), 'Backend & APIs');
  assert.strictEqual(inferCategory(['tui', 'terminal'], 'Go', 'bubbletea'), 'CLI & DevTools');
  assert.strictEqual(inferCategory(['docker', 'bot'], 'Go', 'ironclavebot'), 'DevOps & Cloud');
});

test('generateSyntheticTelemetry produces realistic data and deterministic results', () => {
  const telemetry1 = generateSyntheticTelemetry('DhanushNehru', 'RepoEasy');
  const telemetry2 = generateSyntheticTelemetry('DhanushNehru', 'RepoEasy');
  assert.strictEqual(telemetry1.easyScore, telemetry2.easyScore);
  assert.strictEqual(telemetry1.fullName, 'DhanushNehru/RepoEasy');
  assert.ok(telemetry1.metrics.outsidePrMergeRate >= 70);
});
