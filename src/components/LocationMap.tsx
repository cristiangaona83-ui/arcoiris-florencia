import { useState } from "react";
import { Navigation } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

/**
 * Mapa embebido de Google Maps (sin API key, usando el enlace público
 * "output=embed"). El mapa permanece inactivo hasta que se hace clic o se
 * toca una vez: así el cursor o el dedo pueden pasar por encima sin que el
 * mapa capture la rueda del mouse o el gesto de scroll, evitando que
 * bloquee el desplazamiento normal de la página.
 */
export function LocationMap() {
  const [isActive, setIsActive] = useState(false);
  const query = encodeURIComponent(siteConfig.mapQuery);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl shadow-card ring-1 ring-ink/5">
        <iframe
          title={`Mapa de ubicación de ${siteConfig.name}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full sm:h-96"
        />
        {!isActive && (
          <button
            type="button"
            onClick={() => setIsActive(true)}
            aria-label="Activar mapa interactivo"
            className="absolute inset-0 flex items-end justify-center bg-ink/0 pb-4 transition-colors hover:bg-ink/5 sm:items-center sm:pb-0"
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-card">
              Haz clic o toca para interactuar con el mapa
            </span>
          </button>
        )}
      </div>

      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-coral-600"
      >
        <Navigation className="h-5 w-5" aria-hidden="true" />
        Cómo llegar
      </a>
    </div>
  );
}
