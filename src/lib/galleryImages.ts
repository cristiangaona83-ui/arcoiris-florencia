import { supabase } from "@/lib/supabaseClient";
import { extractPublicMediaPath, PUBLIC_MEDIA_BUCKET, uploadPublicMedia } from "@/lib/publicMediaStorage";

export type GalleryMediaType = "image" | "video" | "youtube";

export interface GalleryImageRow {
  id: string;
  category: string;
  image_url: string | null;
  alt_text: string;
  sort_order: number;
  is_visible: boolean;
  media_type: GalleryMediaType;
  title: string | null;
  description: string | null;
  media_url: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  original_size_bytes: number | null;
  optimized_size_bytes: number | null;
  duration_seconds: number | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

const GALLERY_COLUMNS =
  "id, category, image_url, alt_text, sort_order, is_visible, media_type, title, description, media_url, youtube_id, thumbnail_url, original_size_bytes, optimized_size_bytes, duration_seconds, resolution, created_at, updated_at";

/** Público: solo elementos visibles, en el orden definido por sort_order. */
export async function fetchVisibleGalleryImages(): Promise<GalleryImageRow[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select(GALLERY_COLUMNS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as GalleryImageRow[];
}

/** Admin: todos los elementos (visibles y ocultos). Requiere sesión con is_admin(). */
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

/** Elimina de Storage cualquier archivo propio (no estático) referenciado por la fila. */
async function cleanupGalleryMediaFiles(row: GalleryImageRow): Promise<void> {
  const paths = [row.image_url, row.media_url, row.thumbnail_url]
    .map((url) => extractPublicMediaPath(url))
    .filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove(paths);
  }
}

/** Elimina la fila y, si corresponde, sus archivos en Storage (sin dejar huérfanos). */
export async function deleteGalleryImage(row: GalleryImageRow): Promise<void> {
  const { error } = await supabase.from("gallery_images").delete().eq("id", row.id);
  if (error) throw error;
  await cleanupGalleryMediaFiles(row);
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

export interface GalleryVideoAssets {
  media_url: string;
  thumbnail_url: string;
}

/**
 * Sube el video ya optimizado y su miniatura a `public-media/gallery/{id}/videos/`.
 * Si se indican URLs previas (reemplazo), se eliminan después de subir las
 * nuevas para no dejar archivos huérfanos.
 */
export async function uploadGalleryVideoAssets(
  videoBlob: Blob,
  thumbnailBlob: Blob,
  previous?: { mediaUrl: string | null; thumbnailUrl: string | null }
): Promise<GalleryVideoAssets> {
  const id = crypto.randomUUID();
  const videoPath = `gallery/${id}/videos/${id}.mp4`;
  const thumbPath = `gallery/${id}/videos/${id}-thumb.jpg`;

  const { error: videoError } = await supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .upload(videoPath, videoBlob, { contentType: "video/mp4", upsert: false });
  if (videoError) throw videoError;

  const { error: thumbError } = await supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .upload(thumbPath, thumbnailBlob, { contentType: "image/jpeg", upsert: false });
  if (thumbError) throw thumbError;

  const { data: videoData } = supabase.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(videoPath);
  const { data: thumbData } = supabase.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(thumbPath);

  if (previous) {
    const oldPaths = [previous.mediaUrl, previous.thumbnailUrl]
      .map((url) => extractPublicMediaPath(url))
      .filter((path): path is string => Boolean(path));
    if (oldPaths.length > 0) {
      await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove(oldPaths);
    }
  }

  return { media_url: videoData.publicUrl, thumbnail_url: thumbData.publicUrl };
}
