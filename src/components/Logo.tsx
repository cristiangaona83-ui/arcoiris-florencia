/**
 * Isotipo TEMPORAL basado en un arcoíris, mientras no exista el logo
 * oficial del jardín. Para reemplazarlo:
 *   1. Agrega el archivo "logo.svg" o "logo.png" en /public/
 *   2. Reemplaza el <svg> de abajo por:
 *        <img src="/logo.svg" alt={siteConfig.name} className={className} />
 */
export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Isotipo temporal de Jardín Infantil Arcoíris Florencia"
    >
      <circle cx="32" cy="32" r="32" fill="#FFF6E9" />
      <path d="M10 44a22 22 0 0 1 44 0" fill="none" stroke="#D2452F" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M16 44a16 16 0 0 1 32 0" fill="none" stroke="#F79A1E" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M22 44a10 10 0 0 1 20 0" fill="none" stroke="#369C58" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M28 44a4 4 0 0 1 8 0" fill="none" stroke="#2C8FBE" strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="46" cy="16" r="3.4" fill="#7852B8" />
      <circle cx="14" cy="20" r="2.4" fill="#EF6198" />
    </svg>
  );
}
