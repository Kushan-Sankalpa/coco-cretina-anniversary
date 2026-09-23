import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export default function FloatingHearts() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className={`ann-hearts ${visible && !reduced ? "ann-effects-active" : ""}`} aria-hidden="true">
      {[12, 36, 72, 89].map((left, i) => (
        <span key={left} style={{ left: `${left}%`, animationDelay: `${i * -4}s`, animationDuration: `${18 + i * 3}s` }}>♡</span>
      ))}
    </div>
  );
}
