# Cloud Incident RCA Engine — Frontend

Next.js dashboard for the [Cloud Incident Memory & RCA Engine](https://github.com/taqui-786/rca_agent_frontend): report an incident, get back an LLM-generated root-cause analysis pulled from similar past incidents recalled via [Cognee](https://cognee.ai), and confirm fixes so the system's memory improves over time.

This app is a thin REST client — all recall/reasoning/memory logic lives in the FastAPI backend (`RCA_agent_backend`). See `lib/api.ts` for the full request layer.

## Features

- **Report Incident** — form to submit title, severity, service, environment, and symptoms.
- **RCA Result** — root cause, confidence, recommended fix, and first action returned by the backend.
- **Memory Graph** — a small visual (symptom → service → past fix → recommendation) built from the `recalled_from` field in the RCA response — not a real graph database view.
- **Incident History** — list of incidents submitted so far, with severity and status.
- **Resolve** — confirm the root cause and fix that actually worked, feeding it back into the backend's memory so future recalls improve.

Log/attachment upload is scaffolded in the incident form but disabled — the backend API doesn't accept it yet (see `IncidentCreate` in `lib/types.ts`).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000   # base URL of the FastAPI backend; defaults to this if unset
```

Run the backend (`RCA_agent_backend`) separately — see its README for setup. Without it running, incident submission and resolve will fail.

## Tech stack

- **Next.js 16** (App Router) + React 19
- **Tailwind CSS 4** + shadcn/ui components (`components/ui/`)
- **next-themes** for light/dark mode
- **sonner** for toasts

## Project structure

```
app/
  layout.tsx, page.tsx      # root layout + dashboard page
components/
  layout/                   # header, footer, theme toggle
  incidents/
    incident-form.tsx       # report-incident form
    rca-result.tsx          # RCA output view
    memory-graph.tsx        # recalled_from visual
    incident-list.tsx       # history list
    incident-card.tsx
    resolve-dialog.tsx      # confirm root cause + fix
  ui/                       # shadcn primitives
lib/
  api.ts                    # REST client — POST/GET /incidents, POST /incidents/{id}/resolve
  types.ts                  # request/response types matching the backend's API contract
```

## API contract

The frontend expects the backend to expose:

```
POST /incidents                    → Incident (includes RCA fields)
GET  /incidents                    → Incident[]
GET  /incidents/{id}               → Incident
POST /incidents/{id}/resolve       → Incident
```

See `lib/types.ts` for exact request/response shapes.
