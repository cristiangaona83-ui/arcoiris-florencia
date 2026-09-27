import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const SESSION_KEY = "admision-2027-modal-dismissed";

function wasDismissedThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissedThisSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): el aviso podría
    // reaparecer al navegar, pero nunca rompe la página.
  }
}

/**
 * Aviso emergente de Admisión 2027: se muestra una sola vez por sesión de
 * navegador al entrar al sitio, y no vuelve a aparecer hasta una nueva
 * sesión (pestaña/ventana nueva).
 */
export function AdmissionPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wasDismissedThisSession()) return;
    setIsOpen(true);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function close() {
    setIsVisible(false);
    markDismissedThisSession();
    setTimeout(() => setIsOpen(false), 200);
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admisión 2027"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
    >
      <div
        className={`relative max-h-[85vh] w-full max-w-sm transition-all duration-200 ease-out sm:max-w-md md:max-w-lg ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/images/admision-2027.jpg"
          alt="Admisión 2027 - Matrículas abiertas Jardín Infantil Arcoíris Florencia"
          className="mx-auto block max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <button
          type="button"
          onClick={close}
          className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card hover:bg-cream-deep"
          aria-label="Cerrar aviso de Admisión 2027"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
