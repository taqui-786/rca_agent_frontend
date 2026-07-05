"use client"

import { useState } from "react"
import type { IncidentCreate, Incident } from "@/lib/types"
import { createIncident } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Paperclip } from "lucide-react"

interface IncidentFormProps {
  onCreated: (incident: Incident) => void
}

export function IncidentForm({ onCreated }: IncidentFormProps) {
  const [title, setTitle] = useState("")
  const [severity, setSeverity] = useState<string>("")
  const [service, setService] = useState("")
  const [environment, setEnvironment] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !severity || !service || !environment) {
      setError("Title, severity, service, and environment are required.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data: IncidentCreate = {
        title,
        severity: severity as IncidentCreate["severity"],
        service,
        environment,
        symptoms,
      }
      const result = await createIncident(data)
      onCreated(result)
      setTitle("")
      setSeverity("")
      setService("")
      setEnvironment("")
      setSymptoms("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create incident")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-4 w-4" />
          Report Incident
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Title
            </label>
            <Input
              placeholder="e.g. API gateway timeout on payment service"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Severity
              </label>
              <Select
                value={severity}
                onValueChange={(val) => setSeverity(val ?? "")}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Service
              </label>
              <Input
                placeholder="e.g. payment-gateway"
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Environment
            </label>
            <Input
              placeholder="e.g. production, staging"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Symptoms
            </label>
            <Textarea
              placeholder="Describe what's happening..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">
                Attach logs
              </label>
              <Badge variant="secondary" className="text-[10px]">
                Coming soon
              </Badge>
            </div>
            <div
              className="flex cursor-not-allowed items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground opacity-60"
              title="Log upload isn't supported by the backend yet — the RCA API only accepts title, severity, service, environment, and symptoms. Tracked as a future enhancement."
            >
              <Paperclip className="h-3.5 w-3.5" />
              Log upload will be available once the backend API supports it
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Submit Incident"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
