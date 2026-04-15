'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Magnetic from './Magnetic';

const LINKS = [
  { id: 'services', label: 'Услуги' },
  { id: 'work',     label: 'Работы' },
  { id: 'about',    label: 'О нас'  },
  { id: 'contact',  label: 'Контакт'},
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 3, ease: 'power3.out' }
    );

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const mid = window.scrollY + window.innerHeight / 3;
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (el && mid >= el.offsetTop && mid < el.offsetTop + el.offsetHeight) {
          setActive(l.id);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        padding: scrolled ? '14px 0' : '22px 0',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'padding .3s, background .3s, border .3s',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* Logo */}
        <Magnetic>
          <button onClick={() => scrollTo('hero')} data-cursor="pointer"
            className="font-black text-white tracking-tighter text-lg leading-none">
            WEB<br/>TERA
          </button>
        </Magnetic>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Magnetic key={l.id}>
              <button onClick={() => scrollTo(l.id)} data-cursor="pointer"
                className={`nav-link ${active === l.id ? 'active' : ''}`}>
                {l.label}
              </button>
            </Magnetic>
          ))}
        </div>

        {/* CTA */}
        <Magnetic>
          <button onClick={() => scrollTo('contact')} data-cursor="pointer"
            className="btn-white text-xs py-2.5 px-5">
            Начать проект
          </button>
        </Magnetic>
      </div>
    </nav>
  );
}
