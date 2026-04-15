'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 1,
    title: 'NeoBank App',
    category: 'FinTech / Dashboard',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL'],
    color: '#a78bfa',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'AI Chat Platform',
    category: 'Artificial Intelligence',
    tags: ['React', 'Node.js', 'OpenAI'],
    color: '#38bdf8',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Crypto Tracker',
    category: 'Web3 / DeFi',
    tags: ['React', 'Web3.js', 'Firebase'],
    color: '#fbbf24',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'TaskFlow SaaS',
    category: 'Productivity Tool',
    tags: ['Next.js', 'Supabase', 'Zustand'],
    color: '#34d399',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'E-Commerce Engine',
    category: 'Headless Store',
    tags: ['Next.js', 'Sanity', 'Stripe'],
    color: '#c084fc',
    year: '2022',
    img: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function Projects() {
  const secRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorImgRef = useRef<HTMLImageElement>(null);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      });

      if (listRef.current) {
        gsap.fromTo(Array.from(listRef.current.children), { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 75%' },
        });
      }
    }, secRef);
    return () => ctx.revert();
  }, []);

  // Floating Image Cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    if (hoveredIdx !== null) {
      gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'power3.out' });
    }
  }, [hoveredIdx]);

  return (
    <section id="projects" ref={secRef} className="section" style={{ background: '#08090e' }}>
      <div className="mesh-blob" style={{
        width: '500px', height: '500px', bottom: '0', left: '-10%',
        background: 'radial-gradient(circle, rgba(109,40,217,0.09) 0%, transparent 65%)',
      }} />

      <span className="section-index" style={{ top: '-2rem', right: '2rem' }}>02</span>

      {/* Floating Image Reveal */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[350px] h-[250px] pointer-events-none z-50 overflow-hidden rounded-2xl opacity-0 scale-0 origin-center"
        style={{ transform: 'translate(-50%, -50%)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
      >
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          ref={cursorImgRef}
          src={hoveredIdx !== null ? PROJECTS[hoveredIdx].img : ''}
          alt="Project preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 relative z-10">
        <div ref={headRef} className="mb-14 flex items-end justify-between">
          <div className="space-y-3">
            <span className="label">02 — Проекты</span>
            <h2 className="display-lg text-white">
              Что я<br />
              <span className="gradient-text">создал</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 pb-2">
            <span>Наведи на проект</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Interactive List */}
        <div ref={listRef} className="flex flex-col border-t border-white/10">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-white/10 cursor-none"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              data-cursor="pointer"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-center gap-8 md:gap-12 relative z-10">
                <span className="text-xl font-mono text-slate-600 group-hover:text-white transition-colors duration-300">
                  0{p.id}
                </span>
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold text-slate-300 group-hover:text-white transition-colors duration-300 mb-2">
                    {p.title}
                  </h3>
                  <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                    {p.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 md:mt-0 relative z-10 md:ml-auto">
                <div className="hidden lg:flex gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="tag group-hover:border-white/20 transition-colors duration-300">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-sm text-slate-500 group-hover:text-white transition-colors duration-300">
                  {p.year}
                </span>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                    <path d="M2 12L12 2M12 2H4M12 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="btn-secondary" data-cursor="pointer">
            Смотреть все на GitHub
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 11.5L11.5 1.5M11.5 1.5H4M11.5 1.5v7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
