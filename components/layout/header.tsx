"use client"

import { Cloud } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Cloud className="h-5 w-5 text-primary" />
          <span>Cloud Incident RCA Engine</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground md:inline">
            Institutional Memory for Cloud Teams
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
