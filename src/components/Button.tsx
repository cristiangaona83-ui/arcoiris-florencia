import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "outlineLight" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-coral-500 text-white shadow-soft hover:bg-coral-600 active:bg-coral-600",
  secondary:
    "bg-sky-500 text-white shadow-soft hover:bg-sky-600 active:bg-sky-600",
  outline:
    "bg-white text-ink border-2 border-ink/10 hover:border-coral-300 hover:text-coral-600",
  outlineLight:
    "bg-transparent text-white border-2 border-white/50 hover:border-white hover:bg-white/10",
  ghost: "bg-white/90 text-ink hover:bg-white",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold font-display transition-all duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 min-h-[48px]";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsAnchor) {
  const { variant = "primary", children, className, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
