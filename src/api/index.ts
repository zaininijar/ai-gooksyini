/**
 * OpenRouter API client.
 * Handles sending chat completions with tool calling support.
 */

import { OPENROUTER_API_KEY, OPENROUTER_BASE_URL, MAX_COMPLETION_TOKENS } from "../config"
import { TOOL_DEFINITIONS } from "../tools/definitions"
import { ChatMessage, ChatCompletionResponse } from "../types"

// Re-export types so existing consumers don't break
export type { ChatMessage, ToolCall, ChatCompletionResponse } from "../types"

// ─── API call ─────────────────────────────────────────────────────────
export async function chatCompletion(
    model: string,
    messages: ChatMessage[],
    useTools: boolean = true
): Promise<ChatCompletionResponse> {
    if (!OPENROUTER_API_KEY) {
        throw new Error(
            "OPENROUTER_API_KEY is not set. Please set it as an environment variable:\n" +
            "  export OPENROUTER_API_KEY=sk-or-v1-your-key-here"
        )
    }

    const body: Record<string, any> = {
        model,
        messages,
        max_tokens: MAX_COMPLETION_TOKENS,
    }

    if (useTools) {
        body.tools = TOOL_DEFINITIONS
        body.tool_choice = "auto"
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/ai-gooksyini",
            "X-Title": "Gooksyini AI Coding Assistant"
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`)
    }

    const data = await response.json() as ChatCompletionResponse
    return data
}
