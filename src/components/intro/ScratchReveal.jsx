import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RomanticPhoto from "../anniversary/RomanticPhoto";
import { FingerIcon } from "./TapHint";
import { ScratchEngine, paintScratchCover } from "./scratchEngine";

export default function ScratchReveal({ image, imageAlt, instruction, hiddenMessage, onContinue, leaving = false }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const coverageTimer = useRef(null);
  const revealedRef = useRef(false);
  const headingRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();
  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    clearTimeout(coverageTimer.current);
    coverageTimer.current = null;
    if (engineRef.current) engineRef.current.pointerId = null;
    setRevealed(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new ScratchEngine(canvas, () => document.createElement("canvas"), paintScratchCover);
    engineRef.current = engine;
    const resize = () => engine.resize(canvas.clientWidth, canvas.clientHeight, window.devicePixelRatio || 1);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      clearTimeout(coverageTimer.current);
      coverageTimer.current = null;
      engineRef.current = null;
    };
  }, []);

  const checkCoverage = () => {
    coverageTimer.current = null;
    if (!revealedRef.current && engineRef.current?.coverage() >= .42) reveal();
  };
  const scheduleCheck = () => {
    if (coverageTimer.current === null) coverageTimer.current = setTimeout(checkCoverage, 160);
  };
  const down = (event) => {
    if (revealedRef.current || leaving) return;
    const canvas = event.currentTarget;
    if (engineRef.current?.begin(event.nativeEvent, canvas.getBoundingClientRect())) {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      setStarted(true);
      scheduleCheck();
    }
  };
  const move = (event) => {
    if (revealedRef.current) return;
    if (engineRef.current?.move(event.nativeEvent, event.currentTarget.getBoundingClientRect())) {
      event.preventDefault();
      scheduleCheck();
    }
  };
  const end = (event) => {
    if (engineRef.current?.end(event.nativeEvent)) {
      clearTimeout(coverageTimer.current);
      checkCoverage();
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <motion.section className={`intro-panel scratch-intro ${leaving ? "scratch-leaving" : ""}`}
      aria-labelledby="scratch-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .4 }}>
      <div className="scratch-heading">
        <p className="intro-kicker">A little something from my heart</p>
        <h1 id="scratch-title" ref={headingRef} tabIndex={-1}>{instruction}</h1>
        <p>Just your finger, and a little curiosity.</p>
      </div>
      {/* No rotation or scale during scratching: pointer and canvas coordinate spaces stay aligned. */}
      <motion.div className={`surprise-card ${revealed ? "is-revealed" : ""}`}
        animate={{ scale: leaving && !reduced ? .95 : 1, opacity: leaving ? .4 : 1 }}
        transition={{ duration: reduced ? 0 : .7 }}>
        <div className="scratch-frame">
          <motion.div className="scratch-photo" animate={{ scale: revealed && !reduced ? 1.025 : 1 }} transition={{ duration: 1 }}>
            <RomanticPhoto src={image} alt={imageAlt} eager />
          </motion.div>
          <motion.canvas ref={canvasRef} className="scratch-canvas" role="button"
            tabIndex={revealed ? -1 : 0} aria-label="Scratch to reveal the photograph, or press Enter."
            initial={{ opacity: 1 }} animate={{ opacity: revealed ? 0 : 1 }}
            style={{ pointerEvents: revealed ? "none" : "auto" }}
            transition={{ duration: reduced ? 0 : .8 }}
            onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setStarted(true); reveal(); }
            }} />
          <AnimatePresence>
            {!started && !revealed && <motion.div className="swipe-hint" aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
              <span className="swipe-trail" />
              <motion.span className="swipe-finger" animate={reduced ? undefined : { x: [-32, 0, 32, -32], y: [5, -5, 5, 5], rotate: [-12, 0, 12, -12] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", repeatDelay: .5 }}><FingerIcon /></motion.span>
              <span className="swipe-label">gently, side to side</span>
            </motion.div>}
          </AnimatePresence>
          {revealed && !reduced && <div className="scratch-heart-burst" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <motion.span key={i} initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, .8, 0], x: (i - 2) * 38, y: -70 - (i % 3) * 22 }}
              transition={{ duration: 1.3, delay: i * .07 }}>♡</motion.span>)}
          </div>}
        </div>
        <p className="surprise-card-caption">{revealed ? "My favorite picture. My favorite person." : "A memory worth uncovering."}</p>
      </motion.div>
      <div className="scratch-after" aria-live="polite">
        {revealed ? <motion.div initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .55 }}>
          <p className="scratch-message">{hiddenMessage}</p>
          <button className="intro-continue-button" onClick={onContinue} disabled={leaving}>Continue to our story ♥️ <span aria-hidden="true">→</span></button>
        </motion.div> : <button className="scratch-reveal-alternative" onClick={reveal}>Or tap here to reveal ♡</button>}
      </div>
    </motion.section>
  );
}
