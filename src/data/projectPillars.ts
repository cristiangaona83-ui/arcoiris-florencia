import type { LucideIcon } from "lucide-react";
import { Compass, Eye, HeartHandshake, Target } from "lucide-react";

export interface MissionVisionItem {
  icon: LucideIcon;
  label: string;
  text: string;
  color: "coral" | "sky";
}

export const missionVision: MissionVisionItem[] = [
  {
    icon: Target,
    label: "Misión",
    text: "Promover el desarrollo integral de niños y niñas mediante experiencias significativas, inclusivas y afectivas, trabajando colaborativamente con las familias como primeros educadores.",
    color: "coral",
  },
  {
    icon: Eye,
    label: "Visión",
    text: "Ser una comunidad educativa reconocida por brindar una educación parvularia de calidad, inclusiva y acogedora, donde cada niño y niña pueda aprender, desarrollarse y crecer plenamente.",
    color: "sky",
  },
];

export interface ValueGroup {
  icon: LucideIcon;
  label: string;
  items: string[];
  summary: string;
  color: "leaf" | "grape";
}

export const valueGroups: ValueGroup[] = [
  {
    icon: Compass,
    label: "Principios",
    items: [
      "Bienestar",
      "Singularidad",
      "Juego",
      "Participación",
      "Relaciones positivas",
      "Aprendizajes significativos",
      "Potenciación",
    ],
    summary:
      "Orientamos nuestra labor reconociendo a cada niño y niña como protagonista de sus aprendizajes, respetando sus características, intereses y ritmos de desarrollo.",
    color: "leaf",
  },
  {
    icon: HeartHandshake,
    label: "Valores",
    items: [
      "Inclusión",
      "Amor",
      "Respeto",
      "Solidaridad",
      "Responsabilidad",
      "Libertad",
      "Compartir",
      "Verdad",
    ],
    summary:
      "Estos valores orientan nuestra convivencia y fortalecen una comunidad educativa basada en el buen trato, la colaboración y el respeto por los demás.",
    color: "grape",
  },
];
