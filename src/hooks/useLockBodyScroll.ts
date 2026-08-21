import { useEffect } from "react";

// Contador global de bloqueos activos. Permite que varios componentes
// (menú móvil, lightbox, modal de noticia) bloqueen el scroll al mismo
// tiempo sin pisarse: el body solo se desbloquea cuando el último de
// ellos se cierra, sin importar el orden en que se abrieron o cerraron.
let lockCount = 0;

/** Bloquea el scroll del body mientras `locked` es verdadero (menú móvil, modal). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = "";
      }
    };
  }, [locked]);
}
