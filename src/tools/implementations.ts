/**
 * Tool implementations — the actual functions the agent can call.
 * Each function corresponds to a tool definition in tool-definitions.ts.
 */

import * as fs from "fs"
import * as path from "path"
import { execSync } from "child_process"
import { WORKSPACE_DIR } from "../config"
import { ToolResult } from "../types"

// ─── read_file ────────────────────────────────────────────────────────
export function readFile(args: {
    file_path: string
    start_line?: number
    end_line?: number
}): ToolResult {
    try {
        const filePath = path.resolve(args.file_path)

        if (!fs.existsSync(filePath)) {
            return { success: false, output: "", error: `File not found: ${filePath}` }
        }

        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            return { success: false, output: "", error: `Path is a directory, not a file: ${filePath}` }
        }

        const content = fs.readFileSync(filePath, "utf-8")
        const lines = content.split("\n")

        const startLine = Math.max(1, args.start_line || 1)
        const endLine = Math.min(lines.length, args.end_line || lines.length)

        const selectedLines = lines.slice(startLine - 1, endLine)
        const numberedLines = selectedLines.map((line, i) => `${startLine + i}: ${line}`)

        const header = `File: ${filePath} (${lines.length} lines total, showing ${startLine}-${endLine})`
        return { success: true, output: `${header}\n${numberedLines.join("\n")}` }
    } catch (err: any) {
        return { success: false, output: "", error: `Failed to read file: ${err.message}` }
    }
}

// ─── write_file ───────────────────────────────────────────────────────
export function writeFile(args: {
    file_path: string
    content: string
}): ToolResult {
    try {
        const filePath = path.resolve(args.file_path)
        const dir = path.dirname(filePath)

        // Create parent directories if needed
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        const existed = fs.existsSync(filePath)
        fs.writeFileSync(filePath, args.content, "utf-8")

        const lineCount = args.content.split("\n").length
        const action = existed ? "Updated" : "Created"
        return { success: true, output: `${action} file: ${filePath} (${lineCount} lines)` }
    } catch (err: any) {
        return { success: false, output: "", error: `Failed to write file: ${err.message}` }
    }
}

