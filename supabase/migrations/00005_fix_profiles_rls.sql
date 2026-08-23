-- Add INSERT policy so users can create their own profile if it's missing
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
