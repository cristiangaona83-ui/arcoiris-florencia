import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Send, X } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/lib/supabaseClient";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { relationshipOptions, type TestimonialRelationship } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialFormProps {
  onClose: () => void;
}

interface FormState {
  guardian_name: string;
  relationship: TestimonialRelationship | "";
  comment: string;
  rating: number;
  consent: boolean;
  hp_field: string;
}

interface FormErrors {
  guardian_name?: string;
  relationship?: string;
  comment?: string;
  consent?: string;
}

const initialState: FormState = {
  guardian_name: "",
  relationship: "",
  comment: "",
  rating: 0,
  consent: false,
  hp_field: "",
};

export function TestimonialForm({ onClose }: TestimonialFormProps) {
  useLockBodyScroll(true);

  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  function validate(values: FormState): FormErrors {
    const next: FormErrors = {};
    if (values.guardian_name.trim().length < 2) {
      next.guardian_name = "Ingresa tu nombre.";
    }
    if (!values.relationship) {
      next.relationship = "Selecciona tu relación con el niño o niña.";
    }
    if (values.comment.trim().length < 10) {
      next.comment = "Cuéntanos un poco más sobre tu experiencia (mínimo 10 caracteres).";
    }
    if (!values.consent) {
      next.consent = "Debes autorizar la publicación para poder enviar tu comentario.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Honeypot: un bot que rellene este campo oculto recibe una falsa
    // confirmación de éxito, sin que el comentario llegue a guardarse.
    if (data.hp_field.trim() !== "") {
      setSucceeded(true);
      return;
    }

    setSubmitting(true);
    setSubmitError(false);

    const { error } = await supabase.from("family_testimonials").insert({
      guardian_name: data.guardian_name.trim(),
      relationship: data.relationship,
      comment: data.comment.trim(),
      rating: data.rating > 0 ? data.rating : null,
      consent_to_publish: data.consent,
    });

    setSubmitting(false);

    if (error) {
      setSubmitError(true);
      return;
    }
    setSucceeded(true);
  }

  if (succeeded) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comentario enviado"
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
        onClick={onClose}
      >
        <div
          className="flex max-w-md flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle2 className="h-12 w-12 text-leaf-500" aria-hidden="true" />
          <p className="text-base leading-relaxed text-ink">
            ¡Gracias por compartir tu experiencia! Tu comentario será revisado antes de ser
            publicado.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full bg-coral-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-coral-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comparte tu experiencia"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">Comparte tu experiencia</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Tu opinión ayuda a otras familias a conocer Arcoíris Florencia.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-deep text-ink hover:bg-sun-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-ink-soft">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" aria-hidden="true" />
          <p>
            No incluyas nombres completos de niños, información médica, situaciones privadas ni
            otros datos personales sensibles.
          </p>
        </div>

        {submitError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" aria-hidden="true" />
            <p>No pudimos enviar tu comentario. Por favor, inténtalo nuevamente.</p>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot anti-spam: invisible y no accesible por teclado para personas. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="tf-website">No completar este campo</label>
            <input
              id="tf-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={data.hp_field}
              onChange={(e) => setData((p) => ({ ...p, hp_field: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="tf-name" className="mb-1.5 block text-sm font-bold text-ink">
              Tu nombre
            </label>
            <input
              id="tf-name"
              type="text"
              autoComplete="name"
              maxLength={80}
              value={data.guardian_name}
              onChange={(e) => setData((p) => ({ ...p, guardian_name: e.target.value }))}
              aria-invalid={Boolean(errors.guardian_name)}
              className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-coral-400"
            />
            {errors.guardian_name && (
              <p className="mt-1 text-sm font-semibold text-coral-600">{errors.guardian_name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Relación con el niño o niña
            </label>
            <div className="flex flex-wrap gap-2">
              {relationshipOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData((p) => ({ ...p, relationship: opt.value }))}
                  className={cn(
                    "min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors",
                    data.relationship === opt.value
                      ? "bg-coral-500 text-white"
                      : "bg-cream-deep text-ink-soft hover:bg-sun-100"
                  )}
                  aria-pressed={data.relationship === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.relationship && (
              <p className="mt-1 text-sm font-semibold text-coral-600">{errors.relationship}</p>
            )}
          </div>

          <div>
            <label htmlFor="tf-comment" className="mb-1.5 block text-sm font-bold text-ink">
              Tu comentario
            </label>
            <textarea
              id="tf-comment"
              rows={4}
              maxLength={600}
              value={data.comment}
              onChange={(e) => setData((p) => ({ ...p, comment: e.target.value }))}
              aria-invalid={Boolean(errors.comment)}
              className="w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-coral-400"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.comment ? (
                <p className="text-sm font-semibold text-coral-600">{errors.comment}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-ink-faint">{data.comment.length}/600</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Calificación <span className="font-normal text-ink-faint">(opcional)</span>
            </label>
            <StarRating value={data.rating} onChange={(v) => setData((p) => ({ ...p, rating: v }))} />
          </div>

          <div>
            <label className="flex items-start gap-3 rounded-2xl bg-cream-soft p-4 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => setData((p) => ({ ...p, consent: e.target.checked }))}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-ink/20 text-coral-500 focus:ring-coral-400"
              />
              <span>
                Autorizo la publicación de este comentario en el sitio web del Jardín Infantil
                Arcoíris Florencia.
              </span>
            </label>
            {errors.consent && (
              <p className="mt-1 text-sm font-semibold text-coral-600">{errors.consent}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 font-display text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-coral-600 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            {submitting ? "Enviando..." : "Enviar comentario"}
          </button>
        </form>
      </div>
    </div>
  );
}
