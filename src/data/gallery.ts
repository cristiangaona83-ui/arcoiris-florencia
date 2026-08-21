export type GalleryCategory =
  | "Nuestro Jardín"
  | "Experiencias de aprendizaje"
  | "Actividades"
  | "Celebraciones"
  | "Comunidad educativa";

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  /** Ruta de la imagen. Reemplazar por fotografías reales en /public/images/gallery/ */
  src: string | null;
  alt: string;
}

export const galleryCategories: GalleryCategory[] = [
  "Nuestro Jardín",
  "Experiencias de aprendizaje",
  "Actividades",
  "Celebraciones",
  "Comunidad educativa",
];

/**
 * Aún no existen fotografías oficiales del establecimiento en el proyecto.
 * Se muestran placeholders visuales (sin fotografías de niños tomadas de
 * internet). Para reemplazar: agregar el archivo a /public/images/gallery/
 * y actualizar el campo "src" de cada elemento.
 */
export const galleryImages: GalleryImage[] = [
  { id: "g1", category: "Nuestro Jardín", src: null, alt: "Fachada del Jardín Infantil Arcoíris Florencia (fotografía pendiente)" },
  { id: "g2", category: "Nuestro Jardín", src: null, alt: "Patio y espacios exteriores del jardín (fotografía pendiente)" },
  { id: "g3", category: "Experiencias de aprendizaje", src: null, alt: "Sala de actividades pedagógicas (fotografía pendiente)" },
  { id: "g4", category: "Experiencias de aprendizaje", src: null, alt: "Rincón de exploración y juego (fotografía pendiente)" },
  { id: "g5", category: "Actividades", src: null, alt: "Actividad educativa grupal (fotografía pendiente)" },
  { id: "g6", category: "Actividades", src: null, alt: "Taller de expresión artística (fotografía pendiente)" },
  { id: "g7", category: "Celebraciones", src: null, alt: "Celebración institucional (fotografía pendiente)" },
  { id: "g8", category: "Celebraciones", src: null, alt: "Actividad de fecha significativa (fotografía pendiente)" },
  { id: "g9", category: "Comunidad educativa", src: null, alt: "Encuentro con familias (fotografía pendiente)" },
  { id: "g10", category: "Comunidad educativa", src: null, alt: "Equipo educativo del jardín (fotografía pendiente)" },
];
