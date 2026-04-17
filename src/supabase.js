import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_PROJECT_URL ||
  'https://owdxbrtsqyichvzkkztz.supabase.co'

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_teQ9JNWsy7NimVKPG2Nlxg_e-K8j5TP'

export const supabase = createClient(supabaseUrl, supabaseKey)
