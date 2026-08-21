import { siteConfig } from "@/data/siteConfig";

/**
 * Mapa embebido vía OpenStreetMap (no requiere API key). Utiliza
 * directamente la dirección del jardín como consulta.
 */
export function LocationMap() {
  const query = encodeURIComponent(siteConfig.mapQuery);
  const src = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=&query=${query}`;

  return (
    <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-ink/5">
      <iframe
        title={`Mapa de ubicación de ${siteConfig.name}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-72 w-full sm:h-96"
      />
    </div>
  );
}
