import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof window !== 'undefined' && window.CULTIVA_CONFIG?.VITE_SUPABASE_URL) || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = (typeof window !== 'undefined' && window.CULTIVA_CONFIG?.VITE_SUPABASE_ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa o cliente do Supabase apenas se as credenciais estiverem preenchidas
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.log(
    '%c[Cultiva] Chaves do Supabase ausentes ou não configuradas no arquivo .env. Usando persistência local (LocalStorage).',
    'color: #eab308; font-weight: bold; padding: 4px; background: #fef9c3; border-radius: 4px;'
  );
}
