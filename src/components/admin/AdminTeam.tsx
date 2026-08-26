import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  createTeamMember,
  deleteTeamMember,
  fetchAllTeamMembers,
  reorderTeamMembers,
  updateTeamMember,
  uploadTeamMemberPhoto,
  type TeamMemberRow,
} from "@/lib/teamMembers";

interface EditState {
  id: string | null; // null = creando uno nuevo
  name: string;
  role: string;
  photo_url: string | null;
}

const EMPTY_EDIT: EditState = { id: null, name: "", role: "", photo_url: null };

export function AdminTeam() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await fetchAllTeamMembers();
      setMembers(rows);
    } catch (error) {
      console.error("No se pudo cargar el equipo:", error);
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

  function startEdit(member: TeamMemberRow) {
    setActionError(null);
    setEditing({ id: member.id, name: member.name, role: member.role, photo_url: member.photo_url });
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    setUploading(true);
    setActionError(null);
    try {
      const url = await uploadTeamMemberPhoto(file, editing.photo_url);
      setEditing({ ...editing, photo_url: url });
    } catch (error) {
      console.error("No se pudo subir la fotografía:", error);
      setActionError("No se pudo subir la fotografía. Inténtalo nuevamente.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (editing.name.trim().length < 2 || editing.role.trim().length < 2) {
      setActionError("Nombre y cargo son obligatorios (mínimo 2 caracteres).");
      return;
    }
    setActionError(null);
    try {
      if (editing.id) {
        await updateTeamMember(editing.id, {
          name: editing.name.trim(),
          role: editing.role.trim(),
          photo_url: editing.photo_url,
        });
      } else {
        const nextOrder =
          members.length > 0 ? Math.max(...members.map((m) => m.sort_order)) + 1 : 1;
        await createTeamMember({
          name: editing.name.trim(),
          role: editing.role.trim(),
          photo_url: editing.photo_url,
          sort_order: nextOrder,
          is_visible: true,
        });
      }
      setEditing(null);
      load();
    } catch (error) {
      console.error("No se pudo guardar el integrante:", error);
      setActionError("No se pudo guardar. Inténtalo nuevamente.");
    }
  }

  async function toggleVisible(member: TeamMemberRow) {
    setActionError(null);
    try {
      await updateTeamMember(member.id, { is_visible: !member.is_visible });
      load();
    } catch (error) {
      console.error("No se pudo cambiar la visibilidad:", error);
      setActionError("No se pudo actualizar. Inténtalo nuevamente.");
    }
  }

  async function move(member: TeamMemberRow, direction: "up" | "down") {
    const sorted = [...members].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((m) => m.id === member.id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;

    const a = sorted[index];
    const b = sorted[swapWith];
    setActionError(null);
    try {
      await reorderTeamMembers([
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
      await deleteTeamMember(id);
      setConfirmingDeleteId(null);
      load();
    } catch (error) {
      console.error("No se pudo eliminar el integrante:", error);
      setActionError("No se pudo eliminar. Inténtalo nuevamente.");
    }
  }

  const sortedMembers = [...members].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Equipo</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white hover:bg-coral-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Agregar integrante
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
              {editing.id ? "Editar integrante" : "Nuevo integrante"}
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
              {editing.photo_url ? (
                <img src={editing.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-ink-faint" aria-hidden="true" />
              )}
            </div>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploading ? "Subiendo…" : "Cambiar fotografía"}
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
              <label className="mb-1.5 block text-sm font-bold text-ink">Nombre</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">Cargo</label>
              <input
                type="text"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveEdit}
            className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-display text-sm font-bold text-white hover:bg-coral-600"
          >
            Guardar integrante
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-ink-soft">Cargando equipo…</p>
      ) : loadError ? (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>No se pudo cargar el equipo. Inténtalo nuevamente más tarde.</p>
        </div>
      ) : sortedMembers.length === 0 ? (
        <p className="text-ink-soft">Aún no hay integrantes cargados.</p>
      ) : (
        <div className="space-y-3">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep ring-1 ring-ink/10">
                {member.photo_url ? (
                  <img src={member.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-ink-faint" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{member.name}</p>
                <p className="truncate text-sm text-ink-soft">{member.role}</p>
                {!member.is_visible && (
                  <span className="mt-1 inline-block rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold text-ink-soft">
                    Oculto
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(member, "up")}
                  disabled={index === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(member, "down")}
                  disabled={index === sortedMembers.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100 disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(member)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
                  aria-label={member.is_visible ? "Ocultar" : "Mostrar"}
                >
                  {member.is_visible ? (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(member)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>

                {confirmingDeleteId === member.id ? (
                  <div className="flex items-center gap-2 rounded-full bg-coral-50 px-3 py-1.5">
                    <span className="text-xs font-bold text-coral-700">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={() => confirmDelete(member.id)}
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
                    onClick={() => setConfirmingDeleteId(member.id)}
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
