import { useState, type ReactNode } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

export type AdminModuleId = "inicio" | "configuracion" | "equipo" | "opiniones";

const NAV_ITEMS: { id: AdminModuleId; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "configuracion", label: "Página principal / Configuración" },
  { id: "equipo", label: "Equipo" },
  { id: "opiniones", label: "Opiniones de familias" },
];

interface SidebarContentProps {
  activeModule: AdminModuleId;
  onSelect: (id: AdminModuleId) => void;
}

function SidebarContent({ activeModule, onSelect }: SidebarContentProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={cn(
            "min-h-[48px] rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors",
            activeModule === item.id
              ? "bg-coral-50 text-coral-600"
              : "text-ink-soft hover:bg-cream-deep"
          )}
        >
          {item.label}
        </button>
      ))}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="flex min-h-[48px] w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-bold text-ink-soft hover:bg-cream-deep"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

interface AdminDashboardShellProps {
  activeModule: AdminModuleId;
  onSelectModule: (id: AdminModuleId) => void;
  children: ReactNode;
}

export function AdminDashboardShell({
  activeModule,
  onSelectModule,
  children,
}: AdminDashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function selectAndClose(id: AdminModuleId) {
    onSelectModule(id);
    setMobileNavOpen(false);
  }

  return (
    <div className="min-h-screen bg-cream-soft lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-ink/10 px-4">
          <span className="font-display text-sm font-bold text-ink">
            Arcoíris Florencia · Admin
          </span>
        </div>
        <SidebarContent activeModule={activeModule} onSelect={selectAndClose} />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-deep text-ink lg:hidden"
              aria-label="Abrir menú de administración"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="truncate font-display text-sm font-bold text-ink sm:text-base">
              {NAV_ITEMS.find((item) => item.id === activeModule)?.label}
            </span>
          </div>
          <a
            href="/"
            className="shrink-0 text-sm font-semibold text-coral-600 hover:underline"
          >
            Volver al sitio
          </a>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menú de administración"
            className="absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-ink/10 px-4">
              <span className="font-display text-sm font-bold text-ink">Administración</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream-deep text-ink"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent activeModule={activeModule} onSelect={selectAndClose} />
          </div>
        </div>
      )}
    </div>
  );
}
