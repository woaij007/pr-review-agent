import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import type { PRInfo } from "./github.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt.js";
import { ReviewSchema, type Review } from "./types.js";

dotenv.config();

const client = new Anthropic();

// ~100k tokens at 4 chars/token
const MAX_DIFF_CHARS = 400_000;

function truncateDiff(diff: string): string {
  if (diff.length <= MAX_DIFF_CHARS) return diff;
  return (
    diff.slice(0, MAX_DIFF_CHARS) +
    "\n\n[... diff truncated: exceeded 100k token limit ...]"
  );
}

export async function reviewPR(prInfo: PRInfo, diff: string): Promise<Review> {
  const userPrompt = buildUserPrompt(prInfo, truncateDiff(diff));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!textBlock) {
    throw new Error("No text response from Claude");
  }

  const raw = textBlock.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  return ReviewSchema.parse(JSON.parse(raw));
}
