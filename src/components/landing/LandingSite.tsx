"use client";

import { useCallback, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import { TransformSection } from "./Transform";
import Audience from "./Audience";
import { DownloadSection, StickyDownloadBar } from "./Download";
import { HowItWorks, TemplatesGallery, Privacy, Faq, FinalCta, Footer } from "./Landing";
import { scrollToDownload, smartDownload } from "@/lib/landing/download";
import { fraunces, instrumentSerif, jetbrainsMono, spaceGrotesk } from "./fonts";

export default function LandingSite() {
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const toast = useCallback((m: string) => {
    setGlobalToast(m);
    setTimeout(() => setGlobalToast(null), 3400);
  }, []);

  const handleDownload = useCallback(() => {
    const r = smartDownload();
    if (r === "section") toast("Aquí abajo está la descarga: beta en TestFlight, solo para iPhone. 👇");
  }, [toast]);

  const handleUseTemplate = useCallback(() => {
    scrollToDownload();
    toast("Los estilos viven dentro de la app — descárgala gratis. 👇");
  }, [toast]);

  return (
    <div className={`landing ${fraunces.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-paper text-ink font-grotesk`}>
      <Navbar onDownload={handleDownload} />
      <main>
        <Hero onPrimary={handleDownload} />
        <TransformSection />
        <Audience onStart={handleDownload} />
        <HowItWorks />
        <DownloadSection />
        <TemplatesGallery onUse={handleUseTemplate} />
        <Privacy />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyDownloadBar />
      {globalToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[13.5px] font-medium text-paper shadow-2xl max-w-[90vw] text-center">
          {globalToast}
        </div>
      )}
    </div>
  );
}
