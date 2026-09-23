import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { getAnniversaryCountdownState, getCountdown } from "../../data/anniversaryDates";
import Reveal from "./Reveal";

export default function AnniversaryCountdown({ data }) {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const state = getAnniversaryCountdownState(data, now);
  const hasTarget = Boolean(state.nextDate);
  useEffect(() => {
    if (!visible || !hasTarget) return;
    let timer;
    const tick = () => setNow(new Date());
    const sync = () => {
      clearInterval(timer);
      if (!document.hidden) { tick(); timer = setInterval(tick, 1000); }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", sync); };
  }, [visible, hasTarget]);
  const values = getCountdown(state.nextDate, now);
  return <section className="ann-countdown-section" ref={ref} aria-labelledby="ann-countdown-title">
    <div className="ann-section">
      <Reveal className="ann-section-heading ann-centered">
        <p className="ann-eyebrow">MORE US, PLEASE</p>
        <h2 id="ann-countdown-title">Until Our Next Anniversary <span className="ann-countdown-heart">♥️</span></h2>
        <p>{data.countdown.subtitle}</p>
      </Reveal>
      <div className="ann-countdown-grid" role="timer" aria-label={values ? "Time until our next anniversary" : "Anniversary date to be set"} aria-live="off">
        {Object.entries(data.countdown.labels).map(([label, title]) => <div className="ann-countdown-card" key={label}>
          <motion.strong key={values?.[label] ?? "unset"} initial={reduced ? false : { opacity: .7 }}
            animate={{ opacity: 1 }} transition={{ duration: .2 }}>
            {values ? String(values[label]).padStart(2, "0") : "—"}
          </motion.strong><span>{title}</span>
        </div>)}
      </div>
      <p className="ann-countdown-note">{state.nextDate
        ? `${state.provisional ? "Temporary target · " : ""}${state.nextDate.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}`
        : data.countdown.unconfiguredMessage}</p>
      <p className="ann-couple-divider">{data.coupleName1} ♡ {data.coupleName2}</p>
    </div>
  </section>;
}
