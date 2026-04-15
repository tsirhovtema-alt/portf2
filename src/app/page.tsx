import About from "@/components/About";
import Contact from "@/components/Contact";
import HeroText from "@/components/HeroText";
import Navigation from "@/components/Navigation";
import Services from "@/components/Services";
import Work from "@/components/Work";

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroText />
      <Services />
      <Work />
      <About />
      <Contact />
    </main>
  );
}
