import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/data/gallery";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";

type Filter = "Todas" | GalleryCategory;

/** Normaliza espacios y acentos para que la comparación de categorías sea robusta. */
function normalizeCategory(value: string): string {
  return value.trim().normalize("NFC");
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("Todas");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "Todas"
        ? galleryImages
        : galleryImages.filter(
            (img) => normalizeCategory(img.category) === normalizeCategory(filter)
          ),
    [filter]
  );

  const closeModal = () => setOpenIndex(null);
  const showPrev = () =>
    setOpenIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
  const showNext = () =>
    setOpenIndex((i) => (i === null ? i : (i + 1) % filtered.length));

  useLockBodyScroll(openIndex !== null);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, filtered.length]);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
        {(["Todas", ...galleryCategories] as Filter[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "min-h-[44px] shrink-0 rounded-full px-4 py-2 text-sm font-bold font-display transition-colors",
              filter === cat
                ? "bg-coral-500 text-white shadow-soft"
                : "bg-white text-ink-soft hover:bg-coral-50 hover:text-coral-600"
            )}
            aria-pressed={filter === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm font-semibold text-ink-faint">
          Aún no hay fotografías disponibles en esta categoría.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="reveal group relative aspect-square overflow-hidden rounded-2xl bg-sky-50 ring-1 ring-ink/5"
              style={{ transitionDelay: `${(index % 8) * 60}ms` }}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/70 px-2 py-1.5 text-[11px] font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                {image.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && filtered[openIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la imagen"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
          onClick={closeModal}
        >
          <button
            type="button"
            onClick={closeModal}
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

          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[openIndex].src}
              alt={filtered[openIndex].alt}
              className="max-h-[60vh] w-full rounded-2xl object-contain"
            />
            <p className="text-center text-sm font-semibold text-ink-soft">
              {filtered[openIndex].alt}
            </p>
          </div>

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
