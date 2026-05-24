import React, { useState } from "react";
import LiquidGlass from "./LiquidGlass";

export default function QuoteDisplay() {
  const [quote, setQuote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = async () => {
    setIsLoading(true);
    setQuote(null);
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
    <div className="w-full flex flex-col items-center gap-8">
      {/* Display area */}
      <div className="w-full min-h-[220px] flex items-center justify-center">
        {quote || isLoading ? (
          <div className="w-full animate-in fade-in duration-500">
            <LiquidGlass
              radius={28}
              tint="rgba(255, 255, 255, 0.04)"
              scale={-25}
              blur={20}
            >
              <div className="p-8 sm:p-10 min-h-[200px] flex items-center justify-center text-center">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <p className="font-serif text-xl sm:text-2xl leading-relaxed text-white/90 italic">
                    {quote}
                  </p>
                )}
              </div>
            </LiquidGlass>
          </div>
        ) : (
          <p className="text-white/35 text-[15px] tracking-tight text-center px-6">
            Tap below to receive a verse from the Bhagavad Gita.
          </p>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={fetchQuote}
        disabled={isLoading}
        className="active:scale-95 transition-transform duration-300 disabled:opacity-40"
      >
        <LiquidGlass
          radius={28}
          tint="rgba(255, 255, 255, 0.12)"
          scale={-20}
          blur={20}
        >
          <div className="flex items-center justify-center px-10 py-3.5">
            <span className="text-white font-semibold text-[16px] tracking-tight">
              {quote ? "Another Verse" : "Receive Wisdom"}
            </span>
          </div>
        </LiquidGlass>
      </button>
    </div>
  );
}
