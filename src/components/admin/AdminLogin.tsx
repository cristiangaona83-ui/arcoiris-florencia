import { useState, type FormEvent } from "react";
import { AlertTriangle } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setError(
        "Variables de entorno no configuradas: este despliegue no tiene VITE_SUPABASE_URL ni VITE_SUPABASE_PUBLISHABLE_KEY disponibles. Revísalas en la configuración de producción y vuelve a desplegar."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // "Invalid login credentials" es la respuesta típica de Supabase Auth
        // cuando el correo o la contraseña son incorrectos (o la cuenta no
        // existe/no está confirmada). Cualquier otro error de la API se
        // trata como problema de conexión, no de credenciales.
        const message = signInError.message?.toLowerCase() ?? "";
        setError(
          message.includes("invalid login credentials") || message.includes("invalid")
            ? "Credenciales incorrectas."
            : "Error de conexión con Supabase. Inténtalo nuevamente en unos momentos."
        );
      }
    } catch {
      // El fetch interno de Supabase lanzó (DNS, red caída, host inexistente).
      setError("Error de conexión con Supabase. Verifica tu conexión e inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink/5">
      <h1 className="font-display text-xl font-bold text-ink">Acceso administración</h1>
      <p className="mt-1 text-sm text-ink-soft">Opiniones de familias</p>

      {!isSupabaseConfigured && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sun-50 p-4 text-sm text-ink-soft">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" aria-hidden="true" />
          <p>
            Variables de entorno no configuradas en este despliegue. El inicio de sesión no
            funcionará hasta corregirlo.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin-email" className="mb-1.5 block text-sm font-bold text-ink">
            Correo
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-coral-400"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="mb-1.5 block text-sm font-bold text-ink">
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-coral-400"
          />
        </div>
        {error && <p className="text-sm font-semibold text-coral-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-coral-500 px-6 py-3 font-display text-base font-bold text-white transition-colors hover:bg-coral-600 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
