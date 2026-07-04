"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { Incident } from "@/lib/types"
import { listIncidents } from "@/lib/api"
import { IncidentForm } from "@/components/incidents/incident-form"
import { IncidentList } from "@/components/incidents/incident-list"
import { RcaResult } from "@/components/incidents/rca-result"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle, CheckCircle2, Activity, FileSearch } from "lucide-react"

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await listIncidents()
      setIncidents(data)
    } catch {
      // silently fail on initial load
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  const filtered = useMemo(() => {
    if (!search.trim()) return incidents
    const q = search.toLowerCase()
    return incidents.filter(
      (inc) =>
        inc.title.toLowerCase().includes(q) ||
        inc.service.toLowerCase().includes(q) ||
        inc.environment.toLowerCase().includes(q) ||
        inc.severity.toLowerCase().includes(q) ||
        (inc.root_cause?.toLowerCase().includes(q) ?? false)
    )
  }, [incidents, search])

  const openCount = incidents.filter((i) => i.status === "open").length
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length

  function handleCreated(incident: Incident) {
    setIncidents((prev) => [incident, ...prev])
    setSelected(incident)
    toast.success("Incident created", {
      description: `RCA analysis complete for "${incident.title}"`,
    })
  }

  function handleResolved(updated: Incident) {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === updated.id ? updated : inc))
    )
    setSelected(updated)
    toast.success("Incident resolved", {
      description: `"${updated.title}" has been marked as resolved`,
    })
  }

  function handleSelect(incident: Incident) {
    setSelected(incident)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Incident Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Track, analyze, and resolve cloud infrastructure incidents.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">
              {incidents.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Total Incidents</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">
              {openCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Open</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums leading-none">
              {resolvedCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Resolved</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Left panel */}
        <div className="space-y-4 md:col-span-2">
          <IncidentForm onCreated={handleCreated} />

          {loading ? (
            <div className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="space-y-3">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-card shadow-xs">
              <div className="border-b px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    className="pl-8 shadow-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <IncidentList
                incidents={filtered}
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
              />
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="md:col-span-3">
          {selected ? (
            <RcaResult
              key={selected.id + selected.updated_at}
              incident={selected}
              onResolved={handleResolved}
            />
          ) : (
            <div className="flex h-full min-h-[500px] items-center justify-center rounded-xl border border-dashed bg-card/50 p-8">
              <div className="max-w-xs space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <FileSearch className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground/80">
                    No incident selected
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Create a new incident or select one from the list to view its
                    root cause analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
