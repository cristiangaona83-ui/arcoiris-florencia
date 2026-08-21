export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string | null;
}

/**
 * CONTENIDO DE DEMOSTRACIÓN.
 * Estas noticias son ejemplos visuales para mostrar cómo funciona la sección.
 * No representan actividades reales realizadas por el jardín y deben
 * reemplazarse por noticias oficiales antes de publicar el sitio.
 */
export const news: NewsItem[] = [
  {
    id: "demo-1",
    title: "[Contenido de demostración] Bienvenida al año educativo",
    summary:
      "Ejemplo de noticia para mostrar el formato de tarjeta: fecha, categoría, título, resumen y botón de lectura. Reemplazar por contenido real.",
    date: "2026-03-01",
    category: "Comunidad educativa",
    image: null,
  },
  {
    id: "demo-2",
    title: "[Contenido de demostración] Experiencias de aprendizaje en sala",
    summary:
      "Ejemplo de noticia para mostrar cómo se presentan las actividades pedagógicas del jardín. Reemplazar por contenido real.",
    date: "2026-04-10",
    category: "Experiencias de aprendizaje",
    image: null,
  },
  {
    id: "demo-3",
    title: "[Contenido de demostración] Celebración de fechas significativas",
    summary:
      "Ejemplo de noticia para mostrar cómo se presentan celebraciones y efemérides. Reemplazar por contenido real.",
    date: "2026-05-15",
    category: "Celebraciones",
    image: null,
  },
];
