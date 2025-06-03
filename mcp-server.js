// {
//   "mcpServers": {
//     "get-location-by-ip": {
//       "command": "node",
//       "args": ["mcp-server.js"]
//     }
//   }
// }

import { exec } from "node:child_process"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import validator from "validator"
import { z } from "zod"

const server = new McpServer({
  name: "Server",
  version: "1.0.0",
})

server.tool(
  //
  "get_ips_by_domain",
  {
    domain: z
      .string({
        description:
          "A fully qualified domain name (e.g. example.com, subdomain.example.com) excluding ip addresses",
        examples: ["example.com", "subdomain.example.com"],
      })
      .refine((string) => validator.isFQDN(string), {
        message: "Must be a valid hostname",
      }),
    // .refine(
    //   (string) => {
    //     try {
    //       new URL("https://root:admin@" + string + ":80/")
    //       return true
    //     } catch {
    //       return false
    //     }
    //   },
    //   { message: "Must be a valid hostname" }
    // )
    // .refine(
    //   (string) => {
    //     try {
    //       z.string().ip().parse(string)
    //       return false
    //     } catch {
    //       return true
    //     }
    //   },
    //   { message: "Must not be an IP address" }
    // ),
  },
  async ({ domain }) => {
    const resp = await fetch("https://ipleak.net/json/" + domain)
    const { error, ips } = await resp.json()
    return error ? { error } : { ips: Object.keys(ips) }
  }
)

server.tool(
  //
  "get_location_by_ip",
  { ip: z.string().ip() },
  async ({ ip }) => {
    const resp = await fetch("https://ipleak.net/json/" + ip)
    return await resp.json()
  }
)

server.tool(
  //
  "discover_agents",
  { query: z.string() },
  async ({ query }) => {
    return {
      agents: [
        {
          description:
            "A agent that can help you to find location of IP addresses and IP addresses of domains",
          name: "IP and Domain Agent",
          skills: [
            {
              description: "get location based on IP address",
              examples: ["what is the location of 223.123.43.3"],
              name: "location-from-ip",
            },
            {
              description: "get IP addresses based on domain name",
              examples: ["what are the IPs of example.com"],
              name: "ips-from-domain",
            },
          ],
          url: "http://localhost:9999",
        },
      ],
    }
  }
)

server.tool(
  //
  "call_agent",
  {
    url: z
      .string({
        description:
          "The URL of the agent to call (e.g. http://localhost:9999)",
      })
      .url(),
    prompt: z.string({
      description:
        "The prompt to send to the agent (e.g. " +
        "For a weather agent prompt could be: What is the weather in New York?, " +
        "For a finnance agent prompt could be: What is the current stock price of Apple?" +
        ")",
    }),
  },
  async ({ url, prompt }) => {
    return new Promise((resolve) => {
      exec(
        `uv run a2a_client.py "${url}" "${prompt}"`,
        (error, stdout, stderr) => {
          if (error) {
            resolve({ error: error.message })
            return
          }
          if (stderr) {
            resolve({ error: stderr })
            return
          }
          try {
            const { parts } = JSON.parse(stdout.trim()).result
            resolve({ parts })
          } catch (e) {
            resolve({ error: "Failed to parse response from agent" })
          }
        }
      )
    })
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
