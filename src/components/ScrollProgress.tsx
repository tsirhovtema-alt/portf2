'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        scrub: 0.4,
        start: 'top top',
        end: 'bottom bottom',
      },
    });
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'rgba(255,255,255,0.85)',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
        zIndex: 9997,
        pointerEvents: 'none',
      }}
    />
  );
}
