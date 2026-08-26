import { supabase } from "@/lib/supabaseClient";

const BUCKET = "public-media";
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

/**
 * Redimensiona/comprime una imagen en el navegador antes de subirla, para
 * no consumir Storage y ancho de banda con fotos de varios MB tal cual
 * salen del celular. Mantiene proporción; nunca agranda una imagen más
 * pequeña que el máximo.
 */
async function compressImage(file: File, maxDimension: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", JPEG_QUALITY);
  });
}

/** Extrae el path interno del bucket a partir de una URL pública, o null si no pertenece a este bucket. */
function extractPublicMediaPath(url: string | null): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

/**
 * Sube (o reemplaza) una imagen en el bucket público `public-media`, bajo
 * la carpeta indicada (por ejemplo "team" o "hero"). Si `previousUrl`
 * apunta a un archivo ya almacenado en este bucket, se elimina después de
 * subir la nueva imagen para no dejar archivos huérfanos; si la anterior
 * era una ruta estática de /public/images/, no se toca.
 */
export async function uploadPublicMedia(
  file: File,
  folder: "team" | "hero",
  previousUrl: string | null,
  maxDimension: number = MAX_DIMENSION
): Promise<string> {
  const compressed = await compressImage(file, maxDimension);
  const path = `${folder}/${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const previousPath = extractPublicMediaPath(previousUrl);
  if (previousPath) {
    await supabase.storage.from(BUCKET).remove([previousPath]);
  }

  return data.publicUrl;
}
