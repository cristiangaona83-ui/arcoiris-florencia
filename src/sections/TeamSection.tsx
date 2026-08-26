import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { TeamCard } from "@/components/TeamCard";
import { team as staticTeam, type TeamMember } from "@/data/team";
import { fetchVisibleTeamMembers } from "@/lib/teamMembers";

export function TeamSection() {
  // Se inicializa ya con el respaldo estático: si Supabase falla o tarda,
  // la sección nunca queda vacía, muestra el equipo actual sin interrupción.
  const [members, setMembers] = useState<TeamMember[]>(staticTeam);

  useEffect(() => {
    let active = true;
    fetchVisibleTeamMembers()
      .then((rows) => {
        if (!active) return;
        if (rows.length === 0) return; // sin filas aún: se mantiene el respaldo estático
        setMembers(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            role: row.role,
            photo: row.photo_url,
            isPlaceholder: false,
          }))
        );
      })
      .catch((error) => {
        console.error(
          "No se pudo cargar el equipo desde Supabase; se mantiene el contenido estático:",
          error
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="equipo" className="bg-cream-soft py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Comunidad educativa"
          title="Conoce a nuestro equipo"
          description="En Arcoíris Florencia contamos con un equipo comprometido con el bienestar, desarrollo y aprendizaje de cada niño y niña, acompañando sus experiencias educativas con afecto, respeto y profesionalismo."
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {members.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
