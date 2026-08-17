export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          language: string | null
          theme: string | null
          timezone: string | null
          water_goal_cups: number | null
          water_cup_ml: number | null
          close_to_tray: boolean | null
          start_with_windows: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          language?: string | null
          theme?: string | null
          timezone?: string | null
          water_goal_cups?: number | null
          water_cup_ml?: number | null
          close_to_tray?: boolean | null
          start_with_windows?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          language?: string | null
          theme?: string | null
          timezone?: string | null
          water_goal_cups?: number | null
          water_cup_ml?: number | null
          close_to_tray?: boolean | null
          start_with_windows?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title_pt: string
          title_en: string | null
          description: string | null
          category: string
          type: string
          priority: string | null
          recurrence_rule: Json | null
          scheduled_date: string | null
          link: string | null
          observation: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title_pt: string
          title_en?: string | null
          description?: string | null
          category: string
          type: string
          priority?: string | null
          recurrence_rule?: Json | null
          scheduled_date?: string | null
          link?: string | null
          observation?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title_pt?: string
          title_en?: string | null
          description?: string | null
          category?: string
          type?: string
          priority?: string | null
          recurrence_rule?: Json | null
          scheduled_date?: string | null
          link?: string | null
          observation?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      task_occurrences: {
        Row: {
          id: string
          user_id: string
          task_id: string
          occurrence_date: string
          status: string | null
          completed_at: string | null
          original_date: string | null
          transfer_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          occurrence_date: string
          status?: string | null
          completed_at?: string | null
          original_date?: string | null
          transfer_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          occurrence_date?: string
          status?: string | null
          completed_at?: string | null
          original_date?: string | null
          transfer_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      water_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          cups_consumed: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          cups_consumed?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          cups_consumed?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      agenda_events: {
        Row: {
          id: string
          user_id: string
          title_pt: string
          title_en: string | null
          description: string | null
          event_date: string
          start_time: string | null
          end_time: string | null
          location: string | null
          is_all_day: boolean | null
          recurrence_rule: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title_pt: string
          title_en?: string | null
          description?: string | null
          event_date: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          is_all_day?: boolean | null
          recurrence_rule?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title_pt?: string
          title_en?: string | null
          description?: string | null
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          is_all_day?: boolean | null
          recurrence_rule?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      church_events: {
        Row: {
          id: string
          user_id: string
          title_pt: string
          title_en: string | null
          description: string | null
          event_type: string
          event_date: string
          start_time: string | null
          end_time: string | null
          location: string | null
          sermon_title: string | null
          sermon_notes: string | null
          responsible: string | null
          observation: string | null
          additional_info: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title_pt: string
          title_en?: string | null
          description?: string | null
          event_type: string
          event_date: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          sermon_title?: string | null
          sermon_notes?: string | null
          responsible?: string | null
          observation?: string | null
          additional_info?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title_pt?: string
          title_en?: string | null
          description?: string | null
          event_type?: string
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          location?: string | null
          sermon_title?: string | null
          sermon_notes?: string | null
          responsible?: string | null
          observation?: string | null
          additional_info?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          name_pt: string
          name_en: string | null
          professor: string | null
          color: string | null
          semester: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name_pt: string
          name_en?: string | null
          professor?: string | null
          color?: string | null
          semester?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name_pt?: string
          name_en?: string | null
          professor?: string | null
          color?: string | null
          semester?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      exams: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title_pt: string
          title_en: string | null
          exam_date: string
          exam_time: string | null
          content: string | null
          observation: string | null
          score: number | null
          max_score: number | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title_pt: string
          title_en?: string | null
          exam_date: string
          exam_time?: string | null
          content?: string | null
          observation?: string | null
          score?: number | null
          max_score?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title_pt?: string
          title_en?: string | null
          exam_date?: string
          exam_time?: string | null
          content?: string | null
          observation?: string | null
          score?: number | null
          max_score?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      assignments: {
        Row: {
          id: string
          user_id: string
          subject_id: string
          title_pt: string
          title_en: string | null
          description: string | null
          due_date: string
          progress: number | null
          status: string | null
          priority: string | null
          score: number | null
          max_score: number | null
          link: string | null
          observation: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          subject_id: string
          title_pt: string
          title_en?: string | null
          description?: string | null
          due_date: string
          progress?: number | null
          status?: string | null
          priority?: string | null
          score?: number | null
          max_score?: number | null
          link?: string | null
          observation?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string
          title_pt?: string
          title_en?: string | null
          description?: string | null
          due_date?: string
          progress?: number | null
          status?: string | null
          priority?: string | null
          score?: number | null
          max_score?: number | null
          link?: string | null
          observation?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          exam_id: string | null
          subject_id: string | null
          title_pt: string
          title_en: string | null
          scheduled_date: string
          status: string | null
          duration_minutes: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          exam_id?: string | null
          subject_id?: string | null
          title_pt: string
          title_en?: string | null
          scheduled_date: string
          status?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          exam_id?: string | null
          subject_id?: string | null
          title_pt?: string
          title_en?: string | null
          scheduled_date?: string
          status?: string | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      spiritual_content: {
        Row: {
          id: string
          content_date: string
          verse_text: string
          verse_reference: string
          reflection: string | null
          source: string | null
          source_url: string | null
          language: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          content_date: string
          verse_text: string
          verse_reference: string
          reflection?: string | null
          source?: string | null
          source_url?: string | null
          language?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          content_date?: string
          verse_text?: string
          verse_reference?: string
          reflection?: string | null
          source?: string | null
          source_url?: string | null
          language?: string | null
          created_at?: string | null
        }
      }
      daily_statistics: {
        Row: {
          id: string
          user_id: string
          stat_date: string
          total_tasks: number | null
          completed_tasks: number | null
          completion_rate: number | null
          water_cups: number | null
          study_minutes: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stat_date: string
          total_tasks?: number | null
          completed_tasks?: number | null
          completion_rate?: number | null
          water_cups?: number | null
          study_minutes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stat_date?: string
          total_tasks?: number | null
          completed_tasks?: number | null
          completion_rate?: number | null
          water_cups?: number | null
          study_minutes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
