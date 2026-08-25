import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { TestimonialCard } from "@/components/TestimonialCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { fetchApprovedTestimonials, type Testimonial } from "@/lib/testimonials";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchApprovedTestimonials()
      .then((data) => {
        if (active) setTestimonials(data);
      })
      .catch(() => {
        if (active) setTestimonials([]);
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

        {!loading && testimonials.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <p className="mt-12 text-center text-sm font-semibold text-ink-faint">
            Sé la primera familia en compartir su experiencia con nosotros.
          </p>
        )}
      </div>

      {isFormOpen && <TestimonialForm onClose={() => setIsFormOpen(false)} />}
    </section>
  );
}
