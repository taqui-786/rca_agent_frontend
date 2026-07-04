export interface IncidentCreate {
  title: string
  severity: "critical" | "high" | "medium" | "low"
  service: string
  environment: string
  symptoms: string
}

export interface RecalledFromItem {
  incident_title: string
  symptom: string
  service: string
  fix: string
}

export interface Incident {
  id: number
  title: string
  severity: string
  service: string
  environment: string
  symptoms: string | null
  status: string
  created_at: string
  updated_at: string
  root_cause: string | null
  confidence: number | null
  recommended_fix: string | null
  first_action: string | null
  recalled_from: RecalledFromItem[] | null
  fix_applied: string | null
}

export interface IncidentResolveRequest {
  confirmed_root_cause: string
  fix_applied: string
}
