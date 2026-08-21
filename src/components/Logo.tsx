import { siteConfig } from "@/data/siteConfig";

/**
 * Logo oficial del jardín (public/logo.jpg). Para reemplazarlo por una
 * versión más nueva, sobrescribe ese archivo o cambia el "src" de abajo.
 */
export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt={siteConfig.name}
      className={`${className} rounded-full object-cover ring-2 ring-white shadow-card`}
    />
  );
}
