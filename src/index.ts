import * as dotenv from "dotenv";
import { getPRInfo, getPRFiles, getPRDiff, type PRFile } from "./github.js";

dotenv.config();

async function main() {
  // Test with a real public PR
  const owner = "octocat";
  const repo = "Hello-World";
  const prNumber = 1;

  console.log("Fetching PR info...");
  const info = await getPRInfo(owner, repo, prNumber);
  console.log("PR Info:", JSON.stringify(info, null, 2));

  console.log("\nFetching PR files...");
  const files = await getPRFiles(owner, repo, prNumber);
  console.log(`Files changed: ${files.length}`);
  files.forEach((f: PRFile) => console.log(`  ${f.status} ${f.filename}`));

  console.log("\nFetching PR diff...");
  const diff = await getPRDiff(owner, repo, prNumber);
  console.log(diff || "(no diff available)");
}

main().catch(console.error);
