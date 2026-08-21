export interface InstitutionalDocument {
  id: string;
  name: string;
  description: string;
  /** Ruta al PDF dentro de /public/documents/. Vacío = aún no disponible. */
  file: string;
}

/**
 * Para publicar un nuevo documento: agregar el PDF a /public/documents/
 * y crear un nuevo elemento aquí con su ruta en "file".
 */
export const documents: InstitutionalDocument[] = [
  {
    id: "pei-2026",
    name: "Proyecto Educativo Institucional (PEI) 2026",
    description:
      "Documento que define la identidad, principios y orientaciones pedagógicas del jardín para el año 2026.",
    file: "/documents/pei-2026.pdf",
  },
  {
    id: "reglamento-interno-2026",
    name: "Reglamento Interno 2026",
    description:
      "Normas y procedimientos internos que regulan la convivencia y funcionamiento del jardín durante el año 2026.",
    file: "/documents/reglamento-interno-2026.pdf",
  },
];
