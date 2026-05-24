import React, { useState, useEffect } from "react";
import LiquidGlass from "./LiquidGlass";

const SAMPLE_CHAT = [
  { role: "user", text: "I feel lost in my career. Nothing feels meaningful anymore." },
  { role: "ai", text: "The restless mind mistakes stillness for stagnation, friend. What you call 'lost' may simply be the space between who you were and who you are becoming. The Gita teaches — your right is to action alone, never to its fruits." },
];

export default function HomeHero() {
  const [visibleChats, setVisibleChats] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setVisibleChats(1), 600);
    const t2 = setTimeout(() => setVisibleChats(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 120px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gap: 64,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left — copy */}
        <div className="hero-text" style={{ order: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 20,
            }}
          >
            Powered by Ancient Wisdom
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontFamily: "'Newsreader', serif",
              fontWeight: 300,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 20px",
            }}
          >
            Your guide through
            <br />
            <span style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
              life's battlefield.
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              maxWidth: 440,
              margin: "0 0 32px",
            }}
          >
            Converse with Krishna — an AI rooted in the Bhagavad Gita.
            Ask about purpose, struggle, relationships, and dharma.
            Get real answers, not platitudes.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/converse" style={{ textDecoration: "none" }}>
              <LiquidGlass radius={50} scale={-20} blur={20} tint="rgba(10,132,255,0.15)">
                <div style={{ padding: "14px 36px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "white", fontSize: 15, fontWeight: 600 }}>Start a Conversation</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </LiquidGlass>
            </a>
            <a href="/mahabharat" style={{ textDecoration: "none" }}>
              <LiquidGlass radius={50} scale={-15} blur={16} tint="rgba(255,255,255,0.05)">
                <div style={{ padding: "14px 28px" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 500 }}>Read Tales</span>
                </div>
              </LiquidGlass>
            </a>
          </div>
        </div>

        {/* Right — chat mockup */}
        <div style={{ display: "flex", justifyContent: "center" }} className="hero-preview" >
          <div style={{ width: "100%", maxWidth: 400 }}>
            <LiquidGlass radius={24} scale={-30} blur={18} tint="rgba(255,255,255,0.02)">
              <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>
                <div style={{ textAlign: "center", paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Krishna</span>
                </div>
                {SAMPLE_CHAT.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      opacity: visibleChats > i ? 1 : 0,
                      transform: `translateY(${visibleChats > i ? 0 : 12}px)`,
                      transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "10px 14px",
                        borderRadius: 16,
                        borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                        borderBottomLeftRadius: msg.role === "ai" ? 4 : 16,
                        background: msg.role === "user" ? "rgba(10,100,255,0.18)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${msg.role === "user" ? "rgba(10,100,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: msg.role === "user" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.75)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: 4,
                    padding: "10px 14px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  Message Krishna...
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          grid-template-columns: 1fr;
        }
        .hero-text {
          text-align: center;
        }
        .hero-text p:last-of-type {
          margin-left: auto;
          margin-right: auto;
        }
        .hero-text > div:last-child {
          justify-content: center;
        }
        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
          }
          .hero-text {
            text-align: left;
          }
          .hero-text p:last-of-type {
            margin-left: 0;
            margin-right: 0;
          }
          .hero-text > div:last-child {
            justify-content: flex-start;
          }
          .hero-preview {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}
