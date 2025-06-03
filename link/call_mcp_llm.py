import os
import subprocess

dir = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")


def call_mcp_llm(message: str) -> str:
    """
    Call the MCP LLM with a message and return the response.
    """
    result = subprocess.run(
        ["node", dir + "/call-mcp-llm.js", message], capture_output=True, text=True
    )

    if result.returncode != 0:
        raise RuntimeError(f"Error calling MCP LLM: {result.stderr.strip()}")

    return result.stdout.strip()
