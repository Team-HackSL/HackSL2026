import { getHackathons } from "@/lib/hackathons";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { AboutUs } from "@/components/AboutUs";
import { Mission } from "@/components/Mission";
import { HackathonsSection } from "@/components/HackathonsSection";
import { StartHackathon } from "@/components/StartHackathon";
import { Blog } from "@/components/Blog";
import { Team } from "@/components/Team";
import { Partners } from "@/components/Partners";
import { HackSLFellows } from "@/components/HackSLFellows";
import { Community } from "@/components/Community";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const hackathons = await getHackathons();

  return (
    <div className="min-h-screen bg-white text-[var(--foreground)]">
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero />
        {/* 2. Hackathons */}
        <HackathonsSection hackathons={hackathons} />
        {/* 3. Organize a hackathon */}
        <StartHackathon />
        {/* 4. Partners */}
        <Partners />
        {/* 5. Fellows */}
        <HackSLFellows />
        {/* 6. About us */}
        <AboutUs />
        {/* 7. Mission */}
        <Mission />
        {/* 8. Blog */}
        <Blog />
        {/* 9. Community */}
        <Community />
        {/* 10. Our team */}
        <Team />
        {/* 11. Contact us */}
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
