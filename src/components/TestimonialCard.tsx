import { Quote } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { formatGuardianDisplayName, relationshipLabels, type Testimonial } from "@/lib/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1.5 sm:p-7">
      <Quote className="h-8 w-8 shrink-0 text-coral-200" aria-hidden="true" />
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{testimonial.comment}</p>

      {testimonial.rating && (
        <div className="mt-4">
          <StarRating value={testimonial.rating} size="sm" />
        </div>
      )}

      <div className="mt-4 border-t border-ink/10 pt-4">
        <p className="font-display text-base font-bold text-ink">
          {formatGuardianDisplayName(testimonial.guardian_name)}
        </p>
        <p className="text-sm font-semibold text-coral-500">
          {relationshipLabels[testimonial.relationship]}
        </p>
      </div>
    </article>
  );
}
