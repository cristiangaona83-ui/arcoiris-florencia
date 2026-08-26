import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, Trash2, Upload } from "lucide-react";
import {
  fetchSiteSettings,
  updateSiteSettings,
  uploadHeroImage,
  type PhoneEntry,
  type ScheduleEntry,
  type SiteSettingsRow,
} from "@/lib/siteSettings";

type FormState = Omit<SiteSettingsRow, "id" | "updated_at">;

const EMPTY_FORM: FormState = {
  name: "",
  short_name: "",
  address_street: "",
  sector: "",
  region: "",
  phones: [],
  email: "",
  schedules: [],
  social_facebook: "",
  social_instagram: "",
  hero_title_prefix: "",
  hero_title_highlight: "",
  hero_subtitle: "",
  hero_primary_button_label: "",
  hero_primary_button_href: "",
  hero_secondary_button_label: "",
  hero_secondary_button_href: "",
  hero_image_url: "",
};

function textField(value: string | null): string {
  return value ?? "";
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-coral-400"
      />
    </div>
  );
}

export function AdminSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetchSiteSettings()
      .then((row) => {
        if (!active) return;
        if (row) {
          setForm({
            name: row.name,
            short_name: row.short_name,
            address_street: textField(row.address_street),
            sector: textField(row.sector),
            region: textField(row.region),
            phones: row.phones,
            email: textField(row.email),
            schedules: row.schedules,
            social_facebook: textField(row.social_facebook),
            social_instagram: textField(row.social_instagram),
            hero_title_prefix: textField(row.hero_title_prefix),
            hero_title_highlight: textField(row.hero_title_highlight),
            hero_subtitle: textField(row.hero_subtitle),
            hero_primary_button_label: textField(row.hero_primary_button_label),
            hero_primary_button_href: textField(row.hero_primary_button_href),
            hero_secondary_button_label: textField(row.hero_secondary_button_label),
            hero_secondary_button_href: textField(row.hero_secondary_button_href),
            hero_image_url: textField(row.hero_image_url),
          });
        }
      })
      .catch((error) => {
        console.error("No se pudo cargar la configuración para editar:", error);
        setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function updatePhone(index: number, field: keyof PhoneEntry, value: string) {
    const next = [...form.phones];
    next[index] = { ...next[index], [field]: value };
    patch("phones", next);
  }

  function addPhone() {
    patch("phones", [...form.phones, { display: "", whatsapp: "" }]);
  }

  function removePhone(index: number) {
    patch(
      "phones",
      form.phones.filter((_, i) => i !== index)
    );
  }

  function updateSchedule(index: number, field: keyof ScheduleEntry, value: string) {
    const next = [...form.schedules];
    next[index] = { ...next[index], [field]: value };
    patch("schedules", next);
  }

  function addSchedule() {
    patch("schedules", [...form.schedules, { label: "", hours: "" }]);
  }

  function removeSchedule(index: number) {
    patch(
      "schedules",
      form.schedules.filter((_, i) => i !== index)
    );
  }

  async function handleHeroFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingHero(true);
    setSaveError(null);
    try {
      const url = await uploadHeroImage(file, form.hero_image_url || null);
      patch("hero_image_url", url);
    } catch (error) {
      console.error("No se pudo subir la imagen del Hero:", error);
      setSaveError("No se pudo subir la imagen. Inténtalo nuevamente.");
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateSiteSettings(form);
      setSaved(true);
    } catch (error) {
      console.error("No se pudo guardar la configuración:", error);
      setSaveError("No se pudo guardar. Revisa los datos e inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-ink-soft">Cargando configuración…</p>;
  }

  if (loadError) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>No se pudo cargar la configuración. Inténtalo nuevamente más tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink">Página principal / Configuración</h2>

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Datos institucionales</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nombre del jardín" value={form.name} onChange={(v) => patch("name", v)} />
          <Field
            label="Nombre corto"
            value={form.short_name}
            onChange={(v) => patch("short_name", v)}
          />
          <Field
            label="Dirección"
            value={textField(form.address_street)}
            onChange={(v) => patch("address_street", v)}
          />
          <Field
            label="Comuna"
            value={textField(form.sector)}
            onChange={(v) => patch("sector", v)}
          />
          <Field
            label="Región"
            value={textField(form.region)}
            onChange={(v) => patch("region", v)}
          />
          <Field
            label="Correo electrónico"
            value={textField(form.email)}
            onChange={(v) => patch("email", v)}
          />
          <Field
            label="Facebook"
            value={textField(form.social_facebook)}
            onChange={(v) => patch("social_facebook", v)}
          />
          <Field
            label="Instagram"
            value={textField(form.social_instagram)}
            onChange={(v) => patch("social_instagram", v)}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Teléfonos / WhatsApp</h3>
          <button
            type="button"
            onClick={addPhone}
            className="inline-flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1.5 text-sm font-bold text-ink hover:bg-sun-100"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {form.phones.map((phone, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-2xl bg-cream-soft p-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                value={phone.display}
                placeholder="+56 9 1234 5678"
                onChange={(e) => updatePhone(index, "display", e.target.value)}
                className="min-h-[44px] rounded-xl border-2 border-ink/10 bg-white px-3 text-sm text-ink outline-none focus:border-coral-400"
              />
              <input
                type="text"
                value={phone.whatsapp}
                placeholder="56912345678 (solo dígitos)"
                onChange={(e) => updatePhone(index, "whatsapp", e.target.value)}
                className="min-h-[44px] rounded-xl border-2 border-ink/10 bg-white px-3 text-sm text-ink outline-none focus:border-coral-400"
              />
              <button
                type="button"
                onClick={() => removePhone(index)}
                className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-coral-50 px-3 text-sm font-bold text-coral-600 hover:bg-coral-100"
                aria-label="Quitar teléfono"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {form.phones.length === 0 && (
            <p className="text-sm text-ink-faint">No hay teléfonos cargados.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Horarios</h3>
          <button
            type="button"
            onClick={addSchedule}
            className="inline-flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1.5 text-sm font-bold text-ink hover:bg-sun-100"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Agregar
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {form.schedules.map((schedule, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-2xl bg-cream-soft p-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                value={schedule.label}
                placeholder="Jornada Completa"
                onChange={(e) => updateSchedule(index, "label", e.target.value)}
                className="min-h-[44px] rounded-xl border-2 border-ink/10 bg-white px-3 text-sm text-ink outline-none focus:border-coral-400"
              />
              <input
                type="text"
                value={schedule.hours}
                placeholder="08:00 a 18:30"
                onChange={(e) => updateSchedule(index, "hours", e.target.value)}
                className="min-h-[44px] rounded-xl border-2 border-ink/10 bg-white px-3 text-sm text-ink outline-none focus:border-coral-400"
              />
              <button
                type="button"
                onClick={() => removeSchedule(index)}
                className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-coral-50 px-3 text-sm font-bold text-coral-600 hover:bg-coral-100"
                aria-label="Quitar horario"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {form.schedules.length === 0 && (
            <p className="text-sm text-ink-faint">No hay horarios cargados.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Portada (Hero)</h3>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Título — primera parte"
            value={textField(form.hero_title_prefix)}
            onChange={(v) => patch("hero_title_prefix", v)}
          />
          <Field
            label="Título — parte destacada"
            value={textField(form.hero_title_highlight)}
            onChange={(v) => patch("hero_title_highlight", v)}
          />
        </div>
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-bold text-ink">Subtítulo</label>
          <textarea
            value={textField(form.hero_subtitle)}
            onChange={(e) => patch("hero_subtitle", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-coral-400"
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Botón principal — texto"
            value={textField(form.hero_primary_button_label)}
            onChange={(v) => patch("hero_primary_button_label", v)}
          />
          <Field
            label="Botón principal — enlace"
            value={textField(form.hero_primary_button_href)}
            onChange={(v) => patch("hero_primary_button_href", v)}
          />
          <Field
            label="Botón secundario — texto"
            value={textField(form.hero_secondary_button_label)}
            onChange={(v) => patch("hero_secondary_button_label", v)}
          />
          <Field
            label="Botón secundario — enlace"
            value={textField(form.hero_secondary_button_href)}
            onChange={(v) => patch("hero_secondary_button_href", v)}
          />
        </div>
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-bold text-ink">Imagen principal</label>
          <div className="flex items-center gap-4">
            {form.hero_image_url && (
              <img
                src={form.hero_image_url}
                alt="Vista previa de la imagen del Hero"
                className="h-16 w-28 shrink-0 rounded-xl object-cover ring-1 ring-ink/10"
              />
            )}
            <button
              type="button"
              disabled={uploadingHero}
              onClick={() => heroFileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink hover:bg-sun-100 disabled:opacity-60"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploadingHero ? "Subiendo…" : "Reemplazar imagen"}
            </button>
            <input
              ref={heroFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHeroFileChange}
            />
          </div>
        </div>
      </section>

      {saveError && (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{saveError}</p>
        </div>
      )}

      {saved && (
        <div className="flex items-start gap-3 rounded-2xl bg-leaf-50 p-4 text-sm text-leaf-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>Configuración guardada correctamente.</p>
        </div>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-coral-500 px-8 py-3 font-display text-base font-bold text-white shadow-soft transition-colors hover:bg-coral-600 disabled:pointer-events-none disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
