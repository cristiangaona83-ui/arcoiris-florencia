import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { TestimonialCard } from "@/components/TestimonialCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { fetchApprovedTestimonials, type Testimonial } from "@/lib/testimonials";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchApprovedTestimonials()
      .then((data) => {
        if (active) setTestimonials(data);
      })
      .catch((error) => {
        // Se distingue de "aún no hay opiniones": si esto se dispara, algo
        // impidió leer Supabase (config, red, RLS) y no debe confundirse
        // con que simplemente no existan opiniones aprobadas todavía.
        console.error("No se pudieron cargar las experiencias de familias:", error);
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="experiencias" className="bg-white py-14 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Voces de nuestra comunidad"
          title="Experiencias de nuestras familias"
          description="Lo que madres, padres y apoderados nos cuentan sobre su experiencia en Arcoíris Florencia."
        />

        <div className="mt-8 flex justify-center">
          <Button type="button" variant="secondary" onClick={() => setIsFormOpen(true)}>
            Comparte tu experiencia
          </Button>
        </div>

        {!loading && loadError && (
          <p className="mt-12 text-center text-sm font-semibold text-coral-600">
            No pudimos cargar las experiencias de familias en este momento. Inténtalo nuevamente
            más tarde.
          </p>
        )}

        {!loading && !loadError && testimonials.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}

        {!loading && !loadError && testimonials.length === 0 && (
          <p className="mt-12 text-center text-sm font-semibold text-ink-faint">
            Sé la primera familia en compartir su experiencia con nosotros.
          </p>
        )}
      </div>

      {isFormOpen && <TestimonialForm onClose={() => setIsFormOpen(false)} />}
    </section>
  );
}
