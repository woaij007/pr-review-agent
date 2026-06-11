import { Octokit } from "octokit";
import * as dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface PRInfo {
  title: string;
  body: string | null;
  author: string;
  baseBranch: string;
  headBranch: string;
  url: string;
}

export interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export async function getPRInfo(
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRInfo> {
  const { data } = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });
  return {
    title: data.title,
    body: data.body,
    author: data.user?.login ?? "unknown",
    baseBranch: data.base.ref,
    headBranch: data.head.ref,
    url: data.html_url,
  };
}

export async function getPRFiles(
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRFile[]> {
  const { data } = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: prNumber });
  return data.map((f) => ({
    filename: f.filename,
    status: f.status,
    additions: f.additions,
    deletions: f.deletions,
    ...(f.patch !== undefined && { patch: f.patch }),
  }));
}

export async function getPRDiff(
  owner: string,
  repo: string,
  prNumber: number
): Promise<string> {
  const files = await getPRFiles(owner, repo, prNumber);
  return files
    .filter((f) => f.patch)
    .map((f) => `--- ${f.filename} (${f.status}: +${f.additions} -${f.deletions})\n${f.patch}`)
    .join("\n\n");
}
