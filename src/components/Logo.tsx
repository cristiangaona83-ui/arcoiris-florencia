import { useSiteSettings } from "@/contexts/SiteSettingsContext";

/** Logo institucional, editable desde /admin (respaldo: public/logo.jpg). */
export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  const { logoUrl, name } = useSiteSettings();
  return (
    <img
      src={logoUrl}
      alt={name}
      className={`${className} rounded-full object-cover ring-2 ring-white shadow-card`}
    />
  );
}
