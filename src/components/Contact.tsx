'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';
import Magnetic from './Magnetic';
import LiquidBtn from './LiquidBtn';

const PERKS = [
  { icon: '⚡', title: 'Быстрый старт',   desc: 'Ответим в течение 24 часов после заявки' },
  { icon: '🎯', title: 'Точная оценка',   desc: 'Детальное КП без скрытых платежей'       },
  { icon: '🔄', title: 'Итерации',        desc: 'Правки включены в стоимость проекта'      },
  { icon: '🛡️', title: 'Гарантия',        desc: '3 месяца поддержки после запуска'         },
];

export default function Contact() {
  const secRef  = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm]         = useState({ name: '', phone: '', project: '' });
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 80%' } },
      );
      gsap.fromTo(formRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, delay: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 80%' } },
      );
    }, secRef);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = 'Введите имя';
    if (!form.phone.trim())   e.phone   = 'Введите телефон';
    if (!form.project.trim()) e.project = 'Опишите задачу';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setServerError('Не удалось отправить. Напишите нам напрямую в Telegram.');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = (id: string): React.CSSProperties => ({
    width: '100%', padding: '14px 16px', borderRadius: 10,
    background: errors[id] ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.05)',
    border: `1.5px solid ${errors[id] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
    color: '#fff', fontSize: '0.9rem', outline: 'none',
    transition: 'border-color .2s, background .2s',
  });

  return (
    <section id="contact" ref={secRef} className="section" style={{ background: '#0c0c0c' }}>
      <span className="sec-num" style={{ top: '-1rem', right: '2rem' }}>04</span>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">

        {/* ── Section label + big heading ─────────────── */}
        <div className="text-center mb-14 sm:mb-18">
          <span className="label block mb-5">04 — Контакт</span>
          <h2 className="display text-white leading-none mb-5">
            Начнём<br/>работу?
          </h2>
          <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Оставьте заявку — в течение 24 часов вышлем детальное КП и предложим решение под ваш бюджет.
          </p>
        </div>

        {/* ── Main grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-5 sm:gap-7">

          {/* ── Left column ────────────────────────────── */}
          <div ref={leftRef} className="flex flex-col gap-5">

            {/* Telegram CTA card */}
            <div style={{
              borderRadius: 20, padding: '1.75rem',
              background: 'linear-gradient(135deg, rgba(55,187,254,0.12) 0%, rgba(0,125,187,0.08) 100%)',
              border: '1.5px solid rgba(55,187,254,0.22)',
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: 'rgba(55,187,254,0.18)', border: '1px solid rgba(55,187,254,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">WebTera в Telegram</p>
                  <p className="text-xs" style={{ color: 'rgba(55,187,254,0.7)' }}>@Webterrajab</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Кейсы, советы и новости из мира веб-разработки. Подпишитесь, чтобы быть в курсе.
              </p>
              <Magnetic>
                <a
                  href="https://t.me/+DQFLfk2TVkBhYTIy"
                  target="_blank" rel="noopener noreferrer"
                  data-cursor="pointer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px 20px', borderRadius: 10,
                    background: 'rgba(55,187,254,0.18)', border: '1.5px solid rgba(55,187,254,0.4)',
                    color: 'rgb(55,187,254)', fontSize: '0.82rem', fontWeight: 600,
                    transition: 'background .2s, border-color .2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background   = 'rgba(55,187,254,0.28)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor  = 'rgba(55,187,254,0.7)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background   = 'rgba(55,187,254,0.18)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor  = 'rgba(55,187,254,0.4)';
                  }}
                >
                  <Image src="/icons/telegram.svg" alt="" width={17} height={17} />
                  Подписаться на канал →
                </a>
              </Magnetic>
            </div>

            {/* Perks */}
            <div style={{
              borderRadius: 20, padding: '1.75rem',
              background: 'rgba(255,255,255,0.035)', border: '1.5px solid rgba(255,255,255,0.08)',
            }}>
              <p className="label mb-5" style={{ letterSpacing: '0.15em' }}>Почему WEB TERA</p>
              <div className="flex flex-col gap-4">
                {PERKS.map(p => (
                  <div key={p.title} className="flex items-start gap-3">
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(255,255,255,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                    }}>
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{p.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form card ─────────────────────────────── */}
          <div ref={formRef} style={{
            borderRadius: 20, padding: '2rem',
            background: 'rgba(255,255,255,0.035)', border: '1.5px solid rgba(255,255,255,0.09)',
          }}>
            {sent ? (
              /* Success state */
              <div style={{ minHeight: 460, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>✓</div>
                <h3 className="text-xl font-bold text-white">Заявка принята!</h3>
                <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Свяжемся с вами в течение 24 часов. Также можете написать напрямую.
                </p>
                <a
                  href="https://t.me/+DQFLfk2TVkBhYTIy"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                    borderRadius: 10, background: 'rgba(55,187,254,0.14)',
                    border: '1px solid rgba(55,187,254,0.35)', color: 'rgb(55,187,254)',
                    fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', marginTop: 4,
                  }}
                >
                  <Image src="/icons/telegram.svg" alt="" width={16} height={16} />
                  Написать в Telegram
                </a>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', phone: '', project: '' }); }}
                  className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.28)', cursor: 'pointer' }}
                  data-cursor="pointer"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Расскажите о проекте</h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    * — обязательные поля
                  </p>
                </div>

                {/* Name + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-2">Ваше имя *</label>
                    <input type="text" placeholder="Иван Иванов"
                      value={form.name} style={inputStyle('name')}
                      onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                    />
                    {errors.name && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label block mb-2">Телефон *</label>
                    <input type="tel" placeholder="+7 (999) 000-00-00"
                      value={form.phone} style={inputStyle('phone')}
                      onChange={e => { setForm(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
                    />
                    {errors.phone && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.phone}</p>}
                  </div>
                </div>

                {/* Task */}
                <div>
                  <label className="label block mb-2">Что нужно сделать? *</label>
                  <textarea
                    rows={4}
                    placeholder="Напишите, какой проект вам нужен: сайт, интернет-магазин, лендинг, бот, мобильное приложение..."
                    value={form.project}
                    onChange={e => { setForm(p => ({ ...p, project: e.target.value })); setErrors(p => ({ ...p, project: '' })); }}
                    style={{ ...inputStyle('project'), resize: 'none' }}
                  />
                  {errors.project && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{errors.project}</p>}
                </div>

                {serverError && (
                  <p className="text-xs text-center" style={{ color: '#f87171' }}>{serverError}</p>
                )}

                <Magnetic>
                  <LiquidBtn
                    type="button"
                    onClick={handleSubmit}
                    className="btn-white w-full justify-center"
                    disabled={sending}
                    data-cursor="pointer"
                    style={{ borderRadius: 12, padding: '15px 32px', marginTop: 2 }}
                  >
                    {sending
                      ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Отправка...</>
                      : 'Отправить заявку →'
                    }
                  </LiquidBtn>
                </Magnetic>

                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных данных
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div
          className="mt-16 sm:mt-24 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="label text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2025 WEB TERA. Все права защищены.
          </span>

          <span className="rainbow-text text-xs font-bold tracking-widest uppercase">
            Сайт создан WebTera
          </span>

          <div className="flex items-center gap-3">
            {['/icons/react.svg', '/icons/node_js.svg', '/icons/figma.svg', '/icons/docker.svg', '/icons/python.svg'].map(src => (
              <Image key={src} src={src} alt="" width={16} height={16}
                className="w-4 h-4 object-contain opacity-20 hover:opacity-55 transition-opacity" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
