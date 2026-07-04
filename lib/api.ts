import type { Incident, IncidentCreate, IncidentResolveRequest } from "./types"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export function createIncident(data: IncidentCreate): Promise<Incident> {
  return request("/incidents", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function listIncidents(): Promise<Incident[]> {
  return request("/incidents")
}

export function getIncident(id: number): Promise<Incident> {
  return request(`/incidents/${id}`)
}

export function resolveIncident(
  id: number,
  data: IncidentResolveRequest
): Promise<Incident> {
  return request(`/incidents/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
