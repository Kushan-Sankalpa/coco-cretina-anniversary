import { motion, useReducedMotion } from "framer-motion";

// One observer per meaningful block, once only; never one animation per paragraph.
export default function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
