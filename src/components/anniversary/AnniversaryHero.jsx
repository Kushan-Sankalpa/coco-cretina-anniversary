import { motion, useReducedMotion } from "framer-motion";
import PhotoBackdrop from "./PhotoBackdrop";
import FloatingHearts from "./FloatingHearts";
import ButterflyAccent from "./ButterflyAccent";

export default function AnniversaryHero({ data, onReadLetter }) {
  const reduced = useReducedMotion();
  return (
    <section className="ann-hero" id="anniversary-top" aria-labelledby="ann-hero-title">
      <PhotoBackdrop image={data.image} hero />
      <FloatingHearts />
      <div className="ann-hero-topline"><span>A LOVE NOTE FROM COCO</span><span>FOR MY FOREVER GIRL</span></div>
      <motion.div className="ann-hero-copy" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.35 }}>
        <p className="ann-eyebrow">YOU, ME & ALL OUR TOMORROWS</p>
        <h1 id="ann-hero-title" tabIndex={-1}>{data.heading}</h1>
        <span className="ann-fine-rule" aria-hidden="true" />
        <p className="ann-hero-message">{data.message}</p>
        <p className="ann-hero-dedication">{data.dedication}</p>
        <button className="ann-button ann-button-light" onClick={onReadLetter}>A little something for you <span aria-hidden="true">↓</span></button>
        <ButterflyAccent className="ann-butterfly-hero" />
      </motion.div>
      <div className="ann-hero-bottom"><span>COCO <i>♡</i> CRETINA</span><button onClick={onReadLetter}>SCROLL INTO OUR LITTLE WORLD <span aria-hidden="true">↓</span></button><span>ALWAYS, & THEN SOME.</span></div>
    </section>
  );
}
