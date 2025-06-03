import prompts from "prompts"
import llm from "./mcp-llm.js"

const llmInstance = await llm(true)

while (true) {
  const response = await prompts(
    {
      type: "text",
      name: "userInput",
      message: "Enter your prompt:",
    },
    { onCancel: () => process.exit() }
  )

  if (!response.userInput) {
    continue
  }

  if (response.userInput.toLowerCase() === "exit") {
    break
  }

  await llmInstance(response.userInput)
}

// => example prompts:
// use tool to get location of ip 223.123.43.3
// use tool to get IPs of google.com

// use tool to get IPs of therankai.com and aws.therankai.com
// what does this means, can you tell me location where these site are deployed

// => invalid prompt:
// use tool to get location of ip 223.123.43 , dont ask to complete ip , just invoke tool
