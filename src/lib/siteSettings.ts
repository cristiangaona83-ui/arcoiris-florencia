import { supabase } from "@/lib/supabaseClient";
import { uploadPublicMedia } from "@/lib/publicMediaStorage";

export interface PhoneEntry {
  display: string;
  whatsapp: string;
}

export interface ScheduleEntry {
  label: string;
  hours: string;
}

export interface SiteSettingsRow {
  id: number;
  name: string;
  short_name: string;
  address_street: string | null;
  sector: string | null;
  region: string | null;
  phones: PhoneEntry[];
  email: string | null;
  schedules: ScheduleEntry[];
  social_facebook: string | null;
  social_instagram: string | null;
  hero_title_prefix: string | null;
  hero_title_highlight: string | null;
  hero_subtitle: string | null;
  hero_primary_button_label: string | null;
  hero_primary_button_href: string | null;
  hero_secondary_button_label: string | null;
  hero_secondary_button_href: string | null;
  hero_image_url: string | null;
  updated_at: string;
}

const SITE_SETTINGS_COLUMNS =
  "id, name, short_name, address_street, sector, region, phones, email, schedules, social_facebook, social_instagram, hero_title_prefix, hero_title_highlight, hero_subtitle, hero_primary_button_label, hero_primary_button_href, hero_secondary_button_label, hero_secondary_button_href, hero_image_url, updated_at";

/** Público: lee la fila única de configuración (id = 1). null si aún no existe. */
export async function fetchSiteSettings(): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select(SITE_SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data as SiteSettingsRow | null;
}

export type SiteSettingsUpdate = Partial<Omit<SiteSettingsRow, "id" | "updated_at">>;

/** Admin: actualiza la fila única de configuración. Requiere sesión con is_admin(). */
export async function updateSiteSettings(patch: SiteSettingsUpdate): Promise<SiteSettingsRow> {
  const { data, error } = await supabase
    .from("site_settings")
    .update(patch)
    .eq("id", 1)
    .select(SITE_SETTINGS_COLUMNS)
    .single();

  if (error) throw error;
  return data as SiteSettingsRow;
}

/** Sube (o reemplaza) la imagen principal del Hero en `public-media/hero/`. */
export async function uploadHeroImage(file: File, previousImageUrl: string | null): Promise<string> {
  return uploadPublicMedia(file, "hero", previousImageUrl, 2200);
}
