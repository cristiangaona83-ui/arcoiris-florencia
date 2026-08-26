import { supabase } from "@/lib/supabaseClient";
import { uploadPublicMedia } from "@/lib/publicMediaStorage";

export interface TeamMemberRow {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

const TEAM_MEMBER_COLUMNS = "id, name, role, photo_url, sort_order, is_visible, created_at, updated_at";

/** Público: solo integrantes visibles, en el orden definido por sort_order. */
export async function fetchVisibleTeamMembers(): Promise<TeamMemberRow[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select(TEAM_MEMBER_COLUMNS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as TeamMemberRow[]) ?? [];
}

/** Admin: todos los integrantes (incluidos ocultos), para el panel de gestión. */
export async function fetchAllTeamMembers(): Promise<TeamMemberRow[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select(TEAM_MEMBER_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as TeamMemberRow[]) ?? [];
}

export interface TeamMemberInput {
  name: string;
  role: string;
  photo_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export async function createTeamMember(input: TeamMemberInput): Promise<TeamMemberRow> {
  const { data, error } = await supabase
    .from("team_members")
    .insert(input)
    .select(TEAM_MEMBER_COLUMNS)
    .single();

  if (error) throw error;
  return data as TeamMemberRow;
}

export async function updateTeamMember(
  id: string,
  patch: Partial<TeamMemberInput>
): Promise<TeamMemberRow> {
  const { data, error } = await supabase
    .from("team_members")
    .update(patch)
    .eq("id", id)
    .select(TEAM_MEMBER_COLUMNS)
    .single();

  if (error) throw error;
  return data as TeamMemberRow;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;
}

/** Actualiza sort_order de varios integrantes a la vez (reordenar arriba/abajo). */
export async function reorderTeamMembers(
  updates: { id: string; sort_order: number }[]
): Promise<void> {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("team_members").update({ sort_order }).eq("id", id).throwOnError()
    )
  );
}

/** Sube (o reemplaza) la fotografía de un integrante en `public-media/team/`. */
export async function uploadTeamMemberPhoto(
  file: File,
  previousPhotoUrl: string | null
): Promise<string> {
  return uploadPublicMedia(file, "team", previousPhotoUrl, 800);
}
