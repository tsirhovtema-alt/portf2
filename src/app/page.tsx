import HeroText from "@/components/HeroText";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="relative min-h-[100dvh] w-full flex-1 min-h-0">
        <HeroText />
      </div>
    </main>
  );
}
