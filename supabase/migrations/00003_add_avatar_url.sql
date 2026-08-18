-- Adiciona a coluna avatar_url na tabela profiles para salvar a foto do usuário
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
