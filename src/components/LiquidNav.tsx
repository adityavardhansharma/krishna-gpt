import React, { useState, useEffect, useRef, useMemo, useId, useLayoutEffect } from "react";

const navItems = [
  { path: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { path: "/converse", label: "Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { path: "/mahabharat", label: "Tales", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

function buildNavMapUri(w: number, h: number, r: number): string {
  const blurStdDev = Math.max(4, Math.round(r * 0.3));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
  <defs>
    <linearGradient id='gx' x1='0%' y1='0%' x2='100%' y2='0%'>
      <stop offset='0%' stop-color='#000'/><stop offset='100%' stop-color='#f00'/>
    </linearGradient>
    <linearGradient id='gy' x1='0%' y1='0%' x2='0%' y2='100%'>
      <stop offset='0%' stop-color='#000'/><stop offset='100%' stop-color='#0f0'/>
    </linearGradient>
    <filter id='b'><feGaussianBlur stdDeviation='${blurStdDev}'/></filter>
  </defs>
  <rect width='${w}' height='${h}' rx='${r}' fill='url(#gx)' style='mix-blend-mode:screen'/>
  <rect width='${w}' height='${h}' rx='${r}' fill='url(#gy)' style='mix-blend-mode:screen'/>
  <rect width='${w}' height='${h}' rx='${r}' fill='#808080' filter='url(#b)'/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function supportsBackdropSvgFilter(): boolean {
  if (typeof window === "undefined") return false;
  return /Chrome\//.test(navigator.userAgent) || /Edg\//.test(navigator.userAgent);
}

export default function LiquidNav() {
  const [currentPath, setCurrentPath] = useState("/");
  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [dims, setDims] = useState({ w: 280, h: 56 });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const id = useId();
  const filterId = `nav-lg-${id.replace(/:/g, "")}`;

  const getActiveIndex = (path: string) => {
    const idx = navItems.findIndex(
      (item) => item.path === path || (item.path !== "/" && path.startsWith(item.path))
    );
    return idx >= 0 ? idx : 0;
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleNav = () => {
      setCurrentPath(window.location.pathname);
    };
    document.addEventListener("astro:page-load", handleNav);
    return () => document.removeEventListener("astro:page-load", handleNav);
  }, []);

  // Measure active tab and animate indicator
  useEffect(() => {
    const activeIdx = getActiveIndex(currentPath);
    const el = itemRefs.current[activeIdx];
    const container = barRef.current;
    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [currentPath]);

  useEffect(() => {
    if (!barRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(barRef.current);
    return () => ro.disconnect();
  }, []);

  const mapHref = useMemo(() => buildNavMapUri(dims.w, dims.h, 28), [dims.w, dims.h]);
  const isChrome = useMemo(() => supportsBackdropSvgFilter(), []);

  const backdropValue = isChrome
    ? `blur(40px) url(#${filterId}) brightness(1.15) saturate(1.8)`
    : `blur(40px) brightness(1.12) saturate(1.6)`;

  const activeIndex = getActiveIndex(currentPath);

  return (
    <>
      {isChrome && (
        <svg xmlns="http://www.w3.org/2000/svg" width={0} height={0} style={{ position: "absolute", overflow: "hidden" }} aria-hidden="true">
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <feImage result="dispMap" x={0} y={0} width={dims.w} height={dims.h} preserveAspectRatio="none" href={mapHref} />
              <feDisplacementMap in="SourceGraphic" in2="dispMap" scale={-45} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      )}

      <nav
        ref={barRef}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
        style={{
          borderRadius: 28,
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {/* Layer 0: Refraction */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            backdropFilter: backdropValue,
            WebkitBackdropFilter: backdropValue,
            isolation: "isolate",
          }}
        />

        {/* Layer 1: Glass tint */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "rgba(30, 30, 35, 0.35)",
          }}
        />

        {/* Layer 2: Specular rim */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />

        {/* Sliding active indicator — the glass pill that slides between tabs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 8,
            bottom: 8,
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            borderRadius: 20,
            background: "rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "left 0.5s cubic-bezier(0.32, 0.72, 0, 1), width 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
            zIndex: 5,
          }}
        />

        {/* Layer 3: Content */}
        <div className="relative z-10 flex items-center gap-1 px-3 py-2">
          {navItems.map((item, i) => {
            const isActive = i === activeIndex;

            return (
              <a
                key={item.path}
                href={item.path}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative flex flex-col items-center justify-center"
                style={{
                  padding: "6px 20px",
                  borderRadius: 20,
                  minWidth: 72,
                  textDecoration: "none",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transition: "opacity 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}
                >
                  <path
                    d={item.icon}
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                    marginTop: 2,
                    letterSpacing: "0.01em",
                    transition: "color 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
