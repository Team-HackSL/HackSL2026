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
import { BackToTop } from "@/components/BackToTop";

export default async function Home() {
  const hackathons = await getHackathons();

  return (
    <div className="min-h-screen bg-white text-[var(--foreground)]">
      <Header />
      <main id="main">
        <Hero />
        <PhotoCarousel />
        <AboutUs />
        <Mission />
        <HackathonsSection hackathons={hackathons} />
        <StartHackathon />
        <Blog />
        <Team />
        <Partners />
        <HackSLFellows />
        <Community />
        <ContactUs />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
