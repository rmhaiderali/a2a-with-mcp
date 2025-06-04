import llm from "../mcp-llm.js"

const llmInstance = await llm()

console.log(await llmInstance(process.argv[2] || ""))

process.exit(0)
