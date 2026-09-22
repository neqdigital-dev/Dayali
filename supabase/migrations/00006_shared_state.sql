CREATE TABLE public.shared_state (
  id text PRIMARY KEY,
  state_backup jsonb
);

-- Enable RLS
ALTER TABLE public.shared_state ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read and update
CREATE POLICY "Allow authenticated users to read shared_state" ON public.shared_state FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert shared_state" ON public.shared_state FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update shared_state" ON public.shared_state FOR UPDATE TO authenticated USING (true);
