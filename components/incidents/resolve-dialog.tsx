"use client"

import { useState } from "react"
import type { Incident, IncidentResolveRequest } from "@/lib/types"
import { resolveIncident } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2 } from "lucide-react"

interface ResolveDialogProps {
  incident: Incident
  open: boolean
  onOpenChange: (open: boolean) => void
  onResolved: (updated: Incident) => void
}

export function ResolveDialog({
  incident,
  open,
  onOpenChange,
  onResolved,
}: ResolveDialogProps) {
  const [confirmedRootCause, setConfirmedRootCause] = useState(
    incident.root_cause || ""
  )
  const [fixApplied, setFixApplied] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResolve() {
    if (!confirmedRootCause.trim() || !fixApplied.trim()) {
      setError("Both fields are required.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data: IncidentResolveRequest = {
        confirmed_root_cause: confirmedRootCause,
        fix_applied: fixApplied,
      }
      const result = await resolveIncident(incident.id, data)
      onResolved(result)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Resolve Incident
          </DialogTitle>
          <DialogDescription>
            Confirm the actual root cause and the fix that was applied.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirmed Root Cause</label>
            <Textarea
              value={confirmedRootCause}
              onChange={(e) => setConfirmedRootCause(e.target.value)}
              placeholder="What actually caused this?"
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Fix Applied</label>
            <Textarea
              value={fixApplied}
              onChange={(e) => setFixApplied(e.target.value)}
              placeholder="e.g. Rolled back deployment to v1.2.3"
              rows={2}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleResolve} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resolving...
              </>
            ) : (
              "Confirm Fix"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
