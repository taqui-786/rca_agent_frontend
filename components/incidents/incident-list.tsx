"use client"

import type { Incident } from "@/lib/types"
import { IncidentCard } from "./incident-card"
import { FolderOpen } from "lucide-react"

interface IncidentListProps {
  incidents: Incident[]
  selectedId: number | null
  onSelect: (incident: Incident) => void
}

export function IncidentList({
  incidents,
  selectedId,
  onSelect,
}: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <FolderOpen className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {selectedId ? "No matching incidents" : "No incidents yet"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">
          Submit a new incident above to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {incidents.map((inc) => (
        <div
          key={inc.id}
          className={
            selectedId === inc.id
              ? "bg-primary/5 ring-2 ring-inset ring-primary"
              : undefined
          }
        >
          <IncidentCard incident={inc} onClick={() => onSelect(inc)} />
        </div>
      ))}
    </div>
  )
}
