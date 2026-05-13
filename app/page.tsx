import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { NetworkVisualization } from "@/components/sections/NetworkVisualization";
import { TrendingTopics } from "@/components/sections/TrendingTopics";
import { WhyAwarenessMatterSection } from "@/components/sections/WhyAwarenessMatterSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CallToAction } from "@/components/sections/CallToAction";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-void-950 overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <NetworkVisualization />
          <TrendingTopics />
          <WhyAwarenessMatterSection />
          <StatsSection />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}
