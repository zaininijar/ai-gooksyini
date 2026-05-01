/**
 * Types for the tool system.
 */

export interface ToolResult {
    success: boolean
    output: string
    error?: string
}

export interface ToolDefinition {
    type: "function"
    function: {
        name: string
        description: string
        parameters: Record<string, any>
    }
}
