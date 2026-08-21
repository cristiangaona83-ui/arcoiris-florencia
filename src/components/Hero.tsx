import { Button } from "@/components/Button";
import { CloudShape, StarShape, SunShape } from "@/components/decor/Decorations";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-cream to-cream pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      {/* Formas decorativas de fondo */}
      <CloudShape className="absolute left-[6%] top-16 h-14 w-24 text-white opacity-90 animate-float sm:h-20 sm:w-32" />
      <CloudShape className="absolute right-[8%] top-32 h-10 w-16 text-white opacity-80 animate-float [animation-delay:1.5s] sm:h-14 sm:w-24" />
      <SunShape className="absolute -right-6 top-6 h-24 w-24 text-sun-300 opacity-80 animate-spin-slow sm:h-32 sm:w-32" />
      <StarShape className="absolute left-[16%] top-40 h-5 w-5 text-petal-300 opacity-70" />
      <StarShape className="absolute right-[22%] bottom-16 h-4 w-4 text-grape-300 opacity-70" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="reveal text-center lg:text-left">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-coral-600 shadow-card font-display">
            Educación Parvularia · Llolleo, San Antonio
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Aprendemos, jugamos y{" "}
            <span className="relative inline-block text-coral-500">
              crecemos juntos
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0">
            En Jardín Infantil Arcoíris Florencia acompañamos los primeros
            aprendizajes de niños y niñas en un ambiente acogedor, seguro y
            lleno de oportunidades para descubrir, aprender y crecer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button href="#nuestro-jardin" variant="primary">
              Conoce nuestro jardín
            </Button>
            <Button href="#contacto" variant="outline">
              Contáctanos
            </Button>
          </div>
        </div>

        <div className="reveal relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-soft">
            <img
              src="/images/logo-oficial.jpg"
              alt="Jardín Infantil Arcoíris Florencia — particular pagado reconocido por el MINEDUC, Resolución Exenta N°1762 del 10/05/2022"
              className="h-full w-full rounded-[2rem] object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-sun-300 shadow-soft animate-float sm:h-28 sm:w-28">
            <span className="font-display text-3xl">🌻</span>
          </div>
          <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-petal-200 shadow-soft animate-float [animation-delay:1s] sm:h-20 sm:w-20">
            <span className="font-display text-2xl">✏️</span>
          </div>
        </div>
      </div>
    </section>
  );
}
