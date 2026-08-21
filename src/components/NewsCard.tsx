import { useState } from "react";
import { CalendarDays, ImageOff } from "lucide-react";
import type { NewsItem } from "@/data/news";
import { NewsDetailModal } from "@/components/NewsDetailModal";
import { formatDate } from "@/lib/utils";

export function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className="reveal flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="flex aspect-[16/10] items-center justify-center bg-sky-50 text-sky-300">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <ImageOff className="h-10 w-10" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-coral-500">
          <span className="rounded-full bg-coral-50 px-3 py-1">{item.category}</span>
          <span className="inline-flex items-center gap-1 text-ink-faint">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(item.date)}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-ink">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{item.summary}</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-cream-deep px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-sun-100"
        >
          Leer más
        </button>
      </div>

      {isOpen && <NewsDetailModal item={item} onClose={() => setIsOpen(false)} />}
    </article>
  );
}
