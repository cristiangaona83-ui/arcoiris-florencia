import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { useHideNearFooter } from "@/hooks/useHideNearFooter";

const HIDE_NEAR_IDS = ["contacto", "site-footer"];

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

  // Evita tapar el botón de enviar del formulario y el contenido del footer.
  const hideNearContent = useHideNearFooter(HIDE_NEAR_IDS);

  const commonClasses = `fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-soft transition-all duration-200 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
    hideNearContent ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
  }`;

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
