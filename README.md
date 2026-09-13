# SettleEase — Complete Project Documentation

> **Indian Relocation Buddy** — Full-Stack Web Application  
> Tech Stack: Django REST + React (Vite) + SQLite + ChromaDB + Docker

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features Added (Session-wise)](#2-features-added)
3. [Architecture](#3-architecture)
4. [Backend — Django REST API](#4-backend--django-rest-api)
5. [Frontend — React + Vite](#5-frontend--react--vite)
6. [Authentication System](#6-authentication-system)
7. [Services Module](#7-services-module)
8. [Requirements Module](#8-requirements-module)
9. [Provider Dashboard](#9-provider-dashboard)
10. [User Dashboard](#10-user-dashboard)
11. [Admin Dashboard](#11-admin-dashboard)
12. [Docker Setup](#12-docker-setup)
13. [CI/CD — GitHub Actions](#13-cicd--github-actions)
14. [Cloudflare Deployment](#14-cloudflare-deployment)
15. [Environment Variables](#15-environment-variables)
16. [API Reference](#16-api-reference)
17. [Database Schema](#17-database-schema)
18. [Running Locally](#18-running-locally)
19. [Changelog](#19-changelog)

---

## 1. Project Overview

**SettleEase** is a platform that helps Indians relocating to a new city find:
- PG / Flats
- Tiffin / Food services
- Local services (plumber, electrician, maid, internet)
- Emergency contacts
- Language learning resources

**Roles:**
| Role | Access |
|------|--------|
| `user` | Browse services, post requirements, view responses |
| `service_provider` | List services, browse requirements, post requirements |
| `admin` | Full control — manage users, services, requirements |

---

## 2. Features Added

### Auth & Accounts
| Feature | Description |
|---------|-------------|
| Email-based Login | Custom `EmailLoginView` — email OR username dono se login |
| Email Uniqueness | Same email se dobara register nahi |
| Auto-login after Register | Registration ke baad directly login |
| JWT Token Auth | `djangorestframework-simplejwt` |
| Role Selection | User ya Service Provider |
| Unique email validation | `RegisterSerializer` mein check |

### Services Module
| Feature | Description |
|---------|-------------|
| Dynamic Services | Backend se live fetch |
| Merge with Static Data | Backend + static dono dikhte hain |
| City / Category Filter | Filter by city, tabs (PG/Tiffin/Local) |
| Provider auto-listing | Registration pe auto service create |
| Duplicate prevention | Same service dobara nahi banegi |
| TypeScript fixes | `image: undefined` fallback |

### Requirements Module
| Feature | Description |
|---------|-------------|
| Post Requirement | User apni zaroorat post kare |
| Browse Requirements | Provider sab requirements dekhe |
| Respond Modal | Provider ka detailed view + Express Interest |
| Responses Modal | User ko interested providers dikhte hain |
| Mark Fulfilled | User requirement close kare |
| Provider can also post | Provider bhi apni requirement post kar sakta hai |

### Dashboards
| Dashboard | Features |
|-----------|----------|
| User Dashboard | Requirements list, Responses modal, Mark Fulfilled |
| Provider Dashboard | Services CRUD, Leads count, Provider Hub |
| Admin Dashboard | User + Service + Requirement management |

### Infrastructure
| Item | Status |
|------|--------|
| Backend Dockerfile | ✅ Python 3.11-slim + Gunicorn |
| Frontend Dockerfile | ✅ Multi-stage Node → Nginx |
| docker-compose.yml | ✅ Orchestrated |
| GitHub Actions CI/CD | ✅ (see section 13) |
| Cloudflare Pages | ✅ (see section 14) |

---

## 3. Architecture

```
Browser → React (Cloudflare Pages / Nginx)
               ↓ REST API
         Django (Gunicorn / Docker :8001)
               ↓
     SQLite DB + ChromaDB (AI Vector Store)
```

---

## 4. Backend — Django REST API

**Location:** `backend/`

### Django Apps:
| App | Purpose |
|-----|---------|
| `accounts` | Registration, login, profile |
| `services` | Service listings |
| `requirements_app` | Requirements / leads |
| `chatbot` | AI chatbot (Gemini + ChromaDB) |
| `emergency` | Emergency contacts |
| `languages` | Language resources |

### Key File: `accounts/views.py`

```python
class EmailLoginView(APIView):
    """Email OR username se login karo"""
    def post(self, request):
        identifier = request.data.get('username') or request.data.get('email')
        user = User.objects.filter(email=identifier).first() or \
               User.objects.filter(username=identifier).first()
        # validate password → return JWT tokens
```

---

## 5. Frontend — React + Vite

**Location:** `frontend/`

### Pages:
| Page | Route | Description |
|------|-------|-------------|
| `Index.tsx` | `/` | Landing page |
| `Auth.tsx` | `/auth` | User login/register |
| `ProviderAuth.tsx` | `/provider-auth` | Provider login/register |
| `Services.tsx` | `/services` | Browse all services |
| `UserDashboard.tsx` | `/dashboard` | User requirements |
| `ProviderDashboard.tsx` | `/provider-dashboard` | Provider services hub |
| `PostRequirement.tsx` | `/post-requirement` | Post requirement |
| `BrowseRequirements.tsx` | `/browse-requirements` | Browse all requirements |
| `AdminDashboard.tsx` | `/admin-dashboard` | Admin panel |
| `Emergency.tsx` | `/emergency` | Emergency contacts |
| `Profile.tsx` | `/profile` | User profile |

### API Layer (`frontend/services/`):
```
auth.ts   → signUp(), signIn(), logout()
api.ts    → getServices(), getAllRequirements(), getUserRequirements(),
            createService(), deleteService(), createRequirement()
lib/django.ts → djangoFetch() base caller with JWT
```

---

## 6. Authentication System

### Flow:
```
Register → POST /api/accounts/register/
         → POST /api/accounts/login/ (email + password)
         ← { access: JWT, refresh: JWT }
         → localStorage mein save
         → Dashboard pe redirect
```

### Tokens:
- Access Token: 60 min
- Refresh Token: 7 days
- Refresh: `POST /api/accounts/token/refresh/`

---

## 7. Services Module

### Model (`services/models.py`):
```python
Service: user, name, category, city, area, price,
         price_type, contact_number, rating, verified
```

### Categories: `pg`, `tiffin`, `plumber`, `maid`, `electrician`, `internet`

---

## 8. Requirements Module

### Model (`requirements_app/models.py`):
```python
Requirement: user, title, category, area, city,
             budget, description, timeline, status(open/fulfilled)
```

### Responses: Provider → Requirement pe response dena

---

## 9. Provider Dashboard

### Provider Hub (3 cards):
1. 🔵 **Browse Customer Leads** → `/browse-requirements`
2. 🟣 **View Public Marketplace** → `/services`
3. 🟠 **Post a Requirement** → `/post-requirement` *(nayi card)*

---

## 10. User Dashboard

- Posted requirements list
- **Responses** button → Modal with interested providers + call button
- **Mark Fulfilled** button
- Post New Requirement shortcut

---

## 11. Admin Dashboard

- Django Admin UI: `http://127.0.0.1:8001/admin/`
- Frontend Admin: `/admin-dashboard` (role=admin)
- Users, Services, Requirements management

---

## 12. Docker Setup

### `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential curl
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["gunicorn", "settleease.wsgi:application",
     "--bind", "0.0.0.0:8001",
     "--workers", "2", "--threads", "4",
     "--worker-tmp-dir", "/dev/shm", "--timeout", "120", "--reload"]
```

### `Dockerfile.frontend` (Multi-stage):
```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html vite.config.ts tsconfig*.json tailwind.config.ts postcss.config.js components.json ./
COPY frontend/ ./frontend/
COPY public/ ./public/
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: settleease-backend
    ports: ["8001:8001"]
    env_file: .env
    environment:
      - PYTHONUNBUFFERED=1
    volumes: ["./backend:/app"]
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: settleease-frontend
    ports: ["5173:80"]
    depends_on: [backend]
    restart: unless-stopped
```

### Docker Commands:
```bash
# Build + start (first time)
docker-compose up --build

# Background mein
docker-compose up -d

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down

# Rebuild after code change
docker-compose up --build -d

# Shell + migrations
docker exec -it settleease-backend bash
docker exec -it settleease-backend python manage.py migrate
docker exec -it settleease-backend python manage.py createsuperuser
```

---

## 13. CI/CD — GitHub Actions

### File: `.github/workflows/deploy.yml`

```yaml
name: SettleEase CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:

  # Job 1: Django Tests
  backend-test:
    name: Django Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: python manage.py migrate --run-syncdb
        env:
          DJANGO_SECRET_KEY: ${{ secrets.DJANGO_SECRET_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - run: python manage.py test
        env:
          DJANGO_SECRET_KEY: ${{ secrets.DJANGO_SECRET_KEY }}

  # Job 2: React Build
  frontend-build:
    name: React Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: dist/

  # Job 3: Docker Build & Push to Hub
  docker-build:
    name: Docker Build & Push
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      - name: Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/settleease-backend:latest
      - name: Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile.frontend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/settleease-frontend:latest

  # Job 4: Deploy Frontend → Cloudflare Pages
  deploy-frontend:
    name: Deploy to Cloudflare Pages
    runs-on: ubuntu-latest
    needs: [frontend-build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: frontend-dist
          path: dist/
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: settleease
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Secrets Setup:
> Repo → Settings → Secrets and Variables → Actions → New repository secret

| Secret | Value |
|--------|-------|
| `DJANGO_SECRET_KEY` | Django secret key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `VITE_API_URL` | `https://api.settleease.com` |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_TOKEN` | Docker Hub access token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

---

## 14. Cloudflare Deployment

### Frontend → Cloudflare Pages

**Setup (GUI):**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
2. Connect GitHub → Select your repo
3. Build settings:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variable: `VITE_API_URL` = `https://api.settleease.com`
5. Deploy → `https://settleease.pages.dev`

**Manual CLI deploy:**
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=settleease
```

**Custom Domain:**
- Cloudflare Pages → settleease → Custom domains → Add `settleease.in`

### Backend → VPS + Cloudflare Proxy

**DNS Setup (Cloudflare dashboard):**
```
Type: A
Name: api
IPv4: <VPS IP>
Proxy: Enabled (orange cloud) ← SSL + DDoS protection
```

**VPS Deploy:**
```bash
ssh user@<vps-ip>

# Docker install (one time)
curl -fsSL https://get.docker.com | sh

# Project setup
git clone https://github.com/<username>/settleease.git
cd settleease

# .env file banao
cp .env.example .env
nano .env  # Fill DJANGO_SECRET_KEY, GEMINI_API_KEY, ALLOWED_HOSTS

# Start
docker-compose up -d
docker exec settleease-backend python manage.py migrate
docker exec settleease-backend python manage.py createsuperuser
```

---

## 15. Environment Variables

### `.env` (root — Docker/Backend):
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,api.settleease.com
GEMINI_API_KEY=your-gemini-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://settleease.pages.dev
```

### `.env.local` (Frontend dev):
```env
VITE_API_URL=http://127.0.0.1:8001
```

### Frontend production:
```env
VITE_API_URL=https://api.settleease.com
```

---

## 16. API Reference

**Base URL:** `http://127.0.0.1:8001/api/`

### Accounts:
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/accounts/register/` | ❌ | New user register |
| POST | `/accounts/login/` | ❌ | Login (email or username) |
| POST | `/accounts/token/refresh/` | ❌ | Refresh JWT |
| GET | `/accounts/profile/` | ✅ | Logged-in user info |

### Services:
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/services/` | ❌ | All services |
| POST | `/services/` | ✅ | Create service |
| DELETE | `/services/{id}/` | ✅ | Delete own service |

### Requirements:
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/requirements/` | ✅ | All requirements |
| POST | `/requirements/` | ✅ | Create requirement |
| PATCH | `/requirements/{id}/` | ✅ | Update status |
| GET | `/requirements/{id}/responses/` | ✅ | Get responses |
| POST | `/requirements/{id}/responses/` | ✅ | Add response |

---

## 17. Database Schema

```sql
-- Custom User
accounts_customuser (id, username, email, first_name, role, city, phone)

-- Services
services_service (id, user_id, name, category, city, area,
                  price, price_type, contact_number, rating, verified, created_at)

-- Requirements
requirements_app_requirement (id, user_id, title, category, area, city,
                               budget, description, timeline, status, created_at)

-- Responses
requirements_app_response (id, requirement_id, provider_id, message, created_at)
```

---

## 18. Running Locally

### Dev Mode (No Docker):
```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001

# Terminal 2 — Frontend (project root)
npm install
npm run dev        # → http://localhost:5173
```

### Production (Docker):
```bash
docker-compose up --build -d
docker exec settleease-backend python manage.py migrate
docker exec settleease-backend python manage.py createsuperuser
```

### URLs:
| Service | URL |
|---------|-----|
| Frontend (dev) | http://localhost:5173 |
| Backend API | http://127.0.0.1:8001/api/ |
| Django Admin | http://127.0.0.1:8001/admin/ |
| Frontend (prod) | https://settleease.pages.dev |

---

## 19. Changelog

| Date | Change |
|------|--------|
| Aug 29 | Project initialized — Django + React setup |
| Sep 2 | Services module — backend dynamic integration |
| Sep 3 | Authentication — JWT, role-based login/register |
| Sep 5 | Provider Dashboard — service CRUD, stats |
| Sep 6 | Email login fix (`EmailLoginView`) |
| Sep 6 | Duplicate service prevention on registration |
| Sep 6 | Requirements — post, browse, respond, mark fulfilled |
| Sep 6 | UserDashboard — Responses modal added |
| Sep 6 | BrowseRequirements — Express Interest modal |
| Sep 7 | Docker setup — backend + frontend Dockerfiles |
| Sep 9 | TypeScript fixes — `image: undefined` fallback |
| Sep 9 | Provider Hub — Post Requirement card added |
| Sep 13 | Full documentation written |

---

*SettleEase — Making Indian Relocation Easier 🇮🇳*
