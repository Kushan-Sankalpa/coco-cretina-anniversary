import Reveal from "./Reveal";
import RomanticPhoto from "./RomanticPhoto";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";

export default function LoveTimeline({ data }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 70%"] });
  return (
    <section className="ann-timeline-section" id="anniversary-story" aria-labelledby="ann-story-title">
      <div className="ann-section">
        <Reveal className="ann-section-heading ann-centered"><p className="ann-eyebrow">04 / EVERY CHAPTER LED ME TO YOU</p><h2 id="ann-story-title">{data.heading}</h2><p>Not a perfect story. Our favorite one.</p></Reveal>
        <div className="ann-timeline-track" ref={ref}>
          <motion.div className="ann-timeline-progress" aria-hidden="true" style={{ scaleY: reduced ? 1 : scrollYProgress }} />
        <ol className="ann-timeline">
          {data.items.map((item, index) => (
            <li key={`${item.date}-${item.title}`}>
              <span className="ann-timeline-dot" aria-hidden="true">♡</span>
              <Reveal className="ann-timeline-entry">
                <div className="ann-timeline-copy"><p className="ann-eyebrow">{item.date}</p><h3>{item.title}</h3><p>{item.message}</p></div>
                <div className="ann-timeline-photo"><RomanticPhoto src={item.image} alt={item.title} /><span aria-hidden="true">chapter {String(index + 1).padStart(2, "0")}</span></div>
              </Reveal>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
