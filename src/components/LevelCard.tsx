import { Clock, Sprout, Users } from "lucide-react";
import type { EducationLevel } from "@/data/levels";
import { cn } from "@/lib/utils";

const colorStyles: Record<EducationLevel["color"], { bg: string; text: string; ring: string }> = {
  coral: { bg: "bg-coral-50", text: "text-coral-600", ring: "ring-coral-200" },
  sun: { bg: "bg-sun-50", text: "text-sun-600", ring: "ring-sun-200" },
  leaf: { bg: "bg-leaf-50", text: "text-leaf-600", ring: "ring-leaf-200" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-200" },
};

export function LevelCard({ level, index }: { level: EducationLevel; index: number }) {
  const styles = colorStyles[level.color];

  return (
    <article
      className="reveal flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5 sm:p-7"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div
        className={cn(
          "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ring-4",
          styles.bg,
          styles.ring
        )}
      >
        <Sprout className={cn("h-7 w-7", styles.text)} aria-hidden="true" />
      </div>

      <h3 className="font-display text-xl font-bold text-ink">{level.name}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
        {level.description}
      </p>

      <dl className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm text-ink-faint">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          <dt className="font-semibold">Horario/jornada:</dt>
          <dd className="italic">{level.schedule}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          <dt className="font-semibold">Edad de ingreso:</dt>
          <dd className="italic">{level.entryAge}</dd>
        </div>
      </dl>
    </article>
  );
}
