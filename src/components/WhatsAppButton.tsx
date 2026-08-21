import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

/**
 * Botón flotante de WhatsApp. Usa el primer número de siteConfig.phones.
 * Si no hay ningún número cargado, el botón queda visualmente presente
 * pero deshabilitado (no inventa ni redirige a ningún número).
 */
export function WhatsAppButton() {
  const primary = siteConfig.phones[0];
  const hasNumber = Boolean(primary?.whatsapp?.trim());
  const href = hasNumber
    ? `https://wa.me/${primary.whatsapp}?text=${encodeURIComponent(
        `Hola, quisiera obtener información de ${siteConfig.name}.`
      )}`
    : undefined;

  const commonClasses =
    "fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-soft transition-transform duration-200 sm:bottom-6 sm:right-6";

  if (!hasNumber) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Número de WhatsApp pendiente de configurar"
        className={`${commonClasses} cursor-not-allowed bg-leaf-200 text-white/80`}
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        <span className="sr-only">WhatsApp no disponible por ahora — número pendiente de configurar</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${commonClasses} bg-leaf-500 text-white hover:-translate-y-1 hover:bg-leaf-600`}
      aria-label={`Escribir por WhatsApp a ${siteConfig.name}`}
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
