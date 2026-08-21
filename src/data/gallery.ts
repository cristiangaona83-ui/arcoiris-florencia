export interface GalleryImage {
  id: string;
  /** Nombre de categoría, tal como se muestra en el filtro de la galería. */
  category: string;
  src: string;
  alt: string;
}

/**
 * Solo se listan aquí fotografías reales. Los filtros de la galería se
 * generan automáticamente a partir de las categorías presentes en este
 * arreglo (ver componente Gallery): agregar una fotografía con una
 * categoría nueva hace aparecer ese filtro solo, sin tocar ningún otro
 * archivo. Una categoría sin fotografías simplemente no genera filtro.
 *
 * Para agregar una nueva fotografía:
 *   1. Copia el archivo a /public/images/galeria/ (o a una subcarpeta propia,
 *      como ya se hace con /public/images/kidzania/ y /public/images/dia-del-nino/).
 *   2. Agrega un nuevo objeto aquí con su "id", "category" (nombre visible
 *      del filtro), "src" (ruta pública del archivo) y "alt".
 */
export const galleryImages: GalleryImage[] = [
  { id: "g1", category: "Nuestro Jardín", src: "/images/galeria/nuestro-jardin-01.jpg", alt: "Fachada del Jardín Infantil Arcoíris Florencia" },

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
  { id: "g12b", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-11.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },
  { id: "g12c", category: "Experiencias de aprendizaje", src: "/images/galeria/experiencias-aprendizaje-12.jpg", alt: "Experiencia de aprendizaje en el Jardín Infantil Arcoíris Florencia" },

  { id: "kz1", category: "KidZania", src: "/images/kidzania/1.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz2", category: "KidZania", src: "/images/kidzania/2.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz3", category: "KidZania", src: "/images/kidzania/3.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz4", category: "KidZania", src: "/images/kidzania/4.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz5", category: "KidZania", src: "/images/kidzania/5.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz6", category: "KidZania", src: "/images/kidzania/6.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz7", category: "KidZania", src: "/images/kidzania/7.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz8", category: "KidZania", src: "/images/kidzania/8.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz9", category: "KidZania", src: "/images/kidzania/9.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },
  { id: "kz10", category: "KidZania", src: "/images/kidzania/10.jpeg", alt: "Salida educativa a KidZania — Jardín Infantil Arcoíris Florencia" },

  { id: "g15", category: "Celebraciones", src: "/images/galeria/celebraciones-01.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g16", category: "Celebraciones", src: "/images/galeria/celebraciones-02.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g17", category: "Celebraciones", src: "/images/galeria/celebraciones-03.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g18", category: "Celebraciones", src: "/images/galeria/celebraciones-04.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g18b", category: "Celebraciones", src: "/images/galeria/celebraciones-05.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },
  { id: "g18c", category: "Celebraciones", src: "/images/galeria/celebraciones-06.jpg", alt: "Celebración en el Jardín Infantil Arcoíris Florencia" },

  { id: "dn1", category: "Día del Niño", src: "/images/dia-del-nino/1.jpeg", alt: "Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia" },
  { id: "dn2", category: "Día del Niño", src: "/images/dia-del-nino/2.jpeg", alt: "Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia" },
  { id: "dn3", category: "Día del Niño", src: "/images/dia-del-nino/3.jpeg", alt: "Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia" },
  { id: "dn4", category: "Día del Niño", src: "/images/dia-del-nino/4.jpeg", alt: "Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia" },
  { id: "dn5", category: "Día del Niño", src: "/images/dia-del-nino/5.jpeg", alt: "Celebración del Día del Niño y la Niña — Jardín Infantil Arcoíris Florencia" },

  { id: "g19", category: "Comunidad educativa", src: "/images/galeria/comunidad-educativa-01.jpg", alt: "Comunidad educativa del Jardín Infantil Arcoíris Florencia" },
];
