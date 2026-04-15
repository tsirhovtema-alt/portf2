'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Disable on touch / mobile devices */
    if (window.matchMedia('(hover: none)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 1,   ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1,   ease: 'elastic.out(1, 0.3)' });

    const onMove  = (e: MouseEvent) => {
      const { height, width, left, top } = el.getBoundingClientRect();
      xTo((e.clientX - (left + width  / 2)) * 0.35);
      yTo((e.clientY - (top  + height / 2)) * 0.35);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    el.addEventListener('mousemove',  onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
