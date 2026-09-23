import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "framer-motion";
import RomanticPhoto from "./RomanticPhoto";

export default function PhotoBackdrop({ image, hero = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const visible = useInView(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  return (
    <div className={`ann-backdrop ${hero ? "ann-backdrop-hero" : ""} ${visible ? "ann-effects-active" : ""}`} ref={ref} aria-hidden="true">
      <motion.div className="ann-parallax" style={{ y: reduced ? 0 : y }}
        initial={hero && !reduced ? { opacity: 0, scale: 1.025 } : false}
        animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 1.5 }}>
        <RomanticPhoto src={image} alt="" eager={hero} decorative />
      </motion.div>
      <div className="ann-backdrop-shade" />
    </div>
  );
}
