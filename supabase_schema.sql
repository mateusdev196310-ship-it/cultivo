-- Schema for Cultiva App

-- Create table for public.turmas
CREATE TABLE IF NOT EXISTS public.turmas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    "fotoUrl" TEXT,
    "criadaEm" TEXT NOT NULL
);

-- Create table for public.users
CREATE TABLE IF NOT EXISTS public.users (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    "turmaId" TEXT REFERENCES public.turmas(id) ON DELETE SET NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create table for public.plants
CREATE TABLE IF NOT EXISTS public.plants (
    id TEXT PRIMARY KEY,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    "lastPenaltyDate" TEXT
);

-- Create table for public.posts
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    "plantId" TEXT NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
    "plantName" TEXT NOT NULL,
    day INTEGER NOT NULL,
    date TEXT NOT NULL,
    url TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    notes TEXT,
    likes JSONB NOT NULL DEFAULT '[]'::jsonb,
    comments JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create table for public.feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    email TEXT PRIMARY KEY REFERENCES public.users(email) ON DELETE CASCADE,
    name TEXT NOT NULL,
    vote INTEGER NOT NULL,
    date TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Enable Public Read and Write Policies for all tables (since this app doesn't require authenticated logins yet)
CREATE POLICY "Allow public read/write on turmas" ON public.turmas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on plants" ON public.plants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on posts" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);


