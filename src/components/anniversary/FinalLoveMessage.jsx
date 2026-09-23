import Reveal from "./Reveal";
import RomanticPhoto from "./RomanticPhoto";
import FloatingHearts from "./FloatingHearts";
import ButterflyAccent from "./ButterflyAccent";
import { motion, useReducedMotion } from "framer-motion";

export default function FinalLoveMessage({ data, onReplay, onOpenGift }) {
  const reduced = useReducedMotion();
  return (
    <section className="ann-final" aria-labelledby="ann-final-title">
      <FloatingHearts />
      <div className="ann-final-glow" aria-hidden="true">♥</div>
      <Reveal className="ann-final-content">
        <div className="ann-final-photo"><RomanticPhoto src={data.image} alt="A collage of Coco and Cretina's memories together" /></div>
        <p className="ann-eyebrow">06 / ALWAYS YOU</p>
        <h2 id="ann-final-title">{data.heading}</h2>
        <div className="ann-final-promise ann-script">{data.promise.split("\n").map((line, i) =>
          <motion.p key={line} initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: .65, delay: reduced ? 0 : i * .14 }}>{line}</motion.p>)}</div>
        <ButterflyAccent className="ann-final-butterfly" />
        <p className="ann-final-anniversary">{data.anniversary}</p>
        <p className="ann-final-signature ann-script">{data.signature}</p>
        <button className="ann-button" onClick={onReplay}>{data.replay}<span aria-hidden="true">↑</span></button>
        {onOpenGift && <button className="ann-open-gift" onClick={onOpenGift}>Open my gift again</button>}
      </Reveal>
      <div className="ann-colophon"><span>COCO & CRETINA</span><span>A LITTLE CORNER OF FOREVER ♡</span></div>
    </section>
  );
}
