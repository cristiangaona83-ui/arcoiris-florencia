import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createFaqItem,
  deleteFaqItem,
  fetchAllFaqItems,
  reorderFaqItems,
  updateFaqItem,
  type FaqItemRow,
} from "@/lib/faqItems";

interface EditState {
  id: string | null; // null = creando una nueva
  question: string;
  answer: string;
}

const EMPTY_EDIT: EditState = { id: null, question: "", answer: "" };

export function AdminFaq() {
  const [items, setItems] = useState<FaqItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllFaqItems();
      setItems(rows);
    } catch (error) {
      console.error("No se pudo cargar las preguntas frecuentes:", error);
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

  function startEdit(item: FaqItemRow) {
    setActionError(null);
    setEditing({ id: item.id, question: item.question, answer: item.answer });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (editing.question.trim().length < 3 || editing.answer.trim().length < 3) {
      setActionError("Pregunta y respuesta son obligatorias.");
      return;
    }
    setActionError(null);
    try {
      if (editing.id) {
        await updateFaqItem(editing.id, {
          question: editing.question.trim(),
          answer: editing.answer.trim(),
        });
      } else {
        const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
        await createFaqItem({
          question: editing.question.trim(),
          answer: editing.answer.trim(),
          sort_order: nextOrder,
          is_visible: true,
        });
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar la pregunta:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleVisible(item: FaqItemRow) {
    setActionError(null);
    try {
      await updateFaqItem(item.id, { is_visible: !item.is_visible });
      load();
    } catch (error) {
      console.error("No se pudo cambiar la visibilidad:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function move(item: FaqItemRow, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((i) => i.id === item.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapWith];
    setActionError(null);
    try {
      await reorderFaqItems([
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
      await deleteFaqItem(id);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar la pregunta:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Preguntas frecuentes</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar pregunta
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
              {editing.id ? "Editar pregunta" : "Nueva pregunta"}
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

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">Pregunta</label>
            <input
              type="text"
              value={editing.question}
              onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-bold text-ink">Respuesta</label>
            <textarea
              value={editing.answer}
              onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
              rows={4}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveEdit}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600"
          >
            Guardar pregunta
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Cargando preguntas frecuentes…</p>
      ) : loadError ? (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>No se pudo cargar las preguntas frecuentes. Inténtalo nuevamente más tarde.</p>
        </div>
      ) : sortedItems.length === 0 ? (
        <p className="text-ink-soft">Aún no hay preguntas cargadas.</p>
      ) : (
        <div className="space-y-3">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{item.question}</p>
                <p className="truncate text-sm text-ink-soft">{item.answer}</p>
                {!item.is_visible && (
                  <span className="mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft">
                    Oculta
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(item, "up")}
                  disabled={index === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(item, "down")}
                  disabled={index === sortedItems.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(item)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                  aria-label={item.is_visible ? "Ocultar" : "Mostrar"}
                >
                  {item.is_visible ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>

                {confirmingDeleteId === item.id ? (
                  <div className="flex items-center gap-2 rounded-full bg-coral-50 px-3 py-1.5">
                    <span className="text-xs font-bold text-coral-700">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => confirmDelete(item.id)}
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
                    onClick={() => setConfirmingDeleteId(item.id)}
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
