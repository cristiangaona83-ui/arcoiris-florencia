import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems as staticFaqItems, type FaqItem } from "@/data/faq";
import { fetchVisibleFaqItems } from "@/lib/faqItems";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const { email, schedules } = useSiteSettings();

  /** Resalta en negrita (y como enlace) el correo institucional dentro de la respuesta. */
  function renderAnswer(text: string): ReactNode {
    if (!email || !text.includes(email)) return text;

    const [before, after] = text.split(email);
    return (
      <>
        {before}
        <a
          href={`mailto:${email}`}
          className="font-bold text-coral-600 underline decoration-coral-200 underline-offset-2 hover:text-coral-700"
        >
          {email}
        </a>
        {after}
      </>
    );
  }

  // Se inicializa ya con el respaldo estático: si Supabase falla o tarda,
  // la sección nunca queda vacía, muestra las preguntas actuales sin
  // interrupción.
  const [items, setItems] = useState<FaqItem[]>(staticFaqItems);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    let active = true;
    fetchVisibleFaqItems()
      .then((rows) => {
        if (!active) return;
        if (rows.length === 0) return; // sin filas aún: se mantiene el respaldo estático
        setItems(
          rows.map((row) => ({
            question: row.question,
            answer: row.answer,
            showSchedule: row.content_type === "schedule",
          }))
        );
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar las preguntas frecuentes desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.question}
            className="reveal overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink/5"
            style={{ transitionDelay: `${index * 60}ms` }}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-bold text-ink"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-coral-500 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {renderAnswer(item.answer)}
                  </p>

                  {item.showSchedule && schedules.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-ink/10 pt-3">
                      {schedules.map((schedule) => (
                        <li key={schedule.label} className="text-sm text-ink-soft">
                          <span className="font-bold text-ink">{schedule.label}:</span>{" "}
                          {schedule.hours} hrs.
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
