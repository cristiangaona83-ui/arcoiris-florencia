export function AdminHome() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
      <h2 className="font-display text-2xl font-bold text-ink">Bienvenido a la administración</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Desde aquí puedes editar la página principal y los datos institucionales, gestionar el
        equipo y moderar las opiniones de familias. Los cambios que apruebes o guardes se reflejan
        en el sitio público sin necesidad de un nuevo despliegue.
      </p>
    </div>
  );
}
