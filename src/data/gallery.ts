export type GalleryCategory =
  | "Nuestro Jardín"
  | "Experiencias de aprendizaje"
  | "Actividades"
  | "Celebraciones"
  | "Comunidad educativa";

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  /** Ruta de la imagen. null = fotografía aún pendiente de incorporar. */
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
 * Para agregar una nueva fotografía:
 *   1. Copia el archivo a /public/images/galeria/ (nombre descriptivo, ej. "celebraciones-05.jpg").
 *   2. Agrega un nuevo objeto aquí con su "id", "category", "src" (ruta "/images/galeria/archivo.jpg") y "alt".
 * Las categorías sin fotografías aún muestran "src: null" como placeholder visual
 * (nunca fotografías de niños tomadas de internet).
 */
export const galleryImages: GalleryImage[] = [
  { id: "g1", category: "Nuestro Jardín", src: null, alt: "Fachada del Jardín Infantil Arcoíris Florencia (fotografía pendiente)" },
  { id: "g2", category: "Nuestro Jardín", src: null, alt: "Patio y espacios exteriores del jardín (fotografía pendiente)" },

  { id: "g3", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-01.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g4", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-02.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g5", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-03.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g6", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-04.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g7", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-05.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g8", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-06.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g9", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-07.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g10", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-08.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g11", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-09.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g12", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-10.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },

  { id: "g13", category: "Actividades", src: null, alt: "Actividad educativa grupal (fotografía pendiente)" },
  { id: "g14", category: "Actividades", src: null, alt: "Taller de expresión artística (fotografía pendiente)" },

  { id: "g15", category: "Celebraciones", src: "/images/galeria/celebraciones-01.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g16", category: "Celebraciones", src: "/images/galeria/celebraciones-02.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g17", category: "Celebraciones", src: "/images/galeria/celebraciones-03.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g18", category: "Celebraciones", src: "/images/galeria/celebraciones-04.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },

  { id: "g19", category: "Comunidad educativa", src: "/images/galeria/comunidad-educativa-01.jpg", alt: "Comunidad educativa del Jardín Infantil Arcoíris Florencia" },
];
