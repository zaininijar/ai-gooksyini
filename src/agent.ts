/**
 * Agent loop — the core brain of the coding assistant.
 * Manages the conversation, handles tool calls, and loops
 * until the model produces a final text response.
 */

import { SYSTEM_PROMPT, DEFAULT_MODEL, MAX_TOOL_ITERATIONS } from "./config"
import { chatCompletion } from "./api"
import { executeTool } from "./tools"
import { ChatMessage, ToolCall } from "./types"

// ─── Color helpers for terminal output ────────────────────────────────
const colors = {
    reset: "\x1b[0m",
    dim: "\x1b[2m",
    bold: "\x1b[1m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
}

function log(color: string, prefix: string, message: string) {
    console.log(`${color}${prefix}${colors.reset} ${message}`)
}

// ─── Agent class ──────────────────────────────────────────────────────
export class Agent {
    private messages: ChatMessage[] = []
    private model: string
    private totalTokens: number = 0

    constructor(model?: string) {
        this.model = model || DEFAULT_MODEL
        this.messages.push({
            role: "system",
            content: SYSTEM_PROMPT
        })
    }

    /** Get the current model slug */
    getModel(): string {
        return this.model
    }

    /** Switch to a different model */
    setModel(model: string): void {
        this.model = model
        log(colors.cyan, "⚙", `Model switched to: ${this.model}`)
    }

    /** Get conversation history length */
    getHistoryLength(): number {
        return this.messages.length
    }

    /** Clear conversation history (keeps system prompt) */
    clearHistory(): void {
        this.messages = [this.messages[0]]
        this.totalTokens = 0
        log(colors.cyan, "🧹", "Conversation history cleared.")
    }

    /**
     * Send a user message and run the full agent loop.
     * The agent will keep calling tools until it produces a final text response
     * or hits the max iteration limit.
     */
    async chat(userMessage: string): Promise<string> {
        // Add user message to history
        this.messages.push({
            role: "user",
            content: userMessage
        })

        let iterations = 0

        while (iterations < MAX_TOOL_ITERATIONS) {
            iterations++

            // Call the LLM
            log(colors.dim, "  ⏳", `Thinking... (iteration ${iterations})`)

            let response
            try {
                response = await chatCompletion(this.model, this.messages)
            } catch (err: any) {
                log(colors.red, "  ❌", `API Error: ${err.message}`)
                return `Error: ${err.message}`
            }

            // Track token usage
            if (response.usage) {
                this.totalTokens += response.usage.total_tokens
            }

            const choice = response.choices?.[0]
            if (!choice) {
                log(colors.red, "  ❌", "Empty response from model")
                return "Error: Empty response from model"
            }

            const assistantMessage = choice.message

            // Add assistant message to history
            this.messages.push({
                role: "assistant",
                content: assistantMessage.content,
                tool_calls: assistantMessage.tool_calls
            })

            // Check if the model wants to call tools
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
                // Execute each tool call
                for (const toolCall of assistantMessage.tool_calls) {
                    await this.handleToolCall(toolCall)
                }

                // Continue the loop — the model will see tool results and decide next step
                continue
            }

            // No tool calls — this is the final response
            const finalResponse = assistantMessage.content || "(no response)"
            log(colors.dim, "  📊", `${iterations} iteration(s), ~${this.totalTokens} total tokens used`)
            return finalResponse
        }

        // Hit max iterations
        log(colors.yellow, "  ⚠️", `Hit max tool iterations (${MAX_TOOL_ITERATIONS})`)
        return "I've reached the maximum number of tool call iterations. Please try breaking your request into smaller steps."
    }

    /**
     * Execute a single tool call and add the result to conversation history.
     */
    private async handleToolCall(toolCall: ToolCall): Promise<void> {
        const functionName = toolCall.function.name
        let args: any

        try {
            args = JSON.parse(toolCall.function.arguments)
        } catch {
            log(colors.red, "  ❌", `Failed to parse arguments for ${functionName}`)
            this.messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: "Error: Failed to parse tool arguments as JSON"
            })
            return
        }

        // Log tool usage
        const argsPreview = this.formatToolArgs(functionName, args)
        log(colors.magenta, `  🔧 ${functionName}`, argsPreview)

        // Execute the tool
        const result = executeTool(functionName, args)

        // Log result summary
        if (result.success) {
            const preview = result.output.length > 120
                ? result.output.substring(0, 120) + "..."
                : result.output
            log(colors.green, "  ✅", preview.split("\n")[0])
        } else {
            log(colors.red, "  ❌", result.error || "Tool execution failed")
        }

        // Add tool result to conversation
        const toolResultContent = result.success
            ? result.output
            : `Error: ${result.error}\n${result.output}`

        // Truncate very long outputs to avoid context overflow
        const maxOutputLength = 10000
        const truncatedOutput = toolResultContent.length > maxOutputLength
            ? toolResultContent.substring(0, maxOutputLength) + `\n\n... (truncated, ${toolResultContent.length} total chars)`
            : toolResultContent

        this.messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: truncatedOutput
        })
    }

    /**
     * Format tool arguments for logging preview
     */
    private formatToolArgs(name: string, args: any): string {
        switch (name) {
            case "read_file":
                return args.file_path + (args.start_line ? ` (L${args.start_line}-${args.end_line || "end"})` : "")
            case "write_file":
                return `${args.file_path} (${args.content?.split("\n").length || 0} lines)`
            case "search_file":
                return `"${args.pattern}" in ${args.search_path}`
            case "replace_in_file":
                return args.file_path
            case "list_directory":
                return `${args.dir_path}${args.recursive ? " (recursive)" : ""}`
            case "run_command":
                return args.command.length > 80 ? args.command.substring(0, 80) + "..." : args.command
            default:
                return JSON.stringify(args).substring(0, 80)
        }
    }
}
