# Websitetemplates

Next.js frontend with a FastAPI backend for template browsing and lead capture.

## Frontend

```bash
npm install
npm run dev
```

## Backend

Run these commands from the repository root so `backend.main` resolves correctly. If you already have `backend/venv`, use it directly.

```bash
backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### Environment variables (recommended)

Create a `.env` file in the repo root or set these in your environment. Values marked REQUIRED must be provided to enable the feature.

```
# Backend & frontend URLs
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
BACKEND_URL=http://127.0.0.1:8000

# Database (optional, defaults to sqlite file)
DATABASE_URL=sqlite:///./backend.db

# JWT for auth
JWT_SECRET_KEY=supersecret

# Cloudinary (REQUIRED for uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (REQUIRED for payments)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# SMTP for emails (REQUIRED to send email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your-smtp-password
```

## Optional environment variables

```bash
set NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
set BACKEND_URL=http://127.0.0.1:8000
```

`NEXT_PUBLIC_BACKEND_URL` lets the browser form submit directly to FastAPI. `BACKEND_URL` lets server-rendered pages fetch backend data during development.
