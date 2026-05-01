import { ThemeColors } from "./colors"

// ─── Banner ──────────────────────────────────────────────────────────
export const PrintBanner = () => {
    console.log(`
${ThemeColors.bold}${ThemeColors.magenta}   ██████╗  ██████╗  ██████╗ ██╗  ██╗███████╗██╗   ██╗██╗███╗   ██╗██╗
  ██╔════╝ ██╔═══██╗██╔═══██╗██║ ██╔╝██╔════╝╚██╗ ██╔╝██║████╗  ██║██║
  ██║  ███╗██║   ██║██║   ██║█████╔╝ ███████╗ ╚████╔╝ ██║██╔██╗ ██║██║
  ██║   ██║██║   ██║██║   ██║██╔═██╗ ╚════██║  ╚██╔╝  ██║██║╚██╗██║██║
  ╚██████╔╝╚██████╔╝╚██████╔╝██║  ██╗███████║   ██║   ██║██║ ╚████║██║
   ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚═╝${ThemeColors.reset}

  ${ThemeColors.cyan}AI Coding Assistant${ThemeColors.reset} ${ThemeColors.dim}— by Ahmad Zaini Nijar${ThemeColors.reset}
  ${ThemeColors.dim}Type ${ThemeColors.green}/help${ThemeColors.dim} for commands, or just start chatting.${ThemeColors.reset}
`)
}
