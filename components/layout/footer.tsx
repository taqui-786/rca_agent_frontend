import { GitFork } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95">
      <div className="flex h-12 items-center justify-center px-4 md:px-6">
        <a
          href="https://github.com/taqui-786/rca_agent_frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <GitFork className="h-3.5 w-3.5" />
          View on GitHub
        </a>
      </div>
    </footer>
  )
}
