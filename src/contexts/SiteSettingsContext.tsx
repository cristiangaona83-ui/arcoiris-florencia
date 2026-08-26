import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSiteSettings, type SiteSettingsRow } from "@/lib/siteSettings";
import { siteConfig } from "@/data/siteConfig";

export interface EffectiveSiteSettings {
  name: string;
  shortName: string;
  addressStreet: string;
  sector: string;
  region: string;
  fullAddress: string;
  rbd: string;
  phones: { display: string; whatsapp: string }[];
  email: string;
  schedules: { label: string; hours: string }[];
  social: { facebook: string; instagram: string };
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroPrimaryButtonLabel: string;
  heroPrimaryButtonHref: string;
  heroSecondaryButtonLabel: string;
  heroSecondaryButtonHref: string;
  heroImageUrl: string;
  /** false mientras se usa el respaldo estático (aún no cargó o falló Supabase). */
  isFromDatabase: boolean;
}

/**
 * Combina la fila de site_settings (si existe y cargó bien) con los datos
 * estáticos de siteConfig.ts / Hero.tsx como respaldo, campo por campo.
 * Así, si Supabase falla o un campo puntual quedó vacío, la web pública
 * nunca muestra menos información que la versión actual.
 */
function buildEffectiveSettings(row: SiteSettingsRow | null): EffectiveSiteSettings {
  const addressStreet = row?.address_street || siteConfig.addressStreet;
  const sector = row?.sector || siteConfig.sector;
  const region = row?.region || siteConfig.region;

  return {
    name: row?.name || siteConfig.name,
    shortName: row?.short_name || siteConfig.shortName,
    addressStreet,
    sector,
    region,
    fullAddress: row
      ? [addressStreet, sector, region].filter(Boolean).join(", ")
      : siteConfig.fullAddress,
    rbd: siteConfig.rbd,
    phones: row?.phones?.length ? row.phones : [...siteConfig.phones],
    email: row?.email || siteConfig.email,
    schedules: row?.schedules?.length ? row.schedules : [...siteConfig.schedules],
    social: {
      facebook: row?.social_facebook || siteConfig.social.facebook,
      instagram: row?.social_instagram || siteConfig.social.instagram,
    },
    heroTitlePrefix: row?.hero_title_prefix || "Aprendemos, jugamos y",
    heroTitleHighlight: row?.hero_title_highlight || "crecemos juntos",
    heroSubtitle:
      row?.hero_subtitle ||
      "En Jardín Infantil Arcoíris Florencia acompañamos los primeros aprendizajes de niños y niñas en un ambiente acogedor, seguro y lleno de oportunidades para descubrir, aprender y crecer.",
    heroPrimaryButtonLabel: row?.hero_primary_button_label || "Conoce nuestro jardín",
    heroPrimaryButtonHref: row?.hero_primary_button_href || "#nuestro-jardin",
    heroSecondaryButtonLabel: row?.hero_secondary_button_label || "Contáctanos",
    heroSecondaryButtonHref: row?.hero_secondary_button_href || "#contacto",
    heroImageUrl: row?.hero_image_url || "/images/PORTADA.jpeg",
    isFromDatabase: row !== null,
  };
}

const SiteSettingsContext = createContext<EffectiveSiteSettings | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  // Estado inicial ya es el respaldo estático completo: la primera pintura
  // nunca muestra un hueco vacío mientras se resuelve la consulta.
  const [settings, setSettings] = useState<EffectiveSiteSettings>(() => buildEffectiveSettings(null));

  useEffect(() => {
    let active = true;
    fetchSiteSettings()
      .then((row) => {
        if (active) setSettings(buildEffectiveSettings(row));
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar la configuración del sitio desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): EffectiveSiteSettings {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings debe usarse dentro de <SiteSettingsProvider>");
  }
  return ctx;
}
