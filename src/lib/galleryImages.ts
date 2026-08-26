import { supabase } from "@/lib/supabaseClient";
import { uploadPublicMedia } from "@/lib/publicMediaStorage";

export interface GalleryImageRow {
  id: string;
  category: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const GALLERY_COLUMNS =
  "id, category, image_url, alt_text, sort_order, is_visible, created_at, updated_at";

/** Público: solo imágenes visibles, en el orden definido por sort_order. */
export async function fetchVisibleGalleryImages(): Promise<GalleryImageRow[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select(GALLERY_COLUMNS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as GalleryImageRow[];
}

/** Admin: todas las imágenes (visibles y ocultas). Requiere sesión con is_admin(). */
export async function fetchAllGalleryImages(): Promise<GalleryImageRow[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select(GALLERY_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as GalleryImageRow[];
}

export type GalleryImageInput = Omit<GalleryImageRow, "id" | "created_at" | "updated_at">;

export async function createGalleryImage(input: GalleryImageInput): Promise<GalleryImageRow> {
  const { data, error } = await supabase
    .from("gallery_images")
    .insert(input)
    .select(GALLERY_COLUMNS)
    .single();

  if (error) throw error;
  return data as GalleryImageRow;
}

export async function updateGalleryImage(
  id: string,
  patch: Partial<GalleryImageInput>
): Promise<GalleryImageRow> {
  const { data, error } = await supabase
    .from("gallery_images")
    .update(patch)
    .eq("id", id)
    .select(GALLERY_COLUMNS)
    .single();

  if (error) throw error;
  return data as GalleryImageRow;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderGalleryImages(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("gallery_images").update({ sort_order }).eq("id", id).throwOnError()
    )
  );
}

/** Sube (o reemplaza) una fotografía de galería en `public-media/gallery/`. */
export async function uploadGalleryImage(file: File, previousUrl: string | null): Promise<string> {
  return uploadPublicMedia(file, "gallery", previousUrl, 1600);
}
