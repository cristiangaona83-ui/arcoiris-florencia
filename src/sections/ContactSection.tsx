import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { ContactForm } from "@/components/ContactForm";
import { LocationMap } from "@/components/LocationMap";
import { siteConfig, PLACEHOLDER_TEXT } from "@/data/siteConfig";

export function ContactSection() {
  const hasSocial = siteConfig.social.facebook || siteConfig.social.instagram;

  return (
    <section id="contacto" className="bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Hablemos"
          title="Estamos aquí para ti"
          description="Escríbenos y responderemos a la brevedad."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            <ul className="space-y-4">
              <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Dirección</p>
                  <p className="text-sm text-ink-soft break-words">{siteConfig.fullAddress}</p>
                  <p className="mt-1 text-xs text-ink-faint">RBD: {siteConfig.rbd}</p>
                </div>
              </li>

              <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Teléfono / WhatsApp</p>
                  {siteConfig.phones.length > 0 ? (
                    <ul className="mt-1 space-y-1.5">
                      {siteConfig.phones.map((phone) => (
                        <li key={phone.whatsapp} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <a
                            href={`tel:+${phone.whatsapp}`}
                            className="text-sm font-semibold text-ink-soft hover:text-coral-600"
                          >
                            {phone.display}
                          </a>
                          <a
                            href={`https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(
                              `Hola, quisiera obtener información de ${siteConfig.name}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-bold text-leaf-600 hover:bg-leaf-100"
                            aria-label={`Escribir por WhatsApp al ${phone.display}`}
                          >
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            WhatsApp
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-ink-faint">{PLACEHOLDER_TEXT}</p>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Correo electrónico</p>
                  {siteConfig.email ? (
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-sm text-ink-soft break-words hover:text-coral-600"
                    >
                      {siteConfig.email}
                    </a>
                  ) : (
                    <p className="text-sm italic text-ink-faint">{PLACEHOLDER_TEXT}</p>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Horarios</p>
                  {siteConfig.schedules.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {siteConfig.schedules.map((item) => (
                        <li key={item.label} className="text-sm text-ink-soft">
                          <span className="font-semibold text-ink">{item.label}:</span> {item.hours}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-ink-faint">{PLACEHOLDER_TEXT}</p>
                  )}
                </div>
              </li>

              {hasSocial && (
                <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">Síguenos</p>
                    <div className="mt-1.5 flex gap-2">
                      {siteConfig.social.facebook && (
                        <a
                          href={siteConfig.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook de Jardín Infantil Arcoíris Florencia"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink transition-colors hover:bg-coral-100 hover:text-coral-600"
                        >
                          <Facebook className="h-5 w-5" aria-hidden="true" />
                        </a>
                      )}
                      {siteConfig.social.instagram && (
                        <a
                          href={siteConfig.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram de Jardín Infantil Arcoíris Florencia"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-ink transition-colors hover:bg-coral-100 hover:text-coral-600"
                        >
                          <Instagram className="h-5 w-5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )}
            </ul>

            <LocationMap />
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
