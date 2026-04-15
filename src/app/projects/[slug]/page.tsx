import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKS } from "@/lib/works";

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = WORKS.find((w) => w.slug === slug);
  if (!p) return {};
  return { title: `${p.title} — WEB TERA`, description: p.desc };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = WORKS.find((w) => w.slug === slug);
  if (!p) notFound();

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] px-6 py-16 text-white">
      <Link
        href="/#work"
        className="text-sm text-white/45 transition-colors hover:text-white/80"
      >
        ← Назад к работам
      </Link>
      <h1 className="mt-10 text-4xl font-black tracking-[-0.04em] md:text-5xl">{p.title}</h1>
      <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/40">{p.category}</p>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65">{p.desc}</p>
      <p className="mt-6 font-mono text-xs text-white/30">{p.year}</p>
    </main>
  );
}
