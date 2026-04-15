'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /* Skip smooth scroll on touch devices — native momentum is better */
    const isTouch = window.matchMedia('(hover: none)').matches;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    try {
      lenis = new Lenis({
        duration:    isTouch ? 1.0 : 1.2,
        easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !isTouch,
      });

      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn('Lenis init failed, falling back to native scroll', e);
    }

    return () => {
      if (lenis) { try { lenis.destroy(); } catch (_) {} }
      if (tick)  { gsap.ticker.remove(tick); }
    };
  }, []);

  return <>{children}</>;
}
