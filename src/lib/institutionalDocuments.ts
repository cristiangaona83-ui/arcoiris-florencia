import { supabase } from "@/lib/supabaseClient";
import { extractPublicMediaPath, PUBLIC_MEDIA_BUCKET } from "@/lib/publicMediaStorage";

export interface InstitutionalDocumentRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
  file_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const DOCUMENT_COLUMNS =
  "id, name, description, category, file_url, sort_order, is_visible, created_at, updated_at";

/** Público: solo documentos visibles, en el orden definido por sort_order. */
export async function fetchVisibleDocuments(): Promise<InstitutionalDocumentRow[]> {
  const { data, error } = await supabase
    .from("institutional_documents")
    .select(DOCUMENT_COLUMNS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as InstitutionalDocumentRow[];
}

/** Admin: todos los documentos (visibles y ocultos). Requiere sesión con is_admin(). */
export async function fetchAllDocuments(): Promise<InstitutionalDocumentRow[]> {
  const { data, error } = await supabase
    .from("institutional_documents")
    .select(DOCUMENT_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as InstitutionalDocumentRow[];
}

export type InstitutionalDocumentInput = Omit<
  InstitutionalDocumentRow,
  "id" | "created_at" | "updated_at"
>;

export async function createDocument(
  input: InstitutionalDocumentInput
): Promise<InstitutionalDocumentRow> {
  const { data, error } = await supabase
    .from("institutional_documents")
    .insert(input)
    .select(DOCUMENT_COLUMNS)
    .single();

  if (error) throw error;
  return data as InstitutionalDocumentRow;
}

export async function updateDocument(
  id: string,
  patch: Partial<InstitutionalDocumentInput>
): Promise<InstitutionalDocumentRow> {
  const { data, error } = await supabase
    .from("institutional_documents")
    .update(patch)
    .eq("id", id)
    .select(DOCUMENT_COLUMNS)
    .single();

  if (error) throw error;
  return data as InstitutionalDocumentRow;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from("institutional_documents").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderDocuments(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("institutional_documents").update({ sort_order }).eq("id", id).throwOnError()
    )
  );
}

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Sube (o reemplaza) el PDF de un documento institucional en
 * `public-media/documents/`. No se comprime (no es una imagen): se valida
 * que sea realmente un PDF y que no exceda el tamaño máximo permitido. Si
 * `previousUrl` apunta a un archivo ya almacenado en este bucket, se
 * elimina después de subir el nuevo para no dejar archivos huérfanos.
 */
/** Firma binaria de un PDF real: los primeros bytes del archivo deben ser "%PDF-". */
async function hasPdfMagicBytes(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const signature = String.fromCharCode(...header);
  return signature === "%PDF-";
}

export async function uploadInstitutionalDocumentFile(
  file: File,
  previousUrl: string | null
): Promise<string> {
  const looksLikePdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!looksLikePdf) {
    throw new Error("El archivo debe ser un PDF.");
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new Error("El archivo supera el tamaño máximo permitido (10 MB).");
  }
  if (!(await hasPdfMagicBytes(file))) {
    throw new Error("El archivo no es un PDF válido.");
  }

  const path = `documents/${crypto.randomUUID()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(path);

  const previousPath = extractPublicMediaPath(previousUrl);
  if (previousPath) {
    await supabase.storage.from(PUBLIC_MEDIA_BUCKET).remove([previousPath]);
  }

  return data.publicUrl;
}
