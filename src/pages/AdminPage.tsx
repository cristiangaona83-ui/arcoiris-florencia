import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { AlertTriangle } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminModeration } from "@/components/admin/AdminModeration";

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-soft">
      <header className="border-b border-ink/10 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-lg font-bold text-ink">
            Arcoíris Florencia · Administración
          </span>
          <a href="/" className="text-sm font-semibold text-coral-600 hover:underline">
            Volver al sitio
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}

type AdminCheckState = "checking" | "admin" | "not-admin" | "error";

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminState, setAdminState] = useState<AdminCheckState>("checking");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCheckingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setAdminState("checking");
      return;
    }
    let active = true;
    setAdminState("checking");
    // is_admin() devuelve false (sin error) para un usuario autenticado que
    // simplemente no está en admin_users: eso es "not-admin", no un fallo.
    // Un "error" real aquí significa que la llamada en sí no pudo
    // completarse (problema de conexión con Supabase, no de permisos).
    supabase.rpc("is_admin").then(
      ({ data, error }) => {
        if (!active) return;
        if (error) {
          setAdminState("error");
          return;
        }
        setAdminState(data ? "admin" : "not-admin");
      },
      () => {
        if (active) setAdminState("error");
      }
    );
    return () => {
      active = false;
    };
  }, [session]);

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-ink/5">
          <AlertTriangle className="h-10 w-10 text-coral-500" aria-hidden="true" />
          <p className="font-semibold text-coral-600">Variables de entorno no configuradas.</p>
          <p className="text-sm text-ink-soft">
            Este despliegue no tiene disponibles <code>VITE_SUPABASE_URL</code> ni{" "}
            <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> al momento de compilar. Revísalas en la
            configuración de producción (Vercel → Environment Variables) y vuelve a desplegar sin
            usar caché de build.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (checkingAuth) {
    return (
      <AdminShell>
        <p className="text-ink-soft">Cargando…</p>
      </AdminShell>
    );
  }

  if (!session) {
    return (
      <AdminShell>
        <AdminLogin />
      </AdminShell>
    );
  }

  if (adminState === "checking") {
    return (
      <AdminShell>
        <p className="text-ink-soft">Verificando permisos…</p>
      </AdminShell>
    );
  }

  if (adminState === "error") {
    return (
      <AdminShell>
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-ink/5">
          <AlertTriangle className="h-10 w-10 text-coral-500" aria-hidden="true" />
          <p className="font-semibold text-coral-600">Error de conexión con Supabase.</p>
          <p className="text-sm text-ink-soft">
            No se pudo verificar tu permiso de administrador. Inténtalo nuevamente en unos
            momentos.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-2 text-sm font-semibold text-ink-soft underline hover:text-coral-600"
          >
            Cerrar sesión
          </button>
        </div>
      </AdminShell>
    );
  }

  if (adminState === "not-admin") {
    return (
      <AdminShell>
        <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-ink/5">
          <p className="font-semibold text-coral-600">
            Usuario autenticado pero sin permisos de administrador.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-4 text-sm font-semibold text-ink-soft underline hover:text-coral-600"
          >
            Cerrar sesión
          </button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AdminModeration />
    </AdminShell>
  );
}
