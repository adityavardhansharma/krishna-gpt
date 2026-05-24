"use client";

import React, { useId, useMemo, useRef, useEffect, useState } from "react";

export interface LiquidGlassProps {
  radius?: number;
  scale?: number;
  blur?: number;
  tint?: string;
  chromaticAberration?: boolean;
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

export default function LiquidGlass({
  radius = 24,
  scale = -35,
  blur = 12,
  tint = "rgba(255, 255, 255, 0.08)",
  chromaticAberration = false,
  className = "",
  style,
  children,
}: LiquidGlassProps) {
  const id = useId();
  const filterId = `lg-${id.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 400, h: 200 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const mapHref = useMemo(
    () => buildDisplacementMapUri(dims.w, dims.h, radius),
    [dims.w, dims.h, radius]
  );

  const isChrome = useMemo(() => supportsBackdropSvgFilter(), []);

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
          }}
        />

        {/* Layer 3: Content */}
        <div style={{ position: "relative", zIndex: 10 }}>
          {children}
        </div>
      </div>
    </>
  );
}
