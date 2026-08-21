export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  isPlaceholder: boolean;
}

/**
 * Equipo confirmado del jardín. Se muestran únicamente los integrantes
 * con datos reales entregados: no se agregan tarjetas placeholder.
 */
export const team: TeamMember[] = [
  {
    id: "directora",
    name: "Rosa Verdugo Matamala",
    role: "Directora",
    photo: "/images/equipo/directora-rosa-verdugo.jpg",
    isPlaceholder: false,
  },
  {
    id: "tecnico-1",
    name: "Daniela Araya Cisternas",
    role: "Técnico en Educación Parvularia",
    photo: "/images/equipo/daniela-araya-cisternas.jpg",
    isPlaceholder: false,
  },
  {
    id: "tecnico-2",
    name: "Valentina Jeria Cuevas",
    role: "Técnico en Educación Parvularia",
    photo: "/images/equipo/valentina-jeria-cuevas.jpg",
    isPlaceholder: false,
  },
  {
    id: "auxiliar-1",
    name: "Grimilda Matamala",
    role: "Auxiliar de Servicios",
    photo: "/images/equipo/grimilda-matamala.jpg",
    isPlaceholder: false,
  },
];
