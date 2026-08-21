import { User } from "lucide-react";
import type { TeamMember } from "@/data/team";
import { cn } from "@/lib/utils";

export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article
      className="reveal flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div
        className={cn(
          "flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-4",
          member.isPlaceholder
            ? "bg-cream-deep ring-ink/5"
            : "bg-coral-50 ring-coral-100"
        )}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <User
            className={cn("h-12 w-12", member.isPlaceholder ? "text-ink-faint" : "text-coral-400")}
            aria-hidden="true"
          />
        )}
      </div>

      <h3
        className={cn(
          "mt-4 font-display text-lg font-bold",
          member.isPlaceholder ? "italic text-ink-faint" : "text-ink"
        )}
      >
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-coral-500">{member.role}</p>
    </article>
  );
}
