"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WORKS, type WorkProject } from "@/lib/works";

type Vec3 = [number, number, number];

type TooltipState = { idx: number; sx: number; sy: number };

const rotY = (p: Vec3, a: number): Vec3 => {
  const c = Math.cos(a),
    s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};
const rotX = (p: Vec3, a: number): Vec3 => {
  const c = Math.cos(a),
    s = Math.sin(a);
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
    const t = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi = (2 * Math.PI * i) / gr;
    return [Math.sin(t) * Math.cos(phi), Math.cos(t), Math.sin(t) * Math.sin(phi)] as Vec3;
  });
}

/** Чем больше n, тем больше рёбер — «шар» читается лучше */
function buildEdges(n: number): [number, number][] {
  if (n < 2) return [];
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const add = (a: number, b: number) => {
    if (a === b) return;
    const x = Math.min(a, b),
      y = Math.max(a, b);
    const key = `${x}-${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push([a, b]);
  };
  for (let i = 0; i < n; i++) add(i, (i + 1) % n);
  if (n >= 4) {
    const s1 = Math.max(1, Math.floor(n / 4));
    for (let i = 0; i < n; i++) add(i, (i + s1) % n);
  }
  if (n >= 6) {
    const s2 = Math.max(2, Math.floor(n / 3));
    for (let i = 0; i < n; i++) add(i, (i + s2) % n);
  }
  if (n >= 10) {
    const s3 = Math.max(3, Math.floor(n / 2));
    for (let i = 0; i < n; i++) add(i, (i + s3) % n);
  }
  return edges;
}

function ConstellationCanvas({ works }: { works: WorkProject[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const router = useRouter();

  const rot = useRef({
    rx: 0.28,
    ry: 0,
    vx: 0,
    vy: 0,
    prevRy: 0,
    prevRx: 0.28,
    autoRy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const tipRef = useRef<TooltipState | null>(null);
  const wrapDim = useRef({ w: 0, h: 0 });

  const n = works.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || n === 0) return;

    const edgeList = buildEdges(n);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0,
      H = 0,
      R = 0,
      CX = 0,
      CY = 0;

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      wrapDim.current = { w: W, h: H };
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.34;
      CX = W / 2;
      CY = H / 2;
    };

    const bgStars = fibSphere(80);
    const midStars = fibSphere(40);
    const projNodes = fibSphere(n);
    const outerStars = fibSphere(50).map((p): Vec3 => [p[0] * 1.15, p[1] * 1.15, p[2] * 1.15]);

    resize();
    window.addEventListener("resize", resize);

    let visible = true;
    const visObs = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }, { threshold: 0 });
    visObs.observe(wrap);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visible) return;
      const r = rot.current;

      if (r.dragging) {
        r.vy = r.ry - r.prevRy;
        r.vx = r.rx - r.prevRx;
      } else {
        r.autoRy += 0.003;
        r.vy *= 0.96;
        r.ry += r.vy;
        r.vx *= 0.96;
        r.rx += r.vx;
        r.rx = Math.max(-0.7, Math.min(0.7, r.rx));
      }
      r.prevRy = r.ry;
      r.prevRx = r.rx;

      const RY = r.ry + r.autoRy;
      const RX = r.rx;

      ctx.clearRect(0, 0, W, H);

      const pBg = bgStars.map((p) => {
        const rp = applyRot(p, RX, RY);
        return proj(rp, CX, CY, R);
      });
      const pMid = midStars.map((p) => {
        const rp = applyRot(p, RX, RY);
        return proj(rp, CX, CY, R);
      });
      const pOuter = outerStars.map((p) => {
        const rp = applyRot(p, RX, RY);
        return proj(rp, CX, CY, R);
      });
      const pProj = projNodes.map((p) => {
        const rp = applyRot(p, RX, RY);
        return proj(rp, CX, CY, R);
      });

      edgeList.forEach(([a, b]) => {
        const pa = pProj[a],
          pb = pProj[b];
        if (!pa || !pb) return;
        const avgZ = (pa.z + pb.z) / 2;
        if (avgZ < -0.6) return;
        const op = Math.max(0, (avgZ + 1) * 0.18);
        const grd = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        const ca = works[a].accent,
          cb = works[b].accent;
        grd.addColorStop(0, `${ca}${Math.round(op * 255).toString(16).padStart(2, "0")}`);
        grd.addColorStop(1, `${cb}${Math.round(op * 255).toString(16).padStart(2, "0")}`);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      pOuter.forEach(({ sx, sy, z }) => {
        if (z < -0.2) return;
        const op = Math.max(0, (z + 1) * 0.09);
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,255,${op})`;
        ctx.fill();
      });

      pBg.forEach(({ sx, sy, z }) => {
        if (z < -0.4) return;
        const op = Math.max(0, (z + 1) * 0.14);
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });

      pMid.forEach(({ sx, sy, z }) => {
        if (z < -0.3) return;
        const op = Math.max(0, (z + 1) * 0.16);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,190,255,${op})`;
        ctx.fill();
      });

      let newTip: TooltipState | null = null;

      pProj.forEach(({ sx, sy, sc, z }, i) => {
        const p = works[i];
        const isFront = z > -0.25;
        const dep = Math.max(0, (z + 1) * 0.5);
        const isTipped = tipRef.current?.idx === i;
        const d = Math.hypot(sx - mouseRef.current.x, sy - mouseRef.current.y);
        if (d < 28 && isFront) newTip = { idx: i, sx, sy };

        const Rdot = (isTipped ? 10 : 7) * sc;
        const alpha = isFront ? (isTipped ? 1 : 0.7 + dep * 0.3) : 0.18;

        if (isFront && dep > 0.1) {
          const glowR = Rdot * 3;
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
          grd.addColorStop(0, `${p.accent}${Math.round(alpha * 0.45 * 255).toString(16).padStart(2, "0")}`);
          grd.addColorStop(1, `${p.accent}00`);
          ctx.beginPath();
          ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        if (isFront) {
          ctx.beginPath();
          ctx.arc(sx, sy, Rdot + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.accent}${Math.round(alpha * 0.3 * 255).toString(16).padStart(2, "0")}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, Rdot, 0, Math.PI * 2);
        ctx.fillStyle = isTipped ? "#ffffff" : p.accent;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (isFront && z > 0.05) {
          const fs = Math.round(10 * sc);
          ctx.font = `${isTipped ? 700 : 500} ${fs}px ui-sans-serif, system-ui, sans-serif`;
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
          ctx.textAlign = "left";
          ctx.fillText(p.title, sx + Rdot + 7, sy + 4);
        }
      });

      const nextTip = newTip as TooltipState | null;
      if (nextTip?.idx !== tipRef.current?.idx) {
        tipRef.current = nextTip;
        setTooltip(nextTip);
      }
    };

    draw();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inCanvas =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
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
      rot.current.lastX = e.clientX;
      rot.current.lastY = e.clientY;
      rot.current.vy = 0;
      rot.current.vx = 0;
      rot.current.prevRy = rot.current.ry;
      rot.current.prevRx = rot.current.rx;
    };
    const onMouseUp = () => {
      rot.current.dragging = false;
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onClick = () => {
      if (tipRef.current != null) {
        router.push(`/projects/${works[tipRef.current.idx].slug}`);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      rot.current.dragging = true;
      rot.current.lastX = e.touches[0].clientX;
      rot.current.lastY = e.touches[0].clientY;
      rot.current.vy = 0;
      rot.current.vx = 0;
      rot.current.prevRy = rot.current.ry;
      rot.current.prevRx = rot.current.rx;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - rot.current.lastX;
      const dy = e.touches[0].clientY - rot.current.lastY;
      rot.current.ry += dx * 0.006;
      rot.current.rx += dy * 0.004;
      rot.current.lastX = e.touches[0].clientX;
      rot.current.lastY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      rot.current.dragging = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      visObs.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [router, works, n]);

  const tp = tooltip ? works[tooltip.idx] : null;
  const { w, h } = wrapDim.current;

  if (n === 0) {
    return (
      <div className="flex h-[min(70vh,640px)] w-full items-center justify-center text-sm text-white/40">
        Добавьте проекты в <span className="mx-1 font-mono text-white/60">src/lib/works.ts</span>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-[min(78vh,760px)] w-full select-none"
      style={{ cursor: "none" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {tooltip && tp && (
        <div
          className="pointer-events-none absolute z-20 rounded-[14px] border px-4 py-3.5 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
          style={{
            left: Math.min(tooltip.sx + 18, (w || 800) - 230),
            top: Math.max(10, Math.min(tooltip.sy - 90, (h || 600) - 200)),
            width: 210,
            background: "rgba(8,8,12,0.92)",
            backdropFilter: "blur(14px)",
            borderColor: `${tp.accent}45`,
            boxShadow: `0 0 30px ${tp.accent}22`,
          }}
        >
          <p
            className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: tp.accent }}
          >
            {tp.category}
          </p>
          <h4 className="mb-1.5 text-sm font-bold leading-tight text-white">{tp.title}</h4>
          <p className="mb-2 text-[11px] leading-snug text-white/50">{tp.desc}</p>
          <div className="flex items-center justify-between font-mono text-[10px] text-white/35">
            <span>{tp.year}</span>
            <span className="text-white/40">Нажмите →</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkSection() {
  return (
    <section
      id="work"
      className="relative min-h-screen overflow-hidden bg-[#0d0d0d]"
    >
      <span
        className="pointer-events-none absolute right-8 top-6 text-[clamp(4rem,16vw,12rem)] font-black leading-none tracking-[-0.06em] text-white/[0.03] md:right-12"
        aria-hidden
      >
        02
      </span>

      <div className="pointer-events-none absolute left-[5vw] top-[8%] z-10 max-w-[min(90vw,420px)]">
        <span className="label mb-2 block">02 — Работы</span>
        <h2 className="display-sm text-white">
          Наши
          <br />
          <span className="text-white/45">проекты</span>
        </h2>
        <p className="mt-3 text-xs text-white/18">Тяните для вращения · Наведите на узел · клик — карточка</p>
      </div>

      <div className="absolute inset-0 pt-32 md:pt-24">
        <ConstellationCanvas works={WORKS} />
      </div>
    </section>
  );
}
