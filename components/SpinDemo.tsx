"use client";

// Interactive spin wheel for phones: a working demo with fixed sample data per tab.
// Nothing here is real data: the places are invented and the note says so.
import { useEffect, useRef, useState } from "react";
import SpinWheel from "@/components/SpinWheel";

type Item = { label: string; emoji: string; note?: string };
type Tab = "Nearby" | "Cuisines" | "Dishes";
const TABS: Tab[] = ["Nearby", "Cuisines", "Dishes"];

const DATA: Record<Tab, Item[]> = {
  Nearby: [
    { label: "Baan Noodle", emoji: "🍜", note: "0.4 km away" },
    { label: "Som Tam Hut", emoji: "🥗", note: "0.6 km away" },
    { label: "Pizza Alley", emoji: "🍕", note: "0.8 km away" },
    { label: "Wok Station", emoji: "🥡", note: "1.1 km away" },
    { label: "Grill House", emoji: "🍖", note: "1.3 km away" },
    { label: "Taco Cart", emoji: "🌮", note: "1.6 km away" },
    { label: "Curry Pot", emoji: "🍛", note: "2.0 km away" },
    { label: "Sushi Corner", emoji: "🍣", note: "2.4 km away" },
  ],
  Cuisines: [
    { label: "Mexican", emoji: "🌮" },
    { label: "Thai", emoji: "🍜" },
    { label: "Japanese", emoji: "🍣" },
    { label: "Korean", emoji: "🥘" },
    { label: "Chinese", emoji: "🥟" },
    { label: "Italian", emoji: "🍝" },
    { label: "Vietnamese", emoji: "🥖" },
    { label: "Indian", emoji: "🍛" },
  ],
  Dishes: [
    { label: "Pad Thai", emoji: "🍜" },
    { label: "Ramen", emoji: "🍜" },
    { label: "Pizza", emoji: "🍕" },
    { label: "Burger", emoji: "🍔" },
    { label: "Sushi", emoji: "🍣" },
    { label: "Tacos", emoji: "🌮" },
    { label: "Som Tam", emoji: "🥗" },
    { label: "Dumplings", emoji: "🥟" },
  ],
};

export default function SpinDemo() {
  const [tab, setTab] = useState<Tab>("Cuisines");
  const [spinning, setSpinning] = useState(false);
  const [current, setCurrent] = useState<number | null>(null); // slice lit "hot"
  const [trail, setTrail] = useState<number[]>([]); // slices it just passed ("warm")
  const [picked, setPicked] = useState<number | null>(null);
  const lastPick = useRef<Record<string, number>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const items = DATA[tab];
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const choose = (t: Tab) => {
    if (spinning || t === tab) return;
    setTab(t);
    setCurrent(null);
    setTrail([]);
    setPicked(null);
  };

  const spin = () => {
    if (spinning) return;
    const n = items.length;
    let target = Math.floor(Math.random() * n);
    if (target === lastPick.current[tab]) target = (target + 1 + Math.floor(Math.random() * (n - 1))) % n; // never the same twice in a row
    lastPick.current[tab] = target;
    setPicked(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCurrent(target);
      setTrail([]);
      setPicked(target);
      return;
    }
    setSpinning(true);
    const start = current ?? Math.floor(Math.random() * n);
    const steps = 16 + ((target - start + n) % n);
    let at = 0;
    for (let i = 1; i <= steps; i++) {
      const delay = 55 + Math.pow(i / steps, 2.2) * 330;
      at += delay;
      const idx = (start + i) % n;
      timers.current.push(
        setTimeout(() => {
          setCurrent(idx);
          setTrail((t) => [...t.filter((x) => x !== idx), (start + i - 1 + n) % n].slice(-2));
          if (i === steps) {
            setTrail([]);
            setPicked(target);
            setSpinning(false);
          }
        }, at),
      );
    }
  };

  const lit: Record<string, "hot" | "warm"> = {};
  trail.forEach((i) => (lit[items[i].label] = "warm"));
  if (current !== null) lit[items[current].label] = "hot";
  const result = picked !== null ? items[picked] : null;

  return (
    <div className="spin-demo">
      <div className="pills" role="tablist" aria-label="What to spin for">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === tab}
            className={t === tab ? "pill pill-on" : "pill"}
            onClick={() => choose(t)}
            disabled={spinning && t !== tab}
          >
            {t}
          </button>
        ))}
      </div>
      <SpinWheel
        labels={items.map((i) => i.label)}
        lit={lit}
        label={`The spin wheel with eight ${tab.toLowerCase()}`}
      />
      <div className="spin-demo-action">
        {spinning ? (
          <span className="wait-pill">Fate is choosing your next meal...</span>
        ) : (
          <button type="button" className="spin-btn" onClick={spin}>
            {result ? "Spin again" : "Spin"}
          </button>
        )}
      </div>
      <div className="result spin-demo-result" aria-live="polite">
        {result && !spinning && (
          <>
            <p className="result-label">You got:</p>
            <p className="result-value">
              {result.emoji} {result.label}
            </p>
            {result.note && <p className="result-note">{result.note}</p>}
          </>
        )}
      </div>
      <p className="spin-demo-hint">
        {tab === "Nearby"
          ? "Sample places. In the app, this finds real ones near you."
          : "A demo. In the app, the wheel spins on real dishes and places."}
      </p>
    </div>
  );
}
