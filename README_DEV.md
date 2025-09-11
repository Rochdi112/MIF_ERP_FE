Frontend dev & smoke-test quick guide

1) Install dependencies

```powershell
cd VITE-FRONTEND-ERP-MIF-MAROC
npm install
```

2) Provide backend URL to the frontend

- Option A (recommended): create a local env file
  - Copy `.env.example` to `.env.local` and edit if needed

```powershell
copy .\.env.example .\.env.local
# then edit .env.local if your backend is not at http://localhost:8000
```

- Option B: set in PowerShell for current session

```powershell
$env:VITE_API_BASE_URL="http://localhost:8000"
```

3) Run dev server

```powershell
npm run dev
```

Open the app at the URL printed by Vite (default: http://localhost:5173). Use demo accounts on the login page:
- admin / admin
- responsable / responsable
- technicien / technicien
- client / client

Smoke test checklist:
- Login with a demo account
- Go to Interventions, verify list loads
- Create a new intervention (fill title, type, equipment id)
- Open the intervention details and try uploading a small file

Troubleshooting:
- If you see CORS errors in the browser, ensure the backend is running and `CORS_ALLOW_ORIGINS` includes the origin (http://localhost:5173). The backend repo already includes this in `app/core/config.py`.
- If the frontend cannot reach the backend running in Docker on Windows, try `VITE_API_BASE_URL=http://host.docker.internal:8000`.
