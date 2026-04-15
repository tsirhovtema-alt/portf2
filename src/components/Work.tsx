'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PROJECTS, type ProjectDef } from '@/lib/projects';

/* ─── Types ──────────────────────────────────────────────── */
type Vec3 = [number, number, number];

export type { ProjectDef };

/* ─── 3D Math ────────────────────────────────────────────── */
const rotY = (p: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};
const rotX = (p: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};
const applyRot = (p: Vec3, rx: number, ry: number): Vec3 => rotX(rotY(p, ry), rx);

const proj = (p: Vec3, cx: number, cy: number, r: number) => {
  const d = 3.6;
  const sc = d / (d - p[2] * 0.55);
  return { sx: cx + p[0] * r * sc, sy: cy - p[1] * r * sc, sc, z: p[2] };
};

function fibSphere(n: number): Vec3[] {
  const gr = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const t = Math.acos(1 - 2 * (i + 0.5) / n);
    const phi = 2 * Math.PI * i / gr;
    return [Math.sin(t) * Math.cos(phi), Math.cos(t), Math.sin(t) * Math.sin(phi)] as Vec3;
  });
}

export { PROJECTS };

/* Pentagon + two cross edges for a nice constellation pattern */
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]];

const TAG_ICONS: Record<string, string> = {
  'React':      '/icons/react.svg',
  'Next.js':    '/icons/nextjs.svg',
  'Node.js':    '/icons/node_js.svg',
  'Python':     '/icons/python.svg',
  'NestJS':     '/icons/nestjs.svg',
  'TailwindCSS':'/icons/tailwind.svg',
  'Docker':     '/icons/docker.svg',
  'Prisma':     '/icons/prisma.svg',
  'Vite':       '/icons/vitejs.svg',
  'Vue':        '/icons/vue.svg',
};

/* ─── Constellation Canvas ───────────────────────────────── */
interface Tooltip { idx: number; sx: number; sy: number }

