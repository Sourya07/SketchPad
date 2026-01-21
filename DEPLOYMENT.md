# Deployment Guide

This repository contains a full-stack application (Next.js Frontend, HTTP Backend, WebSocket Server). Because of the WebSocket requirements, you cannot deploy the entire stack to Vercel alone.

- **Apps/Web**: Deploys to Vercel (Next.js).
- **Apps/Backend-Ex (HTTP)** & **Apps/WS (WebSocket)**: Deploy to Railway, Render, or a VPS (Node.js).
- **Packages/DB**: Requires a Postgres Database (e.g. Neon, Railway Postgres).

## 1. Prerequisites
- Accounts on [Vercel](https://vercel.com) and [Railway](https://railway.app) (or Render).
- Your code pushed to a Git provider (GitHub/GitLab).
- A Postgres Database URL (You already have one from Neon in your `.env` files).

## 2. Deploying the Backends (Railway Example)
Since `backend-ex` and `ws` are persistent Node.js servers, they fit best on Railway or Render.

### Steps:
1.  **Create a New Project** in Railway/Render from your GitHub Repo.
2.  **Deploy `backend-ex` Service**:
    -   **Root Directory**: `apps/backend-ex`
    -   **Build Command**: `pnpm build` (Runs `tsc -b`)
    -   **Start Command**: `node dist/index.js`
    -   **Environment Variables**:
        -   `DATABASE_URL`: `postgresql://...` (Your Neon URL)
        -   `JWT_SECRET`: `your_secure_random_string`
        -   `PORT`: `3001` (or whatever Railway assigns, usually automated)
3.  **Deploy `ws` Service**:
    -   **Root Directory**: `apps/ws`
    -   **Build Command**: `pnpm build`
    -   **Start Command**: `node dist/index.js`
    -   **Environment Variables**:
        -   `DATABASE_URL`: `postgresql://...`
        -   `JWT_SECRET`: `your_secure_random_string` (MUST MATCH `backend-ex`)
        -   `PORT`: `8080` (or platform default)

**Note**: After deployment, note down the URLs provided by the platform (e.g., `https://my-api-production.up.railway.app` and `wss://my-ws-production.up.railway.app`).

## 3. Deploying the Frontend (Vercel)
Vercel is perfect for the Next.js app in `apps/web`.

### Steps:
1.  **Import Project** in Vercel.
2.  **Framework Preset**: Next.js.
3.  **Root Directory**: Click "Edit" and select `apps/web`.
4.  **Environment Variables**:
    -   `NEXT_PUBLIC_BACKEND_URL`: The URL of your deployed `backend-ex` (e.g., `https://my-api.up.railway.app`).
    -   `NEXT_PUBLIC_WS_URL`: The URL of your deployed `ws` server (e.g., `wss://my-ws.up.railway.app`).
5.  **Build Command**: `cd ../.. && turbo run build --filter=web` (Usually Vercel detects defaults, but if it fails, try this or let Vercel handle the Monorepo settings). Default `next build` inside the root directory `apps/web` works if Vercel detects it correctly.

## 4. Database Migrations
Ensure your production database has the schema.
- Run `pnpm db:migrate` locally with the `DATABASE_URL` set to your production DB.
- Or add a deploy step in Railway to run usage migrations.

## Summary of Changes Made
To facilitate this deployment, I have:
1.  **Refactored `apps/web/server.ts`** to use `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_WS_URL`.
2.  **Refactored `packages/backend-common`** to use `process.env.JWT_SECRET`.
3.  **Appended `build` scripts** to `apps/backend-ex` and `apps/ws` so they compile correctly during deployment.
4.  **Added `postinstall` script** to root to ensure Prisma Client is generated.
