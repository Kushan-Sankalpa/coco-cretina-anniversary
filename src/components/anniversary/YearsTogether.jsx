import { motion, useReducedMotion } from "framer-motion";
import { getAnniversaryState } from "../../data/anniversaryDates";
import Reveal from "./Reveal";
import LoveWhisper from "./LoveWhisper";

export default function YearsTogether({ data }) {
  const state = getAnniversaryState(data);
  const reduced = useReducedMotion();
  const stats = [[state.years, "Years Together"], [state.months, "Months of Us"], ["∞", "Memories Still to Make"]];
  return <section className="ann-years ann-section" aria-labelledby="ann-years-title">
    <Reveal className="ann-centered">
      <p className="ann-eyebrow">OUR FAVORITE CHAPTER YET</p>
      <h2 id="ann-years-title">{data.currentAnniversaryNumber} Years of Us ♥️</h2>
      <p className="ann-years-message">{data.yearsTogether.message}</p>
    </Reveal>
    <div className="ann-years-grid">
      {stats.map(([value, label], i) => <Reveal key={label} delay={i * .08}>
        <div className="ann-year-stat"><motion.strong initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>{value}</motion.strong><span>{label}</span></div>
      </Reveal>)}
    </div>
    <LoveWhisper />
  </section>;
}
