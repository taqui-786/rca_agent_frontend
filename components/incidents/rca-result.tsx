"use client"

import { useState } from "react"
import type { Incident } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MemoryGraph } from "./memory-graph"
import { ResolveDialog } from "./resolve-dialog"
import {
  Brain,
  Wrench,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react"

interface RcaResultProps {
  incident: Incident
  onResolved: (updated: Incident) => void
}

export function RcaResult({ incident, onResolved }: RcaResultProps) {
  const [resolveOpen, setResolveOpen] = useState(false)

  if (!incident.root_cause) return null

  const recalled = incident.recalled_from?.[0] ?? null
  const isResolved = incident.status === "resolved"

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-5 w-5 text-primary" />
            Root Cause Analysis
            {isResolved && (
              <Badge variant="outline" className="ml-auto text-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Resolved
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Brain className="h-3.5 w-3.5" />
              Root Cause
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {incident.root_cause}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Confidence
            </h4>
            <div className="flex items-center gap-3">
              <Progress
                value={incident.confidence ?? 0}
                className="h-2 flex-1"
              />
              <span className="text-sm font-semibold tabular-nums">
                {incident.confidence ?? "?"}%
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Wrench className="h-3.5 w-3.5" />
              Recommended Fix
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {incident.recommended_fix}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              First Action
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {incident.first_action}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Recalled From
            </h4>
            <MemoryGraph recalled={recalled} />
          </div>

          {!isResolved && (
            <Button
              className="w-full"
              variant="default"
              onClick={() => setResolveOpen(true)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Resolve Incident
            </Button>
          )}

          {isResolved && incident.fix_applied && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Fix Applied
              </h4>
              <p className="mt-1.5 text-sm text-green-600 dark:text-green-300">
                {incident.fix_applied}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResolveDialog
        incident={incident}
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        onResolved={onResolved}
      />
    </>
  )
}
