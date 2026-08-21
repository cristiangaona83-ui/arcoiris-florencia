export interface FaqItem {
  question: string;
  answer: string;
  /** Si es true, se agrega debajo la lista de horarios (siteConfig.schedules). */
  showSchedule?: boolean;
}

export const faqItems: FaqItem[] = [
  {
    question: "¿Cómo puedo solicitar información?",
    answer:
      "Puedes comunicarte con nosotros a través del formulario de contacto de nuestra página web, escribirnos al correo arcoiris.florencia2020@gmail.com o contactarnos mediante nuestras redes sociales. Estaremos encantados de resolver tus consultas.",
  },
  {
    question: "¿Qué documentación se requiere?",
    answer:
      "La documentación puede variar según el nivel y el proceso de matrícula. Contáctanos para conocer los antecedentes requeridos y recibir orientación personalizada.",
  },
  {
    question: "¿Cuáles son los horarios?",
    answer: "Contamos con distintas alternativas de jornada:",
    showSchedule: true,
  },
  {
    question: "¿Cómo puedo conocer el jardín?",
    answer:
      "Puedes contactarnos para coordinar una visita y conocer personalmente nuestras instalaciones, propuesta educativa y los espacios donde niños y niñas desarrollan sus experiencias de aprendizaje.",
  },
  {
    question: "¿Cómo solicitar una entrevista?",
    answer:
      "Puedes solicitar una entrevista mediante nuestro formulario de contacto, correo electrónico o redes sociales, indicando tus datos y el motivo de la consulta. Nos comunicaremos contigo para coordinarla.",
  },
];
