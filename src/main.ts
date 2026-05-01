/**
 * Gooksyini — AI Coding Assistant
 * Interactive REPL entry point.
 */

import "dotenv/config"   // Load .env before anything else
import * as readline from "readline"
import { Agent } from "./agent"
import { OPENROUTER_API_KEY, DEFAULT_MODEL, WORKSPACE_DIR } from "./config"
import { Model } from "./types"
import { PrintBanner, ThemeColors } from "./decorations"

// ─── Load models from JSON ───────────────────────────────────────────
const MODELS_DATA: Model[] = require("../data/models.json").data

const c = ThemeColors

// ─── Model helpers ───────────────────────────────────────────────────
function getFreeModels() {
    return MODELS_DATA.filter(model => {
        if (!model.endpoint) return false
        // Check if all prices are zero
        const hasPaidPrice = model.endpoint.display_pricing.some(p => Number(p.price) > 0)
        return !hasPaidPrice
    })
}

function getToolCapableModels() {
    return getFreeModels().filter(model => {
        return model.endpoint?.supports_tool_parameters === true
    })
}

// ─── Slash commands ──────────────────────────────────────────────────
function printHelp() {
    console.log(`
${c.bold}${c.cyan}═══ Gooksyini Commands ═══${c.reset}

  ${c.green}/help${c.reset}           Show this help message
  ${c.green}/models${c.reset}         List available free models with tool support
  ${c.green}/model <slug>${c.reset}   Switch to a different model
  ${c.green}/current${c.reset}        Show current model and stats
  ${c.green}/clear${c.reset}          Clear conversation history
  ${c.green}/exit${c.reset}           Quit the assistant
`)
}

function printModels() {
    const models = getToolCapableModels()
    console.log(`\n${c.bold}${c.cyan}═══ Free Models with Tool Support (${models.length}) ═══${c.reset}\n`)

    for (const model of models) {
        const ctx = model.context_length >= 1000
            ? `${Math.round(model.context_length / 1024)}K`
            : `${model.context_length}`
        const reasoning = model.supports_reasoning ? `${c.green}✓ reasoning${c.reset}` : ""
        const slug = model.endpoint?.model_variant_slug || model.slug

        console.log(
            `  ${c.yellow}${slug}${c.reset}` +
            `\n    ${c.dim}${model.short_name} | ${ctx} ctx | ${model.author_display_name}${c.reset} ${reasoning}`
        )
    }
    console.log()
}

// ─── Main REPL ───────────────────────────────────────────────────────
async function main() {
    PrintBanner()

    // Validate API key
    if (!OPENROUTER_API_KEY) {
        console.log(`${c.red}${c.bold}  ⚠ ERROR: OPENROUTER_API_KEY is not set.${c.reset}`)
        console.log(`${c.dim}  Set it with: export OPENROUTER_API_KEY=sk-or-v1-your-key-here${c.reset}\n`)
        process.exit(1)
    }

    // Show stats
    const freeModels = getFreeModels()
    const toolModels = getToolCapableModels()
    console.log(`  ${c.dim}Workspace:${c.reset}  ${WORKSPACE_DIR}`)
    console.log(`  ${c.dim}Model:${c.reset}      ${DEFAULT_MODEL}`)
    console.log(`  ${c.dim}Free models:${c.reset} ${freeModels.length} total, ${toolModels.length} with tool support`)
    console.log()

    // Create agent
    const agent = new Agent()

    // ─── Tab autocomplete ────────────────────────────────────────
    const slashCommands = ["/help", "/models", "/model", "/current", "/clear", "/exit", "/quit"]
    const modelSlugs = toolModels.map(m => m.endpoint?.model_variant_slug || m.slug)

    function completer(line: string): [string[], string] {
        const trimmed = line.trimStart()

        // Autocomplete model slug after "/model "
        if (trimmed.startsWith("/model ")) {
            const partial = trimmed.slice(7) // after "/model "
            const hits = modelSlugs.filter(s => s.startsWith(partial))
            return [hits.length ? hits : modelSlugs, partial]
        }

        // Autocomplete slash commands
        if (trimmed.startsWith("/")) {
            const hits = slashCommands.filter(cmd => cmd.startsWith(trimmed))
            return [hits.length ? hits : slashCommands, trimmed]
        }

        return [[], line]
    }

    // Setup readline with autocomplete
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${c.bold}${c.green}you ▶${c.reset} `,
        completer,
    })

    rl.prompt()

    rl.on("line", async (line: string) => {
        const input = line.trim()

        if (!input) {
            rl.prompt()
            return
        }

        // Handle slash commands
        if (input.startsWith("/")) {
            const [cmd, ...args] = input.split(" ")

            switch (cmd.toLowerCase()) {
                case "/help":
                    printHelp()
                    break

                case "/models":
                    printModels()
                    break

                case "/model":
                    if (args.length === 0) {
                        console.log(`${c.yellow}Usage: /model <slug>${c.reset}`)
                        console.log(`${c.dim}Example: /model google/gemma-4-31b-it:free${c.reset}`)
                    } else {
                        agent.setModel(args.join(" "))
                    }
                    break

                case "/current":
                    console.log(`\n  ${c.cyan}Model:${c.reset}   ${agent.getModel()}`)
                    console.log(`  ${c.cyan}History:${c.reset} ${agent.getHistoryLength()} messages\n`)
                    break

                case "/clear":
                    agent.clearHistory()
                    break

                case "/exit":
                case "/quit":
                case "/q":
                    console.log(`\n${c.dim}Goodbye! 👋${c.reset}\n`)
                    process.exit(0)

                default:
                    console.log(`${c.yellow}Unknown command: ${cmd}. Type /help for available commands.${c.reset}`)
            }

            rl.prompt()
            return
        }

        // Send message to agent
        console.log()
        try {
            const response = await agent.chat(input)
            console.log(`\n${c.bold}${c.cyan}gooksyini ▶${c.reset} ${response}\n`)
        } catch (err: any) {
            console.log(`\n${c.red}Error: ${err.message}${c.reset}\n`)
        }

        rl.prompt()
    })

    rl.on("close", () => {
        console.log(`\n${c.dim}Goodbye! 👋${c.reset}\n`)
        process.exit(0)
    })
}

main()