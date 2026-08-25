import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
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

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
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
      setIsAdmin(null);
      return;
    }
    let active = true;
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (active) setIsAdmin(error ? false : Boolean(data));
    });
    return () => {
      active = false;
    };
  }, [session]);

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

  if (isAdmin === null) {
    return (
      <AdminShell>
        <p className="text-ink-soft">Verificando permisos…</p>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-ink/5">
          <p className="font-semibold text-coral-600">
            Esta cuenta no tiene permisos de administrador.
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