function ConstellationCanvas() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const router    = useRouter();

  const rot = useRef({
    rx: 0.28, ry: 0,
    vx: 0,    vy: 0,
    prevRy: 0, prevRx: 0.28,   // for frame-aligned velocity
    autoRy: 0,
    dragging: false,
    lastX: 0, lastY: 0,
  });

  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const tipRef  = useRef<Tooltip | null>(null);
  const wrapDim = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const wrap   = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const dpr    = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, R = 0, CX = 0, CY = 0;

    const resize = () => {
      W = wrap.clientWidth; H = wrap.clientHeight;
      wrapDim.current = { w: W, h: H };
      canvas.width  = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R  = Math.min(W, H) * 0.34;
      CX = W / 2; CY = H / 2;
    };

    /* Generate geometry */
    const bgStars    = fibSphere(80);
    const midStars   = fibSphere(40);
    const projNodes  = fibSphere(5);       // project node positions on unit sphere

    /* Extra star ring (slightly outer radius) */
    const outerStars = fibSphere(50).map((p): Vec3 => [p[0] * 1.15, p[1] * 1.15, p[2] * 1.15]);

    resize();
    window.addEventListener('resize', resize);

    /* Pause loop when section is scrolled out of view */
    let visible = true;
    const visObs = new IntersectionObserver(
      ([e]) => { visible = e.isIntersecting; },
      { threshold: 0 },
    );
    visObs.observe(wrap);

    /* ── Animation loop ───────────────────────────────────── */
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visible) return;
      const r = rot.current;

      if (r.dragging) {
        /* Frame-aligned velocity: measure how much ry/rx actually changed
           this frame (all mousemove deltas accumulated). This gives accurate
           inertia regardless of how many events fired between frames. */
        r.vy = r.ry - r.prevRy;
        r.vx = r.rx - r.prevRx;
      } else {
        r.autoRy += 0.003;
        r.vy *= 0.96; r.ry += r.vy;
        r.vx *= 0.96; r.rx += r.vx;
        r.rx = Math.max(-0.7, Math.min(0.7, r.rx));
      }

      /* Store this frame's position for next-frame velocity calculation */
      r.prevRy = r.ry;
      r.prevRx = r.rx;

      const RY = r.ry + r.autoRy;
      const RX = r.rx;

      ctx.clearRect(0, 0, W, H);

      /* Project everything */
      const pBg    = bgStars.map(p => { const rp = applyRot(p, RX, RY); return proj(rp, CX, CY, R); });
      const pMid   = midStars.map(p => { const rp = applyRot(p, RX, RY); return proj(rp, CX, CY, R); });
      const pOuter = outerStars.map(p => { const rp = applyRot(p, RX, RY); return proj(rp, CX, CY, R); });
      const pProj  = projNodes.map(p => { const rp = applyRot(p, RX, RY); return proj(rp, CX, CY, R); });

      /* ── Constellation edges ─────────────────────── */
      EDGES.forEach(([a, b]) => {
        const pa = pProj[a], pb = pProj[b];
        const avgZ = (pa.z + pb.z) / 2;
        if (avgZ < -0.6) return;
        const op = Math.max(0, (avgZ + 1) * 0.18);

        const grd = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        const ca = PROJECTS[a].accent, cb = PROJECTS[b].accent;
        grd.addColorStop(0, `${ca}${Math.round(op * 255).toString(16).padStart(2, '0')}`);
        grd.addColorStop(1, `${cb}${Math.round(op * 255).toString(16).padStart(2, '0')}`);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.strokeStyle = grd;
        ctx.lineWidth   = 1;
        ctx.stroke();
      });

      /* ── Outer distant stars ─────────────────────── */
      pOuter.forEach(({ sx, sy, z }) => {
        if (z < -0.2) return;
        const op = Math.max(0, (z + 1) * 0.09);
        ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,255,${op})`; ctx.fill();
      });

      /* ── Background stars ────────────────────────── */
      pBg.forEach(({ sx, sy, z }) => {
        if (z < -0.4) return;
        const op = Math.max(0, (z + 1) * 0.14);
        ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill();
      });

      /* ── Mid sphere stars ────────────────────────── */
      pMid.forEach(({ sx, sy, z }) => {
        if (z < -0.3) return;
        const op = Math.max(0, (z + 1) * 0.16);
        ctx.beginPath(); ctx.arc(sx, sy, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,190,255,${op})`; ctx.fill();
      });

      /* ── Project nodes ───────────────────────────── */
      let newTip: Tooltip | null = null;

      pProj.forEach(({ sx, sy, sc, z }, i) => {
        const p   = PROJECTS[i];
        const isFront = z > -0.25;
        const dep = Math.max(0, (z + 1) * 0.5);
        const isTipped = tipRef.current?.idx === i;

        /* Hover detection */
        const d = Math.hypot(sx - mouseRef.current.x, sy - mouseRef.current.y);
        if (d < 28 && isFront) newTip = { idx: i, sx, sy };

        const R_dot  = (isTipped ? 10 : 7) * sc;
        const alpha  = isFront ? (isTipped ? 1 : 0.7 + dep * 0.3) : 0.18;

        if (isFront && dep > 0.1) {
          /* Glow */
          const glowR = R_dot * 3;
          const grd   = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
          grd.addColorStop(0, `${p.accent}${Math.round(alpha * 0.45 * 255).toString(16).padStart(2, '0')}`);
          grd.addColorStop(1, `${p.accent}00`);
          ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }

        /* Ring */
        if (isFront) {
          ctx.beginPath();
          ctx.arc(sx, sy, R_dot + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.accent}${Math.round(alpha * 0.3 * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth   = 1; ctx.stroke();
        }

        /* Core dot */
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(sx, sy, R_dot, 0, Math.PI * 2);
        ctx.fillStyle   = isTipped ? '#ffffff' : p.accent;
        ctx.fill();
        ctx.globalAlpha = 1;

        /* Label */
        if (isFront && z > 0.05) {
          const fs = Math.round(10 * sc);
          ctx.font      = `${isTipped ? 700 : 500} ${fs}px "Inter", sans-serif`;
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
          ctx.textAlign = 'left';
          ctx.fillText(p.title, sx + R_dot + 7, sy + 4);
        }
      });

      /* Update tooltip state only when hovered node changes.
         TypeScript narrows newTip to null after the forEach closure,
         so we cast explicitly to preserve the intended union type. */
      const nextTip = newTip as Tooltip | null;
      if (nextTip?.idx !== tipRef.current?.idx) {
        tipRef.current = nextTip;
        setTooltip(nextTip);
      }
    };

    draw();

    /* ── Events ──────────────────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inCanvas = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top  && e.clientY <= rect.bottom;
      mouseRef.current = inCanvas
        ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
        : { x: -9999, y: -9999 };

      if (rot.current.dragging) {
        const dx = e.clientX - rot.current.lastX;
        const dy = e.clientY - rot.current.lastY;
        rot.current.ry += dx * 0.006;
        rot.current.rx += dy * 0.004;
        rot.current.lastX = e.clientX;
        rot.current.lastY = e.clientY;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      rot.current.dragging = true;
      rot.current.lastX = e.clientX; rot.current.lastY = e.clientY;
      rot.current.vy = 0; rot.current.vx = 0;
      /* Sync prev so first frame delta is 0, not garbage */
      rot.current.prevRy = rot.current.ry;
      rot.current.prevRx = rot.current.rx;
    };
    const onMouseUp   = () => { rot.current.dragging = false; };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onClick     = () => {
      if (tipRef.current) router.push(`/projects/${PROJECTS[tipRef.current.idx].slug}`);
    };

    /* Touch */
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      rot.current.dragging = true;
      rot.current.lastX = e.touches[0].clientX;
      rot.current.lastY = e.touches[0].clientY;
      rot.current.vy = 0; rot.current.vx = 0;
      rot.current.prevRy = rot.current.ry;
      rot.current.prevRx = rot.current.rx;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - rot.current.lastX;
      const dy = e.touches[0].clientY - rot.current.lastY;
      rot.current.ry += dx * 0.006; rot.current.rx += dy * 0.004;
      rot.current.lastX = e.touches[0].clientX;
      rot.current.lastY = e.touches[0].clientY;
    };
    const onTouchEnd  = () => { rot.current.dragging = false; };

    window.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click',      onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);
    window.addEventListener('mouseup',    onMouseUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      visObs.disconnect();
      window.removeEventListener('resize',   resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',  onMouseUp);
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click',      onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, [router]);

  const tp = tooltip ? PROJECTS[tooltip.idx] : null;
  const { w, h } = wrapDim.current;

  return (
    <div
      ref={wrapRef}
      style={{ width: '100%', height: '100%', position: 'relative',
        cursor: 'none', userSelect: 'none' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* ── Tooltip ──────────────────────────────── */}
      {tooltip && tp && (
        <div
          style={{
            position:   'absolute',
            left:       Math.min(tooltip.sx + 18, (w || 800) - 230),
            top:        Math.max(10, Math.min(tooltip.sy - 90, (h || 600) - 200)),
            width:       210,
            background: 'rgba(8,8,12,0.92)',
            backdropFilter: 'blur(14px)',
            border:     `1px solid ${tp.accent}45`,
            borderRadius: 14,
            padding:    '14px 16px',
            pointerEvents: 'none',
            zIndex:     20,
            boxShadow:  `0 0 30px ${tp.accent}22`,
          }}
        >
          <p style={{ fontSize: 9, color: tp.accent, fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
            {tp.category}
          </p>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14,
            lineHeight: 1.2, marginBottom: 6 }}>{tp.title}</h4>
          <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 11,
            lineHeight: 1.55, marginBottom: 9 }}>{tp.desc}</p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 9 }}>
            {tp.tags.map(t => {
              const icon = Object.keys(TAG_ICONS).find(k => t === k);
              return (
                <span key={t} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: `${tp.accent}15`, color: tp.accent,
                  border: `1px solid ${tp.accent}30`,
                  borderRadius: 5, padding: '2px 7px', fontSize: 10,
                }}>
                  {icon && (
                    <Image src={TAG_ICONS[icon]} alt={t} width={11} height={11}
                      style={{ width: 11, height: 11, objectFit: 'contain' }} />
                  )}
                  {t}
                </span>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace' }}>{tp.year}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Нажмите →</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Work Section ───────────────────────────────────────── */
export default function Work() {
  return (
    <section
      id="work"
      style={{ minHeight: '100vh', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}
    >
      <span className="sec-num" style={{ top: '1rem', right: '2rem' }}>02</span>

      <div style={{
        position: 'absolute', top: '8%', left: '5vw',
        zIndex: 10, pointerEvents: 'none',
      }}>
        <span className="label block mb-2">02 — Работы</span>
        <h2 className="display-sm text-white" style={{ lineHeight: 0.92, letterSpacing: '-0.03em' }}>
          Наши<br/>
          <span style={{ color: 'rgba(255,255,255,0.42)' }}>проекты</span>
        </h2>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Тяните для вращения · Наведите на узел
        </p>
      </div>

      <div style={{ position: 'absolute', inset: 0 }}>
        <ConstellationCanvas />
      </div>
    </section>
  );
}
