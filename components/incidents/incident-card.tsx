"use client"

import type { Incident } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckCircle2, ChevronRight } from "lucide-react"

const severityColor: Record<string, string> = {
  critical: "destructive",
  high: "orange",
  medium: "yellow",
  low: "default",
} as const

interface IncidentCardProps {
  incident: Incident
  onClick: () => void
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  )
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  const isResolved = incident.status === "resolved"

  return (
    <button
      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      {isResolved ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-amber-500" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              severityColor[incident.severity] as
                | "destructive"
                | "default"
                | "secondary"
                | "outline"
            }
            className="shrink-0 capitalize"
          >
            {incident.severity}
          </Badge>
          <span className="truncate text-xs text-muted-foreground">
            {incident.service}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium">{incident.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeAgo(incident.created_at)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </button>
  )
}
