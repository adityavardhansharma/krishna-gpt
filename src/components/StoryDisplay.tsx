import React, { useState } from "react";
import LiquidGlass from "./LiquidGlass";

export default function StoryDisplay() {
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStory = async () => {
    setIsLoading(true);
    setStory(null);
    try {
      const response = await fetch("/api/story");
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setStory(data.story);
    } catch {
      setStory("The ancient scrolls are momentarily obscured. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const lines = story?.split("\n").filter((l) => l.trim()) ?? [];
  const title = lines.length > 0 ? lines[0].replace(/^[#*]+\s*/, "").replace(/\*+$/g, "") : "";
  const body = lines.slice(1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 16,
      }}
    >
      {/* Story area — scrollable */}
      {story && !isLoading ? (
        <div
          className="chat-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            padding: "0 4px",
          }}
        >
          <LiquidGlass
            radius={24}
            tint="rgba(255, 255, 255, 0.03)"
            scale={-25}
            blur={18}
          >
            <div style={{ padding: "28px 24px" }}>
              {title && (
                <h2
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.9)",
                    marginBottom: 20,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h2>
              )}
              {body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: i < body.length - 1 ? 16 : 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </LiquidGlass>
        </div>
      ) : !isLoading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 24px" }}>
            <div style={{ marginBottom: 16, opacity: 0.3 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto" }}>
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>
              Discover tales of valor, sacrifice, and dharma from the great epic.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 12px" }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <path d="M22 12a10 10 0 01-10 10" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Unrolling the ancient scrolls...
            </p>
          </div>
        </div>
      )}

      {/* Action button — always visible at bottom */}
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingBottom: 4 }}>
        <button
          onClick={fetchStory}
          disabled={isLoading}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: isLoading ? "default" : "pointer",
            opacity: isLoading ? 0.4 : 1,
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <LiquidGlass
            radius={28}
            tint="rgba(255, 255, 255, 0.1)"
            scale={-20}
            blur={20}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 32px",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {story ? "Another Tale" : "Tell me a Tale"}
              </span>
            </div>
          </LiquidGlass>
        </button>
      </div>
    </div>
  );
}
