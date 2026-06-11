# PR Review Agent

A CLI tool that analyzes GitHub Pull Requests using Claude AI and outputs a structured code review report.

```bash
tsx src/index.ts https://github.com/owner/repo/pull/123
```

## Tech Stack

- TypeScript + Node.js
- [Octokit](https://github.com/octokit/octokit.js) — GitHub API
- [@anthropic-ai/sdk](https://github.com/anthropics/anthropic-sdk-typescript) — Claude API
- [Zod](https://zod.dev) — structured output validation

## Setup

```bash
npm install
cp .env.example .env
# fill in GITHUB_TOKEN and ANTHROPIC_API_KEY
```

## Architecture

```
GitHub PR URL
    ↓ github.ts      — fetch PR info + diff via Octokit
PRInfo + Diff
    ↓ prompt.ts      — build system prompt + user message
System + User Prompt
    ↓ claude.ts      — call Claude API, validate with Zod
Review (structured JSON)
    ↓ index.ts       — format and print to terminal
```

## Review Output Structure

```
summary                   — overall impression of the PR
issues[]
  severity                — CRITICAL | WARNING | SUGGESTION
  file                    — affected file path
  description             — what the issue is
security_concerns[]       — security-related findings
performance_concerns[]    — performance-related findings
code_quality_score        — 1–10
recommended_actions[]     — prioritized next steps
```

**Severity guidelines:**
- `CRITICAL` — bugs, security vulnerabilities, data loss risks — must fix before merge
- `WARNING` — code smells, missing error handling, unclear logic — should fix
- `SUGGESTION` — style, naming, refactoring opportunities — optional

## Project Structure

```
src/
├── index.ts    # CLI entry point
├── github.ts   # GitHub API (getPRInfo, getPRFiles, getPRDiff)
├── claude.ts   # Claude integration (reviewPR)
├── prompt.ts   # Prompt templates (SYSTEM_PROMPT, buildUserPrompt)
└── types.ts    # Zod schemas and TypeScript types
```

## Status

**In Progress** — Day 4/7 complete.

| Day | Task | Status |
|-----|------|--------|
| 1 | Project setup | ✅ |
| 2 | GitHub API integration | ✅ |
| 3 | Prompt design + Zod schema | ✅ |
| 4 | Claude API integration | ✅ |
| 5 | CLI entry point | 🔲 |
| 6–7 | Real-world testing + polish | 🔲 |
