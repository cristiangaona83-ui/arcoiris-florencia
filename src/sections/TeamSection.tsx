import { SectionTitle } from "@/components/SectionTitle";
import { TeamCard } from "@/components/TeamCard";
import { team } from "@/data/team";

export function TeamSection() {
  return (
    <section id="equipo" className="bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Comunidad educativa"
          title="Conoce a nuestro equipo"
          description="Las personas que acompañan el día a día de niños y niñas en Arcoíris Florencia."
        />

        <div className="mx-auto mt-14 grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
