// Dynamic SVG Badge Generator for GitHub READMEs
import express from 'express';
import { getRepoById } from '../db.js';
import { analyzeRepository } from '../githubAnalyzer.js';

const router = express.Router();

function renderSvgBadge(label, value, color) {
  const labelWidth = Math.max(60, label.length * 7 + 12);
  const valueWidth = Math.max(50, value.length * 7 + 14);
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#1e293b"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(labelWidth * 10) / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(labelWidth - 12) * 10}">${label}</text>
    <text x="${(labelWidth * 10) / 2}" y="140" transform="scale(.1)" fill="#fff" textLength="${(labelWidth - 12) * 10}">${label}</text>
    <text aria-hidden="true" x="${labelWidth * 10 + (valueWidth * 10) / 2}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(valueWidth - 12) * 10}">${value}</text>
    <text x="${labelWidth * 10 + (valueWidth * 10) / 2}" y="140" transform="scale(.1)" fill="#fff" textLength="${(valueWidth - 12) * 10}">${value}</text>
  </g>
</svg>`;
}

router.get('/:owner/:repo.svg', async (req, res) => {
  const repoId = `${req.params.owner}/${req.params.repo}`;
  const style = req.query.style || 'welcoming'; // 'welcoming' | 'easyscore' | 'reply'

  let repo = await getRepoById(repoId);
  if (!repo) {
    try {
      // Analyze on the fly
      repo = await analyzeRepository(req.params.owner, req.params.repo);
    } catch {
      repo = null;
    }
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (!repo) {
    const svg = renderSvgBadge('RepoEasy', 'unindexed', '#64748b');
    return res.send(svg);
  }

  let label = 'RepoEasy';
  let value = `EasyScore ${repo.easyScore}`;
  let color = '#10b981'; // emerald

  if (style === 'welcoming') {
    label = 'RepoEasy';
    const mergeRate = Math.round(repo.metrics?.outsidePrMergeRate || 80);
    value = `Welcoming (${mergeRate}% PR Merge)`;
    color = mergeRate >= 80 ? '#10b981' : mergeRate >= 60 ? '#3b82f6' : '#f59e0b';
  } else if (style === 'reply') {
    label = 'Maintainer Reply';
    const replyHours = repo.metrics?.medianResponseTimeHours || 4;
    value = `${replyHours}h median`;
    color = replyHours <= 6 ? '#10b981' : replyHours <= 24 ? '#3b82f6' : '#f59e0b';
  } else {
    // easyscore
    label = 'EasyScore™';
    value = `${repo.easyScore}/100`;
    color = repo.easyScore >= 90 ? '#10b981' : repo.easyScore >= 75 ? '#3b82f6' : '#f59e0b';
  }

  const svg = renderSvgBadge(label, value, color);
  res.send(svg);
});

export default router;
