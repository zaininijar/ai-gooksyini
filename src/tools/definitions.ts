/**
 * OpenAI-compatible tool schemas for function calling.
 * These are sent to the LLM so it knows what tools are available.
 */

import { ToolDefinition } from "../types"

export const TOOL_DEFINITIONS: ToolDefinition[] = [
    {
        type: "function",
        function: {
            name: "read_file",
            description: "Read the contents of a file at the given absolute path. Returns the file content as a string. Use this to inspect code before making changes.",
            parameters: {
                type: "object",
                properties: {
                    file_path: {
                        type: "string",
                        description: "Absolute path to the file to read"
                    },
                    start_line: {
                        type: "number",
                        description: "Optional 1-indexed start line to read from. If omitted, reads from the beginning."
                    },
                    end_line: {
                        type: "number",
                        description: "Optional 1-indexed end line to read to (inclusive). If omitted, reads to the end."
                    }
                },
                required: ["file_path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "write_file",
            description: "Create a new file or overwrite an existing file with the given content. Parent directories will be created if they don't exist.",
            parameters: {
                type: "object",
                properties: {
                    file_path: {
                        type: "string",
                        description: "Absolute path to the file to write"
                    },
                    content: {
                        type: "string",
                        description: "The complete content to write to the file"
                    }
                },
                required: ["file_path", "content"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "search_file",
            description: "Search for a pattern (string or regex) in a file or directory. Returns matching lines with line numbers. Similar to grep.",
            parameters: {
                type: "object",
                properties: {
                    pattern: {
                        type: "string",
                        description: "The search pattern (string or regex)"
                    },
                    search_path: {
                        type: "string",
                        description: "Absolute path to a file or directory to search in"
                    },
                    is_regex: {
                        type: "boolean",
                        description: "If true, treat pattern as a regular expression. Default: false"
                    },
                    case_insensitive: {
                        type: "boolean",
                        description: "If true, perform case-insensitive search. Default: false"
                    },
                    include_glob: {
                        type: "string",
                        description: "Glob pattern to filter files when searching a directory. Example: '*.ts'"
                    }
                },
                required: ["pattern", "search_path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "replace_in_file",
            description: "Replace exact text content in a file. The target text must match exactly (including whitespace). Use this for making precise edits to existing files.",
            parameters: {
                type: "object",
                properties: {
                    file_path: {
                        type: "string",
                        description: "Absolute path to the file to edit"
                    },
                    old_text: {
                        type: "string",
                        description: "The exact text to find and replace. Must match exactly including whitespace."
                    },
                    new_text: {
                        type: "string",
                        description: "The replacement text"
                    },
                    replace_all: {
                        type: "boolean",
                        description: "If true, replace all occurrences. If false (default), replace only the first occurrence."
                    }
                },
                required: ["file_path", "old_text", "new_text"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "list_directory",
            description: "List files and directories at the given path. Returns names, types (file/dir), and sizes.",
            parameters: {
                type: "object",
                properties: {
                    dir_path: {
                        type: "string",
                        description: "Absolute path to the directory to list"
                    },
                    recursive: {
                        type: "boolean",
                        description: "If true, list recursively. Default: false"
                    },
                    max_depth: {
                        type: "number",
                        description: "Maximum depth for recursive listing. Default: 3"
                    }
                },
                required: ["dir_path"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "run_command",
            description: "Execute a shell command in the workspace directory. Use for running tests, installing packages, building, etc. Returns stdout and stderr.",
            parameters: {
                type: "object",
                properties: {
                    command: {
                        type: "string",
                        description: "The shell command to execute"
                    },
                    cwd: {
                        type: "string",
                        description: "Working directory for the command. Defaults to workspace root."
                    },
                    timeout_ms: {
                        type: "number",
                        description: "Timeout in milliseconds. Default: 30000 (30 seconds)"
                    }
                },
                required: ["command"]
            }
        }
    }
]
