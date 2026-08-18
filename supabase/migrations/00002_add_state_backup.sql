-- Adiciona a coluna state_backup na tabela profiles para salvar as tarefas no banco em formato JSON
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_backup JSONB;
