import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createNews,
  deleteNews,
  fetchAllNews,
  updateNews,
  uploadNewsImage,
  type NewsRow,
  type NewsStatus,
} from "@/lib/newsService";
import { formatDate } from "@/lib/utils";

interface EditState {
  id: string | null; // null = creando una nueva
  title: string;
  summary: string;
  category: string;
  event_date: string;
  cover_image_url: string | null;
  body: string[];
  gallery: string[];
  status: NewsStatus;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_EDIT: EditState = {
  id: null,
  title: "",
  summary: "",
  category: "",
  event_date: today(),
  cover_image_url: null,
  body: [""],
  gallery: [],
  status: "borrador",
};

function toEditState(row: NewsRow): EditState {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    category: row.category,
    event_date: row.event_date,
    cover_image_url: row.cover_image_url,
    body: row.body.length > 0 ? [...row.body] : [""],
    gallery: [...row.gallery],
    status: row.status,
  };
}

export function AdminNews() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [previousStatus, setPreviousStatus] = useState<NewsStatus>("borrador");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllNews();
      setItems(rows);
    } catch (error) {
      console.error("No se pudo cargar las noticias:", error);
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
    setEditing({ ...EMPTY_EDIT, body: [""] });
    setPreviousStatus("borrador");
  }

  function startEdit(row: NewsRow) {
    setActionError(null);
    setEditing(toEditState(row));
    setPreviousStatus(row.status);
  }

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    setUploadingCover(true);
    setActionError(null);
    try {
      const url = await uploadNewsImage(file, editing.cover_image_url);
      setEditing({ ...editing, cover_image_url: url });
    } catch (error) {
      console.error("No se pudo subir la imagen destacada:", error);
      setActionError("No se pudo subir la imagen destacada. Inténtalo nuevamente.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleGalleryFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0 || !editing) return;

    setUploadingGallery(true);
    setActionError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadNewsImage(file, null));
      }
      setEditing((current) =>
        current ? { ...current, gallery: [...current.gallery, ...uploaded] } : current
      );
    } catch (error) {
      console.error("No se pudo subir una fotografía de la galería:", error);
      setActionError("No se pudo subir una de las fotografías. Inténtalo nuevamente.");
    } finally {
      setUploadingGallery(false);
    }
  }

  function removeGalleryImage(index: number) {
    if (!editing) return;
    setEditing({ ...editing, gallery: editing.gallery.filter((_, i) => i !== index) });
  }

  function updateBodyParagraph(index: number, value: string) {
    if (!editing) return;
    const next = [...editing.body];
    next[index] = value;
    setEditing({ ...editing, body: next });
  }

  async function handleSave(status: NewsStatus) {
    if (!editing) return;
    if (editing.title.trim().length < 3 || editing.summary.trim().length < 3) {
      setActionError("Título y resumen son obligatorios.");
      return;
    }
    setActionError(null);

    const payload = {
      title: editing.title.trim(),
      summary: editing.summary.trim(),
      category: editing.category.trim() || "General",
      event_date: editing.event_date,
      cover_image_url: editing.cover_image_url,
      body: editing.body.map((p) => p.trim()).filter((p) => p.length > 0),
      gallery: editing.gallery,
      status,
    };

    try {
      if (editing.id) {
        await updateNews(editing.id, payload, previousStatus);
      } else {
        await createNews(payload);
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar la noticia:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleStatus(row: NewsRow) {
    setActionError(null);
    try {
      const nextStatus: NewsStatus = row.status === "publicado" ? "borrador" : "publicado";
      await updateNews(
        row.id,
        {
          title: row.title,
          summary: row.summary,
          category: row.category,
          event_date: row.event_date,
          cover_image_url: row.cover_image_url,
          body: row.body,
          gallery: row.gallery,
          status: nextStatus,
        },
        row.status
      );
      load();
    } catch (error) {
      console.error("No se pudo cambiar el estado de la noticia:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function confirmDelete(id: string) {
    setActionError(null);
    try {
      await deleteNews(id);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar la noticia:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Noticias</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nueva noticia
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
              {editing.id ? "Editar noticia" : "Nueva noticia"}
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

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
              {editing.cover_image_url ? (
                <img
                  src={editing.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-ink-faint" aria-hidden="true" />
              )}
            </div>
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploadingCover ? "Subiendo…" : "Imagen destacada"}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Título</label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Categoría</label>
              <input
                type="text"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="Ej: Celebraciones, Actividades"
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Fecha</label>
              <input
                type="date"
                value={editing.event_date}
                onChange={(e) => setEditing({ ...editing, event_date: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">Resumen</label>
            <textarea
              value={editing.summary}
              onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
              rows={2}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Contenido (un párrafo por campo)
            </label>
            <div className="space-y-3">
              {editing.body.map((paragraph, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateBodyParagraph(i, e.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-coral-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({ ...editing, body: editing.body.filter((_, idx) => idx !== i) })
                    }
                    disabled={editing.body.length <= 1}
                    className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-50 text-coral-600 hover:bg-coral-100 disabled:opacity-30"
                    aria-label="Eliminar párrafo"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEditing({ ...editing, body: [...editing.body, ""] })}
              className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-cream-deep px-3.5 py-2 text-xs font-bold text-ink hover:bg-sun-100"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Agregar párrafo
            </button>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Galería de fotografías
            </label>
            <div className="flex flex-wrap gap-3">
              {editing.gallery.map((src, i) => (
                <div
                  key={src}
                  className="relative h-20 w-20 overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-coral-600 shadow-card"
                    aria-label="Quitar de la galería"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={uploadingGallery}
              onClick={() => galleryInputRef.current?.click()}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploadingGallery ? "Subiendo…" : "Agregar fotografías"}
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryFilesChange}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleSave("borrador")}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-cream-deep px-5 py-3 font-display text-sm font-bold text-ink hover:bg-sun-100"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => handleSave("publicado")}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600"
            >
              Publicar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Cargando noticias…</p>
      ) : loadError ? (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>No se pudo cargar las noticias. Inténtalo nuevamente más tarde.</p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-ink-soft">Aún no hay noticias cargadas.</p>
      ) : (
        <div className="space-y-3">
          {items.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                {row.cover_image_url ? (
                  <img src={row.cover_image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-ink-faint" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{row.title}</p>
                <p className="truncate text-sm text-ink-soft">
                  {row.category} · {formatDate(row.event_date)}
                </p>
                <span
                  className={
                    row.status === "publicado"
                      ? "mt-1 inline-block rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-bold text-leaf-700"
                      : "mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft"
                  }
                >
                  {row.status === "publicado" ? "Publicado" : "Borrador"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(row)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                  aria-label={row.status === "publicado" ? "Despublicar" : "Publicar"}
                >
                  {row.status === "publicado" ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
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
                      onClick={() => confirmDelete(row.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
