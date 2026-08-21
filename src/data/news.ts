export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  image: string | null;
  /** Párrafos del cuerpo completo, mostrados al abrir "Leer más". */
  body?: string[];
  /** Fotografías adicionales para la galería interna al abrir "Leer más". */
  gallery?: string[];
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
  {
    id: "kidzania-2026-07-31",
    title: "Salida educativa a KidZania",
    summary:
      "Nuestros niños y niñas disfrutaron de una enriquecedora salida educativa a KidZania, aprendiendo mediante el juego, la exploración y nuevas experiencias.",
    date: "2026-07-31",
    category: "Actividades",
    image: "/images/kidzania/1.jpeg",
    body: [
      "Nuestros niños y niñas participaron el 31 de julio de 2026 en una entretenida salida educativa a KidZania, donde tuvieron la oportunidad de aprender a través del juego, la exploración y la participación en distintas experiencias relacionadas con el mundo de las profesiones y la vida cotidiana.",
      "Esta experiencia permitió fortalecer la autonomía, la convivencia, la participación y el aprendizaje significativo, ofreciendo nuevos espacios para descubrir, experimentar y compartir junto a sus compañeros y equipo educativo.",
      "Fue una jornada llena de entusiasmo, aprendizajes y experiencias que enriquecen nuestro proyecto educativo y permiten que niños y niñas continúen aprendiendo más allá del aula.",
    ],
    gallery: [
      "/images/kidzania/2.jpeg",
      "/images/kidzania/3.jpeg",
      "/images/kidzania/4.jpeg",
      "/images/kidzania/5.jpeg",
      "/images/kidzania/6.jpeg",
      "/images/kidzania/7.jpeg",
      "/images/kidzania/8.jpeg",
      "/images/kidzania/9.jpeg",
      "/images/kidzania/10.jpeg",
    ],
  },
];
