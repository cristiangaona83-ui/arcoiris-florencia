import { useState, type FormEvent } from "react";
import { useForm } from "@formspree/react";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  [key: string]: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const isConfigured = Boolean(siteConfig.formspreeId);
  const [formspreeState, submitToFormspree, resetFormspree] = useForm<ContactFormData>(
    siteConfig.formspreeId || "unconfigured"
  );

  const [data, setData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(values: ContactFormData): FormErrors {
    const next: FormErrors = {};
    if (!values.name.trim()) next.name = "Ingresa tu nombre.";
    if (!values.email.trim()) {
      next.email = "Ingresa tu correo electrónico.";
    } else if (!emailPattern.test(values.email)) {
      next.email = "Ingresa un correo electrónico válido.";
    }
    if (!values.subject.trim()) next.subject = "Ingresa un asunto.";
    if (!values.message.trim()) {
      next.message = "Escribe tu mensaje.";
    } else if (values.message.trim().length < 10) {
      next.message = "El mensaje debe tener al menos 10 caracteres.";
    }
    return next;
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!isConfigured) return;

    await submitToFormspree(data);
  }

  if (formspreeState.succeeded) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-leaf-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-leaf-500" aria-hidden="true" />
        <p className="max-w-md text-base leading-relaxed text-ink">
          ¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente.
          Nos pondremos en contacto contigo a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(initialData);
            setErrors({});
            resetFormspree();
          }}
          className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-card hover:bg-cream-deep"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {!isConfigured && (
        <div className="flex items-start gap-3 rounded-2xl bg-sun-50 p-4 text-sm text-ink-soft">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" aria-hidden="true" />
          <p>
            El envío de mensajes aún no está activado (falta configurar el
            formulario). Por ahora este formulario solo valida los datos
            ingresados.
          </p>
        </div>
      )}

      {isConfigured && formspreeState.errors && !formspreeState.submitting && (
        <div className="flex items-start gap-3 rounded-2xl bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-500" aria-hidden="true" />
          <p>No pudimos enviar tu mensaje. Por favor, inténtalo nuevamente.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sky-400"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm font-semibold text-coral-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sky-400"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm font-semibold text-coral-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-ink">
            Teléfono <span className="font-normal text-ink-faint">(opcional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sky-400"
          />
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-bold text-ink">
            Asunto
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={data.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            className="w-full min-h-[48px] rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sky-400"
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-sm font-semibold text-coral-600">
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-ink">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={data.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-sky-400"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm font-semibold text-coral-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={formspreeState.submitting}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 font-display text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-coral-600 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        {formspreeState.submitting ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
