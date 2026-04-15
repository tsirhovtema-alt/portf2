'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

/**
 * Wraps children in an overflow:hidden mask.
 * Content slides up from 105% → 0% on scroll-enter.
 */
export default function RevealText({ children, className, delay = 0, style }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current || !innerRef.current) return;
    gsap.fromTo(
      innerRef.current,
      { y: '105%' },
      {
        y: '0%',
        duration: 0.9,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 90%',
        },
      },
    );
  }, [delay]);

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden', lineHeight: 1 }}>
      <div ref={innerRef} className={className} style={style}>
        {children}
      </div>
    </div>
  );
}
