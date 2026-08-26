/** Recorta espacios y colapsa espacios internos repetidos. */
export function normalizeCategoryInput(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * Resuelve la categoría a guardar: si ya existe una categoría equivalente
 * (mismo texto salvo mayúsculas/minúsculas o espacios), reutiliza su grafía
 * original en vez de crear un duplicado; si no, usa el texto normalizado
 * como categoría nueva. Evita necesitar una tabla de categorías aparte.
 */
export function resolveCategory(raw: string, existing: string[]): string {
  const normalized = normalizeCategoryInput(raw);
  const match = existing.find(
    (candidate) => candidate.localeCompare(normalized, "es", { sensitivity: "base" }) === 0
  );
  return match ?? normalized;
}

/** Lista de categorías distintas presentes en las filas, en orden de aparición. */
export function distinctCategories(categories: string[]): string[] {
  const seen: string[] = [];
  for (const category of categories) {
    if (!seen.some((c) => c.localeCompare(category, "es", { sensitivity: "base" }) === 0)) {
      seen.push(category);
    }
  }
  return seen;
}
