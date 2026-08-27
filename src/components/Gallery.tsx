import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { galleryImages as staticGalleryImages } from "@/data/gallery";
import { fetchVisibleGalleryImages, type GalleryMediaType } from "@/lib/galleryImages";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/youtube";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";

interface DisplayMedia {
  id: string;
  category: string;
  alt: string;
  mediaType: GalleryMediaType;
  imageSrc: string | null;
  videoSrc: string | null;
  thumbnailSrc: string | null;
  youtubeId: string | null;
}

function fromStatic(): DisplayMedia[] {
  return staticGalleryImages.map((image) => ({
    id: image.id,
    category: image.category,
    alt: image.alt,
    mediaType: "image",
    imageSrc: image.src,
    videoSrc: null,
    thumbnailSrc: null,
    youtubeId: null,
  }));
}

type Filter = "Todas" | string;

/** Normaliza espacios y acentos para que la comparación de categorías sea robusta. */
function normalizeCategory(value: string): string {
  return value.trim().normalize("NFC");
}

/** Miniatura a mostrar en la grilla: la propia imagen, o la miniatura del video. */
function tileThumbnail(item: DisplayMedia): string | null {
  if (item.mediaType === "image") return item.imageSrc;
  if (item.mediaType === "youtube" && item.youtubeId) return youtubeThumbnailUrl(item.youtubeId);
  return item.thumbnailSrc;
}

export function Gallery() {
  // Se inicializa ya con el respaldo estático: si Supabase falla o tarda,
  // la galería nunca queda vacía, muestra las fotografías actuales sin
  // interrupción.
  const [items, setItems] = useState<DisplayMedia[]>(fromStatic);

  useEffect(() => {
    let active = true;
    fetchVisibleGalleryImages()
      .then((rows) => {
        if (!active) return;
        if (rows.length === 0) return; // sin filas aún: se mantiene el respaldo estático
        setItems(
          rows.map((row) => ({
            id: row.id,
            category: row.category,
            alt: row.alt_text || row.title || row.category,
            mediaType: row.media_type,
            imageSrc: row.image_url,
            videoSrc: row.media_url,
            thumbnailSrc: row.thumbnail_url,
            youtubeId: row.youtube_id,
          }))
        );
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar la galería desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  // Los filtros se generan a partir de las categorías que realmente tienen
  // contenido: una categoría nueva aparece sola, sin tocar este componente.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      if (!seen.includes(item.category)) seen.push(item.category);
    }
    return seen;
  }, [items]);

  const [filter, setFilter] = useState<Filter>("Todas");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "Todas"
        ? items
        : items.filter((item) => normalizeCategory(item.category) === normalizeCategory(filter)),
    [filter, items]
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

  const active = openIndex !== null ? filtered[openIndex] : null;

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
        {(["Todas", ...categories] as Filter[]).map((cat) => (
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

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {filtered.map((item, index) => {
          const thumbnail = tileThumbnail(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-sky-50 ring-1 ring-ink/5"
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {item.mediaType !== "image" && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors group-hover:bg-ink/35">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-5 w-5 text-ink" aria-hidden="true" />
                  </span>
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/70 px-2 py-1.5 text-[11px] font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                {item.category}
              </span>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
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
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {active.mediaType === "image" && active.imageSrc && (
              <img
                src={active.imageSrc}
                alt={active.alt}
                className="max-h-[70vh] w-full rounded-2xl object-contain"
              />
            )}

            {active.mediaType === "video" && active.videoSrc && (
              <video
                src={active.videoSrc}
                poster={active.thumbnailSrc ?? undefined}
                controls
                preload="metadata"
                className="max-h-[70vh] w-full rounded-2xl bg-ink"
              >
                Tu navegador no admite la reproducción de este video.
              </video>
            )}

            {active.mediaType === "youtube" && active.youtubeId && (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ink">
                <iframe
                  src={youtubeEmbedUrl(active.youtubeId)}
                  title={active.alt}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <p className="text-center text-sm font-semibold text-ink-soft">{active.alt}</p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
