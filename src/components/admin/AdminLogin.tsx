import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError("Correo o contraseña incorrectos.");
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink/5">
      <h1 className="font-display text-xl font-bold text-ink">Acceso administración</h1>
      <p className="mt-1 text-sm text-ink-soft">Opiniones de familias</p>

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
