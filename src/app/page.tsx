import HeroText from "@/components/HeroText";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#0a0a0a]">
      <div className="relative min-h-[100dvh] w-full flex-1 min-h-0">
        <HeroText />
      </div>
      <WorkSection />
    </main>
  );
}
