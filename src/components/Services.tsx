'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';
import Magnetic from './Magnetic';
import RevealText from './RevealText';
import LiquidBtn from './LiquidBtn';

const ITEMS = [
  {
    num: '01', title: 'Веб-разработка',
    desc: 'Создаём быстрые, масштабируемые сайты и веб-приложения с фокусом на производительность и UX.',
    techIcons: [
      { src: '/icons/react.svg',    name: 'React'   },
      { src: '/icons/nextjs.svg',   name: 'Next.js' },
      { src: '/icons/node_js.svg',  name: 'Node.js' },
      { src: '/icons/tailwind.svg', name: 'Tailwind'},
      { src: '/icons/vitejs.svg',   name: 'Vite'    },
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
        <rect x="4" y="10" width="40" height="28" rx="3" stroke="white" strokeWidth="2"/>
        <path d="M16 22l-6 4 6 4M32 22l6 4-6 4M22 30l4-12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '02', title: 'UI/UX Дизайн',
    desc: 'Проектируем интерфейсы, которые конвертируют. Прототипирование, дизайн-системы, motion.',
    techIcons: [
      { src: '/icons/figma.svg',    name: 'Figma'   },
      { src: '/icons/react.svg',    name: 'React'   },
      { src: '/icons/vue.svg',      name: 'Vue'     },
      { src: '/icons/tailwind.svg', name: 'Tailwind'},
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
        <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="2"/>
        <path d="M24 6v36M6 24h36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="24" cy="24" rx="9" ry="18" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    num: '03', title: 'E-Commerce',
    desc: 'Интернет-магазины с высокой конверсией. Интеграция платёжных систем, CMS, аналитика.',
    techIcons: [
      { src: '/icons/nextjs.svg',  name: 'Next.js' },
      { src: '/icons/nestjs.svg',  name: 'NestJS'  },
      { src: '/icons/prisma.svg',  name: 'Prisma'  },
      { src: '/icons/docker.svg',  name: 'Docker'  },
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
        <path d="M8 12h4l6 18h16M18 30l-2-12h20l-3 12H18z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="38" r="2" stroke="white" strokeWidth="2"/>
        <circle cx="34" cy="38" r="2" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    num: '04', title: 'SEO & Продвижение',
    desc: 'Техническое SEO, Core Web Vitals, настройка аналитики. Ваш сайт найдёт Google.',
    techIcons: [
      { src: '/icons/python.svg',     name: 'Python'  },
      { src: '/icons/kubernetes.svg', name: 'K8s'     },
      { src: '/icons/docker.svg',     name: 'Docker'  },
      { src: '/icons/npm.svg',        name: 'npm'     },
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
        <polyline points="8,36 16,24 24,28 32,16 40,20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="10" r="6" stroke="white" strokeWidth="2"/>
        <path d="M42 14l4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function Card3D({ item }: { item: typeof ITEMS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 20;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 20;
      gsap.to(card, { rotateX: -y, rotateY: x, transformPerspective: 800, duration: 0.35, ease: 'power2.out' });
      if (glowRef.current) {
        const gx = ((e.clientX - r.left) / r.width)  * 100;
        const gy = ((e.clientY - r.top)  / r.height) * 100;
        glowRef.current.style.background =
          `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07) 0%, transparent 60%)`;
      }
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      if (glowRef.current) glowRef.current.style.background = 'transparent';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="card service-card p-7 cursor-none group"
      style={{ transformStyle: 'preserve-3d' }}
      data-cursor="pointer"
    >
      <div ref={glowRef} className="absolute inset-0 pointer-events-none rounded-sm transition-all duration-200" />

      <div className="service-card-inner relative z-10 flex flex-col gap-5 h-full">
        <div className="flex items-start justify-between">
          <span className="label">{item.num}</span>
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 float">
            {item.icon}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>

        <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
          {item.desc}
        </p>

        <div className="flex flex-col gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="label" style={{ letterSpacing: '0.12em' }}>Стек</span>
          <div className="flex items-center gap-3 flex-wrap">
            {item.techIcons.map(t => (
              <div key={t.name} className="flex items-center gap-1.5 group/icon">
                <Image src={t.src} alt={t.name} width={20} height={20}
                  className="w-5 h-5 object-contain transition-transform duration-200 group-hover/icon:scale-125" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-4 bottom-2 font-black select-none pointer-events-none"
        style={{ fontSize: '6rem', lineHeight: 1, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.05em' }}>
        {item.num}
      </div>
    </div>
  );
}

export default function Services() {
  const secRef  = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(Array.from(gridRef.current.children), { opacity: 0, y: 60, scale: 0.96 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
        });
      }
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={secRef} className="section" style={{ background: '#0a0a0a' }}>
      <span className="sec-num" style={{ top: '-1rem', right: '2rem' }}>01</span>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="mb-16 flex flex-col gap-4">
          <RevealText><span className="label">01 — Услуги</span></RevealText>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <RevealText delay={0.08}>
              <h2 className="display-sm text-white">
                Что мы<br/>
                <span style={{
                  background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>делаем</span>
              </h2>
            </RevealText>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Полный цикл создания цифровых продуктов — от идеи до запуска и поддержки.
            </p>
          </div>
          <div className="hr max-w-full" />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ITEMS.map(item => <Card3D key={item.num} item={item} />)}
        </div>

        <div className="mt-15 flex items-center justify-between">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Нужно что-то другое?</p>
          <Magnetic>
            <LiquidBtn
              className="btn-outline text-sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              data-cursor="pointer"
            >
              Обсудим проект →
            </LiquidBtn>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
