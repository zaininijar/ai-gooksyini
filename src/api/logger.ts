import * as fs from "fs"
import * as path from "path"

const LOG_FILE = path.resolve(process.cwd(), "logs/api.txt")

/**
 * Logs API requests and responses as a single line for simplicity.
 */
export function logApiCall(type: "request" | "response", data: any) {
    try {
        const logDir = path.dirname(LOG_FILE)
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true })
        }

        const timestamp = new Date().toLocaleString()
        const content = JSON.stringify(data) // Single line JSON
        const entry = `[${timestamp}] ${type.toUpperCase()}: ${content}\n`

        fs.appendFileSync(LOG_FILE, entry, "utf-8")
    } catch (err) {
        console.error("Failed to write API log:", err)
    }
}
