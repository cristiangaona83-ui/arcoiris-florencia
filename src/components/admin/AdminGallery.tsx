import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Pencil,
  Play,
  Plus,
  Trash2,
  Upload,
  Youtube,
  X,
} from "lucide-react";
import {
  createGalleryImage,
  deleteGalleryImage,
  fetchAllGalleryImages,
  reorderGalleryImages,
  updateGalleryImage,
  uploadGalleryImage,
  uploadGalleryVideoAssets,
  type GalleryImageRow,
  type GalleryMediaType,
} from "@/lib/galleryImages";
import { distinctCategories, resolveCategory } from "@/lib/categoryUtils";
import { parseYouTubeId, youtubeThumbnailUrl } from "@/lib/youtube";

const NEW_CATEGORY_OPTION = "__new__";
const MAX_OPTIMIZED_VIDEO_BYTES = 30 * 1024 * 1024; // 30 MB
const MAX_ORIGINAL_VIDEO_BYTES = 500 * 1024 * 1024; // límite de seguridad antes de intentar comprimir

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

interface EditState {
  id: string | null; // null = creando uno nuevo
  media_type: GalleryMediaType;
  category: string;
  newCategory: string;
  title: string;
  description: string;
  alt_text: string;
  image_url: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  original_size_bytes: number | null;
  optimized_size_bytes: number | null;
  duration_seconds: number | null;
  resolution: string | null;
  youtube_id: string | null;
  youtubeInputUrl: string;
}

const EMPTY_EDIT: EditState = {
  id: null,
  media_type: "image",
  category: "",
  newCategory: "",
  title: "",
  description: "",
  alt_text: "",
  image_url: null,
  media_url: null,
  thumbnail_url: null,
  original_size_bytes: null,
  optimized_size_bytes: null,
  duration_seconds: null,
  resolution: null,
  youtube_id: null,
  youtubeInputUrl: "",
};

function toEditState(row: GalleryImageRow): EditState {
  return {
    id: row.id,
    media_type: row.media_type,
    category: row.category,
    newCategory: "",
    title: row.title ?? "",
    description: row.description ?? "",
    alt_text: row.alt_text,
    image_url: row.image_url,
    media_url: row.media_url,
    thumbnail_url: row.thumbnail_url,
    original_size_bytes: row.original_size_bytes,
    optimized_size_bytes: row.optimized_size_bytes,
    duration_seconds: row.duration_seconds,
    resolution: row.resolution,
    youtube_id: row.youtube_id,
    youtubeInputUrl: row.youtube_id ? `https://www.youtube.com/watch?v=${row.youtube_id}` : "",
  };
}

