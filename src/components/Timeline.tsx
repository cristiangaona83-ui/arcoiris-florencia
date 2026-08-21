import { timelineEvents } from "@/data/timeline";

export function Timeline() {
  return (
    <ol className="relative mx-auto max-w-2xl">
      <div
        className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-coral-300 via-sun-300 to-leaf-300 sm:left-1/2 sm:-translate-x-1/2"
        aria-hidden="true"
      />

      {timelineEvents.map((event, index) => (
        <li
          key={event.year}
          className="reveal relative mb-10 pl-10 last:mb-0 sm:mb-14 sm:pl-0"
          style={{ transitionDelay: `${index * 120}ms` }}
        >
          <div
            className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-coral-500 text-xs font-bold text-white shadow-soft sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          >
            {index + 1}
          </div>

          <div
            className={`sm:flex sm:w-full sm:items-center ${
              index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
            }`}
          >
            <div className="sm:w-1/2" />
            <div
              className={`rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink/5 sm:w-1/2 ${
                index % 2 === 0 ? "sm:mr-8 sm:text-right" : "sm:ml-8"
              }`}
            >
              <span className="font-display text-2xl font-extrabold text-coral-500">
                {event.year}
              </span>
              {event.date && (
                <p className="mt-1 text-sm font-semibold text-ink-faint">{event.date}</p>
              )}
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{event.title}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
