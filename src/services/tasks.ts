import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// Helper types based on the assumed schema
export type TaskRow = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export const taskService = {
  /**
   * Busca todas as tarefas ativas do usuário
   */
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true }); // Default order

    if (error) throw error;
    return data;
  },

  /**
   * Adiciona uma nova tarefa
   */
  async createTask(task: TaskInsert) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualiza uma tarefa (pode ser título, categoria, etc)
   */
  async updateTask(id: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deleta (inativa) uma tarefa logicamente
   */
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }
};
