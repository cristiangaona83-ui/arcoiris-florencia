/**
 * Configuración institucional centralizada.
 * Todos los datos reales del jardín viven aquí. Los campos vacíos ("")
 * son placeholders pendientes de completar — no deben inventarse.
 */
export const siteConfig = {
  name: "Jardín Infantil Arcoíris Florencia",
  shortName: "Arcoíris Florencia",
  director: "Rosa Verdugo Matamala",

  addressStreet: "General Manuel Baquedano 283",
  sector: "Llolleo",
  city: "San Antonio",
  region: "Región de Valparaíso",
  country: "Chile",
  fullAddress:
    "General Manuel Baquedano 283, Llolleo, San Antonio, Región de Valparaíso, Chile",

  foundedAt: "1 de febrero de 2020",
  officialRecognitionAt: "10 de mayo de 2022",
  officialRecognitionResolution: "Resolución Exenta N°1762",
  rbd: "42064-0",

  levels: [
    "Nivel Medio Menor",
    "Nivel Medio Mayor",
    "Prekínder",
    "Kínder",
  ],

  // Números de contacto. "whatsapp" son solo dígitos con código de país
  // (sin "+" ni espacios), usados para generar enlaces wa.me.
  phones: [
    { display: "+56 9 5961 3494", whatsapp: "56959613494" },
    { display: "+56 9 3540 3115", whatsapp: "56935403115" },
  ],

  email: "arcoiris.florencia2020@gmail.com",

  schedules: [
    { label: "Jornada Completa", hours: "08:00 a 18:30" },
    { label: "Media Jornada Mañana", hours: "08:00 a 13:00" },
    { label: "Media Jornada Tarde", hours: "13:30 a 18:30" },
  ],

  social: {
    facebook: "https://www.facebook.com/arcoiris.florencia/",
    instagram: "https://www.instagram.com/jardin.arcoirisflorencia/",
  },

  mapQuery:
    "General Manuel Baquedano 283, Llolleo, San Antonio, Región de Valparaíso, Chile",
} as const;

export const PLACEHOLDER_TEXT = "Información pendiente de completar.";
