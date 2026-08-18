-- 00001_initial_schema.sql
-- Create initial tables, triggers, and Row Level Security policies for Dayali.

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  language TEXT DEFAULT 'pt' CHECK (language IN ('pt', 'en')),
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  water_goal_cups INTEGER DEFAULT 8,
  water_cup_ml INTEGER DEFAULT 250,
  close_to_tray BOOLEAN DEFAULT TRUE,
  start_with_windows BOOLEAN DEFAULT FALSE,
  dashboard_columns JSONB DEFAULT '[["personal"], ["work"], ["college", "church"]]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. TASKS
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('personal', 'work', 'college')),
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'custom', 'one_time')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  
  -- Recurrence Rule (JSONB)
  recurrence_rule JSONB, 
  
  scheduled_date DATE, -- For one_time
  
  link TEXT,
  observation TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_user ON public.tasks(user_id);
CREATE INDEX idx_tasks_category ON public.tasks(user_id, category);
CREATE INDEX idx_tasks_active ON public.tasks(user_id, is_active);

-- 3. TASK OCCURRENCES
CREATE TABLE public.task_occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  occurrence_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'postponed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  
  original_date DATE, 
  transfer_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(task_id, occurrence_date)
);

CREATE INDEX idx_occurrences_date ON public.task_occurrences(user_id, occurrence_date);
CREATE INDEX idx_occurrences_status ON public.task_occurrences(user_id, occurrence_date, status);

-- 4. AGENDA EVENTS
CREATE TABLE public.agenda_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  is_all_day BOOLEAN DEFAULT FALSE,
  recurrence_rule JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agenda_date ON public.agenda_events(user_id, event_date);

-- 5. CHURCH EVENTS
CREATE TABLE public.church_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('preaching', 'participation', 'informative')),
  
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  
  sermon_title TEXT,
  sermon_notes TEXT,
  responsible TEXT,
  observation TEXT,
  additional_info TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_church_date ON public.church_events(user_id, event_date);
CREATE INDEX idx_church_type ON public.church_events(user_id, event_type);

-- 6. WATER LOGS
CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  cups_consumed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_water_date ON public.water_logs(user_id, log_date);

-- 7. SUBJECTS (College)
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name_pt TEXT NOT NULL,
  name_en TEXT,
  professor TEXT,
  color TEXT, 
  semester TEXT, 
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subjects_user ON public.subjects(user_id);

-- 8. EXAMS (College)
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  exam_date DATE NOT NULL,
  exam_time TIME,
  content TEXT,
  observation TEXT,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 10.0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'studying', 'completed', 'graded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exams_date ON public.exams(user_id, exam_date);
CREATE INDEX idx_exams_subject ON public.exams(subject_id);

-- 9. ASSIGNMENTS (College)
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  due_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'submitted', 'graded')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 10.0,
  link TEXT,
  observation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_date ON public.assignments(user_id, due_date);
CREATE INDEX idx_assignments_subject ON public.assignments(subject_id);

-- 10. STUDY SESSIONS (College)
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title_pt TEXT NOT NULL,
  title_en TEXT,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_date ON public.study_sessions(user_id, scheduled_date);
CREATE INDEX idx_study_exam ON public.study_sessions(exam_id);

-- 11. SPIRITUAL CONTENT (Global)
CREATE TABLE public.spiritual_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_date DATE NOT NULL UNIQUE,
  verse_text TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  reflection TEXT,
  source TEXT,
  source_url TEXT,
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_spiritual_date ON public.spiritual_content(content_date);

-- 12. DAILY STATISTICS
CREATE TABLE public.daily_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL,
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.0,
  water_cups INTEGER DEFAULT 0,
  study_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, stat_date)
);

CREATE INDEX idx_stats_date ON public.daily_statistics(user_id, stat_date);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_statistics ENABLE ROW LEVEL SECURITY;

-- 1. Profiles (users can view and update their own profile)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Tasks
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- 3. Task Occurrences
CREATE POLICY "Users can view own occurrences" ON public.task_occurrences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own occurrences" ON public.task_occurrences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own occurrences" ON public.task_occurrences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own occurrences" ON public.task_occurrences FOR DELETE USING (auth.uid() = user_id);

-- 4. Agenda Events
CREATE POLICY "Users can view own agenda" ON public.agenda_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own agenda" ON public.agenda_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agenda" ON public.agenda_events FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own agenda" ON public.agenda_events FOR DELETE USING (auth.uid() = user_id);

-- 5. Church Events
CREATE POLICY "Users can view own church events" ON public.church_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own church events" ON public.church_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own church events" ON public.church_events FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own church events" ON public.church_events FOR DELETE USING (auth.uid() = user_id);

-- 6. Water Logs
CREATE POLICY "Users can view own water logs" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water logs" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own water logs" ON public.water_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own water logs" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);

-- 7. Subjects
CREATE POLICY "Users can view own subjects" ON public.subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subjects" ON public.subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subjects" ON public.subjects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own subjects" ON public.subjects FOR DELETE USING (auth.uid() = user_id);

-- 8. Exams
CREATE POLICY "Users can view own exams" ON public.exams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exams" ON public.exams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exams" ON public.exams FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own exams" ON public.exams FOR DELETE USING (auth.uid() = user_id);

-- 9. Assignments
CREATE POLICY "Users can view own assignments" ON public.assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assignments" ON public.assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own assignments" ON public.assignments FOR DELETE USING (auth.uid() = user_id);

-- 10. Study Sessions
CREATE POLICY "Users can view own study sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own study sessions" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- 11. Spiritual Content (Global, viewable by all authenticated users, editable by none or only admins)
CREATE POLICY "Authenticated users can view spiritual content" ON public.spiritual_content FOR SELECT USING (auth.role() = 'authenticated');
-- (Insert/Update/Delete would be done by an admin role or external process)

-- 12. Daily Statistics
CREATE POLICY "Users can view own statistics" ON public.daily_statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own statistics" ON public.daily_statistics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own statistics" ON public.daily_statistics FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own statistics" ON public.daily_statistics FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- REALTIME REPLICATION
-- ==========================================
-- Enable Realtime for tables that need instant sync (task_occurrences and water_logs)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_occurrences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_logs;
