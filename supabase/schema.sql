-- Run this SQL in your Supabase SQL Editor to initialize your projects table:

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT DEFAULT 'General',
  tags JSONB DEFAULT '[]'::jsonb,
  render_url TEXT,
  health_endpoint TEXT DEFAULT '/health',
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 99,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all projects
CREATE POLICY "Allow public read access"
  ON public.projects
  FOR SELECT
  USING (true);

-- Allow authenticated or service role to insert/update/delete
CREATE POLICY "Allow all operations for anon key"
  ON public.projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed initial data
INSERT INTO public.projects (id, title, tagline, description, category, tags, render_url, health_endpoint, github_url, demo_url, image_url, featured, "order")
VALUES 
(
  'proj-1',
  'Aura Canvas Engine',
  'Real-time collaborative architectural sketchpad powered by WebSockets and CRDTs',
  'High-performance vector canvas with infinite zoom, spatial indexing, and sub-millisecond local latency. Backed by an Elixir/Go service hosted on Render that reconciles multi-tenant drafting sessions in real time.',
  'Interactive Engine',
  '["TypeScript", "WebGL", "Rust / Wasm", "Render", "WebSockets"]'::jsonb,
  'https://aura-canvas-service.onrender.com',
  '/healthz',
  'https://github.com/example/aura-canvas-engine',
  'https://aura-canvas-service.onrender.com',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  true,
  1
),
(
  'proj-2',
  'Cognitive Query Mesh',
  'Semantic search and document synthesis pipeline across heterogenous databases',
  'An asynchronous vector indexing pipeline that chunks, embeds, and summarizes technical CAD specifications and PDF blueprints using hybrid sparse-dense retrieval. Runs serverless background workers on Render.',
  'Distributed AI',
  '["Python", "FastAPI", "PostgreSQL", "pgvector", "Render", "Docker"]'::jsonb,
  'https://cognitive-query-mesh.onrender.com',
  '/api/v1/health',
  'https://github.com/example/cognitive-query-mesh',
  'https://cognitive-query-mesh.onrender.com',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  true,
  2
)
ON CONFLICT (id) DO NOTHING;
