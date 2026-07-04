"use client"

import type { RecalledFromItem } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface MemoryGraphProps {
  recalled: RecalledFromItem | null
}

export function MemoryGraph({ recalled }: MemoryGraphProps) {
  if (!recalled) {
    return (
      <Card className="p-4 text-center text-sm text-muted-foreground">
        No historical context available for this incident.
      </Card>
    )
  }

  const boxes = [
    { label: "Symptom", value: recalled.symptom },
    { label: "Service", value: recalled.service },
    { label: "Past Fix", value: recalled.fix },
    { label: "RCA Derived", value: "root cause analysis" },
  ]

  return (
    <div className="flex items-center justify-center gap-1 overflow-x-auto py-2">
      {boxes.map((box, i) => (
        <div key={box.label} className="flex items-center gap-1">
          <div className="flex flex-col items-center rounded-md border bg-muted/30 px-3 py-2 text-center min-w-[100px]">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {box.label}
            </span>
            <span className="mt-0.5 text-xs font-medium leading-tight">
              {box.value}
            </span>
          </div>
          {i < boxes.length - 1 && (
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  )
}
