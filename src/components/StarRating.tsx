import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

const STARS = [1, 2, 3, 4, 5];

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  if (!onChange) {
    return (
      <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
        {STARS.map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= value ? "fill-sun-400 text-sun-400" : "fill-transparent text-ink/15"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación (opcional)">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          onClick={() => onChange(star === value ? 0 : star)}
          className="rounded p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              starSize,
              star <= value ? "fill-sun-400 text-sun-400" : "fill-transparent text-ink/25"
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
