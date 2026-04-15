import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

/* ─── Static project data ────────────────────────────────── */
interface ProjectDetail {
  slug: string; title: string; category: string; year: string;
  accent: string;
  overview: string;
  challenge: string;
  solution: string;
  result: string;
  tags: string[];
  techIcons: { src: string; label: string }[];
  stats: { value: string; label: string }[];
}

const TAG_ICONS: Record<string, string> = {
  'Next.js':    '/icons/nextjs.svg',
  'React':      '/icons/react.svg',
  'Node.js':    '/icons/node_js.svg',
  'NestJS':     '/icons/nestjs.svg',
  'Python':     '/icons/python.svg',
  'TailwindCSS':'/icons/tailwind.svg',
  'Docker':     '/icons/docker.svg',
  'Prisma':     '/icons/prisma.svg',
  'Vite':       '/icons/vitejs.svg',
  'Figma':      '/icons/figma.svg',
  'Vue':        '/icons/vue.svg',
  'TypeScript': '/icons/js.svg',
  'Kubernetes': '/icons/kubernetes.svg',
};

const PROJECTS: Record<string, ProjectDetail> = {
  neobank: {
    slug: 'neobank', title: 'NeoBank Dashboard', category: 'FinTech / SaaS',
    year: '2024', accent: '#a78bfa',
    overview: 'Корпоративный финансовый дашборд для управления активами, транзакциями и аналитикой реального времени. Система обрабатывает данные более 50 000 пользователей.',
    challenge: 'Клиент нуждался в замене устаревшей ERP-системы на современный, масштабируемый продукт, способный обрабатывать тысячи транзакций в секунду с мгновенным обновлением данных.',
    solution: 'Разработали микросервисную архитектуру на NestJS + Next.js. Использовали WebSocket для real-time обновлений и Prisma ORM для типобезопасной работы с PostgreSQL. CI/CD через GitHub Actions + Docker.',
    result: 'Время загрузки сократилось с 8с до 1.2с. Количество ошибок снизилось на 94%. Команда разработки стала в 3 раза быстрее выпускать обновления.',
    tags: ['Next.js', 'NestJS', 'Prisma', 'Docker', 'TypeScript'],
    techIcons: [
      { src: '/icons/nextjs.svg',  label: 'Next.js'   },
      { src: '/icons/nestjs.svg',  label: 'NestJS'    },
      { src: '/icons/prisma.svg',  label: 'Prisma'    },
      { src: '/icons/docker.svg',  label: 'Docker'    },
    ],
    stats: [{ value: '50к+', label: 'Пользователей' }, { value: '1.2с', label: 'Загрузка' }, { value: '94%', label: 'Меньше ошибок' }, { value: '3×', label: 'Быстрее деплой' }],
  },
  'ai-content': {
    slug: 'ai-content', title: 'AI Content Studio', category: 'AI / Platform',
    year: '2024', accent: '#34d399',
    overview: 'SaaS-платформа для генерации, редактирования и публикации контента на основе GPT-4. Включает умный редактор, планировщик публикаций и аналитику эффективности.',
    challenge: 'Команда маркетологов тратила до 40 часов в неделю на создание контента. Требовалась платформа, которая ускорит процесс в 10 раз без потери качества.',
    solution: 'Интегрировали GPT-4 API с кастомными промптами для разных типов контента. Разработали rich-text редактор на основе Tiptap, систему темплейтов и AI-суммаризатор обратной связи.',
    result: 'Команда из 5 человек создаёт теперь контент за 4 часа вместо 40. ROI платформы окупился за 2 месяца после запуска.',
    tags: ['React', 'Python', 'NestJS', 'Docker', 'Vite'],
    techIcons: [
      { src: '/icons/react.svg',   label: 'React'   },
      { src: '/icons/python.svg',  label: 'Python'  },
      { src: '/icons/nestjs.svg',  label: 'NestJS'  },
      { src: '/icons/vitejs.svg',  label: 'Vite'    },
    ],
    stats: [{ value: '10×', label: 'Быстрее создание' }, { value: '2мес', label: 'Окупаемость' }, { value: '40ч→4ч', label: 'Время на контент' }, { value: '98%', label: 'Uptime' }],
  },
  restaurant: {
    slug: 'restaurant', title: 'Restaurant Chain', category: 'Corporate / Website',
    year: '2024', accent: '#fbbf24',
    overview: 'Мультиязычный корпоративный сайт сети из 12 ресторанов с онлайн-бронированием столиков, CMS для управления меню и системой лояльности.',
    challenge: 'Устаревший сайт давал менее 3% конверсии из посетителей в онлайн-бронирования. Нужна была современная платформа с возможностью самостоятельного обновления контента.',
    solution: 'Разработали на Next.js с headless CMS Sanity. Внедрили систему онлайн-броней с синхронизацией с ресторанной системой, мультиязычный интерфейс (RU/EN) и программу лояльности.',
    result: 'Конверсия в онлайн-брони выросла с 3% до 18%. Органический трафик вырос в 4 раза за 3 месяца благодаря оптимизации Core Web Vitals.',
    tags: ['Next.js', 'TailwindCSS', 'Docker', 'Figma'],
    techIcons: [
      { src: '/icons/nextjs.svg',  label: 'Next.js'    },
      { src: '/icons/tailwind.svg', label: 'TailwindCSS' },
      { src: '/icons/docker.svg',  label: 'Docker'     },
      { src: '/icons/figma.svg',   label: 'Figma'      },
    ],
    stats: [{ value: '18%', label: 'Конверсия броней' }, { value: '4×', label: 'Рост трафика' }, { value: '100', label: 'PageSpeed' }, { value: '12', label: 'Ресторанов' }],
  },
  crypto: {
    slug: 'crypto', title: 'Crypto Tracker', category: 'Web3 / Finance',
    year: '2023', accent: '#38bdf8',
    overview: 'Веб-приложение для агрегации и мониторинга криптовалютных портфелей с поддержкой 50+ бирж, live-ценами через WebSocket и умными алертами.',
    challenge: 'Пользователи держали активы на множестве бирж и тратили часы на ручной подсчёт портфеля. Нужен единый дашборд с актуальными данными и уведомлениями.',
    solution: 'Интегрировали API 50+ бирж через единый адаптер. Разработали собственный WebSocket-прокси для real-time цен, систему алертов через Telegram Bot и тепловые карты производительности.',
    result: 'Приложение собрало 8 000 пользователей за первые 2 месяца. Средняя сессия — 12 минут. Рейтинг в Product Hunt: #3 за неделю запуска.',
    tags: ['React', 'Node.js', 'Vite', 'Docker', 'Python'],
    techIcons: [
      { src: '/icons/react.svg',   label: 'React'   },
      { src: '/icons/node_js.svg', label: 'Node.js' },
      { src: '/icons/vitejs.svg',  label: 'Vite'    },
      { src: '/icons/python.svg',  label: 'Python'  },
    ],
    stats: [{ value: '8к+', label: 'Пользователей' }, { value: '50+', label: 'Бирж' }, { value: '12мин', label: 'Сессия' }, { value: '#3', label: 'Product Hunt' }],
  },
  fashion: {
    slug: 'fashion', title: 'Fashion E-Commerce', category: 'E-Commerce / Retail',
    year: '2023', accent: '#f472b6',
    overview: 'Интернет-магазин премиум-класса с 3D-примеркой одежды, AR-функцией через смартфон, умными рекомендациями и интеграцией с 5 платёжными системами.',
    challenge: 'Клиент — бутик с высоким процентом возвратов (32%) из-за несоответствия ожиданиям. Задача: снизить возвраты и увеличить средний чек через персонализацию.',
    solution: 'Разработали 3D-визуализатор одежды на WebGL, систему рекомендаций на ML-модели и интеграцию с Robokassa, ЮKassa, Stripe, PayPal и Apple Pay.',
    result: 'Процент возвратов снизился с 32% до 9%. Средний чек вырос на 67%. Конверсия из каталога в корзину — 8.4% (отраслевой стандарт — 2%).',
    tags: ['Next.js', 'NestJS', 'Prisma', 'Vue', 'Docker'],
    techIcons: [
      { src: '/icons/nextjs.svg',  label: 'Next.js' },
      { src: '/icons/nestjs.svg',  label: 'NestJS'  },
      { src: '/icons/prisma.svg',  label: 'Prisma'  },
      { src: '/icons/vue.svg',     label: 'Vue'     },
    ],
    stats: [{ value: '9%', label: 'Возвраты' }, { value: '+67%', label: 'Средний чек' }, { value: '8.4%', label: 'Конверсия' }, { value: '5', label: 'Платёжных систем' }],
  },
};

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS[slug];
  if (!p) return {};
  return { title: `${p.title} — WEB TERA`, description: p.overview };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PROJECTS[slug];
  if (!p) notFound();

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{
        minHeight: '55vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '6rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
        background: `radial-gradient(ellipse at 20% 60%, ${p.accent}18 0%, transparent 60%), #0a0a0a`,
      }}>
        {/* Back */}
        <Link href="/#work" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          position: 'absolute', top: '2rem', left: '2rem',
          color: 'rgba(255,255,255,0.4)', fontSize: 13,
          textDecoration: 'none', transition: 'color .2s',
        }}
          onMouseEnter={undefined}
        >
          ← Назад к проектам
        </Link>

        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%',
              background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: p.accent }}>
              {p.category}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginLeft: 8 }}>{p.year}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem,7vw,5rem)', fontWeight: 900,
            lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 24 }}>
            {p.title}
          </h1>

          <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.55)',
            maxWidth: 600, lineHeight: 1.7 }}>
            {p.overview}
          </p>
        </div>

        {/* Accent line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, ${p.accent}40, transparent 60%)` }} />
      </section>

      {/* ── Stats ────────────────────────────────────── */}
      <section style={{ padding: '3rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {p.stats.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 14, padding: '1.25rem 1rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900,
                color: p.accent, letterSpacing: '-0.03em', marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content sections ─────────────────────────── */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {[
            { title: 'Задача', text: p.challenge },
            { title: 'Решение', text: p.solution  },
            { title: 'Результат', text: p.result  },
          ].map(s => (
            <div key={s.title} className="project-content-grid">
              <div>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: p.accent }}>
                  {s.title}
                </span>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
                {s.text}
              </p>
            </div>
          ))}

          {/* Tech stack */}
          <div className="project-content-grid">
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: p.accent }}>
              Стек
            </span>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {p.techIcons.map(t => (
                <div key={t.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '8px 14px',
                }}>
                  <Image src={t.src} alt={t.label} width={20} height={20}
                    style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{t.label}</span>
                </div>
              ))}
              {p.tags.filter(t => !p.techIcons.find(ti => ti.label === t)).map(t => {
                const icon = TAG_ICONS[t];
                return (
                  <div key={t} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '8px 14px',
                  }}>
                    {icon && <Image src={icon} alt={t} width={20} height={20}
                      style={{ width: 20, height: 20, objectFit: 'contain' }} />}
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{
        padding: '4rem 2rem', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: `radial-gradient(ellipse at 50% 0%, ${p.accent}10 0%, transparent 60%)`,
      }}>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900,
          letterSpacing: '-0.03em', marginBottom: 16 }}>
          Хотите похожий проект?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32, fontSize: 15 }}>
          Обсудим вашу задачу и предложим решение
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 10,
            background: '#fff', color: '#0a0a0a', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>
            Обсудить проект →
          </Link>
          <Link href="/#work" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 10,
            background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14,
            border: '1px solid rgba(255,255,255,0.15)',
            textDecoration: 'none',
          }}>
            ← Все проекты
          </Link>
        </div>
      </section>

    </main>
  );
}
