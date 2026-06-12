import * as dotenv from "dotenv";
import { getPRInfo, getPRDiff } from "./github.js";
import { reviewPR } from "./claude.js";
import type { Review } from "./types.js";

dotenv.config();

function parsePRUrl(url: string): { owner: string; repo: string; prNumber: number } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    throw new Error(`Invalid GitHub PR URL: ${url}`);
  }
  return {
    owner: match[1]!,
    repo: match[2]!,
    prNumber: parseInt(match[3]!, 10),
  };
}

function formatReview(review: Review, prUrl: string): string {
  const divider = "─".repeat(60);
  const lines: string[] = [];

  lines.push(`\n${"═".repeat(60)}`);
  lines.push(`  PR REVIEW REPORT`);
  lines.push(`  ${prUrl}`);
  lines.push(`${"═".repeat(60)}`);

  lines.push(`\n## Summary\n`);
  lines.push(review.summary);

  lines.push(`\n${divider}`);
  lines.push(`## Issues Found (${review.issues.length})\n`);
  if (review.issues.length === 0) {
    lines.push("  No issues found.");
  } else {
    for (const issue of review.issues) {
      lines.push(`  [${issue.severity}] ${issue.file}`);
      lines.push(`  ${issue.description}\n`);
    }
  }

  lines.push(`${divider}`);
  lines.push(`## Security Concerns\n`);
  if (review.security_concerns.length === 0) {
    lines.push("  None identified.");
  } else {
    for (const c of review.security_concerns) {
      lines.push(`  • ${c}`);
    }
  }

  lines.push(`\n${divider}`);
  lines.push(`## Performance Concerns\n`);
  if (review.performance_concerns.length === 0) {
    lines.push("  None identified.");
  } else {
    for (const c of review.performance_concerns) {
      lines.push(`  • ${c}`);
    }
  }

  lines.push(`\n${divider}`);
  lines.push(`## Code Quality Score: ${review.code_quality_score} / 10\n`);

  lines.push(`${divider}`);
  lines.push(`## Recommended Actions\n`);
  review.recommended_actions.forEach((action, i) => {
    lines.push(`  ${i + 1}. ${action}`);
  });

  lines.push(`\n${"═".repeat(60)}\n`);

  return lines.join("\n");
}

async function main() {
  const prUrl = process.argv[2];
  if (!prUrl) {
    console.error("Usage: tsx src/index.ts <GitHub PR URL>");
    console.error("Example: tsx src/index.ts https://github.com/owner/repo/pull/123");
    process.exit(1);
  }

  const { owner, repo, prNumber } = parsePRUrl(prUrl);

  console.log(`\nFetching PR #${prNumber} from ${owner}/${repo}...`);
  const [prInfo, diff] = await Promise.all([
    getPRInfo(owner, repo, prNumber),
    getPRDiff(owner, repo, prNumber),
  ]);

  console.log(`PR: "${prInfo.title}" by @${prInfo.author}`);
  console.log(`Diff size: ${diff.length.toLocaleString()} chars`);
  console.log("Analyzing with Claude...\n");

  const review = await reviewPR(prInfo, diff);
  console.log(formatReview(review, prUrl));
}

main().catch((err) => {
  console.error("Error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
