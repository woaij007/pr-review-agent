import { z } from "zod";

export const IssueSeverity = z.enum(["CRITICAL", "WARNING", "SUGGESTION"]);

export const IssueSchema = z.object({
  severity: IssueSeverity,
  file: z.string(),
  description: z.string(),
});

export const ReviewSchema = z.object({
  summary: z.string(),
  issues: z.array(IssueSchema),
  security_concerns: z.array(z.string()),
  performance_concerns: z.array(z.string()),
  code_quality_score: z.number().min(1).max(10),
  recommended_actions: z.array(z.string()),
});

export type Issue = z.infer<typeof IssueSchema>;
export type Review = z.infer<typeof ReviewSchema>;
