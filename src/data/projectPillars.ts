import type { LucideIcon } from "lucide-react";
import { Target, Eye, Award, HeartHandshake } from "lucide-react";

export interface ProjectPillar {
  icon: LucideIcon;
  title: string;
  content: string;
}

/**
 * Estructura preparada para el Proyecto Educativo Institucional.
 * Los textos oficiales (misión, visión, sellos, valores) aún no han sido
 * entregados: se muestra un texto claramente identificado como pendiente,
 * nunca contenido inventado.
 */
export const PENDING_INSTITUTIONAL_CONTENT =
  "Contenido institucional pendiente de incorporar.";

export const projectPillars: ProjectPillar[] = [
  { icon: Target, title: "Misión", content: PENDING_INSTITUTIONAL_CONTENT },
  { icon: Eye, title: "Visión", content: PENDING_INSTITUTIONAL_CONTENT },
  {
    icon: Award,
    title: "Sellos educativos",
    content: PENDING_INSTITUTIONAL_CONTENT,
  },
  {
    icon: HeartHandshake,
    title: "Valores y principios pedagógicos",
    content: PENDING_INSTITUTIONAL_CONTENT,
  },
];
