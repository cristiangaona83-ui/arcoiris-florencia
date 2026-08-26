import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
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
  createGalleryImage,
  deleteGalleryImage,
  fetchAllGalleryImages,
  reorderGalleryImages,
  updateGalleryImage,
  uploadGalleryImage,
  type GalleryImageRow,
} from "@/lib/galleryImages";
import { distinctCategories, resolveCategory } from "@/lib/categoryUtils";

const NEW_CATEGORY_OPTION = "__new__";

interface EditState {
  id: string | null; // null = creando una nueva
  category: string;
  newCategory: string;
  image_url: string | null;
  alt_text: string;
}

const EMPTY_EDIT: EditState = {
  id: null,
  category: "",
  newCategory: "",
  image_url: null,
  alt_text: "",
};

export function AdminGallery() {
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingCategories = useMemo(
    () => distinctCategories(images.map((img) => img.category)),
    [images]
  );

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllGalleryImages();
      setImages(rows);
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

  function startEdit(image: GalleryImageRow) {
    setActionError(null);
    setEditing({
      id: image.id,
      category: image.category,
      newCategory: "",
      image_url: image.image_url,
      alt_text: image.alt_text,
    });
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    setUploading(true);
    setActionError(null);
    try {
      const url = await uploadGalleryImage(file, editing.image_url);
      setEditing({ ...editing, image_url: url });
    } catch (error) {
      console.error("No se pudo subir la fotografía:", error);
      setActionError("No se pudo subir la fotografía. Inténtalo nuevamente.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (!editing.image_url) {
      setActionError("Debes subir una fotografía.");
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
    try {
      if (editing.id) {
        await updateGalleryImage(editing.id, {
          category,
          image_url: editing.image_url,
          alt_text: editing.alt_text.trim(),
        });
      } else {
        const nextOrder =
          images.length > 0 ? Math.max(...images.map((i) => i.sort_order)) + 1 : 1;
        await createGalleryImage({
          category,
          image_url: editing.image_url,
          alt_text: editing.alt_text.trim(),
          sort_order: nextOrder,
          is_visible: true,
        });
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar la fotografía:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleVisible(image: GalleryImageRow) {
    setActionError(null);
    try {
      await updateGalleryImage(image.id, { is_visible: !image.is_visible });
      load();
    } catch (error) {
      console.error("No se pudo cambiar la visibilidad:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function move(image: GalleryImageRow, direction: "up" | "down") {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((i) => i.id === image.id);
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

  async function confirmDelete(id: string) {
    setActionError(null);
    try {
      await deleteGalleryImage(id);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar la fotografía:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

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
          Agregar fotografía
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
              {editing.id ? "Editar fotografía" : "Nueva fotografía"}
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
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
              {editing.image_url ? (
                <img src={editing.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-ink-faint" aria-hidden="true" />
              )}
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploading ? "Subiendo…" : "Subir fotografía"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

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
              <label className="mb-1.5 block text-sm font-bold text-ink">Texto alternativo</label>
              <input
                type="text"
                value={editing.alt_text}
                onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveEdit}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600"
          >
            Guardar fotografía
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
      ) : sortedImages.length === 0 ? (
        <p className="text-ink-soft">Aún no hay fotografías cargadas.</p>
      ) : (
        <div className="space-y-3">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                <img src={image.image_url} alt="" className="h-full w-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{image.category}</p>
                <p className="truncate text-sm text-ink-soft">{image.alt_text}</p>
                {!image.is_visible && (
                  <span className="mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft">
                    Oculta
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(image, "up")}
                  disabled={index === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(image, "down")}
                  disabled={index === sortedImages.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(image)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                  aria-label={image.is_visible ? "Ocultar" : "Mostrar"}
                >
                  {image.is_visible ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(image)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>

                {confirmingDeleteId === image.id ? (
                  <div className="flex items-center gap-2 rounded-full bg-coral-50 px-3 py-1.5">
                    <span className="text-xs font-bold text-coral-700">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => confirmDelete(image.id)}
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
                    onClick={() => setConfirmingDeleteId(image.id)}
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
