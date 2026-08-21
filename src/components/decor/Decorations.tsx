import { cn } from "@/lib/utils";

interface DecorProps {
  className?: string;
}

/** Arco de arcoíris decorativo, trazado con colores suaves de la paleta. */
export function RainbowArc({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 200 110"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path d="M10 100a90 90 0 0 1 180 0" stroke="#FFB5A0" strokeWidth="12" strokeLinecap="round" />
      <path d="M28 100a72 72 0 0 1 144 0" stroke="#FFD98A" strokeWidth="12" strokeLinecap="round" />
      <path d="M46 100a54 54 0 0 1 108 0" stroke="#A2DFB5" strokeWidth="12" strokeLinecap="round" />
      <path d="M64 100a36 36 0 0 1 72 0" stroke="#9FDBF2" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

export function CloudShape({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path
        d="M25 55a20 20 0 0 1-2-39.8A24 24 0 0 1 68 8a18 18 0 0 1 27 15 16 16 0 0 1-4 31.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SunShape({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <circle cx="50" cy="50" r="22" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="M50 8v14" />
        <path d="M50 78v14" />
        <path d="M8 50h14" />
        <path d="M78 50h14" />
        <path d="M20 20l10 10" />
        <path d="M70 70l10 10" />
        <path d="M80 20L70 30" />
        <path d="M30 70L20 80" />
      </g>
    </svg>
  );
}

export function FlowerShape({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <g fill="currentColor">
        <circle cx="40" cy="18" r="12" />
        <circle cx="40" cy="62" r="12" />
        <circle cx="18" cy="40" r="12" />
        <circle cx="62" cy="40" r="12" />
      </g>
      <circle cx="40" cy="40" r="11" fill="#FFB238" />
    </svg>
  );
}

export function StarShape({ className }: DecorProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path d="M20 2l4.7 12.2L38 18l-11.5 6.3L23 38l-3-13.5L8 22l11-5.6z" />
    </svg>
  );
}
