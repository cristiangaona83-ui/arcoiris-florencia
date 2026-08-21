export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  isPlaceholder: boolean;
}

/**
 * Únicamente Rosa Verdugo Matamala (Directora) es un dato confirmado.
 * El resto del equipo se deja como tarjetas placeholder: no se inventan
 * nombres ni cargos hasta contar con la información oficial.
 */
export const team: TeamMember[] = [
  {
    id: "directora",
    name: "Rosa Verdugo Matamala",
    role: "Directora",
    photo: null,
    isPlaceholder: false,
  },
  {
    id: "educadora-1",
    name: "Nombre pendiente de completar",
    role: "Educadora de Párvulos",
    photo: null,
    isPlaceholder: true,
  },
  {
    id: "educadora-2",
    name: "Nombre pendiente de completar",
    role: "Educadora de Párvulos",
    photo: null,
    isPlaceholder: true,
  },
  {
    id: "tecnico-1",
    name: "Nombre pendiente de completar",
    role: "Técnico en Educación Parvularia",
    photo: null,
    isPlaceholder: true,
  },
  {
    id: "tecnico-2",
    name: "Nombre pendiente de completar",
    role: "Técnico en Educación Parvularia",
    photo: null,
    isPlaceholder: true,
  },
];
