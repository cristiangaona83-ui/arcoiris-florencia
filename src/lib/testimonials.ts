import { supabase } from "@/lib/supabaseClient";

export type TestimonialRelationship = "madre" | "padre" | "apoderado_a" | "otro";
export type TestimonialStatus = "pendiente" | "aprobado" | "rechazado" | "oculto";

export interface Testimonial {
  id: string;
  guardian_name: string;
  relationship: TestimonialRelationship;
  comment: string;
  rating: number | null;
  consent_to_publish: boolean;
  status: TestimonialStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  published_at: string | null;
}

export const relationshipOptions: { value: TestimonialRelationship; label: string }[] = [
  { value: "madre", label: "Madre" },
  { value: "padre", label: "Padre" },
  { value: "apoderado_a", label: "Apoderado/a" },
  { value: "otro", label: "Otro familiar" },
];

export const relationshipLabels: Record<TestimonialRelationship, string> = {
  madre: "Madre",
  padre: "Padre",
  apoderado_a: "Apoderado/a",
  otro: "Familiar",
};

export const statusLabels: Record<TestimonialStatus, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  oculto: "Oculto",
};

/** Muestra "Nombre A." (primer nombre + inicial del apellido) para proteger la privacidad. */
export function formatGuardianDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  const [first, second] = parts;
  return `${first} ${second[0].toUpperCase()}.`;
}

/** Público: solo trae comentarios aprobados. RLS lo garantiza aunque se omita el filtro. */
export async function fetchApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("family_testimonials")
    .select(
      "id, guardian_name, relationship, comment, rating, consent_to_publish, status, created_at, reviewed_at, reviewed_by, published_at"
    )
    .eq("status", "aprobado")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
