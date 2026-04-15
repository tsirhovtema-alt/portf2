'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';

const STACK = [
  { name: 'React',       icon: '/icons/react.svg'       },
  { name: 'Next.js',     icon: '/icons/nextjs.svg'      },
  { name: 'Vue',         icon: '/icons/vue.svg'         },
  { name: 'NestJS',      icon: '/icons/nestjs.svg'      },
  { name: 'Node.js',     icon: '/icons/node_js.svg'     },
  { name: 'JavaScript',  icon: '/icons/js.svg'          },
  { name: 'TailwindCSS', icon: '/icons/tailwind.svg'    },
  { name: 'HTML5',       icon: '/icons/html_5.svg'      },
  { name: 'CSS3',        icon: '/icons/css_3.svg'       },
  { name: 'Python',      icon: '/icons/python.svg'      },
  { name: 'Docker',      icon: '/icons/docker.svg'      },
  { name: 'Kubernetes',  icon: '/icons/kubernetes.svg'  },
  { name: 'Prisma',      icon: '/icons/prisma.svg'      },
  { name: 'Vite',        icon: '/icons/vitejs.svg'      },
  { name: 'Flutter',     icon: '/icons/flutter.svg'     },
  { name: 'Figma',       icon: '/icons/figma.svg'       },
  { name: 'VS Code',     icon: '/icons/vs_code.svg'     },
  { name: 'npm',         icon: '/icons/npm.svg'         },
  { name: 'Android',     icon: '/icons/android.svg'     },
];

const STATS = [
  { value: 50, suffix: '+', label: 'проектов'    },
  { value: 4,  suffix: '',  label: 'года опыта'  },
  { value: 35, suffix: '+', label: 'клиентов'    },
  { value: 98, suffix: '%', label: 'довольных'   },
];

const VALUES = [
  { icon: '⚡', title: 'Скорость',    desc: 'Запускаем проекты точно в срок. Без задержек и лишних согласований.' },
  { icon: '🔒', title: 'Надёжность',  desc: 'Код, который живёт годами. Современный стек и лучшие практики.' },
  { icon: '🤝', title: 'Прозрачность', desc: 'Регулярные статусы, понятные отчёты, честные сроки и цены.' },
  { icon: '📈', title: 'Результат',   desc: 'Фокус на бизнес-метриках, а не на процессе ради процесса.' },
];

/* Easing helper for counter animation */
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function About() {
  const secRef   = useRef<HTMLElement>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stackRef = useRef<HTMLDivElement>(null);
  const valRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Counters via IntersectionObserver (reliable on all mobile browsers) ── */
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterObs.unobserve(entry.target);
        const idx  = Number((entry.target as HTMLElement).dataset.idx);
        const stat = STATS[idx];
        const el   = statRefs.current[idx];
        if (!el) return;
        const dur    = 1600;
        const start  = performance.now();
        const tick   = (now: number) => {
          const t   = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(easeOut(t) * stat.value) + stat.suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.05 });

    statRefs.current.forEach(el => { if (el?.parentElement) counterObs.observe(el.parentElement); });

    /* ── GSAP for other reveal animations (non-critical) ── */
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.07, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } },
        );
      });
      if (stackRef.current) {
        gsap.fromTo(Array.from(stackRef.current.children),
          { opacity: 0, scale: 0.75, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: stackRef.current, start: 'top 90%' } },
        );
      }
      if (valRef.current) {
        gsap.fromTo(Array.from(valRef.current.children),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: valRef.current, start: 'top 90%' } },
        );
      }
    }, secRef);

    return () => { counterObs.disconnect(); ctx.revert(); };
  }, []);

  return (
    <section id="about" ref={secRef} className="section" style={{ background: '#0a0a0a' }}>
      <span className="sec-num" style={{ top: '-1rem', right: '2rem' }}>03</span>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col gap-16 sm:gap-20">

        {/* ── Heading ─────────────────────────────────── */}
        <div data-reveal className="flex flex-col gap-4 max-w-2xl">
          <span className="label">03 — О нас</span>
          <h2 className="display-sm text-white">Мы — WEB TERA</h2>
          <p className="text-base sm:text-lg leading-relaxed mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Веб-студия полного цикла из Москвы. Создаём цифровые продукты, которые работают,
            выглядят безупречно и приносят реальный результат бизнесу.
          </p>
        </div>

        {/* ── Stats row ───────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              data-idx={i}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '1.75rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: 6,
                transition: 'border-color .3s, background .3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)';
                (e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,0.04)';
              }}
            >
              <span
                ref={el => { statRefs.current[i] = el; }}
                data-idx={i}
                style={{ fontSize: 'clamp(2.4rem,6vw,3.5rem)', fontWeight: 900, lineHeight: 1, color: '#fff', letterSpacing: '-0.03em' }}
              >
                0{s.suffix}
              </span>
              <span className="label" style={{ letterSpacing: '0.12em', fontSize: '0.62rem' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Values / Principles ─────────────────────── */}
        <div>
          <p data-reveal className="label mb-7" style={{ letterSpacing: '0.18em' }}>Наши принципы</p>
          <div ref={valRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(v => (
              <div
                key={v.title}
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'border-color .3s, transform .3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLDivElement).style.transform   = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.transform   = '';
                }}
              >
                <div style={{
                  width: 44, height: 44, flexShrink: 0, borderRadius: 12,
                  background: 'rgba(255,255,255,0.07)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                }}>
                  {v.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{v.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech stack ──────────────────────────────── */}
        <div>
          <p data-reveal className="label mb-7 text-center" style={{ letterSpacing: '0.2em' }}>
            Технологический стек
          </p>
          <div
            ref={stackRef}
            className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3"
          >
            {STACK.map(t => (
              <div
                key={t.name}
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '0.9rem 0.5rem',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  transition: 'transform .25s, border-color .25s, background .25s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform    = 'translateY(-5px) scale(1.06)';
                  (e.currentTarget as HTMLDivElement).style.borderColor  = 'rgba(255,255,255,0.18)';
                  (e.currentTarget as HTMLDivElement).style.background   = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform    = '';
                  (e.currentTarget as HTMLDivElement).style.borderColor  = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.background   = 'rgba(255,255,255,0.035)';
                }}
              >
                <Image src={t.icon} alt={t.name} width={30} height={30}
                  className="w-7 h-7 object-contain"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.1))' }} />
                <span style={{ fontSize: '0.6rem', fontWeight: 500, color: 'rgba(255,255,255,0.42)',
                  textAlign: 'center', lineHeight: 1.2 }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Marquee ─────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '1.25rem 0', overflow: 'hidden',
        }}>
          <div className="flex overflow-hidden">
            <div className="marquee" style={{ gap: '3.5rem' }}>
              {Array(3).fill(['Веб-разработка', '·', 'UI/UX Дизайн', '·', 'E-Commerce',
                '·', 'SEO', '·', 'Брендинг', '·', 'Motion Design', '·']).flat()
                .map((t, i) => (
                  <span key={i}
                    className="text-xs font-medium tracking-widest uppercase"
                    style={{ color: t === '·' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
