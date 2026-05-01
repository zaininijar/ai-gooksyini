/**
 * Types for the OpenRouter chat completions API.
 */

export interface ChatMessage {
    role: "system" | "user" | "assistant" | "tool"
    content: string | null
    tool_calls?: ToolCall[]
    tool_call_id?: string
    name?: string
}

export interface ToolCall {
    id: string
    type: "function"
    function: {
        name: string
        arguments: string
    }
}

export interface ChatCompletionResponse {
    id: string
    choices: {
        index: number
        message: {
            role: string
            content: string | null
            tool_calls?: ToolCall[]
        }
        finish_reason: string
    }[]
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}
