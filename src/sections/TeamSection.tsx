import { SectionTitle } from "@/components/SectionTitle";
import { TeamCard } from "@/components/TeamCard";
import { team } from "@/data/team";

export function TeamSection() {
  return (
    <section id="equipo" className="bg-cream-soft py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Comunidad educativa"
          title="Conoce a nuestro equipo"
          description="En Arcoíris Florencia contamos con un equipo comprometido con el bienestar, desarrollo y aprendizaje de cada niño y niña, acompañando sus experiencias educativas con afecto, respeto y profesionalismo."
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
