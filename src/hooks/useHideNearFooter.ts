import { useEffect, useState } from "react";

/**
 * Oculta el botón flotante mientras el formulario de contacto o el footer
 * están visibles, para que no tape el botón de enviar ni el contenido final.
 */
export function useHideNearFooter(targetIds: string[]): boolean {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const elements = targetIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting);
        }
        setShouldHide(Array.from(visibility.values()).some(Boolean));
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetIds]);

  return shouldHide;
}
