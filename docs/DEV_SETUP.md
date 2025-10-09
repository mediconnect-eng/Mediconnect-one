# Development Setup

This branch is for larger experiments, but it still needs a reliable way to boot the full stack. Follow the checklist below before making feature changes.

## 1. Prerequisites
- **Node.js 20+** (the project targets the same runtime used on Replit).
- **PostgreSQL** (local instance or managed service such as Neon).
- **pnpm or npm** – examples below use `npm`.
- Optional but recommended: access to an object storage bucket if you plan to exercise PDF downloads or diagnostics uploads.

## 2. Configure environment variables
1. Copy the sample file and fill in the values:
   ```bash
   cp .env.example .env
   ```
2. Set `DATABASE_URL` to a reachable Postgres database.
3. If you intend to generate prescription PDFs or upload diagnostic results, populate `PUBLIC_OBJECT_SEARCH_PATHS` and `PRIVATE_OBJECT_DIR` with your bucket paths. Leave them blank to keep those endpoints disabled.

## 3. Install dependencies
```bash
npm install
```

## 4. Prepare the database
Run migrations (the schema is source-of-truth in `shared/schema.ts`):
```bash
npm run db:push
```

Seed demo data (script added in package.json):
```bash
npm run seed
```

> If you skip seeding, you will need to create users manually through the API.

## 5. Start the stack
Development mode launches Express and Vite together:
```bash
npm run dev
```
- API available at `http://localhost:5000/api/*`.
- Web app served on the same port with hot module reload.

For a production build:
```bash
npm run build
npm start
```

## 6. Helpful tips
- Update `shared/config.ts` flags when you swap adapter implementations.
- Object storage routes require valid ACL metadata; the stub adapters skip that requirement.
- `docs/ROADMAP.md` (added in this branch) outlines the next milestones so you can prioritise large changes.
