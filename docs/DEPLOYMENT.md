# Deployment Guide

## Docker (local or server)

### Run full stack with Docker Compose

```bash
# From project root
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000 (or via frontend at http://localhost:3000/api)
# MongoDB: localhost:27017
```

Set `JWT_SECRET` in `.env` or export before running:

```bash
export JWT_SECRET=your-secret-key
docker-compose up -d
```

### Build images only (no compose)

```bash
docker build -t movie-booking-backend ./backend
docker build -t movie-booking-frontend ./frontend
```

---

## CI/CD (GitHub Actions)

### Workflow: `ci-cd.yml`

1. **Build & Test** (on every push/PR):
   - Backend: `npm ci || npm install`, `npm test` (with MongoDB service)
   - Frontend: `npm ci || npm install`, `npm run build`

2. **Docker Build & Push** (on push to `main`/`master` only):
   - Build backend and frontend images
   - Push to Docker Hub: `DOCKERHUB_USERNAME/movie-booking-backend`, `DOCKERHUB_USERNAME/movie-booking-frontend`

### Required secrets (GitHub repo → Settings → Secrets and variables → Actions)

| Secret               | Description                          |
|----------------------|--------------------------------------|
| `DOCKERHUB_USERNAME` | Docker Hub username                  |
| `DOCKERHUB_TOKEN`    | Docker Hub access token (or password) |

### Optional: Render deploy hook

- Add secret `RENDER_DEPLOY_HOOK_URL` with your Render service deploy hook URL.
- After Docker push, the workflow will `curl` this URL to trigger a redeploy on Render.

---

## Deploy to Render

### Option A: Render Blueprint (render.yaml)

1. Connect your GitHub repo to [Render](https://render.com).
2. Create a **Blueprint** and point it to this repo; Render will read `render.yaml`.
3. Add environment variables in Dashboard:
   - **Backend:** `MONGODB_URI` (e.g. MongoDB Atlas URI), `CORS_ORIGIN` (frontend URL).
   - **Frontend:** `VITE_API_URL` = backend URL (e.g. `https://movie-booking-backend.onrender.com`).
4. For frontend Docker build, pass `VITE_API_URL` as build arg if your Dockerfile supports it; or build frontend as **Static Site** with build command `npm run build` and set `VITE_API_URL` in environment.

### Option B: Manual Web Services

1. **Backend:** New Web Service → Docker → connect repo, Dockerfile path `backend/Dockerfile`, root `backend`. Add env: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.
2. **Frontend:** **Recommended:** New Static Site → build command `npm run build`, publish directory `dist`. Set env `VITE_API_URL` to your backend URL (e.g. `https://movie-booking-backend.onrender.com`).  
   The repo’s frontend Docker image is intended for **docker-compose** (nginx proxies `/api` to service name `backend`). On Render, services are separate, so use Static Site with `VITE_API_URL`, or build the frontend image with build arg `VITE_API_URL=<backend URL>` and deploy that image.
3. **Database:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGODB_URI` in backend.

### Option C: Run Docker images from Docker Hub

If CI/CD pushes images to Docker Hub:

1. Render → New Web Service → **Docker** → Image: `DOCKERHUB_USERNAME/movie-booking-backend`.
2. New Web Service → Image: `DOCKERHUB_USERNAME/movie-booking-frontend`.
3. Add env vars; for frontend, ensure `VITE_API_URL` was set at image build time or use a frontend that proxies to backend by hostname (e.g. in docker-compose, frontend nginx proxies to `backend`).

---

## Other platforms (AWS, GCP, Azure)

- **Backend:** Run the backend Docker image on ECS, Cloud Run, App Service, or a VM. Set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.
- **Frontend:** Build with `VITE_API_URL` pointing to backend URL; deploy `dist` to S3+CloudFront, Firebase Hosting, or static hosting. Or run the frontend Docker image behind a load balancer.
- **Database:** Use managed MongoDB (Atlas, DocumentDB, etc.) and set `MONGODB_URI`.
