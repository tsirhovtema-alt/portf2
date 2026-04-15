'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const GeneratingText = dynamic(() => import('./GeneratingText'), { ssr: false });

const SKILLS = [
  { name:'React / Next.js', level:95, color:'#61dafb' },
  { name:'TypeScript',      level:90, color:'#3178c6' },
  { name:'Node.js',         level:88, color:'#68a063' },
  { name:'CSS / Tailwind',  level:93, color:'#38bdf8' },
  { name:'PostgreSQL',      level:82, color:'#336791' },
  { name:'Docker / CI/CD',  level:78, color:'#0db7ed' },
  { name:'GraphQL',         level:85, color:'#e535ab' },
  { name:'AWS / Vercel',    level:75, color:'#ff9900' },
];

const SERVICES = [
  { icon:'🎨', title:'UI/UX Дизайн',         desc:'Пиксель-перфект интерфейсы, motion design, интуитивные сценарии.', color:'#a78bfa' },
  { icon:'⚙️', title:'Backend разработка',    desc:'Масштабируемые API, микросервисы, базы данных, авторизация.', color:'#38bdf8' },
  { icon:'📱', title:'Адаптивный дизайн',     desc:'Mobile-first подход, все устройства, любые размеры экранов.', color:'#fbbf24' },
  { icon:'🚀', title:'Производительность',    desc:'Оптимизация бандла, SSR/SSG, Edge функции, Core Web Vitals.', color:'#34d399' },
  { icon:'🔐', title:'Безопасность',          desc:'Auth, OAuth, JWT, защита от XSS/CSRF, HTTPS everywhere.', color:'#f472b6' },
  { icon:'🧪', title:'Тестирование',          desc:'Unit / Integration / E2E тесты, CI/CD пайплайны.', color:'#fb923c' },
];

export default function Skills() {
  const secRef      = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const barsRef     = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current, { opacity:0, y:50 },
        { opacity:1, y:0, duration:0.9, ease:'power3.out',
          scrollTrigger:{ trigger:headRef.current, start:'top 80%' } });

      if (barsRef.current) {
        gsap.fromTo(Array.from(barsRef.current.querySelectorAll('.skill-item')), { opacity:0, x:-24 },
          { opacity:1, x:0, duration:0.6, stagger:0.09, ease:'power3.out',
            scrollTrigger:{ trigger:barsRef.current, start:'top 78%' } });

        barsRef.current.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach(bar => {
          gsap.fromTo(bar, { width:'0%' },
            { width:`${bar.dataset.level}%`, duration:1.4, ease:'power2.out',
              scrollTrigger:{ trigger:bar, start:'top 90%' } });
        });
      }

      if (servicesRef.current) {
        gsap.fromTo(Array.from(servicesRef.current.children), { opacity:0, y:40, scale:0.97 },
          { opacity:1, y:0, scale:1, duration:0.6, stagger:0.09, ease:'power3.out',
            scrollTrigger:{ trigger:servicesRef.current, start:'top 78%' } });
      }
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={secRef} className="section" style={{ background:'#0a0b12' }}>
      {/* Mesh blob */}
      <div className="mesh-blob" style={{
        width:'450px', height:'450px', top:'20%', right:'-8%',
        background:'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 65%)',
      }}/>

      <span className="section-index" style={{ top:'-2rem', right:'2rem' }}>03</span>

      <div className="max-w-7xl mx-auto w-full px-8 relative z-10">
        {/* Heading */}
        <div ref={headRef} className="mb-16 space-y-3">
          <span className="label">03 — Навыки</span>
          <div className="flex flex-wrap items-end gap-6">
            <h2 className="display-lg text-white">
              Моя<br/><span className="gradient-text">экспертиза</span>
            </h2>
            {/* GeneratingText индикатор */}
            <div className="mb-2 bento-card px-4 py-2 inline-flex items-center gap-3 self-end">
              <span className="label">статус:</span>
              <GeneratingText />
            </div>
          </div>
          <div className="line-divider max-w-md" />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 mb-16">
          {/* Skill bars */}
          <div ref={barsRef} className="space-y-5">
            <h3 className="label mb-8">Технический уровень</h3>
            {SKILLS.map(s => (
              <div key={s.name} className="skill-item">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">{s.name}</span>
                  <span className="font-mono text-xs" style={{ color: s.color }}>{s.level}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.04)' }}>
                  <div className="skill-bar-fill h-full rounded-full"
                    data-level={s.level}
                    style={{
                      width:'0%',
                      background:`linear-gradient(90deg, ${s.color}60, ${s.color})`,
                    }} />
                </div>
              </div>
            ))}
          </div>

          {/* Services bento */}
          <div ref={servicesRef} className="grid grid-cols-2 gap-3">
            {SERVICES.map(s => (
              <div key={s.title}
                className="bento-card p-5 group cursor-none transition-all duration-300 hover:border-white/15"
                data-cursor="pointer">
                <div className="text-2xl mb-3">{s.icon}</div>
                <h4 className="font-semibold text-white text-sm mb-1.5">{s.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                <div className="mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background:`linear-gradient(90deg, ${s.color}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Big stats bar */}
        <div className="bento-card gradient-border p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v:'50+',  l:'Проектов',    icon:'🚀' },
              { v:'3+',   l:'Лет опыта',   icon:'📅' },
              { v:'15+',  l:'Технологий',  icon:'⚡' },
              { v:'100%', l:'Вовлечённость', icon:'🎯' },
            ].map((s, i) => (
              <div key={s.l} className="text-center relative">
                {i > 0 && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-px hidden md:block"
                    style={{ background:'rgba(255,255,255,0.07)' }} />
                )}
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-3xl font-black gradient-text">{s.v}</div>
                <div className="text-slate-500 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
