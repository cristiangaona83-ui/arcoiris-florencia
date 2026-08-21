export interface InstitutionalDocument {
  id: string;
  name: string;
  description: string;
  /** Ruta al PDF dentro de /public/documents/. Vacío = aún no disponible. */
  file: string;
}

/**
 * Aún no se han proporcionado documentos institucionales oficiales.
 * Para publicar uno: agregar el PDF a /public/documents/ y crear un
 * nuevo elemento aquí con su ruta en "file".
 */
export const documents: InstitutionalDocument[] = [];
