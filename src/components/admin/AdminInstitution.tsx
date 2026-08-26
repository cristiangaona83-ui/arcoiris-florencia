import { useEffect, useState } from "react";
import { AlertTriangle, Check, Plus, Trash2 } from "lucide-react";
import {
  fetchInstitutionalContent,
  updateInstitutionalContent,
  type InstitutionalContentRow,
} from "@/lib/institutionalContent";

interface FormState {
  history_paragraphs: string[];
  mission_text: string;
  vision_text: string;
  principles_summary: string;
  principles_items: string[];
  values_summary: string;
  values_items: string[];
}

function toFormState(row: InstitutionalContentRow | null): FormState {
  return {
    history_paragraphs: row?.history_paragraphs?.length ? [...row.history_paragraphs] : [""],
    mission_text: row?.mission_text ?? "",
    vision_text: row?.vision_text ?? "",
    principles_summary: row?.principles_summary ?? "",
    principles_items: row?.principles_items?.length ? [...row.principles_items] : [""],
    values_summary: row?.values_summary ?? "",
    values_items: row?.values_items?.length ? [...row.values_items] : [""],
  };
}

function ItemListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full min-h-[44px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-2.5 text-ink outline-none focus:border-coral-400"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              disabled={items.length <= 1}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-50 text-coral-600 hover:bg-coral-100 disabled:opacity-30"
              aria-label="Eliminar"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-cream-deep px-3.5 py-2 text-xs font-bold text-ink hover:bg-sun-100"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Agregar
      </button>
    </div>
  );
}

export function AdminInstitution() {
  const [form, setForm] = useState<FormState>(() => toFormState(null));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchInstitutionalContent()
      .then((row) => setForm(toFormState(row)))
      .catch((error) => {
        console.error("No se pudo cargar el contenido institucional:", error);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateParagraph(i: number, value: string) {
    const next = [...form.history_paragraphs];
    next[i] = value;
    setForm({ ...form, history_paragraphs: next });
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateInstitutionalContent({
        history_paragraphs: form.history_paragraphs
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
        mission_text: form.mission_text.trim() || null,
        vision_text: form.vision_text.trim() || null,
        principles_summary: form.principles_summary.trim() || null,
        principles_items: form.principles_items.map((i) => i.trim()).filter((i) => i.length > 0),
        values_summary: form.values_summary.trim() || null,
        values_items: form.values_items.map((i) => i.trim()).filter((i) => i.length > 0),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("No se pudo guardar el contenido institucional:", error);
      setSaveError("No se pudo guardar. Inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink-soft">Cargando…</p>;

  if (loadError) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>No se pudo cargar el contenido institucional. Inténtalo nuevamente más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink">Institución</h2>

      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Historia</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Un párrafo por campo. Usa doble asterisco para marcar texto en negrita, por ejemplo:{" "}
          <code>**1 de febrero de 2020**</code>.
        </p>
        <div className="mt-4 space-y-3">
          {form.history_paragraphs.map((paragraph, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={3}
                className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    history_paragraphs: form.history_paragraphs.filter((_, idx) => idx !== i),
                  })
                }
                disabled={form.history_paragraphs.length <= 1}
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
          onClick={() =>
            setForm({ ...form, history_paragraphs: [...form.history_paragraphs, ""] })
          }
          className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-cream-deep px-3.5 py-2 text-xs font-bold text-ink hover:bg-sun-100"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Agregar párrafo
        </button>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Misión y Visión</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">Misión</label>
            <textarea
              value={form.mission_text}
              onChange={(e) => setForm({ ...form, mission_text: e.target.value })}
              rows={4}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">Visión</label>
            <textarea
              value={form.vision_text}
              onChange={(e) => setForm({ ...form, vision_text: e.target.value })}
              rows={4}
              className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Principios y Valores</h3>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <ItemListEditor
              label="Principios"
              items={form.principles_items}
              onChange={(items) => setForm({ ...form, principles_items: items })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Resumen de Principios
              </label>
              <textarea
                value={form.principles_summary}
                onChange={(e) => setForm({ ...form, principles_summary: e.target.value })}
                rows={3}
                className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>
          <div className="space-y-4">
            <ItemListEditor
              label="Valores"
              items={form.values_items}
              onChange={(items) => setForm({ ...form, values_items: items })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">
                Resumen de Valores
              </label>
              <textarea
                value={form.values_summary}
                onChange={(e) => setForm({ ...form, values_summary: e.target.value })}
                rows={3}
                className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>
        </div>
      </div>

      {saveError && (
        <p className="rounded-2xl bg-coral-50 p-3 text-sm font-semibold text-coral-700">
          {saveError}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600 disabled:opacity-60"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Guardado
          </>
        ) : saving ? (
          "Guardando…"
        ) : (
          "Guardar cambios"
        )}
      </button>
    </div>
  );
}
