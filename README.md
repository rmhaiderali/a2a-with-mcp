### Usage

Copy .env.example to .env

And set OPENROUTER_API_KEY

You must have installed `node >= 22` and `python >= 3.13`

Install uv (a replacement of pip)

```sh
pip install uv
```

Install Node dependencies

```sh
npm i
```

Install Python dependencies

```sh
uv sync
```

Run CLI

```sh
node cli
```

Run A2A Server

```sh
uv run a2a_server.py
```

Run A2A Client

```sh
uv run a2a_client.py "<server_url>" "<prompt>"
```

### Implementations Used

A2A: https://github.com/google-a2a/a2a-python \
MCP: https://github.com/modelcontextprotocol/typescript-sdk
