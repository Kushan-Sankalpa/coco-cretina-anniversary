import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import FloatingHearts from "./FloatingHearts";
import ButterflyAccent from "./ButterflyAccent";
import { nextSpinRotation, segmentPath, wheelPoint, winnerAtRotation } from "./wheelGeometry";
import "./spinWheel.css";

function WheelLabel({ item, index, count, rotation }) {
  const point = wheelPoint(-90 + index * 360 / count, 161);
  // Labels move around the circle but stay upright, including when the spin ends.
  const counterRotation = useTransform(rotation, (angle) => -angle);
  return <motion.g style={{ rotate: counterRotation, transformBox: "view-box", transformOrigin: `${point.x}px ${point.y}px` }} className="ann-wheel-label">
    <text x={point.x} y={point.y - 20} textAnchor="middle" className="ann-wheel-emoji">{item.emoji}</text>
    <text x={point.x} y={point.y + 7} textAnchor="middle">
      {item.lines.map((line, i) => <tspan key={line} x={point.x} dy={i === 0 ? 0 : 25}>{line}</tspan>)}
    </text>
  </motion.g>;
}

export default function LoveSpinWheel({ data }) {
  const rimId = `wheel-rim-${useId().replaceAll(":", "")}`;
  const rotation = useMotionValue(0);
  const reduced = useReducedMotion();
  const controlsRef = useRef(null);
  const spinningRef = useRef(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [spinCount, setSpinCount] = useState(0);
  const pendingRef = useRef(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => () => {
    controlsRef.current?.stop();
    spinningRef.current = false;
  }, []);

  const finish = useCallback((target) => {
    if (!spinningRef.current) return;
    spinningRef.current = false;
    setSpinning(false);
    setResult(data.items[winnerAtRotation(target, data.items.length)]);
    setSpinCount((count) => count + 1);
    pendingRef.current = null;
  }, [data.items]);

  useEffect(() => {
    if (reduced && spinningRef.current && pendingRef.current !== null) {
      const target = pendingRef.current;
      controlsRef.current?.stop();
      rotation.set(target);
      finish(target);
    }
  }, [reduced, rotation, finish]);

  const spin = () => {
    if (spinningRef.current || data.items.length < 2) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult(null);
    const selected = Math.floor(Math.random() * data.items.length);
    const offset = (Math.random() - .5) * (360 / data.items.length) * .3;
    const target = nextSpinRotation(rotation.get(), selected, data.items.length, reducedRef.current ? 0 : 6, offset);
    pendingRef.current = target;
    if (reducedRef.current) {
      rotation.set(target);
      finish(target);
      return;
    }
    controlsRef.current = animate(rotation, target, {
      duration: 5.2,
      ease: [.12, .72, .12, 1],
      onComplete: () => finish(target),
    });
  };

  return <section className="ann-spin-section" aria-labelledby="ann-spin-title">
    <FloatingHearts />
    <div className="ann-section">
      <Reveal className="ann-section-heading ann-centered">
        <p className="ann-eyebrow">A LITTLE CHANCE. A WHOLE LOT OF LOVE.</p>
        <h2 id="ann-spin-title">{data.heading}</h2>
        <p>{data.subtitle}</p>
        <ButterflyAccent className="ann-wheel-butterfly" />
      </Reveal>
      <Reveal className="ann-wheel-content">
        <div className={`ann-wheel-stage ${spinning ? "is-spinning" : ""}`} aria-busy={spinning}>
          <div className="ann-wheel-halo" aria-hidden="true" />
          <motion.svg className="ann-wheel-disc" viewBox="0 0 560 560" style={{ rotate: rotation }} aria-hidden="true">
            <defs><radialGradient id={rimId}><stop offset=".88" stopColor="#e1c5a7" /><stop offset=".95" stopColor="#fff8ea" /><stop offset="1" stopColor="#d5b69f" /></radialGradient></defs>
            <circle cx="280" cy="280" r="271" fill={`url(#${rimId})`} stroke="#bb9385" strokeWidth="1" />
            <circle cx="280" cy="280" r="257" fill="#885769" />
            {data.items.map((item, index) => <path className="ann-wheel-segment" data-selected={result?.id === item.id} key={item.id} d={segmentPath(index, data.items.length)} fill={item.color} stroke={result?.id === item.id ? "#966276" : "#fff5e4"} strokeWidth={result?.id === item.id ? 3 : 1.5} />)}
            <circle cx="280" cy="280" r="247" fill="none" stroke="#fff7e6" strokeWidth="4" />
            {Array.from({ length: 28 }, (_, i) => {
              const point = wheelPoint(i * 360 / 28, 263);
              return <circle key={i} cx={point.x} cy={point.y} r="1.2" fill="#a77875" opacity=".5" />;
            })}
            {data.items.map((item, index) => <WheelLabel key={item.id} item={item} index={index} count={data.items.length} rotation={rotation} />)}
          </motion.svg>
          <svg className="ann-wheel-pointer" viewBox="0 0 40 54" aria-hidden="true"><path d="M3 4Q20-2 37 4L23 48Q20 54 17 48Z" fill="#75354f" stroke="#f9debf" strokeWidth="2" /><circle cx="20" cy="14" r="4" fill="#e8bf9d" /></svg>
          <button className="ann-wheel-hub" onClick={spin} disabled={spinning} aria-label={spinning ? "Wheel spinning" : "Spin the love wheel"}><span aria-hidden="true">♥</span></button>
          {result && !reduced && <div className="ann-wheel-burst" key={spinCount} aria-hidden="true">
            {["♡", "✦", "♡", "✦", "♡"].map((glyph, i) => <motion.span key={i}
              initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: (i - 2) * 37, y: -85 - (i % 2) * 25, opacity: [0, .8, 0] }}
              transition={{ duration: 1.1, delay: i * .05 }}>{glyph}</motion.span>)}
          </div>}
        </div>
        <button className="ann-button ann-spin-button" onClick={spin} disabled={spinning}>
          {spinning ? data.spinningLabel : spinCount ? data.againLabel : data.spinLabel}
        </button>
        <div className="ann-wheel-result-slot" role="status" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {result ? <motion.div key={spinCount} className="ann-wheel-result" initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }}>
              <span className="ann-wheel-result-eyebrow">A LITTLE PROMISE, JUST FOR YOU</span>
              <h3>You got: {result.label} {result.emoji}</h3>
              <p>{result.message}</p>
            </motion.div> : <p key="waiting" className="ann-wheel-waiting">{spinning ? "Let's see how Coco gets to spoil you..." : "A little surprise, whichever way it lands."}</p>}
          </AnimatePresence>
        </div>
      </Reveal>
    </div>
  </section>;
}
