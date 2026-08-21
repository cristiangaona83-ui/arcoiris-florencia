import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { MobileMenu } from "@/components/MobileMenu";
import { navLinks } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionIds = navLinks.map((link) => link.href.replace("#", ""));
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-cream/90 shadow-card backdrop-blur-md"
          : "bg-cream/60 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="flex min-w-0 items-center gap-2 rounded-xl focus-visible:outline-offset-4 sm:gap-3"
        >
          <Logo className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
          <span className="truncate font-display text-base font-bold leading-tight text-ink sm:text-xl">
            {siteConfig.shortName}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-bold font-display transition-colors",
                  isActive
                    ? "bg-coral-50 text-coral-600"
                    : "text-ink-soft hover:bg-white hover:text-coral-500"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href="#contacto" variant="primary">
              Contáctanos
            </Button>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-card lg:hidden"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeId={activeId} />
    </header>
  );
}
