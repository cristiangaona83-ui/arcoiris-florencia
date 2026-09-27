import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Home } from "@/pages/Home";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { InstitutionalContentProvider } from "@/contexts/InstitutionalContentContext";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

// Cargado solo cuando se visita /admin: el sitio público nunca descarga el
// código del panel (formularios, subida de imágenes, etc.), manteniéndolo
// liviano y rápido.
const AdminPage = lazy(() => import("@/pages/AdminPage"));

function App() {
  const rootRef = useRevealOnScroll<HTMLDivElement>();

  // Sitio estático sin librería de rutas: /admin es la única ruta aparte
  // de la página principal, así que basta con revisar el path actual.
  if (window.location.pathname.startsWith("/admin")) {
    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-cream-soft text-ink-soft">
            Cargando…
          </div>
        }
      >
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <SiteSettingsProvider>
      <InstitutionalContentProvider>
        <div ref={rootRef}>
          <a
            href="#inicio"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-ink focus:shadow-soft"
          >
            Saltar al contenido principal
          </a>
          <Header />
          <main>
            <Home />
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </InstitutionalContentProvider>
    </SiteSettingsProvider>
  );
}

export default App;
