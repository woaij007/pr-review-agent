import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Anthropic();

async function main() {
const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 64,
    messages: [{ role: "user", content: "Say: PR Review Agent ready." }],
});
console.log((message.content[0] as { text: string }).text);
}

main();