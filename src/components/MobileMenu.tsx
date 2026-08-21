import { X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { navLinks } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string;
}

export function MobileMenu({ isOpen, onClose, activeId }: MobileMenuProps) {
  useLockBodyScroll(isOpen);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Logo className="h-9 w-9 shrink-0" />
            <span className="truncate font-display text-base font-bold text-ink">
              {siteConfig.shortName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full bg-white text-ink shadow-card"
            aria-label="Cerrar menú de navegación"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-4" aria-label="Navegación móvil">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "min-h-[48px] rounded-2xl px-4 py-3 text-base font-bold font-display transition-colors flex items-center",
                  isActive
                    ? "bg-coral-50 text-coral-600"
                    : "text-ink-soft hover:bg-white"
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-ink/10 p-5">
          <Button href="#contacto" onClick={onClose} className="w-full">
            Contáctanos
          </Button>
        </div>
      </div>
    </div>
  );
}
