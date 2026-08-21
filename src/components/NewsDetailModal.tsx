import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { NewsItem } from "@/data/news";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatDate } from "@/lib/utils";

export function NewsDetailModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = item.gallery ?? [];

  useLockBodyScroll(true);

  const showPrev = () =>
    setLightboxIndex((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % gallery.length));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (lightboxIndex !== null) {
        if (event.key === "Escape") setLightboxIndex(null);
        if (event.key === "ArrowLeft") showPrev();
        if (event.key === "ArrowRight") showNext();
      } else if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, gallery.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full shrink-0 bg-sky-50">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-card hover:bg-white"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-coral-500">
            <span className="rounded-full bg-coral-50 px-3 py-1">{item.category}</span>
            <span className="inline-flex items-center gap-1 text-ink-faint">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(item.date)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold leading-snug text-ink">
            {item.title}
          </h3>

          <div className="mt-4 space-y-4 text-left leading-relaxed text-ink-soft">
            {(item.body ?? [item.summary]).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {gallery.length > 0 && (
            <div className="mt-8">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink-faint">
                Galería de fotografías
              </h4>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-sky-50 ring-1 ring-ink/5"
                  >
                    <img
                      src={src}
                      alt={`${item.title} — fotografía ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex(null);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <img
            src={gallery[lightboxIndex]}
            alt={`${item.title} — fotografía ${lightboxIndex + 1}`}
            className="max-h-[80vh] w-full max-w-2xl rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
