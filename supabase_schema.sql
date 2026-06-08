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
    photos JSONB NOT NULL DEFAULT '[]'::jsonb
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

-- Seed Data (Inicia o banco de dados com dados iniciais idênticos ao localStorage padrão)

-- Seed users
INSERT INTO public.users (email, name, password, points, "isAdmin") VALUES
('leo.silva@escola.com', 'Leonardo Silva', '123456', 250, FALSE),
('bia.oliveira@escola.com', 'Beatriz Oliveira', '123456', 150, FALSE)
ON CONFLICT (email) DO NOTHING;

-- Seed plants
INSERT INTO public.plants (id, "studentName", "studentEmail", name, species, "startDate", photos) VALUES
('plant-1', 'Leonardo Silva', 'leo.silva@escola.com', 'Pepe o Feijão', 'Feijoeiro Comum', '2026-05-15', '[
  {
    "day": 1,
    "date": "2026-05-15",
    "url": "https://images.unsplash.com/photo-1532467411038-57680e4ded04?w=600&auto=format&fit=crop&q=60",
    "stageName": "Embebição",
    "analysis": "Sua semente de Feijão está absorvendo água e começando a inchar no algodão úmido. A casca está amolecendo para dar passagem à primeira raiz nos próximos dias!",
    "notes": "Coloquei meu feijãozinho no algodão hoje! Estou ansioso."
  },
  {
    "day": 7,
    "date": "2026-05-22",
    "url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60",
    "stageName": "Abertura dos Cotilédones",
    "analysis": "Impressionante! Os cotilédones do Pepe se abriram completamente e ele já tem um pequeno caule de 4cm. O feijão agora está usando a luz solar para iniciar a fotossíntese primária.",
    "notes": "Ele nasceu! Olha como está verdinho. Já passei ele para um copinho com terra."
  }
]'::jsonb),
('plant-2', 'Beatriz Oliveira', 'bia.oliveira@escola.com', 'Hortinha', 'Hortelã', '2026-05-20', '[
  {
    "day": 1,
    "date": "2026-05-20",
    "url": "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=600&auto=format&fit=crop&q=60",
    "stageName": "Ativação metabólica",
    "analysis": "As sementes de Hortelã foram plantadas no solo fértil. Em alguns dias, o metabolismo ativo irá romper as sementinhas em brotos verdes.",
    "notes": "Plantei as sementinhas em um vaso reciclado com garrafa PET!"
  }
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed posts
INSERT INTO public.posts (id, "plantId", "studentName", "studentEmail", "plantName", day, date, url, "stageName", notes, likes, comments) VALUES
('post-1', 'plant-1', 'Leonardo Silva', 'leo.silva@escola.com', 'Pepe o Feijão', 7, '2026-05-22', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=60', 'Abertura dos Cotilédones', 'Ele nasceu! Olha como está verdinho. Já passei ele para um copinho com terra.', '["bia.oliveira@escola.com"]'::jsonb, '[
  {
    "id": "c-1",
    "studentName": "Beatriz Oliveira",
    "studentEmail": "bia.oliveira@escola.com",
    "text": "Que lindo Leo! O meu ainda não brotou assim, mas estou regando todo dia.",
    "date": "2026-05-22"
  }
]'::jsonb),
('post-2', 'plant-2', 'Beatriz Oliveira', 'bia.oliveira@escola.com', 'Hortinha', 1, '2026-05-20', 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=600&auto=format&fit=crop&q=60', 'Ativação metabólica', 'Plantei as sementinhas em um vaso reciclado com garrafa PET!', '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
