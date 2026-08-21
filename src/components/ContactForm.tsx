import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialData: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(values: FormData): FormErrors {
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

  function handleChange(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-leaf-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-leaf-500" aria-hidden="true" />
        <h3 className="font-display text-xl font-bold text-ink">
          Formulario validado correctamente
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">
          Este formulario aún no está conectado a un servicio de envío de
          correos ni a un backend, por lo tanto tu mensaje{" "}
          <strong>no ha sido enviado realmente</strong>. Debe integrarse
          posteriormente con un servicio de formularios, correo electrónico o
          backend propio.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(initialData);
            setSubmitted(false);
          }}
          className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-card hover:bg-cream-deep"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl bg-sun-50 p-4 text-sm text-ink-soft">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" aria-hidden="true" />
        <p>
          Este formulario aún no está conectado a un servicio de envío real
          (email o backend). Por ahora solo valida los datos ingresados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
            Nombre
          </label>
          <input
            id="name"
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
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3.5 font-display text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-coral-600 sm:w-auto"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        Enviar mensaje
      </button>
    </form>
  );
}
