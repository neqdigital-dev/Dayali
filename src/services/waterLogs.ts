import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

export type WaterLogInsert = Database['public']['Tables']['water_logs']['Insert'];
export type WaterLogUpdate = Database['public']['Tables']['water_logs']['Update'];

export const waterService = {
  /**
   * Busca o log de água de hoje (ou de uma data específica)
   */
  async getWaterLogByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', date)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching water log:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Atualiza ou insere o log de água
   */
  async upsertWaterLog(log: WaterLogInsert) {
    // Tenta atualizar primeiro
    const existing = await this.getWaterLogByDate(log.user_id, log.log_date);
    
    if (existing) {
      const { data, error } = await supabase
        .from('water_logs')
        .update({ cups_consumed: log.cups_consumed })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('water_logs')
        .insert([log])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  }
};
