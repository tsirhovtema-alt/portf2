"use client";

import { useCallback, useEffect, useRef } from "react";

type Shape = "circle" | "square" | "triangle";

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  s: number;
  alpha: number;
  alphaTarget: number;
  shape: Shape;
  nextShape: Shape;
  timer: number;
  interval: number;
  rotation: number;
  rotSpeed: number;
}

const SHAPES: Shape[] = ["circle", "square", "triangle"];
const MOUSE_RADIUS = 110;
const RETURN_FORCE = 0.055;
const FRICTION = 0.84;
const REPULSION = 7;

function rndShape(): Shape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  shape: Shape,
  rot: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();

  if (shape === "circle") {
    ctx.arc(0, 0, s, 0, Math.PI * 2);
  } else if (shape === "square") {
    ctx.rect(-s, -s, s * 2, s * 2);
  } else {
    const h = s * 1.6;
    ctx.moveTo(0, -h * 0.65);
    ctx.lineTo(s, h * 0.35);
    ctx.lineTo(-s, h * 0.35);
    ctx.closePath();
  }

  ctx.fill();
  ctx.restore();
}

export default function HeroText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);
  const cssW = useRef(0);
  const cssH = useRef(0);

  const build = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await Promise.race([
      document.fonts.load("900 16px Inter").catch(() => {}),
      document.fonts.ready,
      new Promise<void>((res) => setTimeout(res, 2000)),
    ]);

    const section = canvas.parentElement;
    const W = section ? section.clientWidth : window.innerWidth;
    const H = section ? section.clientHeight : window.innerHeight;
    if (W < 2 || H < 2) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW.current = W;
    cssH.current = H;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const oc = off.getContext("2d");
    if (!oc) return;

    const sqSize = Math.min(W, H) * 0.62;
    const sqX = (W - sqSize) / 2;
    const sqY = (H - sqSize) / 2;
    const bw = Math.max(4, sqSize * 0.009);

    oc.fillStyle = "#ffffff";
    oc.fillRect(sqX, sqY, sqSize, bw);
    oc.fillRect(sqX, sqY + sqSize - bw, sqSize, bw);
    oc.fillRect(sqX, sqY, bw, sqSize);
    oc.fillRect(sqX + sqSize - bw, sqY, bw, sqSize);

    const cd = bw * 6;
    [
      [sqX - cd / 2, sqY - cd / 2],
      [sqX + sqSize - cd / 2, sqY - cd / 2],
      [sqX - cd / 2, sqY + sqSize - cd / 2],
      [sqX + sqSize - cd / 2, sqY + sqSize - cd / 2],
    ].forEach(([cx, cy]) => oc.fillRect(cx, cy, cd, cd));

    const fs = sqSize * 0.295;
    oc.font = `900 ${fs}px "Inter", "Arial Black", Arial, sans-serif`;
    oc.textAlign = "center";
    oc.textBaseline = "alphabetic";
    oc.fillText("WEB", W / 2, sqY + sqSize * 0.5);
    oc.fillText("TERA", W / 2, sqY + sqSize * 0.82);

    const isMobile = W < 640;
    const gap = isMobile ? 4 : 4;
    const pSize = isMobile ? 0.7 : 0.6;
    const img = oc.getImageData(0, 0, W, H).data;
    const list: Particle[] = [];

    for (let py = 0; py < H; py += gap) {
      for (let px = 0; px < W; px += gap) {
        if (img[(py * W + px) * 4 + 3] > 100) {
          const interval = 60 + Math.floor(Math.random() * 180);
          const shape = rndShape();
          list.push({
            x: Math.random() * W,
            y: Math.random() * H,
            ox: px,
            oy: py,
            vx: 0,
            vy: 0,
            s: Math.random() * pSize + pSize * 0.5,
            alpha: 0,
            alphaTarget: 0.55 + Math.random() * 0.45,
            shape,
            nextShape: rndShape(),
            timer: Math.floor(Math.random() * interval),
            interval,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.015,
          });
        }
      }
    }

    particles.current = list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let visible = true;
    const obs = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    obs.observe(canvas);

    const animate = () => {
      raf.current = requestAnimationFrame(animate);
      if (!visible) return;

      ctx.clearRect(0, 0, cssW.current || canvas.width, cssH.current || canvas.height);
      const isMobile = (cssW.current || window.innerWidth) < 640;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const p of particles.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;

        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
          const dist = Math.sqrt(d2);
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * REPULSION;
          p.vx += (dx / (dist || 1)) * force;
          p.vy += (dy / (dist || 1)) * force;
        }

        p.vx += (p.ox - p.x) * RETURN_FORCE;
        p.vy += (p.oy - p.y) * RETURN_FORCE;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        p.timer -= 1;
        if (p.timer <= 0) {
          if (isMobile) {
            /* На телефоне не гасим частицы полностью, чтобы надпись оставалась читаемой */
            p.alphaTarget = 0.65 + Math.random() * 0.35;
          } else {
            p.alphaTarget = Math.random() > 0.2 ? 0.5 + Math.random() * 0.5 : 0;
          }
          p.nextShape = rndShape();
          p.timer = p.interval + Math.floor(Math.random() * 60);
        }

        if (p.alpha < 0.04 && p.nextShape !== p.shape) p.shape = p.nextShape;
        p.alpha += (p.alphaTarget - p.alpha) * 0.06;

        if (p.shape !== "circle") p.rotation += p.rotSpeed;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const finalA = Math.min(1, p.alpha + speed * 0.06);
        if (finalA < 0.01) continue;

        ctx.globalAlpha = finalA;
        ctx.fillStyle = "#ffffff";
        drawShape(ctx, p.x, p.y, p.s + speed * 0.06, p.shape, p.rotation);
      }
      ctx.globalAlpha = 1;
    };

    build().then(() => {
      animate();
      window.setTimeout(() => {
        if (subtitleRef.current) {
          subtitleRef.current.style.opacity = "1";
          subtitleRef.current.style.transform = "translateY(0)";
        }
        if (scrollRef.current) {
          scrollRef.current.style.opacity = "1";
        }
      }, 2800);
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.touches[0].clientX - rect.left;
      mouse.current.y = e.touches[0].clientY - rect.top;
    };
    const onTouchEnd = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    let buildGen = 0;
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const gen = ++buildGen;
        cancelAnimationFrame(raf.current);
        build().then(() => {
          if (gen === buildGen) animate();
        });
      }, 100);
    });
    const section = canvas.parentElement;
    if (section) ro.observe(section);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(raf.current);
      obs.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [build]);

  return (
    <section
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ touchAction: "none", cursor: "none" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
      />
      <div
        ref={subtitleRef}
        className="pointer-events-none absolute left-0 right-0 text-center"
        style={{
          bottom: "22%",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 900ms ease, transform 900ms ease",
        }}
      >
        <p
          style={{
            fontSize: "clamp(0.4rem, 1.8vmin, 0.72rem)",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.42)",
            whiteSpace: "nowrap",
          }}
        >
          Разрабатываем · Проектируем · Запускаем
        </p>
      </div>
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{
          opacity: 0,
          transition: "opacity 900ms ease",
          cursor: "none",
        }}
        onClick={() => {
          const target = document.getElementById("services");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.46)",
          }}
        >
          scroll
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect
            x="1"
            y="1"
            width="14"
            height="22"
            rx="7"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
          <rect
            x="7"
            y="4"
            width="2"
            height="6"
            rx="1"
            fill="white"
            style={{ animation: "hero-scroll-dot 2s ease-in-out infinite" }}
          />
        </svg>
      </div>
    </section>
  );
}
