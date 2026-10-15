// Conexão do site Team Thomé com o Supabase.
// Este arquivo deve ser carregado como módulo JavaScript.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://hbhoycqklkiuhqhgrjfk.supabase.co";

// Chave pública: pode ser usada no navegador.
// Nunca coloque uma chave secret ou service_role neste arquivo.
const supabasePublishableKey =
  "sb_publishable_q8gPL4EHxb52VEmDLsAZhA_Hh8ecjYV";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);