export function AdminGallery() {
  const [items, setItems] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const existingCategories = useMemo(
    () => distinctCategories(items.map((img) => img.category)),
    [items]
  );

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllGalleryImages();
      setItems(rows);
    } catch (error) {
      console.error("No se pudo cargar la galería:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setActionError(null);
    setEditing({ ...EMPTY_EDIT, category: existingCategories[0] ?? NEW_CATEGORY_OPTION });
  }

  function startEdit(row: GalleryImageRow) {
    setActionError(null);
    setEditing(toEditState(row));
  }

  function setMediaType(media_type: GalleryMediaType) {
    if (!editing) return;
    setEditing({ ...editing, media_type });
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    setUploadingPhoto(true);
    setActionError(null);
    try {
      const url = await uploadGalleryImage(file, editing.image_url);
      setEditing({ ...editing, image_url: url });
    } catch (error) {
      console.error("No se pudo subir la fotografía:", error);
      setActionError("No se pudo subir la fotografía. Inténtalo nuevamente.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleVideoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    const looksLikeVideo =
      file.type === "video/mp4" ||
      file.type === "video/webm" ||
      /\.(mp4|webm)$/i.test(file.name);
    if (!looksLikeVideo) {
      setActionError("El archivo debe ser un video MP4 o WebM.");
      return;
    }
    if (file.size > MAX_ORIGINAL_VIDEO_BYTES) {
      setActionError("El video original es demasiado pesado para optimizarlo en el navegador.");
      return;
    }

    setActionError(null);
    setCompressing(true);
    setCompressionProgress(0);
    try {
      const { compressVideo, captureVideoThumbnail } = await import("@/lib/videoCompression");
      const result = await compressVideo(file, setCompressionProgress);

      if (result.blob.size > MAX_OPTIMIZED_VIDEO_BYTES) {
        setActionError(
          "Este video continúa siendo demasiado pesado. Te recomendamos subirlo a YouTube y agregar aquí su enlace."
        );
        return;
      }

      const thumbnailBlob = await captureVideoThumbnail(result.blob);
      const assets = await uploadGalleryVideoAssets(result.blob, thumbnailBlob, {
        mediaUrl: editing.media_url,
        thumbnailUrl: editing.thumbnail_url,
      });

      setEditing({
        ...editing,
        media_url: assets.media_url,
        thumbnail_url: assets.thumbnail_url,
        original_size_bytes: file.size,
        optimized_size_bytes: result.blob.size,
        duration_seconds: result.durationSeconds,
        resolution: `${result.width}x${result.height}`,
      });
    } catch (error) {
      console.error("No se pudo optimizar el video:", error);
      setActionError("No se pudo optimizar el video. Inténtalo nuevamente.");
    } finally {
      setCompressing(false);
    }
  }

  function handleYoutubeUrlChange(value: string) {
    if (!editing) return;
    const youtube_id = parseYouTubeId(value);
    setEditing({ ...editing, youtubeInputUrl: value, youtube_id });
  }

  async function handleSaveEdit() {
    if (!editing) return;

    if (editing.media_type === "image" && !editing.image_url) {
      setActionError("Debes subir una fotografía.");
      return;
    }
    if (editing.media_type === "video" && !editing.media_url) {
      setActionError("Debes subir un video.");
      return;
    }
    if (editing.media_type === "youtube" && !editing.youtube_id) {
      setActionError("Ingresa un enlace de YouTube válido.");
      return;
    }

    const category =
      editing.category === NEW_CATEGORY_OPTION
        ? resolveCategory(editing.newCategory, existingCategories)
        : editing.category;
    if (category.length < 2) {
      setActionError("Ingresa una categoría válida.");
      return;
    }
    setActionError(null);

    const altText = editing.alt_text.trim() || editing.title.trim();

    const payload = {
      category,
      alt_text: altText,
      media_type: editing.media_type,
      title: editing.title.trim() || null,
      description: editing.description.trim() || null,
      image_url: editing.media_type === "image" ? editing.image_url : null,
      media_url: editing.media_type === "video" ? editing.media_url : null,
      thumbnail_url: editing.media_type === "video" ? editing.thumbnail_url : null,
      original_size_bytes: editing.media_type === "video" ? editing.original_size_bytes : null,
      optimized_size_bytes: editing.media_type === "video" ? editing.optimized_size_bytes : null,
      duration_seconds: editing.media_type === "video" ? editing.duration_seconds : null,
      resolution: editing.media_type === "video" ? editing.resolution : null,
      youtube_id: editing.media_type === "youtube" ? editing.youtube_id : null,
    };

    try {
      if (editing.id) {
        await updateGalleryImage(editing.id, payload);
      } else {
        const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
        await createGalleryImage({ ...payload, sort_order: nextOrder, is_visible: true });
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar el elemento:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleVisible(row: GalleryImageRow) {
    setActionError(null);
    try {
      await updateGalleryImage(row.id, { is_visible: !row.is_visible });
      load();
    } catch (error) {
      console.error("No se pudo cambiar la visibilidad:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function move(row: GalleryImageRow, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((i) => i.id === row.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapWith];
    setActionError(null);
    try {
      await reorderGalleryImages([
        { id: a.id, sort_order: b.sort_order },
        { id: b.id, sort_order: a.sort_order },
      ]);
      load();
    } catch (error) {
      console.error("No se pudo reordenar:", error);
      setActionError("No se pudo reordenar. Inténtalo nuevamente.");
    }
  }

  async function confirmDelete(row: GalleryImageRow) {
    setActionError(null);
    try {
      await deleteGalleryImage(row);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar el elemento:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);

  const savingsPercent =
    editing?.original_size_bytes && editing.optimized_size_bytes
      ? Math.round((1 - editing.optimized_size_bytes / editing.original_size_bytes) * 100)
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Galería</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar imagen o video
        </button>
      </div>

      {actionError && (
        <p className="rounded-2xl bg-coral-50 p-3 text-sm font-semibold text-coral-700">
          {actionError}
        </p>
      )}

      {editing && (
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">
              {editing.id ? "Editar elemento" : "Nuevo elemento"}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
              aria-label="Cancelar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                { type: "image" as const, label: "Foto", icon: ImageIcon },
                { type: "video" as const, label: "Video", icon: Film },
                { type: "youtube" as const, label: "YouTube", icon: Youtube },
              ]
            ).map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${
                  editing.media_type === type
                    ? "bg-coral-500 text-white"
                    : "bg-cream-deep text-ink hover:bg-sun-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {editing.media_type === "image" && (
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                {editing.image_url ? (
                  <img src={editing.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-ink-faint" aria-hidden="true" />
                )}
              </div>
              <button
                type="button"
                disabled={uploadingPhoto}
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {uploadingPhoto ? "Subiendo…" : "Subir fotografía"}
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          )}

          {editing.media_type === "video" && (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                  {editing.thumbnail_url ? (
                    <img
                      src={editing.thumbnail_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Film className="h-8 w-8 text-ink-faint" aria-hidden="true" />
                  )}
                </div>
                <button
                  type="button"
                  disabled={compressing}
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  {compressing ? "Optimizando…" : editing.media_url ? "Reemplazar video" : "Subir video"}
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={handleVideoFileChange}
                />
              </div>

              {compressing && (
                <div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-cream-deep">
                    <div
                      className="h-full rounded-full bg-coral-500 transition-all"
                      style={{ width: `${Math.round(compressionProgress * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">
                    Comprimiendo video… {Math.round(compressionProgress * 100)}%
                  </p>
                </div>
              )}

              {editing.original_size_bytes != null && editing.optimized_size_bytes != null && (
                <div className="rounded-2xl bg-leaf-50 p-3 text-sm text-leaf-700">
                  <p>Original: {formatMb(editing.original_size_bytes)} MB</p>
                  <p>Optimizado: {formatMb(editing.optimized_size_bytes)} MB</p>
                  {savingsPercent !== null && <p>Ahorro: {savingsPercent}%</p>}
                  {editing.resolution && <p>Resolución final: {editing.resolution}</p>}
                </div>
              )}
            </div>
          )}

          {editing.media_type === "youtube" && (
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Enlace de YouTube
              </label>
              <input
                type="text"
                value={editing.youtubeInputUrl}
                onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
              {editing.youtubeInputUrl && !editing.youtube_id && (
                <p className="mt-1.5 text-sm font-semibold text-coral-600">
                  No se reconoce un enlace de YouTube válido.
                </p>
              )}
              {editing.youtube_id && (
                <img
                  src={youtubeThumbnailUrl(editing.youtube_id)}
                  alt=""
                  className="mt-3 h-28 w-48 rounded-2xl object-cover ring-1 ring-ink/10"
                />
              )}
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Categoría</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value={NEW_CATEGORY_OPTION}>+ Nueva categoría</option>
              </select>
              {editing.category === NEW_CATEGORY_OPTION && (
                <input
                  type="text"
                  value={editing.newCategory}
                  onChange={(e) => setEditing({ ...editing, newCategory: e.target.value })}
                  placeholder="Nombre de la nueva categoría"
                  className="mt-2 w-full min-h-[44px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-coral-400"
                />
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Título</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">Descripción</label>
            <textarea
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={2}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
            />
          </div>

          {editing.media_type === "image" && (
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-bold text-ink">Texto alternativo</label>
              <input
                type="text"
                value={editing.alt_text}
                onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveEdit}
            disabled={compressing}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600 disabled:opacity-60"
          >
            Guardar
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Cargando galería…</p>
      ) : loadError ? (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>No se pudo cargar la galería. Inténtalo nuevamente más tarde.</p>
        </div>
      ) : sortedItems.length === 0 ? (
        <p className="text-ink-soft">Aún no hay elementos cargados.</p>
      ) : (
        <div className="space-y-3">
          {sortedItems.map((row, index) => {
            const thumb =
              row.media_type === "image"
                ? row.image_url
                : row.media_type === "video"
                  ? row.thumbnail_url
                  : row.youtube_id
                    ? youtubeThumbnailUrl(row.youtube_id)
                    : null;

            return (
              <div
                key={row.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-ink-faint" aria-hidden="true" />
                  )}
                  {row.media_type !== "image" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                      <Play className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">
                    {row.title || row.alt_text || row.category}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {row.category}
                    {row.media_type === "video" && row.optimized_size_bytes
                      ? ` · ${formatMb(row.optimized_size_bytes)} MB`
                      : ""}
                    {row.media_type === "youtube" ? " · YouTube" : ""}
                  </p>
                  {!row.is_visible && (
                    <span className="mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft">
                      Oculto
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(row, "up")}
                    disabled={index === 0}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                    aria-label="Subir"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(row, "down")}
                    disabled={index === sortedItems.length - 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                    aria-label="Bajar"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVisible(row)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                    aria-label={row.is_visible ? "Ocultar" : "Mostrar"}
                  >
                    {row.is_visible ? (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {confirmingDeleteId === row.id ? (
                    <div className="flex items-center gap-2 rounded-full bg-coral-50 px-3 py-1.5">
                      <span className="text-xs font-bold text-coral-700">¿Eliminar?</span>
                      <button
                        type="button"
                        onClick={() => confirmDelete(row)}
                        className="rounded-full bg-coral-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-coral-600"
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(null)}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink-soft hover:bg-cream-deep"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(row.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coral-50 text-coral-600 hover:bg-coral-100"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
