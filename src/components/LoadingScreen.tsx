"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

const ANIM_MS = 2600;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const hide = () => setVisible(false);

    const onAnimEnd = (e: AnimationEvent) => {
      if (e.animationName === "loading-screen-out") {
        hide();
      }
    };

    el.addEventListener("animationend", onAnimEnd);

    /* Запасной таймаут, если animationend не сработал (in-app браузеры, старые WebView) */
    const fallback = window.setTimeout(hide, ANIM_MS + 1200);

    return () => {
      el.removeEventListener("animationend", onAnimEnd);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="loading-screen-root"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "oklch(0.1 0 0)",
        animation: `loading-screen-out ${ANIM_MS / 1000}s ease forwards`,
      }}
    >
      <Loader />
    </div>
  );
}
