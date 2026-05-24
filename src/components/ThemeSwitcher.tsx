import React, { useState, useEffect, useRef } from "react";
import LiquidGlass from "./LiquidGlass";

type ThemeType = "orbs" | "gradient" | "mesh" | "minimal";

interface ThemeCategory {
  id: string;
  label: string;
  icon: string;
  themes: Theme[];
}

interface Theme {
  id: string;
  name: string;
  type: ThemeType;
  preview: string;
  bg: string;
  // orb themes
  orbs?: [string, string, string, string];
  orbOpacities?: [number, number, number, number];
  // gradient themes
  gradientCss?: string;
  // mesh themes
  meshCss?: string;
  // minimal themes
  minimalCss?: string;
  grainOpacity?: number;
}

const CATEGORIES: ThemeCategory[] = [
  {
    id: "nebula",
    label: "Nebula",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    themes: [
      {
        id: "nebula-cosmic",
        name: "Cosmic",
        type: "orbs",
        preview: "linear-gradient(135deg, #3B0086, #0077FF, #FF5E00)",
        bg: "#050505",
        orbs: ["#3B0086", "#FF5E00", "#0077FF", "#FFB800"],
        orbOpacities: [0.4, 0.25, 0.3, 0.2],
      },
      {
        id: "nebula-devotion",
        name: "Devotion",
        type: "orbs",
        preview: "linear-gradient(135deg, #FF6B35, #D4145A, #FFB800)",
        bg: "#0A0505",
        orbs: ["#D4145A", "#FF6B35", "#8B0000", "#FFB800"],
        orbOpacities: [0.35, 0.3, 0.25, 0.2],
      },
      {
        id: "nebula-ocean",
        name: "Ocean",
        type: "orbs",
        preview: "linear-gradient(135deg, #003545, #0077B6, #00B4D8)",
        bg: "#020A0F",
        orbs: ["#003545", "#0077B6", "#00B4D8", "#0096C7"],
        orbOpacities: [0.45, 0.3, 0.35, 0.2],
      },
      {
        id: "nebula-lotus",
        name: "Lotus",
        type: "orbs",
        preview: "linear-gradient(135deg, #C77DFF, #E040FB, #7B2FF7)",
        bg: "#080510",
        orbs: ["#7B2FF7", "#E040FB", "#C77DFF", "#9D4EDD"],
        orbOpacities: [0.35, 0.25, 0.3, 0.2],
      },
      {
        id: "nebula-forest",
        name: "Forest",
        type: "orbs",
        preview: "linear-gradient(135deg, #1B4332, #2D6A4F, #52B788)",
        bg: "#030A06",
        orbs: ["#1B4332", "#52B788", "#2D6A4F", "#40916C"],
        orbOpacities: [0.4, 0.25, 0.35, 0.2],
      },
      {
        id: "nebula-sunset",
        name: "Sunset",
        type: "orbs",
        preview: "linear-gradient(135deg, #FF6700, #C1121F, #FFD60A)",
        bg: "#0A0504",
        orbs: ["#C1121F", "#FF6700", "#780000", "#FFD60A"],
        orbOpacities: [0.35, 0.3, 0.2, 0.25],
      },
      {
        id: "nebula-midnight",
        name: "Midnight",
        type: "orbs",
        preview: "linear-gradient(135deg, #10002B, #240046, #3C096C)",
        bg: "#030108",
        orbs: ["#10002B", "#3C096C", "#240046", "#5A189A"],
        orbOpacities: [0.5, 0.3, 0.4, 0.2],
      },
      {
        id: "nebula-aurora",
        name: "Aurora",
        type: "orbs",
        preview: "linear-gradient(135deg, #00F5D4, #7209B7, #F72585)",
        bg: "#040808",
        orbs: ["#00F5D4", "#7209B7", "#F72585", "#4CC9F0"],
        orbOpacities: [0.3, 0.35, 0.25, 0.2],
      },
      {
        id: "nebula-ember",
        name: "Ember",
        type: "orbs",
        preview: "linear-gradient(135deg, #E25822, #8B2500, #FF4500)",
        bg: "#080302",
        orbs: ["#E25822", "#8B2500", "#FF4500", "#CC5500"],
        orbOpacities: [0.35, 0.3, 0.25, 0.2],
      },
      {
        id: "nebula-ice",
        name: "Ice",
        type: "orbs",
        preview: "linear-gradient(135deg, #A8DADC, #457B9D, #1D3557)",
        bg: "#030810",
        orbs: ["#1D3557", "#457B9D", "#A8DADC", "#2A6F97"],
        orbOpacities: [0.4, 0.3, 0.25, 0.2],
      },
    ],
  },
  {
    id: "gradient",
    label: "Flow",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    themes: [
      {
        id: "flow-twilight",
        name: "Twilight",
        type: "gradient",
        preview: "linear-gradient(135deg, #0F0C29, #302B63, #24243E)",
        bg: "#0F0C29",
        gradientCss: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)",
      },
      {
        id: "flow-ember",
        name: "Molten",
        type: "gradient",
        preview: "linear-gradient(135deg, #0a0000, #3a0000, #1a0505)",
        bg: "#0a0000",
        gradientCss: "linear-gradient(160deg, #0a0000 0%, #3a0000 40%, #1a0505 70%, #0a0000 100%)",
      },
      {
        id: "flow-deep-sea",
        name: "Deep Sea",
        type: "gradient",
        preview: "linear-gradient(135deg, #000428, #004e92, #000a1a)",
        bg: "#000428",
        gradientCss: "linear-gradient(150deg, #000428 0%, #004e92 50%, #000a1a 100%)",
      },
      {
        id: "flow-wine",
        name: "Wine",
        type: "gradient",
        preview: "linear-gradient(135deg, #1a0011, #4a0033, #1a0011)",
        bg: "#1a0011",
        gradientCss: "linear-gradient(140deg, #1a0011 0%, #4a0033 45%, #2a0022 75%, #0a0008 100%)",
      },
      {
        id: "flow-moss",
        name: "Moss",
        type: "gradient",
        preview: "linear-gradient(135deg, #0a1a0a, #1a3a1a, #0a1a0a)",
        bg: "#0a1a0a",
        gradientCss: "linear-gradient(155deg, #050d05 0%, #1a3a1a 40%, #0d200d 70%, #050d05 100%)",
      },
      {
        id: "flow-arctic",
        name: "Arctic",
        type: "gradient",
        preview: "linear-gradient(135deg, #0a0a1a, #1a2a4a, #0a1020)",
        bg: "#0a0a1a",
        gradientCss: "linear-gradient(145deg, #0a0a1a 0%, #1a2a4a 35%, #0f1a30 65%, #050510 100%)",
      },
      {
        id: "flow-sandstorm",
        name: "Sandstorm",
        type: "gradient",
        preview: "linear-gradient(135deg, #1a1408, #3a2810, #1a1408)",
        bg: "#1a1408",
        gradientCss: "linear-gradient(150deg, #0d0a04 0%, #3a2810 45%, #1a1408 75%, #0d0a04 100%)",
      },
      {
        id: "flow-amethyst",
        name: "Amethyst",
        type: "gradient",
        preview: "linear-gradient(135deg, #0d0015, #2d004a, #15002a)",
        bg: "#0d0015",
        gradientCss: "linear-gradient(160deg, #0d0015 0%, #2d004a 40%, #15002a 70%, #08000f 100%)",
      },
      {
        id: "flow-charcoal",
        name: "Charcoal",
        type: "gradient",
        preview: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #0d0d0d)",
        bg: "#0a0a0a",
        gradientCss: "linear-gradient(150deg, #0a0a0a 0%, #1a1a1a 40%, #121212 70%, #080808 100%)",
      },
      {
        id: "flow-rose",
        name: "Rose",
        type: "gradient",
        preview: "linear-gradient(135deg, #1a0a10, #3a1020, #1a0810)",
        bg: "#1a0a10",
        gradientCss: "linear-gradient(145deg, #0d0508 0%, #3a1020 40%, #1a0810 70%, #0d0508 100%)",
      },
    ],
  },
  {
    id: "mesh",
    label: "Aura",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    themes: [
      {
        id: "aura-mystic",
        name: "Mystic",
        type: "mesh",
        preview: "linear-gradient(135deg, #1a0533, #0033aa, #330066)",
        bg: "#050208",
        meshCss: `radial-gradient(ellipse at 20% 50%, rgba(88, 28, 135, 0.4) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, rgba(30, 58, 138, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 60% 80%, rgba(126, 34, 206, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 10% 90%, rgba(67, 56, 202, 0.25) 0%, transparent 45%)`,
      },
      {
        id: "aura-sakura",
        name: "Sakura",
        type: "mesh",
        preview: "linear-gradient(135deg, #4a0020, #ff69b4, #2a0010)",
        bg: "#0a0308",
        meshCss: `radial-gradient(ellipse at 30% 20%, rgba(219, 39, 119, 0.3) 0%, transparent 55%),
                  radial-gradient(ellipse at 70% 60%, rgba(244, 114, 182, 0.25) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 80%, rgba(190, 24, 93, 0.2) 0%, transparent 45%),
                  radial-gradient(ellipse at 90% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 40%)`,
      },
      {
        id: "aura-emerald",
        name: "Emerald",
        type: "mesh",
        preview: "linear-gradient(135deg, #003320, #00aa55, #002210)",
        bg: "#020a05",
        meshCss: `radial-gradient(ellipse at 25% 35%, rgba(5, 150, 105, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 75% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 10%, rgba(6, 95, 70, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 85% 15%, rgba(52, 211, 153, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-golden",
        name: "Golden",
        type: "mesh",
        preview: "linear-gradient(135deg, #3a2000, #ffaa00, #2a1500)",
        bg: "#0a0700",
        meshCss: `radial-gradient(ellipse at 40% 30%, rgba(217, 119, 6, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 70% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 15% 75%, rgba(180, 83, 9, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 85% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-crimson",
        name: "Crimson",
        type: "mesh",
        preview: "linear-gradient(135deg, #3a0000, #cc0000, #1a0000)",
        bg: "#0a0202",
        meshCss: `radial-gradient(ellipse at 30% 40%, rgba(185, 28, 28, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 80% 25%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 55% 80%, rgba(153, 27, 27, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 10% 10%, rgba(239, 68, 68, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-sapphire",
        name: "Sapphire",
        type: "mesh",
        preview: "linear-gradient(135deg, #001133, #0055cc, #000a22)",
        bg: "#020510",
        meshCss: `radial-gradient(ellipse at 20% 60%, rgba(29, 78, 216, 0.4) 0%, transparent 55%),
                  radial-gradient(ellipse at 75% 30%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 90%, rgba(30, 64, 175, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 90% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-lavender",
        name: "Lavender",
        type: "mesh",
        preview: "linear-gradient(135deg, #1a0a30, #8855cc, #100520)",
        bg: "#080510",
        meshCss: `radial-gradient(ellipse at 35% 25%, rgba(139, 92, 246, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 65% 75%, rgba(167, 139, 250, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 15% 65%, rgba(109, 40, 217, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 85% 40%, rgba(196, 181, 253, 0.15) 0%, transparent 40%)`,
      },
      {
        id: "aura-copper",
        name: "Copper",
        type: "mesh",
        preview: "linear-gradient(135deg, #2a1505, #b87333, #1a0d03)",
        bg: "#0a0604",
        meshCss: `radial-gradient(ellipse at 40% 50%, rgba(180, 83, 9, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 80% 30%, rgba(217, 119, 6, 0.25) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 80%, rgba(146, 64, 14, 0.3) 0%, transparent 45%),
                  radial-gradient(ellipse at 70% 85%, rgba(120, 53, 15, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-teal",
        name: "Teal",
        type: "mesh",
        preview: "linear-gradient(135deg, #002020, #008080, #001515)",
        bg: "#020808",
        meshCss: `radial-gradient(ellipse at 25% 45%, rgba(13, 148, 136, 0.35) 0%, transparent 55%),
                  radial-gradient(ellipse at 70% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 55% 85%, rgba(15, 118, 110, 0.25) 0%, transparent 45%),
                  radial-gradient(ellipse at 90% 65%, rgba(45, 212, 191, 0.2) 0%, transparent 40%)`,
      },
      {
        id: "aura-slate",
        name: "Slate",
        type: "mesh",
        preview: "linear-gradient(135deg, #0f1520, #334155, #0a0f18)",
        bg: "#060810",
        meshCss: `radial-gradient(ellipse at 30% 35%, rgba(51, 65, 85, 0.4) 0%, transparent 55%),
                  radial-gradient(ellipse at 75% 60%, rgba(71, 85, 105, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 15% 80%, rgba(30, 41, 59, 0.35) 0%, transparent 45%),
                  radial-gradient(ellipse at 85% 15%, rgba(100, 116, 139, 0.2) 0%, transparent 40%)`,
      },
    ],
  },
  {
    id: "minimal",
    label: "Zen",
    icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    themes: [
      {
        id: "zen-obsidian",
        name: "Obsidian",
        type: "minimal",
        preview: "linear-gradient(135deg, #0a0a0a, #141414, #0a0a0a)",
        bg: "#080808",
        minimalCss: "linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #080808 100%)",
        grainOpacity: 0.04,
      },
      {
        id: "zen-ink",
        name: "Ink",
        type: "minimal",
        preview: "linear-gradient(135deg, #080812, #101020, #080812)",
        bg: "#060610",
        minimalCss: "linear-gradient(180deg, #080812 0%, #0d0d1a 50%, #060610 100%)",
        grainOpacity: 0.03,
      },
      {
        id: "zen-iron",
        name: "Iron",
        type: "minimal",
        preview: "linear-gradient(135deg, #101215, #181c20, #101215)",
        bg: "#0c0e10",
        minimalCss: "linear-gradient(180deg, #101215 0%, #161a1e 50%, #0c0e10 100%)",
        grainOpacity: 0.05,
      },
      {
        id: "zen-shadow",
        name: "Shadow",
        type: "minimal",
        preview: "linear-gradient(135deg, #050505, #0e0e0e, #050505)",
        bg: "#030303",
        minimalCss: "linear-gradient(180deg, #050505 0%, #0b0b0b 50%, #030303 100%)",
        grainOpacity: 0.03,
      },
      {
        id: "zen-earth",
        name: "Earth",
        type: "minimal",
        preview: "linear-gradient(135deg, #0d0a08, #1a1410, #0d0a08)",
        bg: "#0a0806",
        minimalCss: "linear-gradient(180deg, #0d0a08 0%, #151210 50%, #0a0806 100%)",
        grainOpacity: 0.05,
      },
      {
        id: "zen-dusk",
        name: "Dusk",
        type: "minimal",
        preview: "linear-gradient(135deg, #0d080f, #18101a, #0d080f)",
        bg: "#0a060c",
        minimalCss: "linear-gradient(180deg, #0d080f 0%, #140e16 50%, #0a060c 100%)",
        grainOpacity: 0.04,
      },
      {
        id: "zen-marine",
        name: "Marine",
        type: "minimal",
        preview: "linear-gradient(135deg, #060a0d, #0d151a, #060a0d)",
        bg: "#050810",
        minimalCss: "linear-gradient(180deg, #060a0d 0%, #0c1218 50%, #050810 100%)",
        grainOpacity: 0.04,
      },
      {
        id: "zen-olive",
        name: "Olive",
        type: "minimal",
        preview: "linear-gradient(135deg, #0a0d08, #141a10, #0a0d08)",
        bg: "#080a06",
        minimalCss: "linear-gradient(180deg, #0a0d08 0%, #12160e 50%, #080a06 100%)",
        grainOpacity: 0.05,
      },
      {
        id: "zen-void",
        name: "Void",
        type: "minimal",
        preview: "linear-gradient(135deg, #000000, #080808, #000000)",
        bg: "#000000",
        minimalCss: "linear-gradient(180deg, #020202 0%, #060606 50%, #000000 100%)",
        grainOpacity: 0.02,
      },
      {
        id: "zen-graphite",
        name: "Graphite",
        type: "minimal",
        preview: "linear-gradient(135deg, #121212, #1e1e1e, #121212)",
        bg: "#101010",
        minimalCss: "linear-gradient(180deg, #121212 0%, #1a1a1a 50%, #101010 100%)",
        grainOpacity: 0.06,
      },
    ],
  },
];

const ALL_THEMES = CATEGORIES.flatMap((c) => c.themes);

function applyTheme(theme: Theme) {
  const bg = document.querySelector(".ambient-bg") as HTMLElement | null;
  if (!bg) return;

  const orbs = bg.querySelectorAll<HTMLElement>(".ambient-orb");
  const grainEl = bg.querySelector<HTMLElement>(".ambient-grain");

  bg.style.backgroundColor = theme.bg;
  bg.style.backgroundImage = "none";

  if (theme.type === "orbs") {
    orbs.forEach((orb, i) => {
      orb.style.display = "";
      if (i < 4 && theme.orbs && theme.orbOpacities) {
        orb.style.background = theme.orbs[i];
        orb.style.opacity = String(theme.orbOpacities[i]);
      }
    });
    if (grainEl) grainEl.style.opacity = "0";
  } else {
    orbs.forEach((orb) => {
      orb.style.display = "none";
    });

    if (theme.type === "gradient" && theme.gradientCss) {
      bg.style.backgroundImage = theme.gradientCss;
    } else if (theme.type === "mesh" && theme.meshCss) {
      bg.style.backgroundImage = theme.meshCss;
    } else if (theme.type === "minimal" && theme.minimalCss) {
      bg.style.backgroundImage = theme.minimalCss;
    }

    if (grainEl) {
      grainEl.style.opacity = String(theme.grainOpacity ?? (theme.type === "minimal" ? 0.04 : 0));
    }
  }
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("nebula-cosmic");
  const [activeCategory, setActiveCategory] = useState("nebula");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("krishna-theme");
    if (saved) {
      const theme = ALL_THEMES.find((t) => t.id === saved);
      if (theme) {
        setActiveTheme(saved);
        const cat = CATEGORIES.find((c) => c.themes.some((t) => t.id === saved));
        if (cat) setActiveCategory(cat.id);
        applyTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    const reapply = () => {
      const theme = ALL_THEMES.find((t) => t.id === activeTheme);
      if (theme) applyTheme(theme);
    };
    document.addEventListener("astro:page-load", reapply);
    return () => document.removeEventListener("astro:page-load", reapply);
  }, [activeTheme]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectTheme = (theme: Theme) => {
    setActiveTheme(theme.id);
    localStorage.setItem("krishna-theme", theme.id);
    applyTheme(theme);
  };

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div ref={panelRef} style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change theme"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <LiquidGlass radius={50} scale={-15} blur={16} tint="rgba(255,255,255,0.05)">
          <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
              <path
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </LiquidGlass>
      </button>

      {open && (
        <div style={{ position: "absolute", top: 52, right: 0 }}>
          <LiquidGlass radius={20} scale={-25} blur={20} tint="rgba(15,15,20,0.6)">
            <div style={{ padding: 16, width: 260 }}>
              {/* Category tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      background: activeCategory === cat.id ? "rgba(255,255,255,0.1)" : "transparent",
                      transition: "background 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d={cat.icon}
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ opacity: activeCategory === cat.id ? 0.9 : 0.35 }}
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: activeCategory === cat.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />

              {/* Theme grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {currentCategory.themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => selectTheme(theme)}
                    title={theme.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: theme.preview,
                      border: activeTheme === theme.id ? "2px solid rgba(255,255,255,0.8)" : "2px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
                      padding: 0,
                      boxShadow: activeTheme === theme.id ? "0 0 12px rgba(255,255,255,0.15)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    }}
                  />
                ))}
              </div>

              {/* Theme name */}
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  marginTop: 12,
                  marginBottom: 0,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {ALL_THEMES.find((t) => t.id === activeTheme)?.name ?? ""}
              </p>
            </div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
}
