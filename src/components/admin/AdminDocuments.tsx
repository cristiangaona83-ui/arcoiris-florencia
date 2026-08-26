import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createDocument,
  deleteDocument,
  fetchAllDocuments,
  reorderDocuments,
  updateDocument,
  uploadInstitutionalDocumentFile,
  type InstitutionalDocumentRow,
} from "@/lib/institutionalDocuments";
import { distinctCategories, resolveCategory } from "@/lib/categoryUtils";

const NEW_CATEGORY_OPTION = "__new__";
const SUGGESTED_CATEGORIES = [
  "Proyecto Educativo",
  "Reglamento Interno",
  "Protocolos",
  "Informativos",
  "Otros",
];

interface EditState {
  id: string | null; // null = creando uno nuevo
  name: string;
  description: string;
  category: string;
  newCategory: string;
  file_url: string | null;
}

const EMPTY_EDIT: EditState = {
  id: null,
  name: "",
  description: "",
  category: SUGGESTED_CATEGORIES[0],
  newCategory: "",
  file_url: null,
};

export function AdminDocuments() {
  const [documents, setDocuments] = useState<InstitutionalDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingCategories = useMemo(
    () => distinctCategories([...SUGGESTED_CATEGORIES, ...documents.map((d) => d.category)]),
    [documents]
  );

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllDocuments();
      setDocuments(rows);
    } catch (error) {
      console.error("No se pudo cargar los documentos:", error);
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
    setEditing({ ...EMPTY_EDIT });
  }

  function startEdit(doc: InstitutionalDocumentRow) {
    setActionError(null);
    setEditing({
      id: doc.id,
      name: doc.name,
      description: doc.description ?? "",
      category: doc.category,
      newCategory: "",
      file_url: doc.file_url,
    });
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    setUploading(true);
    setActionError(null);
    try {
      const url = await uploadInstitutionalDocumentFile(file, editing.file_url);
      setEditing({ ...editing, file_url: url });
    } catch (error) {
      console.error("No se pudo subir el documento:", error);
      setActionError(
        error instanceof Error ? error.message : "No se pudo subir el documento. Inténtalo nuevamente."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (editing.name.trim().length < 3) {
      setActionError("El nombre es obligatorio.");
      return;
    }
    if (!editing.file_url) {
      setActionError("Debes subir el archivo PDF.");
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
        await updateDocument(editing.id, {
          name: editing.name.trim(),
          description: editing.description.trim() || null,
          category,
          file_url: editing.file_url,
        });
      } else {
        const nextOrder =
          documents.length > 0 ? Math.max(...documents.map((d) => d.sort_order)) + 1 : 1;
        await createDocument({
          name: editing.name.trim(),
          description: editing.description.trim() || null,
          category,
          file_url: editing.file_url,
          sort_order: nextOrder,
          is_visible: true,
        });
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar el documento:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleVisible(doc: InstitutionalDocumentRow) {
    setActionError(null);
    try {
      await updateDocument(doc.id, { is_visible: !doc.is_visible });
      load();
    } catch (error) {
      console.error("No se pudo cambiar la visibilidad:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function move(doc: InstitutionalDocumentRow, direction: "up" | "down") {
    const sorted = [...documents].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((d) => d.id === doc.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapWith];
    setActionError(null);
    try {
      await reorderDocuments([
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
      await deleteDocument(id);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar el documento:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  const sortedDocuments = [...documents].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Documentos</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar documento
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
              {editing.id ? "Editar documento" : "Nuevo documento"}
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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
              <FileText className="h-7 w-7" aria-hidden="true" />
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploading ? "Subiendo…" : editing.file_url ? "Reemplazar PDF" : "Subir PDF"}
            </button>
            {editing.file_url && (
              <a
                href={editing.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-sky-600 hover:underline"
              >
                Ver actual
              </a>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Nombre</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
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

          <button
            type="button"
            onClick={handleSaveEdit}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600"
          >
            Guardar documento
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Cargando documentos…</p>
      ) : loadError ? (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>No se pudo cargar los documentos. Inténtalo nuevamente más tarde.</p>
        </div>
      ) : sortedDocuments.length === 0 ? (
        <p className="text-ink-soft">Aún no hay documentos cargados.</p>
      ) : (
        <div className="space-y-3">
          {sortedDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{doc.name}</p>
                <p className="truncate text-sm text-ink-soft">{doc.category}</p>
                {!doc.is_visible && (
                  <span className="mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft">
                    Oculto
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(doc, "up")}
                  disabled={index === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(doc, "down")}
                  disabled={index === sortedDocuments.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(doc)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                  aria-label={doc.is_visible ? "Ocultar" : "Mostrar"}
                >
                  {doc.is_visible ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(doc)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>

                {confirmingDeleteId === doc.id ? (
                  <div className="flex items-center gap-2 rounded-full bg-coral-50 px-3 py-1.5">
                    <span className="text-xs font-bold text-coral-700">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => confirmDelete(doc.id)}
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
                    onClick={() => setConfirmingDeleteId(doc.id)}
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
