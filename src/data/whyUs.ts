import type { LucideIcon } from "lucide-react";
import { Puzzle, HeartHandshake, Sparkles, Users } from "lucide-react";

export interface WhyUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "coral" | "sun" | "leaf" | "sky";
}

export const whyUsItems: WhyUsItem[] = [
  {
    icon: Puzzle,
    title: "Aprendizaje a través del juego",
    description:
      "Promovemos experiencias educativas significativas donde niños y niñas pueden aprender explorando, creando, descubriendo y jugando.",
    color: "coral",
  },
  {
    icon: Sparkles,
    title: "Desarrollo integral",
    description:
      "Favorecemos el desarrollo de habilidades cognitivas, sociales, emocionales, comunicativas y motrices, considerando las características y ritmos de aprendizaje de cada niño y niña.",
    color: "sun",
  },
  {
    icon: HeartHandshake,
    title: "Ambiente acogedor",
    description:
      "Buscamos generar espacios educativos donde niños y niñas puedan sentirse seguros, respetados, acompañados y valorados.",
    color: "leaf",
  },
  {
    icon: Users,
    title: "Trabajo con las familias",
    description:
      "Reconocemos a las familias como actores fundamentales del proceso educativo y promovemos una relación basada en la colaboración, comunicación y confianza.",
    color: "sky",
  },
];
