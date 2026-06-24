import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase unique de l'app (contracts.md §1, §7).
 * Toutes les features passent par cet export — aucune ne recrée de client.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Variables Supabase manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY. ' +
      'Copie .env.example vers .env et renseigne-les.',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: 'saraillon-auth',
  },
})
