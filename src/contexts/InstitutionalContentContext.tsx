import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fetchInstitutionalContent,
  type InstitutionalContentRow,
} from "@/lib/institutionalContent";
import { missionVision, valueGroups } from "@/data/projectPillars";

const STATIC_HISTORY_PARAGRAPHS = [
  "El Jardín Infantil Arcoíris Florencia nace el **1 de febrero de 2020** en Llolleo, comuna de San Antonio, como el sueño de dos profesionales de la educación: **Rosa Verdugo Matamala**, Educadora de Párvulos y Magíster en Dirección y Liderazgo para la Gestión Educacional, actual directora del establecimiento; y su esposo, **Cristian Gaona**, Profesor, Magíster en Dirección y Liderazgo para la Gestión Educacional y Magíster en Gestión Pedagógica y Curricular.",
  "A partir de su experiencia en jardines infantiles, escuelas y colegios, ambos decidieron dar vida a un proyecto educativo orientado a entregar una educación de calidad desde los primeros años, en un ambiente seguro, acogedor y comprometido con el **desarrollo integral** de niños y niñas.",
  'El nombre "**Arcoíris Florencia**" nace en honor a su primera hija, **Florencia**, cuya experiencia desde muy pequeña en sala cuna y jardín infantil permitió a sus padres valorar profundamente la importancia de la educación parvularia y de las experiencias tempranas en el desarrollo de la autonomía, los vínculos, las habilidades y los aprendizajes.',
  "Este proyecto representa así una **convicción personal y profesional**: que cada niño y niña merece vivir sus primeros años educativos en un espacio donde pueda sentirse protegido, valorado, acompañado y estimulado para descubrir el mundo.",
  "El **10 de mayo de 2022**, el Jardín Infantil Arcoíris Florencia obtuvo su **Reconocimiento Oficial del Estado**, constituyéndose en un importante hito dentro de su proceso de consolidación institucional.",
];

export interface EffectiveInstitutionalContent {
  historyParagraphs: string[];
  missionText: string;
  visionText: string;
  principlesSummary: string;
  principlesItems: string[];
  valuesSummary: string;
  valuesItems: string[];
  isFromDatabase: boolean;
}

/**
 * Combina institutional_content (si existe y cargó bien) con el contenido
 * estático actual como respaldo, campo por campo, igual que
 * SiteSettingsContext: si Supabase falla o un campo puntual quedó vacío, la
 * web pública nunca muestra menos información que la versión actual.
 */
function buildEffectiveContent(row: InstitutionalContentRow | null): EffectiveInstitutionalContent {
  return {
    historyParagraphs: row?.history_paragraphs?.length
      ? row.history_paragraphs
      : STATIC_HISTORY_PARAGRAPHS,
    missionText: row?.mission_text || missionVision[0].text,
    visionText: row?.vision_text || missionVision[1].text,
    principlesSummary: row?.principles_summary || valueGroups[0].summary,
    principlesItems: row?.principles_items?.length ? row.principles_items : valueGroups[0].items,
    valuesSummary: row?.values_summary || valueGroups[1].summary,
    valuesItems: row?.values_items?.length ? row.values_items : valueGroups[1].items,
    isFromDatabase: row !== null,
  };
}

const InstitutionalContentContext = createContext<EffectiveInstitutionalContent | null>(null);

export function InstitutionalContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<EffectiveInstitutionalContent>(() =>
    buildEffectiveContent(null)
  );

  useEffect(() => {
    let active = true;
    fetchInstitutionalContent()
      .then((row) => {
        if (active) setContent(buildEffectiveContent(row));
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar el contenido institucional desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <InstitutionalContentContext.Provider value={content}>
      {children}
    </InstitutionalContentContext.Provider>
  );
}

export function useInstitutionalContent(): EffectiveInstitutionalContent {
  const ctx = useContext(InstitutionalContentContext);
  if (!ctx) {
    throw new Error(
      "useInstitutionalContent debe usarse dentro de <InstitutionalContentProvider>"
    );
  }
  return ctx;
}
