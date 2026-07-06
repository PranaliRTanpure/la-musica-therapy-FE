#!/usr/bin/env node
/**
 * AI code reviewer. Reviews STAGED git changes against the rubric in
 * scripts/review-prompt.md and the conventions in CLAUDE.md.
 *
 * Transport (auto-detected, override with REVIEW_MODE=cli|api):
 *   - CLI: uses `claude -p` (Claude Code subscription). Default locally.
 *   - API: uses ANTHROPIC_API_KEY via fetch. Used in CI or when key is set
 *          and CLI is unavailable.
 *
 * Exit codes: 0 = APPROVE (commit proceeds), 1 = REQUEST_CHANGES (blocked).
 *
 * Skip intentionally: SKIP_AI_REVIEW=1 git commit ...
 */
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PROMPT_PATH = join(ROOT, 'scripts', 'review-prompt.md');
const CLAUDE_MD = join(ROOT, 'CLAUDE.md');
const REVIEW_DIR = join(ROOT, '.reviews');
const MODEL = process.env.REVIEW_MODEL || 'claude-sonnet-4-6';
const MAX_DIFF_BYTES = 60_000; // keep token cost sane; very large diffs are truncated

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function log(s = '') {
  process.stdout.write(s + '\n');
}

if (process.env.SKIP_AI_REVIEW === '1') {
  log(c.yellow('⚠  AI review skipped (SKIP_AI_REVIEW=1).'));
  process.exit(0);
}

// --- Gather staged diff (only JS/TS/TSX, exclude generated) ---
function getStagedDiff() {
  const files = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
  })
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => /\.(ts|tsx|js|jsx)$/.test(f))
    .filter((f) => !f.includes('src/api/generated'));

  if (files.length === 0) return { diff: '', files: [] };

  const diff = execSync(
    `git diff --cached -- ${files.map((f) => `"${f}"`).join(' ')}`,
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    }
  );
  return { diff, files };
}

function buildPrompt(diff, claudeMd) {
  const rubric = readFileSync(PROMPT_PATH, 'utf8');
  let body = diff;
  let truncatedNote = '';
  if (Buffer.byteLength(body, 'utf8') > MAX_DIFF_BYTES) {
    body = body.slice(0, MAX_DIFF_BYTES);
    truncatedNote =
      '\n\n[NOTE: diff truncated for length — review what is shown.]';
  }
  return [
    rubric,
    '\n\n===== PROJECT CONVENTIONS (CLAUDE.md) =====\n',
    claudeMd,
    '\n\n===== STAGED DIFF TO REVIEW =====\n',
    body,
    truncatedNote,
  ].join('');
}

// --- Transport: CLI ---
function reviewViaCli(prompt) {
  const res = spawnSync('claude', ['-p', '--model', MODEL], {
    input: prompt,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    throw new Error(`claude CLI exited ${res.status}: ${res.stderr || ''}`);
  }
  return res.stdout.trim();
}

// --- Transport: API ---
async function reviewViaApi(prompt) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

function cliAvailable() {
  const r = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  return !r.error && r.status === 0;
}

function pickMode() {
  const forced = process.env.REVIEW_MODE;
  if (forced === 'cli' || forced === 'api') return forced;
  if (process.env.CI && process.env.ANTHROPIC_API_KEY) return 'api';
  if (cliAvailable()) return 'cli';
  if (process.env.ANTHROPIC_API_KEY) return 'api';
  return null;
}

function colorizeSeverity(line) {
  return line
    .replace(/\bBLOCKER\b/g, c.red('BLOCKER'))
    .replace(/\bWARNING\b/g, c.yellow('WARNING'))
    .replace(/\bNIT\b/g, c.dim('NIT'));
}

async function main() {
  const { diff, files } = getStagedDiff();
  if (!diff) {
    log(c.dim('AI review: no reviewable JS/TS changes staged. Skipping.'));
    process.exit(0);
  }

  log(c.bold(`\n🔎 AI reviewing ${files.length} file(s)...`));
  files.forEach((f) => log(c.dim('   • ' + f)));

  const mode = pickMode();
  if (!mode) {
    log(
      c.yellow(
        '\n⚠  No reviewer available (no `claude` CLI and no ANTHROPIC_API_KEY).'
      )
    );
    log(c.yellow('   Commit allowed, but review did NOT run.'));
    log(c.dim('   Install Claude Code or set ANTHROPIC_API_KEY to enable.'));
    process.exit(0); // fail-open: don't block work if reviewer can't run
  }

  const claudeMd = existsSync(CLAUDE_MD) ? readFileSync(CLAUDE_MD, 'utf8') : '';
  const prompt = buildPrompt(diff, claudeMd);

  let out;
  try {
    out = mode === 'cli' ? reviewViaCli(prompt) : await reviewViaApi(prompt);
  } catch (e) {
    log(c.yellow(`\n⚠  Review could not run (${e.message}).`));
    log(c.yellow('   Commit allowed, but review did NOT run.'));
    process.exit(0); // fail-open on transport errors
  }

  // Pretty print
  log('');
  out.split('\n').forEach((line) => log('   ' + colorizeSeverity(line)));
  log('');

  // Log to .reviews for accountability (human reviewers can check it ran)
  mkdirSync(REVIEW_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = join(REVIEW_DIR, `${stamp}.md`);
  writeFileSync(
    logFile,
    `# AI Review ${new Date().toISOString()}\n\nFiles:\n${files
      .map((f) => `- ${f}`)
      .join('\n')}\n\n---\n\n${out}\n`
  );

  const blocked = /VERDICT:\s*REQUEST_CHANGES/i.test(out);
  if (blocked) {
    log(c.red(c.bold('✖ Commit blocked: review requested changes.')));
    log(
      c.dim(
        '  Fix the BLOCKER items above, then commit again.\n' +
          '  To bypass in an emergency: SKIP_AI_REVIEW=1 git commit ...\n' +
          '  (Bypasses are logged in .reviews/ — use sparingly.)'
      )
    );
    process.exit(1);
  }

  log(c.green(c.bold('✔ Review passed.')));
  log(c.dim(`  Saved to ${logFile.replace(ROOT, '.')}`));
  log(
    c.dim(
      '  → Before you push, make sure you can answer the "UNDERSTAND YOUR CODE" questions above.'
    )
  );
  process.exit(0);
}

main().catch((e) => {
  log(c.yellow(`AI review error: ${e.message} — commit allowed.`));
  process.exit(0);
});
