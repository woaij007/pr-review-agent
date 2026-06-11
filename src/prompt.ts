import type { PRInfo } from "./github.js";

export const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the given PR diff and provide a structured review.

Your review must be returned as a JSON object with exactly this structure:
{
  "summary": "Brief overview of what this PR does and overall impression",
  "issues": [
    {
      "severity": "CRITICAL" | "WARNING" | "SUGGESTION",
      "file": "path/to/file.ts",
      "description": "Clear description of the issue"
    }
  ],
  "security_concerns": ["List security issues, or empty array if none"],
  "performance_concerns": ["List performance issues, or empty array if none"],
  "code_quality_score": 7,
  "recommended_actions": ["Prioritized list of things the author should do"]
}

Severity guidelines:
- CRITICAL: bugs, security vulnerabilities, data loss risks — must fix before merge
- WARNING: code smells, missing error handling, unclear logic — should fix
- SUGGESTION: style, naming, refactoring opportunities — optional improvements

Return only valid JSON, no markdown fences, no extra text.`;

export function buildUserPrompt(prInfo: PRInfo, diff: string): string {
  return `PR: ${prInfo.title}
Author: ${prInfo.author}
Branch: ${prInfo.headBranch} → ${prInfo.baseBranch}
URL: ${prInfo.url}

Description:
${prInfo.body ?? "(no description provided)"}

Diff:
${diff}`;
}
