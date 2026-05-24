import React, { useState, useRef, useEffect } from "react";
import LiquidGlass from "./LiquidGlass";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste, my friend. I am Krishna. What troubles your mind today? What questions of dharma or purpose do you seek answers to?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Forgive me, friend. A shadow blocks my sight. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
        paddingBottom: 96,
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingTop: "env(safe-area-inset-top, 16px)",
          paddingBottom: 8,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ paddingTop: 16 }}>
          <h1
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Krishna
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
              fontWeight: 500,
              margin: "2px 0 0",
              letterSpacing: "0.02em",
            }}
          >
            Divine Guide
          </p>
        </div>
      </div>

      {/* Messages — scrolls, clipped at its boundary, nothing leaks */}
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "user" ? (
              <div style={{ maxWidth: "80%" }}>
                <LiquidGlass
                  radius={20}
                  scale={-20}
                  blur={14}
                  tint="rgba(10, 100, 255, 0.18)"
                  style={{ borderBottomRightRadius: 6 }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      color: "rgba(255,255,255,0.95)",
                      fontSize: 16,
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </LiquidGlass>
              </div>
            ) : (
              <div style={{ maxWidth: "85%" }}>
                <LiquidGlass
                  radius={20}
                  scale={-25}
                  blur={14}
                  tint="rgba(255, 255, 255, 0.06)"
                  style={{ borderBottomLeftRadius: 6 }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      color: "rgba(255,255,255,0.88)",
                      fontSize: 16,
                      lineHeight: 1.55,
                      letterSpacing: "-0.01em",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </LiquidGlass>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", width: "100%", justifyContent: "flex-start" }}>
            <LiquidGlass
              radius={20}
              scale={-15}
              blur={12}
              tint="rgba(255, 255, 255, 0.04)"
              style={{ borderBottomLeftRadius: 6 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 20px",
                  gap: 6,
                }}
              >
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </LiquidGlass>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — in the flow, not fixed. Sits right below scroll area, above nav */}
      <div style={{ flexShrink: 0, padding: "8px 12px 0" }}>
        <LiquidGlass radius={26} scale={-20} blur={28} tint="rgba(28, 28, 32, 0.65)">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 6px 6px 0",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message Krishna..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                fontSize: 16,
                color: "white",
                outline: "none",
                paddingLeft: 18,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: isLoading || !input.trim() ? "rgba(10,132,255,0.3)" : "#0A84FF",
                color: "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isLoading || !input.trim() ? "default" : "pointer",
                flexShrink: 0,
                marginRight: 4,
                transition: "background 0.2s, transform 0.2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4L12 20M12 4L6 10M12 4L18 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}
