import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import ButterflyAccent from "../anniversary/ButterflyAccent";
import TapHint from "./TapHint";
import { flapPath } from "./envelopeGeometry";

// Every fold shares the same SVG coordinates. The full back remains behind all
// folds, so subpixel antialiasing cannot expose white seams on Safari.
export function EnvelopeArt({ opened, reduced }) {
  const id = useId().replaceAll(":", "");
  const paint = (name) => `url(#${id}-${name})`;
  const ease = [0.22, 0.8, 0.3, 1];
  const angle = useMotionValue(opened ? 180 : 0);
  const flap = useTransform(angle, flapPath);
  const frontOpacity = useTransform(angle, [0, 89.5, 90, 180], [1, 1, 0, 0]);
  const backOpacity = useTransform(angle, [0, 90, 90.5, 180], [0, 0, 1, 1]);
  const foldShade = useTransform(angle, [0, 55, 90, 180], [0, .13, .2, 0]);
  const castShadow = useTransform(angle, [0, 40, 85, 100, 180], [.1, .17, .04, 0, 0]);
  useEffect(() => {
    if (reduced) { angle.set(opened ? 180 : 0); return; }
    const animation = animate(angle, opened ? 180 : 0, {
      duration: .88, delay: opened ? .2 : 0, ease: [.42, 0, .25, 1],
    });
    return () => animation.stop();
  }, [angle, opened, reduced]);
  return (
    <svg className="envelope-art" viewBox="0 0 440 390" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-paper`} x2=".3" y2="1"><stop stopColor="#ffe7dd" /><stop offset="1" stopColor="#e8b5b0" /></linearGradient>
        <linearGradient id={`${id}-left`} x2="1" y2="1"><stop stopColor="#f8d7cb" /><stop offset="1" stopColor="#e5aaa8" /></linearGradient>
        <linearGradient id={`${id}-right`} x1="1" x2="0" y2="1"><stop stopColor="#f5d3c9" /><stop offset="1" stopColor="#d89d9f" /></linearGradient>
        <linearGradient id={`${id}-bottom`} x2="0" y2="1"><stop stopColor="#f9dad0" /><stop offset="1" stopColor="#edbeb6" /></linearGradient>
        <linearGradient id={`${id}-letter`} x2=".2" y2="1"><stop stopColor="#fffdf5" /><stop offset="1" stopColor="#f5e8d8" /></linearGradient>
        <radialGradient id={`${id}-wax`} cx=".3" cy=".2" r=".85"><stop stopColor="#bd5b70" /><stop offset=".6" stopColor="#8f304e" /><stop offset="1" stopColor="#65203c" /></radialGradient>
        <pattern id={`${id}-liner`} width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#7b2946" /><circle cx="7" cy="7" r=".7" fill="#d5a199" opacity=".35" /></pattern>
        <clipPath id={`${id}-body`}><rect x="26" y="145" width="388" height="225" rx="16" /></clipPath>
      </defs>
      <motion.ellipse cx="220" cy="379" rx="167" ry="9" fill="#27061b" initial={false}
        animate={reduced || opened ? { opacity: .17 } : { opacity: [.16, .25, .16], rx: [162, 172, 162] }}
        transition={{ duration: 4.6, repeat: reduced || opened ? 0 : Infinity }} />
      {/* The reverse face appears behind the letter only after passing the hinge. */}
      <motion.path d={flap} style={{ opacity: backOpacity }} fill={paint("liner")} stroke="#c4948c" strokeWidth=".8" />
      <rect x="26" y="145" width="388" height="225" rx="16" fill={paint("paper")} stroke="#d39a98" strokeWidth="1" />
      <rect x="32" y="150" width="376" height="205" rx="12" fill={paint("liner")} />
      <motion.g initial={false} animate={{ y: opened ? -87 : 0 }} transition={{ duration: reduced ? 0 : .72, delay: reduced ? 0 : .86, ease }}>
        <rect x="55" y="164" width="330" height="185" rx="7" fill="#552439" opacity=".12" />
        <rect x="57" y="158" width="326" height="185" rx="7" fill={paint("letter")} stroke="#e5d0bb" />
        <rect x="67" y="168" width="306" height="165" rx="3" fill="none" stroke="#c4a58a" strokeOpacity=".35" />
        <text x="220" y="194" textAnchor="middle" fill="#a27a73" fontSize="9" letterSpacing="3">TO MY FOREVER GIRL</text>
        <text x="220" y="235" textAnchor="middle" className="envelope-letter-script" fill="#8b3b54">only you</text>
        <text x="220" y="265" textAnchor="middle" fill="#a75267" fontSize="18">♡</text>
      </motion.g>
      <g clipPath={paint("body")}>
        <path d="M26 146 L236 284 L26 372Z" fill={paint("left")} />
        <path d="M414 146 L204 284 L414 372Z" fill={paint("right")} />
        <path d="M24 372 L199 258 Q220 244 241 258 L416 372Z" fill={paint("bottom")} stroke="#d6a39d" strokeWidth="1" />
        <path d="M30 367 L200 261 Q220 247 240 261 L410 367" fill="none" stroke="#fff0e3" strokeOpacity=".5" />
      </g>
      <path d="M32 146 H408" stroke="#fce5d7" strokeWidth="1" opacity=".65" />
      <g transform="translate(0 4)"><motion.path d={flap} fill="#54263a" style={{ opacity: castShadow }} /></g>
      <motion.g style={{ opacity: frontOpacity }}>
        <motion.path d={flap} fill={paint("paper")} stroke="#d9a69e" strokeWidth=".8" />
        <motion.path d={flap} fill="#623346" style={{ opacity: foldShade }} />
      </motion.g>
      <motion.g initial={false} animate={{ opacity: opened ? 0 : 1, scale: opened ? 1.12 : 1 }}
        style={{ transformBox: "view-box", transformOrigin: "220px 266px" }} transition={{ duration: reduced ? 0 : .25 }}>
        <circle cx="220" cy="270" r="30" fill="#562036" opacity=".16" />
        <path d="M220 234 C231 232 236 239 244 244 C252 250 249 259 251 268 C252 280 244 285 236 291 C229 299 219 296 210 296 C198 294 194 286 190 277 C186 268 190 259 190 251 C194 240 204 237 220 234Z" fill={paint("wax")} />
        <circle cx="220" cy="266" r="23" fill="none" stroke="#e5a79e" strokeOpacity=".54" />
        <circle cx="220" cy="266" r="20" fill="none" stroke="#6c2340" strokeOpacity=".6" />
        <path d="M220 275 C214 271 207 266 210 260 C213 254 218 258 220 261 C222 258 227 254 230 260 C233 266 226 271 220 275Z" fill="#eeb6a5" stroke="#732940" strokeWidth=".7" />
      </motion.g>
    </svg>
  );
}

export default function EnvelopeIntro({ heading, label, helperText, onOpen, onOpening }) {
  const [opened, setOpened] = useState(false);
  const openingRef = useRef(false);
  const timer = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);
  const open = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    onOpening?.();
    setOpened(true);
    timer.current = setTimeout(onOpen, reduced ? 50 : 1750);
  };
  return (
    <motion.section className="intro-panel envelope-intro" aria-labelledby="intro-title"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : .25 }}>
      <div className="intro-heading-group">
        <p className="intro-kicker">{label}</p>
        <h1 id="intro-title">{heading}</h1>
        <ButterflyAccent className="intro-heading-butterfly" />
      </div>
      <motion.button className="romantic-envelope" onClick={open} disabled={opened} aria-label="Open your anniversary surprise"
        animate={reduced || opened ? { y: 0, scale: 1 } : { y: [0, -5, 0], scale: [1, 1.006, 1] }}
        transition={{ duration: opened ? .2 : 4.6, repeat: reduced || opened ? 0 : Infinity, ease: "easeInOut" }}>
        <motion.span className="envelope-halo" aria-hidden="true"
          animate={{ opacity: opened ? .9 : .35, scale: opened ? 1.2 : 1 }}
          transition={{ duration: reduced ? 0 : .65, delay: opened && !reduced ? .65 : 0 }} />
        <EnvelopeArt opened={opened} reduced={reduced} />
        {!opened && <TapHint reduced={reduced} />}
        <span className="envelope-idle-spark" aria-hidden="true">✦</span>
        {opened && !reduced && <span className="envelope-escape" aria-hidden="true">
          {["♡", "butterfly", "♡"].map((glyph, i) => <motion.span key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: .7 }}
            animate={{ opacity: [0, .6, 0], x: (i - 1) * 48, y: -100 - i * 13, scale: 1 }}
            transition={{ duration: .8, delay: .9 + i * .05 }}>{glyph === "butterfly" ? <ButterflyAccent /> : glyph}</motion.span>)}
        </span>}
      </motion.button>
      <p className="intro-helper" aria-live="polite">{opened ? "A little love, just for you..." : helperText}</p>
    </motion.section>
  );
}
