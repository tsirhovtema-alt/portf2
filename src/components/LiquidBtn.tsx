'use client';

import { useRef, ReactNode, MouseEvent, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: CSSProperties;
  [key: string]: unknown;
}

export default function LiquidBtn({
  children, className = '', onClick, type = 'button',
  disabled, style, ...rest
}: Props) {
  const blobRef = useRef<HTMLSpanElement>(null);
  const btnRef  = useRef<HTMLButtonElement>(null);

  const isOutline  = className.includes('btn-outline');
  const blobColor  = isOutline
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.13)';

  const getXY = (e: MouseEvent) => {
    const r = btnRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    };
  };

  const onEnter = (e: MouseEvent) => {
    const { x, y } = getXY(e);
    const b = blobRef.current!;
    b.style.transition = 'none';
    b.style.clipPath = `circle(0% at ${x}% ${y}%)`;
    requestAnimationFrame(() => {
      b.style.transition = 'clip-path 0.55s cubic-bezier(0.4,0,0.2,1)';
      b.style.clipPath = `circle(150% at ${x}% ${y}%)`;
    });
  };

  const onLeave = (e: MouseEvent) => {
    const { x, y } = getXY(e);
    const b = blobRef.current!;
    b.style.transition = 'clip-path 0.45s cubic-bezier(0.4,0,0.2,1)';
    b.style.clipPath = `circle(0% at ${x}% ${y}%)`;
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      <span
        ref={blobRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: blobColor,
          clipPath: 'circle(0% at 50% 50%)',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </button>
  );
}
