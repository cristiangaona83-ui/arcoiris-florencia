import { Button } from "@/components/Button";
import { CloudShape, StarShape, SunShape } from "@/components/decor/Decorations";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function Hero() {
  const settings = useSiteSettings();

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-cream to-cream pt-10 pb-14 sm:pt-20 sm:pb-28"
    >
      {/* Formas decorativas de fondo */}
      <CloudShape className="absolute left-[6%] top-16 h-14 w-24 text-white opacity-90 animate-float sm:h-20 sm:w-32" />
      <CloudShape className="absolute right-[8%] top-32 h-10 w-16 text-white opacity-80 animate-float [animation-delay:1.5s] sm:h-14 sm:w-24" />
      <SunShape className="absolute -right-6 top-6 h-24 w-24 text-sun-300 opacity-80 animate-spin-slow sm:h-32 sm:w-32" />
      <StarShape className="absolute left-[16%] top-40 h-5 w-5 text-petal-300 opacity-70" />
      <StarShape className="absolute right-[22%] bottom-16 h-4 w-4 text-grape-300 opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-coral-600 shadow-card font-display">
            Educación Parvularia · Llolleo, San Antonio
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            {settings.heroTitlePrefix}{" "}
            <span className="relative inline-block text-coral-500">
              {settings.heroTitleHighlight}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            {settings.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href={settings.heroPrimaryButtonHref} variant="primary">
              {settings.heroPrimaryButtonLabel}
            </Button>
            <Button href={settings.heroSecondaryButtonHref} variant="outline">
              {settings.heroSecondaryButtonLabel}
            </Button>
          </div>
        </div>

        <div className="reveal relative mx-auto mt-12 w-full">
          <div className="relative aspect-[2073/758] w-full overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-soft sm:rounded-[2rem] sm:p-3">
            <img
              src={settings.heroImageUrl}
              alt={`${settings.name} — Niveles Medio Menor, Medio Mayor, Prekínder y Kínder. Reconocido por el Ministerio de Educación, RBD N°${settings.rbd}`}
              className="h-full w-full rounded-[1.25rem] object-contain sm:rounded-[1.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
