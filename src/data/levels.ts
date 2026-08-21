export interface EducationLevel {
  id: string;
  name: string;
  description: string;
  color: "coral" | "sun" | "leaf" | "sky";
  entryAge: string;
}

export const levels: EducationLevel[] = [
  {
    id: "medio-menor",
    name: "Nivel Medio Menor",
    description:
      "Espacio educativo orientado al desarrollo progresivo de la autonomía, el lenguaje, la exploración, la convivencia y el aprendizaje mediante experiencias significativas y el juego.",
    color: "coral",
    entryAge: "Desde los 2 años",
  },
  {
    id: "medio-mayor",
    name: "Nivel Medio Mayor",
    description:
      "Experiencias pedagógicas que fortalecen la comunicación, el pensamiento, la convivencia, la motricidad y la autonomía, respetando los ritmos y características de cada niño y niña.",
    color: "sun",
    entryAge: "3 años",
  },
  {
    id: "prekinder",
    name: "Prekínder",
    description:
      "Nivel orientado a ampliar las oportunidades de aprendizaje mediante experiencias lúdicas, creativas y participativas, favoreciendo el desarrollo integral y la preparación progresiva para nuevos desafíos educativos.",
    color: "leaf",
    entryAge: "4 años",
  },
  {
    id: "kinder",
    name: "Kínder",
    description:
      "Nivel que fortalece aprendizajes, habilidades y actitudes fundamentales para la transición a la Educación Básica, promoviendo la autonomía, la curiosidad, la convivencia y el disfrute por aprender.",
    color: "sky",
    entryAge: "5 años",
  },
];
