import { Button } from "@/components/Button";
import { FlowerShape, StarShape } from "@/components/decor/Decorations";

export function WelcomeSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <FlowerShape className="absolute -left-4 top-10 h-16 w-16 text-petal-200 opacity-70" />
      <StarShape className="absolute right-10 bottom-16 h-6 w-6 text-sun-300 opacity-70" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="reveal order-2 lg:order-1">
          <div className="aspect-[4/3] w-full rounded-[2.5rem] border-2 border-dashed border-leaf-200 bg-leaf-50 p-8 flex items-center justify-center text-center">
            <p className="max-w-[240px] text-sm font-semibold text-leaf-600">
              Espacio reservado para fotografía del establecimiento
            </p>
          </div>
        </div>

        <div className="reveal order-1 lg:order-2">
          <span className="mb-3 inline-block rounded-full bg-leaf-100 px-4 py-1 text-sm font-bold uppercase tracking-wide text-leaf-600 font-display">
            Nuestro Jardín
          </span>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Bienvenidos a Arcoíris Florencia
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            En Jardín Infantil Arcoíris Florencia creemos que cada niño y
            niña aprende descubriendo, jugando, explorando y compartiendo con
            otros. Nuestro propósito es acompañar sus primeros años de
            formación mediante experiencias educativas significativas, en un
            ambiente acogedor que favorezca la autonomía, la convivencia, la
            creatividad y el desarrollo integral.
          </p>
          <Button href="#historia" variant="secondary" className="mt-7">
            Conoce nuestra historia
          </Button>
        </div>
      </div>
    </section>
  );
}
