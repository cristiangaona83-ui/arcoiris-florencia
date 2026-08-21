export interface EducationLevel {
  id: string;
  name: string;
  description: string;
  color: "coral" | "sun" | "leaf" | "sky";
  /** Placeholders visibles en la tarjeta hasta que se entregue la información real. */
  schedule: string;
  entryAge: string;
}

export const levels: EducationLevel[] = [
  {
    id: "medio-menor",
    name: "Nivel Medio Menor",
    description:
      "Espacio educativo orientado al desarrollo progresivo de la autonomía, el lenguaje, la exploración, la convivencia y el aprendizaje mediante experiencias significativas y el juego.",
    color: "coral",
    schedule: "Información pendiente de completar.",
    entryAge: "Información pendiente de completar.",
  },
  {
    id: "medio-mayor",
    name: "Nivel Medio Mayor",
    description:
      "Experiencias pedagógicas que fortalecen la comunicación, el pensamiento, la convivencia, la motricidad y la autonomía, respetando los ritmos y características de cada niño y niña.",
    color: "sun",
    schedule: "Información pendiente de completar.",
    entryAge: "Información pendiente de completar.",
  },
  {
    id: "prekinder",
    name: "Prekínder",
    description:
      "Nivel orientado a ampliar las oportunidades de aprendizaje mediante experiencias lúdicas, creativas y participativas, favoreciendo el desarrollo integral y la preparación progresiva para nuevos desafíos educativos.",
    color: "leaf",
    schedule: "Información pendiente de completar.",
    entryAge: "Información pendiente de completar.",
  },
  {
    id: "kinder",
    name: "Kínder",
    description:
      "Nivel que fortalece aprendizajes, habilidades y actitudes fundamentales para la transición a la Educación Básica, promoviendo la autonomía, la curiosidad, la convivencia y el disfrute por aprender.",
    color: "sky",
    schedule: "Información pendiente de completar.",
    entryAge: "Información pendiente de completar.",
  },
];
