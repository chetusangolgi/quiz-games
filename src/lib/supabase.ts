import { createClient } from '@supabase/supabase-js';
import { QuizResult } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveQuizResult = async (result: Omit<QuizResult, 'completed_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('results')
      .insert([
        {
          ...result,
          completed_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error saving quiz result:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
};