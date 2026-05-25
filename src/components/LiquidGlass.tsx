"use client";

import React, { useId, useMemo, useRef, useEffect, useState, useCallback } from "react";

export interface LiquidGlassProps {
  radius?: number;
  scale?: number;
  blur?: number;
  tint?: string;
  chromaticAberration?: boolean;
  scrollable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function buildDisplacementMapUri(width: number, height: number, radius: number): string {
  const blurStdDev = Math.max(5, Math.round(radius * 0.35));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
  <defs>
    <linearGradient id='gx' x1='0%' y1='0%' x2='100%' y2='0%'>
      <stop offset='0%' stop-color='#000'/>
      <stop offset='100%' stop-color='#f00'/>
    </linearGradient>
    <linearGradient id='gy' x1='0%' y1='0%' x2='0%' y2='100%'>
      <stop offset='0%' stop-color='#000'/>
      <stop offset='100%' stop-color='#0f0'/>
    </linearGradient>
    <filter id='b'><feGaussianBlur stdDeviation='${blurStdDev}'/></filter>
  </defs>
  <rect width='${width}' height='${height}' rx='${radius}' fill='url(#gx)' style='mix-blend-mode:screen'/>
  <rect width='${width}' height='${height}' rx='${radius}' fill='url(#gy)' style='mix-blend-mode:screen'/>
  <rect width='${width}' height='${height}' rx='${radius}' fill='#808080' filter='url(#b)'/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function supportsBackdropSvgFilter(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return (/Chrome\//.test(ua) && !/Edg\//.test(ua)) || /Edg\//.test(ua);
}

/* ─── Glass scrollbar component ─── */
function GlassScrollbar({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    const overflow = scrollHeight > clientHeight + 1;
    setCanScroll(overflow);
    if (!overflow) return;

    const trackHeight = clientHeight - 24; // 12px padding top+bottom
    const ratio = clientHeight / scrollHeight;
    const thumb = Math.max(32, trackHeight * ratio);
    const scrollableRange = scrollHeight - clientHeight;
    const thumbRange = trackHeight - thumb;
    const top = scrollableRange > 0 ? 12 + (scrollTop / scrollableRange) * thumbRange : 12;

    setThumbHeight(thumb);
    setThumbTop(top);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Also observe children for content changes
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });
    update();
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, [scrollRef, update]);

  // Drag handling
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = scrollRef.current;
      if (!el) return;
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartScroll.current = el.scrollTop;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [scrollRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const el = scrollRef.current;
      if (!el) return;
      const { scrollHeight, clientHeight } = el;
      const trackHeight = clientHeight - 24;
      const ratio = clientHeight / scrollHeight;
      const thumb = Math.max(32, trackHeight * ratio);
      const thumbRange = trackHeight - thumb;
      const scrollRange = scrollHeight - clientHeight;

      if (thumbRange <= 0) return;
      const dy = e.clientY - dragStartY.current;
      const scrollDelta = (dy / thumbRange) * scrollRange;
      el.scrollTop = dragStartScroll.current + scrollDelta;
    },
    [isDragging, scrollRef]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Click on track to jump
  const onTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const { scrollHeight, clientHeight } = el;
      const ratio = clickY / rect.height;
      el.scrollTop = ratio * (scrollHeight - clientHeight);
    },
    [scrollRef]
  );

  if (!canScroll) return null;

  const active = isDragging || isHovering;

  return (
    <div
      ref={trackRef}
      onClick={onTrackClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 8,
        right: 4,
        bottom: 8,
        width: active ? 14 : 10,
        zIndex: 15,
        cursor: "pointer",
        borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
        transition: "width 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      {/* Thumb */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "absolute",
          top: thumbTop,
          left: 2,
          right: 2,
          height: thumbHeight,
          borderRadius: 10,
          cursor: "grab",
          overflow: "hidden",
          transition: isDragging
            ? "none"
            : "top 0.08s ease-out, box-shadow 0.25s ease, border-color 0.25s ease",

          // Strong glass effect
          background: active
            ? "rgba(255,255,255,0.3)"
            : "rgba(255,255,255,0.15)",
          backdropFilter: "blur(16px) brightness(1.2) saturate(1.6)",
          WebkitBackdropFilter: "blur(16px) brightness(1.2) saturate(1.6)",
          boxShadow: active
            ? "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(255,255,255,0.08)"
            : "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)",
          border: active
            ? "1px solid rgba(255,255,255,0.35)"
            : "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {/* Inner specular sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function LiquidGlass({
  radius = 24,
  scale = -35,
  blur = 12,
  tint = "rgba(255, 255, 255, 0.08)",
  chromaticAberration = false,
  scrollable = false,
  className = "",
  style,
  children,
}: LiquidGlassProps) {
  const id = useId();
  const filterId = `lg-${id.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 200 });
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setIsChrome(supportsBackdropSvgFilter());
  }, []);

  const mapHref = useMemo(
    () => buildDisplacementMapUri(dims.w, dims.h, radius),
    [dims.w, dims.h, radius]
  );

  const backdropFilterValue = isChrome
    ? `blur(${blur}px) url(#${filterId}) brightness(1.05) saturate(1.3)`
    : `blur(${blur}px) brightness(1.05) saturate(1.2)`;

  const scaleR = scale;
  const scaleG = Math.round(scale * 1.07);
  const scaleB = Math.round(scale * 1.035);

  return (
    <>
      {isChrome && (
        <svg xmlns="http://www.w3.org/2000/svg" width={0} height={0} style={{ position: "absolute", overflow: "hidden" }} aria-hidden="true">
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <feImage result="dispMap" x={0} y={0} width={dims.w} height={dims.h} preserveAspectRatio="none" href={mapHref} />
              {chromaticAberration ? (
                <>
                  <feDisplacementMap in="SourceGraphic" in2="dispMap" scale={scaleR} xChannelSelector="R" yChannelSelector="G" result="dispR" />
                  <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="Ronly" />
                  <feDisplacementMap in="SourceGraphic" in2="dispMap" scale={scaleG} xChannelSelector="R" yChannelSelector="G" result="dispG" />
                  <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="Gonly" />
                  <feDisplacementMap in="SourceGraphic" in2="dispMap" scale={scaleB} xChannelSelector="R" yChannelSelector="G" result="dispB" />
                  <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="Bonly" />
                  <feBlend in="Ronly" in2="Gonly" mode="screen" result="RG" />
                  <feBlend in="RG" in2="Bonly" mode="screen" />
                </>
              ) : (
                <feDisplacementMap in="SourceGraphic" in2="dispMap" scale={scale} xChannelSelector="R" yChannelSelector="G" />
              )}
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={containerRef}
        className={className}
        style={{
          position: "relative",
          borderRadius: radius,
          overflow: "hidden",
          willChange: "transform",
          ...style,
        }}
      >
        {/* Layer 0: Refraction */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            backdropFilter: backdropFilterValue,
            WebkitBackdropFilter: backdropFilterValue,
            isolation: "isolate",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Layer 1: Glass tint */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: tint,
            zIndex: 1,
            pointerEvents: "none",
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
              "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.12)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* Layer 3: Content */}
        <div
          ref={scrollable ? contentRef : undefined}
          className={scrollable ? "lg-scroll-content" : undefined}
          style={{
            position: "relative",
            zIndex: 10,
            ...(scrollable ? { height: "100%", overflowY: "auto" } : {}),
          }}
        >
          {children}
        </div>

        {/* Layer 4: Glass scrollbar */}
        {scrollable && <GlassScrollbar scrollRef={contentRef} />}
      </div>
    </>
  );
}
