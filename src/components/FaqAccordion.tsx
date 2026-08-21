import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/** Resalta en negrita (y como enlace) el correo institucional dentro de la respuesta. */
function renderAnswer(text: string): ReactNode {
  if (!siteConfig.email || !text.includes(siteConfig.email)) return text;

  const [before, after] = text.split(siteConfig.email);
  return (
    <>
      {before}
      <a
        href={`mailto:${siteConfig.email}`}
        className="font-bold text-coral-600 underline decoration-coral-200 underline-offset-2 hover:text-coral-700"
      >
        {siteConfig.email}
      </a>
      {after}
    </>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {faqItems.map((item, index) => {
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

                  {item.showSchedule && siteConfig.schedules.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-ink/10 pt-3">
                      {siteConfig.schedules.map((schedule) => (
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
