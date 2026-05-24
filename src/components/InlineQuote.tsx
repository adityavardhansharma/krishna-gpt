import React, { useState } from "react";
import LiquidGlass from "./LiquidGlass";

export default function InlineQuote() {
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/quote");
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setQuote(data.quote);
    } catch {
      setQuote("The flow of time obscures this verse. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <LiquidGlass
        radius={24}
        tint={quote ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.04)"}
        scale={-25}
        blur={18}
      >
        <div className="flex flex-col items-center text-center" style={{ padding: "28px 24px" }}>
          {quote && !isLoading ? (
            <p
              className="font-serif text-lg md:text-xl text-white/85 leading-relaxed italic mb-5"
              style={{ maxWidth: 440 }}
            >
              {quote}
            </p>
          ) : !isLoading ? (
            <p className="text-white/30 text-[15px] mb-5 leading-relaxed" style={{ maxWidth: 300 }}>
              Receive a random shloka from the Bhagavad Gita
            </p>
          ) : (
            <div className="flex items-center gap-2 mb-5 py-3">
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}

          <button
            onClick={fetchQuote}
            disabled={isLoading}
            className="disabled:opacity-40 active:scale-95 transition-transform duration-300"
            style={{
              padding: "10px 28px",
              borderRadius: 50,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.05)",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
          >
            {isLoading ? "Receiving..." : quote ? "Another Verse" : "Daily Verse"}
          </button>
        </div>
      </LiquidGlass>
    </div>
  );
}
