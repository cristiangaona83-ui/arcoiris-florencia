import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/data/navigation";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();
  const hasSocial = settings.social.facebook || settings.social.instagram;

  return (
    <footer id="site-footer" className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="font-display text-lg font-bold text-white">
              {settings.shortName}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            {settings.fullAddress}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-sun-300">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" aria-hidden="true" />
              <span>
                {settings.fullAddress}
                <span className="mt-0.5 block text-xs text-white/50">RBD: {settings.rbd}</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" aria-hidden="true" />
              {settings.phones.length > 0 ? (
                <span className="flex flex-col">
                  {settings.phones.map((phone) => (
                    <a
                      key={phone.whatsapp}
                      href={`tel:+${phone.whatsapp}`}
                      className="transition-colors hover:text-sun-300"
                    >
                      {phone.display}
                    </a>
                  ))}
                </span>
              ) : (
                <span className="italic">Teléfono pendiente de completar</span>
              )}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-sun-300" aria-hidden="true" />
              {settings.email ? (
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-sun-300">
                  {settings.email}
                </a>
              ) : (
                <span className="italic">Correo pendiente de completar</span>
              )}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
            Documentos y redes
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#documentos" className="transition-colors hover:text-sun-300">
                Documentos institucionales
              </a>
            </li>
          </ul>

          {hasSocial ? (
            <div className="mt-4 flex gap-3">
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de Jardín Infantil Arcoíris Florencia"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-sun-300 hover:text-ink"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Jardín Infantil Arcoíris Florencia"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-sun-300 hover:text-ink"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
            </div>
          ) : (
            <p className="mt-4 text-xs italic text-white/50">
              Redes sociales pendientes de completar.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50 sm:px-6 lg:px-8">
        © {year} {settings.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
