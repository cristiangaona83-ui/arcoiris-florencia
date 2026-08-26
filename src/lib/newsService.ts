import { supabase } from "@/lib/supabaseClient";
import { uploadPublicMedia } from "@/lib/publicMediaStorage";

export type NewsStatus = "borrador" | "publicado";

export interface NewsRow {
  id: string;
  title: string;
  summary: string;
  category: string;
  cover_image_url: string | null;
  body: string[];
  gallery: string[];
  event_date: string;
  status: NewsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const NEWS_COLUMNS =
  "id, title, summary, category, cover_image_url, body, gallery, event_date, status, published_at, created_at, updated_at";

/** Público: solo noticias publicadas, más recientes primero. */
export async function fetchPublishedNews(): Promise<NewsRow[]> {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_COLUMNS)
    .eq("status", "publicado")
    .order("event_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as NewsRow[];
}

/** Admin: todas las noticias (borrador y publicado). Requiere sesión con is_admin(). */
export async function fetchAllNews(): Promise<NewsRow[]> {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_COLUMNS)
    .order("event_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as NewsRow[];
}

export type NewsInput = Omit<
  NewsRow,
  "id" | "created_at" | "updated_at" | "published_at"
>;

export async function createNews(input: NewsInput): Promise<NewsRow> {
  const { data, error } = await supabase
    .from("news")
    .insert({
      ...input,
      published_at: input.status === "publicado" ? new Date().toISOString() : null,
    })
    .select(NEWS_COLUMNS)
    .single();

  if (error) throw error;
  return data as NewsRow;
}

export async function updateNews(
  id: string,
  patch: Partial<NewsInput>,
  previousStatus: NewsStatus
): Promise<NewsRow> {
  const nextPatch: Partial<NewsRow> & { published_at?: string | null } = { ...patch };

  // Solo se toca published_at cuando el estado efectivamente cambia, para no
  // pisar la fecha de primera publicación en ediciones posteriores.
  if (patch.status && patch.status !== previousStatus) {
    nextPatch.published_at = patch.status === "publicado" ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from("news")
    .update(nextPatch)
    .eq("id", id)
    .select(NEWS_COLUMNS)
    .single();

  if (error) throw error;
  return data as NewsRow;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}

/** Sube (o reemplaza) la imagen de portada o de galería de una noticia en `public-media/news/`. */
export async function uploadNewsImage(file: File, previousUrl: string | null): Promise<string> {
  return uploadPublicMedia(file, "news", previousUrl, 2000);
}
