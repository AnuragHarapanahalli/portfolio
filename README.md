# Architectural Portfolio with Render Cold-Start Warmer

Built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, and deployed seamlessly to **Vercel**.

---

## Key Features

1. **Illoca Architectural Aesthetic**:
   - Warm drafting parchment palette (`#F7F4EE` canvas, `#ECE5D8` cards, `#3B60C5` blueprint cobalt, `#E76051` terracotta red, `#212121` graphite darks).
   - Blueprint grid background pattern (`bg-blueprint-grid`).
   - Live pointer coordinate HUD (`X: 0.00`, `Y: 0.00`) tracking cursor position across the viewport.
   - Dual-layer neo-grotesque hero headlines (outline stroke layered under solid fill).
   - Handwritten architectural annotations (`font-architect` with SVG drafting squiggles and arrows).
   - Illoca split stamp buttons with left icon squares, paper drop shadows, and vertical text roll-over animations on hover.

2. **Automated Render Cold-Start Pre-Warmer**:
   - Free-tier Render web services sleep after 15 minutes of inactivity and take ~45 seconds to spin up.
   - **Dual-channel pre-warming**:
     1. As soon as a visitor lands on the portfolio (or hovers over a project card), a background client-side `fetch(url, { mode: 'no-cors' })` immediately wakes up the Render container.
     2. Next.js serverless route `/api/health-check` measures response latency and reports health status.
   - Live status badges on each project card:
     - 🟢 `ONLINE` (Render container hot and responsive, with latency in ms)
     - 🟡 `WARMING UP` (Render cold-start in progress, ~45s)
     - ⚪ `STANDBY`
   - Floating **Render Radar** dock at the bottom-right for live system telemetry.

3. **Direct Project Management (`/admin`)**:
   - Access `/admin` directly on your live portfolio.
   - Protected by a secure passcode/PIN (default: `admin123`, customizable via `ADMIN_SECRET`).
   - **Dual Storage Strategy**:
     - **Supabase (PostgreSQL)**: Instant, permanent persistence on Vercel without requiring redeployment.
     - **Local JSON Fallback (`data/projects.json`)**: Runs out of the box with zero external database setup required, plus a 1-click **Export JSON** button in `/admin`.
   - Add, edit, or remove project specifications with live Render URL and health check testing.

---

## Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000`.

### 2. Admin Access

Visit `http://localhost:3000/admin` and enter:
- Default PIN: `admin123`

To change this PIN, set `ADMIN_SECRET` in your `.env.local` or in your Vercel project environment variables.

---

## Supabase Setup (Optional for Live Cloud Storage)

If you want projects added via `/admin` to persist in a cloud PostgreSQL database without redeploying:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the script in [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your project URL and anon public key from **Project Settings → API**.
4. Add them to `.env.local` (and your Vercel Environment Variables):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

*Note: If these variables are not set, the portfolio automatically operates using the local fallback data in `data/projects.json`!*

---

## Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `ADMIN_SECRET`: Your chosen passcode to protect `/admin` (e.g. `my-secure-pin-2026`).
   - (Optional) `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Click **Deploy**.

---

## Personalizing Your Information

Edit [`data/portfolio-config.ts`](./data/portfolio-config.ts) to customize:
- Name & Title
- Bio statement & headline
- Contact email
- GitHub and LinkedIn links
