import { Hero } from "@/components/Hero";
import { WelcomeSection } from "@/sections/WelcomeSection";
import { HistorySection } from "@/sections/HistorySection";
import { WhyUsSection } from "@/sections/WhyUsSection";
import { ProjectSection } from "@/sections/ProjectSection";
import { PedagogySection } from "@/sections/PedagogySection";
import { LevelsSection } from "@/sections/LevelsSection";
import { TeamSection } from "@/sections/TeamSection";
import { GallerySection } from "@/sections/GallerySection";
import { NewsSection } from "@/sections/NewsSection";
import { DocumentsSection } from "@/sections/DocumentsSection";
import { AdmissionSection } from "@/sections/AdmissionSection";
import { ContactSection } from "@/sections/ContactSection";

export function Home() {
  return (
    <>
      <Hero />
      <div id="nuestro-jardin">
        <WelcomeSection />
        <HistorySection />
        <WhyUsSection />
      </div>
      <ProjectSection />
      <PedagogySection />
      <LevelsSection />
      <TeamSection />
      <GallerySection />
      <NewsSection />
      <DocumentsSection />
      <AdmissionSection />
      <ContactSection />
    </>
  );
}
