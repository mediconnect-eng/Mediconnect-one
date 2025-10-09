# Vercel Deployment Guide

This project now supports a split deployment model on Vercel: the React front-end is served as a static site, and the Express API runs inside a Vercel Serverless Function.

## 1. Prerequisites
- Vercel account
- A reachable PostgreSQL database; reuse the Supabase connection string you configured in `.env`
- The Vercel CLI (`npm i -g vercel`) for local verification (optional but recommended)

## 2. Build Outputs
- `npm run build` produces the static assets under `dist/public`
- The API entry point lives at `api/index.ts`; Vercel builds it with the Node.js 22 runtime

## 3. Environment Variables
In the Vercel dashboard (Project → Settings → Environment Variables) add:

| Key | Value | Notes |
| --- | ----- | ----- |
| `DATABASE_URL` | Your Postgres connection string (`postgresql://...`) | Include `?sslmode=require` when using managed services like Supabase |
| `SUPABASE_KEY` | Optional | Only required if server code calls Supabase directly |
| Any other secrets | As needed | Mirror values from your local `.env` |

> Deploy once the variables are saved; serverless functions read them at runtime.

## 4. Local Verification
1. Run `npm run build` to ensure the static bundle succeeds
2. (Optional) Run `vercel dev` to emulate Vercel locally. The front-end serves from `dist/public`, and API requests proxy to `api/index.ts`

## 5. Deploy
1. `vercel` (or `vercel --prod`) from the repository root
2. Verify the build summary – Vercel uses the included `vercel.json`:
   - Build command: `npm run build`
   - Static output directory: `dist/public`
   - Serverless function: `api/index.ts` (`nodejs22.x`)
3. Visit the preview URL. All `/api/*` routes are forwarded to the serverless Express handler, and every other path rewrites to `index.html` so client-side routing keeps working.

## 6. Database Seeding
Vercel functions should not run the seeding script. Run `npm run seed` locally against the same database before deploying, or seed through your managed database console.

You are ready to ship! Continuous deployments trigger automatically on pushes to the linked branch. Use Vercel’s Environment tabs (Development/Preview/Production) to manage per-environment secrets if your staging and production databases differ.
