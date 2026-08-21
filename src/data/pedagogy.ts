import type { LucideIcon } from "lucide-react";
import {
  Gamepad2,
  Compass,
  PersonStanding,
  MessageCircle,
  Palette,
  UsersRound,
  KeyRound,
  Brush,
  Leaf,
} from "lucide-react";

export interface PedagogyItem {
  icon: LucideIcon;
  label: string;
}

/**
 * Ámbitos de experiencias que el jardín desea destacar visualmente.
 * No corresponden a "sellos institucionales oficiales": esa información
 * se incorporará en la sección "Nuestro Proyecto Educativo" cuando sea
 * proporcionada.
 */
export const pedagogyItems: PedagogyItem[] = [
  { icon: Gamepad2, label: "Juego" },
  { icon: Compass, label: "Exploración" },
  { icon: PersonStanding, label: "Movimiento" },
  { icon: MessageCircle, label: "Lenguaje" },
  { icon: Palette, label: "Creatividad" },
  { icon: UsersRound, label: "Convivencia" },
  { icon: KeyRound, label: "Autonomía" },
  { icon: Brush, label: "Expresión artística" },
  { icon: Leaf, label: "Descubrimiento del entorno" },
];
