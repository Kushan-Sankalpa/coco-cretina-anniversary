import { motion } from "framer-motion";

export function FingerIcon() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M18 25V11a3 3 0 0 1 6 0v11-4a3 3 0 0 1 6 0v5-3a3 3 0 0 1 6 0v5-2a3 3 0 0 1 6 0v9c0 8-5 12-12 12-5 0-8-2-11-5l-8-10a3 3 0 0 1 5-3l2 3v-4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#fff5e8" />
  </svg>;
}

export default function TapHint({ reduced }) {
  return <span className="envelope-tap-hint" aria-hidden="true">
    <motion.span className="tap-ripple" animate={reduced ? { opacity: .3 } : { scale: [.6, .6, 1.4], opacity: [0, .5, 0] }} transition={{ duration: 2.8, repeat: Infinity }} />
    <motion.span className="tap-finger" animate={reduced ? undefined : { y: [-7, 0, -7], rotate: [-9, -4, -9] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}><FingerIcon /></motion.span>
  </span>;
}
