import { createClient } from "@supabase/supabase-js";

/**
 * Cliente único de Supabase para este proyecto (Vite + React SPA, sin
 * renderizado en servidor). No existe "cliente de servidor" porque este
 * sitio no ejecuta código en un servidor: todo corre en el navegador.
 *
 * Usa exclusivamente la clave "anon/publishable" (segura para exponer en
 * el navegador): la seguridad real la aplican las políticas RLS en
 * Supabase, no esta clave. Nunca debe usarse aquí la service_role key.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase no está configurado: faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env.local"
  );
}

// createClient() lanza una excepción si la URL llega vacía. Se usa un
// placeholder solo para que la app no se caiga por completo mientras
// falten las credenciales reales; las llamadas simplemente fallarán
// (con error de red) hasta que .env.local tenga los valores correctos.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-anon-key"
);
