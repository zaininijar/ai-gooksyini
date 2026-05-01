# Gooksyini — AI Coding Assistant

<img src="assets/logo.png" height="150" alt="Gooksyini Logo">

An agentic AI coding assistant that runs in your terminal. Powered by **free** LLM models via [OpenRouter](https://openrouter.ai).

Gooksyini can read, write, search, and edit files in your project — just describe what you want in natural language.

## Features

- **6 built-in tools** — read, write, search, replace files + list dirs + run shell commands
- **Agentic loop** — autonomously chains multiple tool calls to complete tasks
- **Free models** — uses OpenRouter's free tier (Gemma 4, Llama, Qwen, etc.)
- **Model switching** — swap models on the fly with `/model <slug>`
- **Colored terminal UI** — readable logs for every tool call and result

## Project Structure

```
ai-gooksyini/
├── src/
│   ├── main.ts              # REPL entry point (interactive chat)
│   ├── agent.ts             # Agentic loop (LLM ↔ tools cycle)
│   ├── api/
│   │   └── index.ts         # OpenRouter API client
│   ├── config/
│   │   └── index.ts         # Configuration & system prompt
│   ├── decorations/
│   │   ├── index.ts         # Barrel export
│   │   ├── banner.ts        # ASCII Banner logic
│   │   └── colors.ts        # ANSI Color themes
│   ├── tools/
│   │   ├── index.ts         # Barrel export
│   │   ├── definitions.ts   # OpenAI-format tool schemas
│   │   └── implementations.ts  # Tool functions (fs, shell)
│   └── types/
│       ├── index.ts         # Barrel export
│       ├── api.ts           # ChatMessage, ToolCall, etc.
│       ├── models.ts        # OpenRouter model data types
│       └── tools.ts         # ToolResult, ToolDefinition
├── data/
│   └── models.json          # OpenRouter model catalog
├── assets/
│   └── logo.png             # Project logo
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
yarn install
```

### 2. Set up your API key

```bash
cp .env.example .env
# Edit .env and paste your OpenRouter API key
```

Or export it directly:

```bash
export OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

> 📌 Get a free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

### 3. Run

```bash
yarn start
```

## Usage

Once running, you'll see an interactive prompt. Just type what you want:

```
you ▶ baca file package.json dan tambahkan script "test"
```

The agent will:
1. Read the file using `read_file`
2. Modify the content using `replace_in_file`
3. Verify the result

### Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/models` | List free models with tool calling support |
| `/model <slug>` | Switch to a different model |
| `/current` | Show current model and conversation stats |
| `/clear` | Clear conversation history |
| `/exit` | Quit |

### Example: Switch Model

```
you ▶ /model qwen/qwen3-coder-480b-a35b:free
⚙ Model switched to: qwen/qwen3-coder-480b-a35b:free
```

## Available Tools

| Tool | What it does |
|------|-------------|
| `read_file` | Read file content (with optional line range) |
| `write_file` | Create or overwrite a file |
| `search_file` | Grep for a pattern in files/directories |
| `replace_in_file` | Find & replace exact text in a file |
| `list_directory` | List directory contents (with tree view) |
| `run_command` | Execute shell commands |

## Configuration

All configuration is in `src/config.ts`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DEFAULT_MODEL` | `google/gemma-4-31b-it:free` | Default LLM model |
| `MAX_TOOL_ITERATIONS` | `25` | Max tool call loops per message |
| `MAX_COMPLETION_TOKENS` | `16384` | Max output tokens per API call |
| `WORKSPACE_DIR` | `process.cwd()` | Working directory for the agent |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | Your OpenRouter API key |
| `WORKSPACE_DIR` | ❌ | Override the workspace directory |

## Author

**Ahmad Zaini Nijar**
- Email: [zaininijar@gmail.com](mailto:zaininijar@gmail.com)
- GitHub: [@zaininijar](https://github.com/zaininijar)

## License

MIT