// ─── search_file ──────────────────────────────────────────────────────
export function searchFile(args: {
    pattern: string
    search_path: string
    is_regex?: boolean
    case_insensitive?: boolean
    include_glob?: string
}): ToolResult {
    try {
        const searchPath = path.resolve(args.search_path)

        if (!fs.existsSync(searchPath)) {
            return { success: false, output: "", error: `Path not found: ${searchPath}` }
        }

        // Build grep command
        const flags: string[] = ["-n", "--color=never"]
        if (args.case_insensitive) flags.push("-i")
        if (!args.is_regex) flags.push("-F") // Fixed string matching
        if (fs.statSync(searchPath).isDirectory()) {
            flags.push("-r")
            if (args.include_glob) {
                flags.push(`--include="${args.include_glob}"`)
            }
        }

        const escapedPattern = args.pattern.replace(/"/g, '\\"')
        const cmd = `grep ${flags.join(" ")} "${escapedPattern}" "${searchPath}" 2>/dev/null | head -100`

        try {
            const result = execSync(cmd, { encoding: "utf-8", maxBuffer: 1024 * 1024 })
            const lines = result.trim().split("\n").filter(Boolean)
            return {
                success: true,
                output: lines.length > 0
                    ? `Found ${lines.length} matches:\n${lines.join("\n")}`
                    : "No matches found."
            }
        } catch {
            // grep returns exit code 1 when no matches found
            return { success: true, output: "No matches found." }
        }
    } catch (err: any) {
        return { success: false, output: "", error: `Search failed: ${err.message}` }
    }
}

// ─── replace_in_file ──────────────────────────────────────────────────
export function replaceInFile(args: {
    file_path: string
    old_text: string
    new_text: string
    replace_all?: boolean
}): ToolResult {
    try {
        const filePath = path.resolve(args.file_path)

        if (!fs.existsSync(filePath)) {
            return { success: false, output: "", error: `File not found: ${filePath}` }
        }

        const content = fs.readFileSync(filePath, "utf-8")

        if (!content.includes(args.old_text)) {
            return {
                success: false,
                output: "",
                error: `Target text not found in ${filePath}. Make sure the text matches exactly (including whitespace and indentation).`
            }
        }

        let newContent: string
        let count: number

        if (args.replace_all) {
            count = content.split(args.old_text).length - 1
            newContent = content.split(args.old_text).join(args.new_text)
        } else {
            count = 1
            const index = content.indexOf(args.old_text)
            newContent = content.substring(0, index) + args.new_text + content.substring(index + args.old_text.length)
        }

        fs.writeFileSync(filePath, newContent, "utf-8")
        return { success: true, output: `Replaced ${count} occurrence(s) in ${filePath}` }
    } catch (err: any) {
        return { success: false, output: "", error: `Replace failed: ${err.message}` }
    }
}

// ─── list_directory ───────────────────────────────────────────────────
export function listDirectory(args: {
    dir_path: string
    recursive?: boolean
    max_depth?: number
}): ToolResult {
    try {
        const dirPath = path.resolve(args.dir_path)

        if (!fs.existsSync(dirPath)) {
            return { success: false, output: "", error: `Directory not found: ${dirPath}` }
        }

        if (!fs.statSync(dirPath).isDirectory()) {
            return { success: false, output: "", error: `Not a directory: ${dirPath}` }
        }

        const maxDepth = args.max_depth || 3
        const results: string[] = []

        function walk(dir: string, depth: number, prefix: string) {
            if (depth > maxDepth) return

            let entries: fs.Dirent[]
            try {
                entries = fs.readdirSync(dir, { withFileTypes: true })
            } catch {
                return
            }

            // Sort: dirs first, then files
            entries.sort((a, b) => {
                if (a.isDirectory() && !b.isDirectory()) return -1
                if (!a.isDirectory() && b.isDirectory()) return 1
                return a.name.localeCompare(b.name)
            })

            for (const entry of entries) {
                // Skip hidden dirs and node_modules
                if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") {
                    continue
                }

                const fullPath = path.join(dir, entry.name)

                if (entry.isDirectory()) {
                    results.push(`${prefix}📁 ${entry.name}/`)
                    if (args.recursive) {
                        walk(fullPath, depth + 1, prefix + "  ")
                    }
                } else {
                    const stat = fs.statSync(fullPath)
                    const size = formatFileSize(stat.size)
                    results.push(`${prefix}📄 ${entry.name} (${size})`)
                }
            }
        }

        walk(dirPath, 1, "")
        return {
            success: true,
            output: `Directory: ${dirPath}\n${results.join("\n") || "(empty)"}`
        }
    } catch (err: any) {
        return { success: false, output: "", error: `List directory failed: ${err.message}` }
    }
}

// ─── run_command ──────────────────────────────────────────────────────
export function runCommand(args: {
    command: string
    cwd?: string
    timeout_ms?: number
}): ToolResult {
    try {
        const cwd = args.cwd ? path.resolve(args.cwd) : WORKSPACE_DIR
        const timeout = args.timeout_ms || 30000

        const result = execSync(args.command, {
            cwd,
            encoding: "utf-8",
            maxBuffer: 5 * 1024 * 1024, // 5MB buffer
            timeout,
            stdio: ["pipe", "pipe", "pipe"]
        })

        return {
            success: true,
            output: result.trim() || "(command completed with no output)"
        }
    } catch (err: any) {
        // Command failed but may have output
        const stdout = err.stdout?.toString().trim() || ""
        const stderr = err.stderr?.toString().trim() || ""
        const output = [stdout, stderr].filter(Boolean).join("\n---\n")

        return {
            success: false,
            output: output || "(no output)",
            error: `Command exited with code ${err.status}: ${args.command}`
        }
    }
}

// ─── Tool dispatcher ──────────────────────────────────────────────────
export function executeTool(name: string, args: any): ToolResult {
    switch (name) {
        case "read_file":
            return readFile(args)
        case "write_file":
            return writeFile(args)
        case "search_file":
            return searchFile(args)
        case "replace_in_file":
            return replaceInFile(args)
        case "list_directory":
            return listDirectory(args)
        case "run_command":
            return runCommand(args)
        default:
            return { success: false, output: "", error: `Unknown tool: ${name}` }
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
