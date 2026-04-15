"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const remove = () => setGone(true);
    const t = setTimeout(remove, 4200);
    window.addEventListener(
      "load",
      () => {
        clearTimeout(t);
        setTimeout(remove, 3200);
      },
      { once: true }
    );
    return () => {
      clearTimeout(t);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      <style>{`
        @keyframes _ld_out {
          0%,60% { opacity:1 }
          100%   { opacity:0 }
        }
        @keyframes _ld_bar {
          from { width:0% }
          to   { width:100% }
        }
        @keyframes _ld_float {
          0%,100% { transform:translateY(0) }
          50%     { transform:translateY(12px) }
        }
        @keyframes _ld_p1 {
          0%  {fill:#f0f0f0} 34%{fill:#b0b0b0} 66%{fill:#d8d8d8} 100%{fill:#f0f0f0}
        }
        @keyframes _ld_p2 {
          0%  {fill:#d8d8d8} 34%{fill:#f0f0f0} 66%{fill:#b0b0b0} 100%{fill:#d8d8d8}
        }
        @keyframes _ld_p3 {
          0%  {fill:#b0b0b0} 34%{fill:#d8d8d8} 66%{fill:#f0f0f0} 100%{fill:#b0b0b0}
        }
        .__ld_p1 { fill:#f0f0f0; stroke-width:0; animation:_ld_p1 3s ease infinite }
        .__ld_p2 { fill:#d8d8d8; stroke-width:0; animation:_ld_p2 3s ease infinite }
        .__ld_p3 { fill:#b0b0b0; stroke-width:0; animation:_ld_p3 3s ease infinite }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          background: "#0a0a0a",
          animation: "_ld_out 3.5s ease forwards",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 900,
            letterSpacing: ".15em",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          WEB TERA
        </p>

        <div style={{ width: 180, height: 180, animation: "_ld_float 3s ease-in-out infinite" }}>
          <svg viewBox="0 0 2000 2000" width="100%" height="100%">
            <polygon
              className="__ld_p1"
              points="928 781 1021 951 784.5 1371.97 1618 1371.97 1530.32 1544 509 1539 928 781"
            />
            <polygon
              className="__ld_p3"
              points="1618 1371.97 784.5 1371.97 874.93 1211 1346 1211 923.1 456 1110.06 456 1618 1371.97"
            />
            <polygon
              className="__ld_p2"
              points="418 1372.74 509 1539 928 781 1162.32 1211 1346 1211 923.1 456 418 1372.74"
            />
          </svg>
        </div>

        <div
          style={{
            width: 160,
            height: 1,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "rgba(255,255,255,0.65)",
              borderRadius: 1,
              animation: "_ld_bar 2s ease forwards",
            }}
          />
        </div>

        <p
          style={{
            fontSize: ".65rem",
            letterSpacing: ".25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          Загрузка
        </p>
      </div>
    </>
  );
}
