import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Home } from "@/pages/Home";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

function App() {
  const rootRef = useRevealOnScroll<HTMLDivElement>();

  return (
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
  );
}

export default App;
