import { supabase } from "@/lib/supabaseClient";

export type FaqContentType = "text" | "schedule";

export interface FaqItemRow {
  id: string;
  question: string;
  answer: string;
  content_type: FaqContentType;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const FAQ_COLUMNS =
  "id, question, answer, content_type, sort_order, is_visible, created_at, updated_at";

/** Público: solo preguntas visibles, en el orden definido por sort_order. */
export async function fetchVisibleFaqItems(): Promise<FaqItemRow[]> {
  const { data, error } = await supabase
    .from("faq_items")
    .select(FAQ_COLUMNS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FaqItemRow[];
}

/** Admin: todas las preguntas (visibles y ocultas). Requiere sesión con is_admin(). */
export async function fetchAllFaqItems(): Promise<FaqItemRow[]> {
  const { data, error } = await supabase
    .from("faq_items")
    .select(FAQ_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FaqItemRow[];
}

// content_type es opcional al crear/editar desde el admin: las preguntas
// nuevas quedan como 'text' por defecto en la base de datos, y las
// existentes conservan su content_type actual si no se envía.
export type FaqItemInput = Omit<FaqItemRow, "id" | "created_at" | "updated_at" | "content_type"> & {
  content_type?: FaqContentType;
};

export async function createFaqItem(input: FaqItemInput): Promise<FaqItemRow> {
  const { data, error } = await supabase
    .from("faq_items")
    .insert(input)
    .select(FAQ_COLUMNS)
    .single();

  if (error) throw error;
  return data as FaqItemRow;
}

export async function updateFaqItem(
  id: string,
  patch: Partial<FaqItemInput>
): Promise<FaqItemRow> {
  const { data, error } = await supabase
    .from("faq_items")
    .update(patch)
    .eq("id", id)
    .select(FAQ_COLUMNS)
    .single();

  if (error) throw error;
  return data as FaqItemRow;
}

export async function deleteFaqItem(id: string): Promise<void> {
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderFaqItems(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("faq_items").update({ sort_order }).eq("id", id).throwOnError()
    )
  );
}
