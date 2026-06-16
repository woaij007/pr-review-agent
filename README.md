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

## Example Output

```
Fetching PR #61084 from microsoft/TypeScript...
PR: "[moveToFile] Fix symbols with empty declarations being treated as importable" by @andrewbranch
Diff size: 1,012 chars
Analyzing with Claude...

════════════════════════════════════════════════════════════
  PR REVIEW REPORT
  https://github.com/microsoft/TypeScript/pull/61084
════════════════════════════════════════════════════════════

## Summary

This PR fixes a bug where symbols with empty `declarations` arrays were incorrectly
treated as importable during moveToFile refactoring. Recommend merging.

────────────────────────────────────────────────────────────
## Issues Found (1)

  [CRITICAL] src/services/refactors/moveToFile.ts
  The original condition `!symbol.declarations` is logically incorrect — an empty
  array [] is truthy, so this check passes for symbols with empty declarations.
  Fix using `some(symbol.declarations)` correctly handles this edge case.

────────────────────────────────────────────────────────────
## Code Quality Score: 8 / 10

────────────────────────────────────────────────────────────
## Recommended Actions

  1. Verify that some() is imported from the TypeScript utilities library in moveToFile.ts
  2. Confirm the test case passes for exporting undefined values correctly
  3. Check for similar falsy checks on array properties elsewhere in the codebase

════════════════════════════════════════════════════════════
```

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

**In Progress** — Day 6/7 complete.

| Day | Task | Status |
|-----|------|--------|
| 1 | Project setup | ✅ |
| 2 | GitHub API integration | ✅ |
| 3 | Prompt design + Zod schema | ✅ |
| 4 | Claude API integration | ✅ |
| 5 | CLI entry point | ✅ |
| 6 | Real-world testing + prompt tuning | ✅ |
| 7 | Polish | 🔲 |
