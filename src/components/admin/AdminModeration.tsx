import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { StarRating } from "@/components/StarRating";
import { formatDate, cn } from "@/lib/utils";
import {
  relationshipLabels,
  statusLabels,
  type Testimonial,
  type TestimonialStatus,
} from "@/lib/testimonials";

const FILTERS: (TestimonialStatus | "todos")[] = ["pendiente", "aprobado", "rechazado", "oculto", "todos"];

export function AdminModeration() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<TestimonialStatus | "todos">("pendiente");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("family_testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Testimonial[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === "todos" ? items : items.filter((t) => t.status === filter);

  async function updateStatus(id: string, status: TestimonialStatus) {
    setActionError(null);
    const { data: userData } = await supabase.auth.getUser();
    const patch: Record<string, unknown> = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: userData.user?.id ?? null,
    };
    if (status === "aprobado") patch.published_at = new Date().toISOString();

    const { error } = await supabase.from("family_testimonials").update(patch).eq("id", id);
    if (error) {
      setActionError("No se pudo actualizar el estado. Inténtalo nuevamente.");
      return;
    }
    load();
  }

  async function saveEdit(id: string) {
    if (editComment.trim().length < 10) {
      setActionError("El comentario editado debe tener al menos 10 caracteres.");
      return;
    }
    setActionError(null);
    const { error } = await supabase
      .from("family_testimonials")
      .update({ comment: editComment.trim() })
      .eq("id", id);
    if (error) {
      setActionError("No se pudo guardar la edición. Inténtalo nuevamente.");
      return;
    }
    setEditingId(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Opiniones de familias</h2>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="text-sm font-semibold text-ink-soft hover:text-coral-600"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "min-h-[40px] rounded-full px-4 py-2 text-sm font-bold transition-colors",
              filter === status
                ? "bg-coral-500 text-white"
                : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-cream-deep"
            )}
          >
            {status === "todos" ? "Todos" : statusLabels[status]}
          </button>
        ))}
      </div>

      {actionError && (
        <p className="mt-4 rounded-2xl bg-coral-50 p-3 text-sm font-semibold text-coral-700">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-ink-soft">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-ink-soft">No hay opiniones en este estado.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">
                    {t.guardian_name}{" "}
                    <span className="font-normal text-ink-soft">
                      · {relationshipLabels[t.relationship]}
                    </span>
                  </p>
                  <p className="text-xs text-ink-faint">
                    {formatDate(t.created_at.slice(0, 10))} · {statusLabels[t.status]}
                  </p>
                </div>
                {Boolean(t.rating) && <StarRating value={t.rating ?? 0} size="sm" />}
              </div>

              {editingId === t.id ? (
                <div className="mt-3">
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={3}
                    maxLength={600}
                    className="w-full rounded-xl border-2 border-ink/10 p-3 text-sm text-ink outline-none focus:border-coral-400"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(t.id)}
                      className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-bold text-white hover:bg-leaf-600"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.comment}</p>
              )}

              {editingId !== t.id && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.status !== "aprobado" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, "aprobado")}
                      className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-bold text-white hover:bg-leaf-600"
                    >
                      Aprobar
                    </button>
                  )}
                  {t.status !== "rechazado" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, "rechazado")}
                      className="rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
                    >
                      Rechazar
                    </button>
                  )}
                  {t.status === "aprobado" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, "oculto")}
                      className="rounded-full bg-ink/70 px-4 py-2 text-sm font-bold text-white hover:bg-ink"
                    >
                      Ocultar
                    </button>
                  )}
                  {t.status === "oculto" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(t.id, "aprobado")}
                      className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-bold text-white hover:bg-leaf-600"
                    >
                      Reaprobar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(t.id);
                      setEditComment(t.comment);
                      setActionError(null);
                    }}
                    className="rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
