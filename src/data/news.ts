export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  /** Fotografía real de portada. Toda publicación debe tener una imagen. */
  image: string;
  /** Párrafos del cuerpo completo, mostrados al abrir "Leer más". */
  body?: string[];
  /** Fotografías adicionales para la galería interna al abrir "Leer más". */
  gallery?: string[];
}

/**
 * Solo se publican aquí noticias reales, con contenido y fotografía
 * verídicos del jardín. No se agregan publicaciones de demostración
 * ni fotografías inventadas.
 */
export const news: NewsItem[] = [
  {
    id: "dia-del-nino-2026-08-07",
    title: "Celebración del Día del Niño y la Niña",
    summary:
      "Una jornada llena de magia, alegría y diversión para celebrar a nuestros niños y niñas junto a toda la comunidad educativa.",
    date: "2026-08-07",
    category: "Celebraciones",
    image: "/images/dia-del-nino/5.jpeg",
    body: [
      "Con mucha alegría celebramos el Día del Niño y la Niña en el Jardín Infantil Arcoíris Florencia, compartiendo una jornada especialmente preparada para que nuestros niños y niñas disfrutaran, jugaran y vivieran momentos inolvidables.",
      "Durante la actividad pudieron disfrutar de un entretenido show de magia, lleno de sorpresas, risas y diversión, generando un espacio de encuentro y alegría junto a sus compañeros y equipo educativo.",
      "Agradecemos sinceramente a nuestras familias y apoderados por su permanente apoyo y colaboración, que contribuyeron a hacer posible esta hermosa celebración.",
      "Asimismo, agradecemos a Petit Mon Diversiones por acompañarnos con su espectáculo y regalar a nuestros niños y niñas una experiencia llena de magia y felicidad.",
      "En Arcoíris Florencia continuamos creando experiencias que fortalecen la convivencia, el bienestar y los vínculos de nuestra comunidad educativa.",
    ],
    gallery: [
      "/images/dia-del-nino/1.jpeg",
      "/images/dia-del-nino/2.jpeg",
      "/images/dia-del-nino/3.jpeg",
      "/images/dia-del-nino/4.jpeg",
    ],
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
