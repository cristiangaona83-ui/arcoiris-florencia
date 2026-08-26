import { supabase } from "@/lib/supabaseClient";

export interface InstitutionalContentRow {
  id: number;
  history_paragraphs: string[];
  mission_text: string | null;
  vision_text: string | null;
  principles_summary: string | null;
  principles_items: string[];
  values_summary: string | null;
  values_items: string[];
  updated_at: string;
}

const INSTITUTIONAL_CONTENT_COLUMNS =
  "id, history_paragraphs, mission_text, vision_text, principles_summary, principles_items, values_summary, values_items, updated_at";

/** Público: lee la fila única de contenido institucional (id = 1). null si aún no existe. */
export async function fetchInstitutionalContent(): Promise<InstitutionalContentRow | null> {
  const { data, error } = await supabase
    .from("institutional_content")
    .select(INSTITUTIONAL_CONTENT_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data as InstitutionalContentRow | null;
}

export type InstitutionalContentUpdate = Partial<
  Omit<InstitutionalContentRow, "id" | "updated_at">
>;

/** Admin: actualiza la fila única de contenido institucional. Requiere sesión con is_admin(). */
export async function updateInstitutionalContent(
  patch: InstitutionalContentUpdate
): Promise<InstitutionalContentRow> {
  const { data, error } = await supabase
    .from("institutional_content")
    .update(patch)
    .eq("id", 1)
    .select(INSTITUTIONAL_CONTENT_COLUMNS)
    .single();

  if (error) throw error;
  return data as InstitutionalContentRow;
}
