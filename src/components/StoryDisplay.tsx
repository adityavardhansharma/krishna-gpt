import React, { useState, useRef, useEffect } from "react";
import LiquidGlass from "./LiquidGlass";

/* ─── Animated loader ─── */
function StoryLoader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        flex: 1,
      }}
    >
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.06)",
          }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              animation: `orbit 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
              animationDelay: `${i * -0.8}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: `rgba(255,255,255,${0.6 - i * 0.15})`,
                boxShadow: `0 0 ${12 + i * 4}px rgba(255,255,255,${0.3 - i * 0.08})`,
              }}
            />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
            animation: "pulse-glow 2.4s ease-in-out infinite",
          }}
        />
      </div>
      <p
        style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.02em",
          animation: "text-breathe 3s ease-in-out infinite",
        }}
      >
        Unrolling the ancient scrolls...
      </p>
    </div>
  );
}

/* ─── Parse story into parts ─── */
function parseStory(story: string) {
  const lines = story.split("\n").filter((l) => l.trim());
  const title =
    lines.length > 0
      ? lines[0].replace(/^[#*]+\s*/, "").replace(/\*+$/g, "")
      : "";
  const body = lines.slice(1);
  const hasMulti = body.length > 1;
  const mainBody = hasMulti ? body.slice(0, -1) : body;
  const moral = hasMulti ? body[body.length - 1] : null;
  return { title, mainBody, moral };
}

/* ─── Story viewer — single story, full-width ─── */
function StoryViewer({ story, index }: { story: string; index: number }) {
  const { title, mainBody, moral } = parseStory(story);

  return (
    <div className="story-card-animate" style={{ height: "100%" }}>
      <LiquidGlass
        radius={24}
        tint="rgba(255, 255, 255, 0.03)"
        scale={-25}
        blur={18}
        scrollable
        className="story-scroll"
        style={{ height: "100%" }}
      >
        <div
          style={{
            padding: "32px 32px",
          }}
        >
          {/* Tale number tag */}
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Tale {index + 1}
            </span>
          </div>

          {/* Title */}
          {title && (
            <h2
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: "clamp(24px, 3.5vw, 30px)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.92)",
                marginBottom: 24,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
          )}

          {/* Divider */}
          <div
            style={{
              width: 40,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)",
              marginBottom: 24,
            }}
          />

          {/* Body */}
          {mainBody.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.65)",
                marginBottom: i < mainBody.length - 1 ? 20 : 0,
                letterSpacing: "-0.005em",
              }}
            >
              {para}
            </p>
          ))}

          {/* Moral */}
          {moral && (
            <div
              style={{
                marginTop: 28,
                padding: "18px 22px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                borderLeft: "2px solid rgba(255,255,255,0.12)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                  marginBottom: 8,
                }}
              >
                Lesson
              </p>
              <p
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: 16,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {moral}
              </p>
            </div>
          )}
        </div>
      </LiquidGlass>
    </div>
  );
}

/* ─── Main component ─── */
export default function StoryDisplay() {
  const [stories, setStories] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const fetchStory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/story");
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      if (data.story) {
        setStories((prev) => {
          const next = [...prev, data.story];
          setActiveIndex(next.length - 1);
          return next;
        });
      }
    } catch {
      setStories((prev) => {
        const next = [
          ...prev,
          "The Ancient Scrolls are Obscured\nThe connection to the ancient texts has been momentarily lost. The winds of time sometimes obscure even the most sacred scrolls. Please try again in a moment.",
        ];
        setActiveIndex(next.length - 1);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll nav to keep the active pill visible
  useEffect(() => {
    if (!navScrollRef.current) return;
    const active = navScrollRef.current.querySelector(
      "[data-active='true']"
    ) as HTMLElement | null;
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeIndex, stories.length]);

  const hasStories = stories.length > 0;

  // Empty state — full page with centered prompt
  if (!hasStories && !isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 32,
        }}
      >
        {/* Icon */}
        <div style={{ opacity: 0.15 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Discover tales of valor, sacrifice, and dharma from the great epic.
          </p>
        </div>

        {/* Big CTA button */}
        <button
          onClick={fetchStory}
          className="tale-button"
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <LiquidGlass
            radius={50}
            tint="rgba(10,132,255,0.12)"
            scale={-20}
            blur={20}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 44px",
                gap: 10,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Tell me a Tale
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ opacity: 0.4 }}
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </LiquidGlass>
        </button>

        <style>{`
          .tale-button:hover { transform: scale(1.03); }
          .tale-button:active { transform: scale(0.97); }
          .tale-button { transition: transform 0.15s ease; }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 12,
      }}
    >
      {/* ── Top navigation bar ── */}
      <div style={{ flexShrink: 0 }}>
        <LiquidGlass
          radius={20}
          tint="rgba(255,255,255,0.02)"
          scale={-15}
          blur={14}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 8px",
              gap: 6,
            }}
          >
            {/* Scrollable tale pills */}
            <div
              ref={navScrollRef}
              style={{
                flex: 1,
                display: "flex",
                gap: 4,
                overflowX: "auto",
                minWidth: 0,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {stories.map((story, i) => {
                const { title } = parseStory(story);
                const isActive = i === activeIndex;
                // Truncate title for the pill
                const shortTitle =
                  title.length > 20 ? title.slice(0, 18) + "..." : title;

                return (
                  <button
                    key={i}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 14px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      transition:
                        "background 0.25s ease, color 0.25s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: isActive
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.3)",
                        whiteSpace: "nowrap",
                        transition: "color 0.25s ease",
                      }}
                    >
                      {shortTitle || `Tale ${i + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* + Add new tale button */}
            <button
              onClick={fetchStory}
              disabled={isLoading}
              className="add-tale-btn"
              title="New Tale"
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.06)",
                cursor: isLoading ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isLoading ? 0.3 : 1,
                transition:
                  "opacity 0.3s ease, background 0.2s ease, transform 0.15s ease",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={isLoading ? "add-icon-spin" : ""}
              >
                {isLoading ? (
                  <path
                    d="M12 2a10 10 0 0110 10"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </LiquidGlass>
      </div>

      {/* ── Story content area ── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {isLoading && !hasStories ? (
          <StoryLoader />
        ) : isLoading && activeIndex === stories.length ? (
          <StoryLoader />
        ) : hasStories && stories[activeIndex] ? (
          <StoryViewer
            key={activeIndex}
            story={stories[activeIndex]}
            index={activeIndex}
          />
        ) : (
          <StoryLoader />
        )}
      </div>

      <style>{`
        @keyframes orbit {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.8; transform: translate(-50%, -50%) scale(1.8); }
        }
        @keyframes text-breathe {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.55; }
        }
        @keyframes story-enter {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .story-card-animate {
          animation: story-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .add-tale-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.12) !important;
          transform: scale(1.08);
        }
        .add-tale-btn:active:not(:disabled) {
          transform: scale(0.94);
        }
        .add-icon-spin {
          animation: spin 1s linear infinite;
        }
        .story-scroll::-webkit-scrollbar { display: none; }
        .story-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tale-button:hover { transform: scale(1.03); }
        .tale-button:active { transform: scale(0.97); }
        .tale-button { transition: transform 0.15s ease; }
      `}</style>
    </div>
  );
}
