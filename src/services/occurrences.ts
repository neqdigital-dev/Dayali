import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

export type TaskOccurrenceRow = Database['public']['Tables']['task_occurrences']['Row'];
export type TaskOccurrenceInsert = Database['public']['Tables']['task_occurrences']['Insert'];
export type TaskOccurrenceUpdate = Database['public']['Tables']['task_occurrences']['Update'];

export const occurrenceService = {
  /**
   * Busca as ocorrências do usuário para um dia específico.
   * Obs: a data deve estar no formato YYYY-MM-DD
   */
  async getOccurrencesByDate(dateStr: string) {
    const { data, error } = await supabase
      .from('task_occurrences')
      .select('*, task:tasks(*)')
      .eq('occurrence_date', dateStr);

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza o status de uma ocorrência (ex: completed, pending)
   */
  async updateOccurrenceStatus(id: string, status: 'pending' | 'completed' | 'postponed' | 'cancelled') {
    const { data, error } = await supabase
      .from('task_occurrences')
      .update({ 
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
