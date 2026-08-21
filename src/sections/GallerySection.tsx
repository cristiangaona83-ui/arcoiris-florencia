import { SectionTitle } from "@/components/SectionTitle";
import { Gallery } from "@/components/Gallery";

export function GallerySection() {
  return (
    <section id="galeria" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nuestra vida institucional"
          title="Momentos que nos inspiran"
          description="Un registro visual de nuestro jardín, sus espacios y experiencias de aprendizaje."
        />

        <div className="mt-12">
          <Gallery />
        </div>
      </div>
    </section>
  );
}
