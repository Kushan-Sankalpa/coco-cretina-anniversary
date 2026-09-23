import { useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import EnvelopeIntro from "./EnvelopeIntro";
import HeartRain from "./HeartRain";
import ScratchReveal from "./ScratchReveal";
import { defaultIntroConfig } from "./introConfig";
import "./intro.css";

function IntroExperience({ onBegin, onComplete, config = {} }) {
  const [step, setStep] = useState("envelope");
  const [isLeaving, setIsLeaving] = useState(false);
  const leavingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const content = { ...defaultIntroConfig, ...config };

  const finishIntro = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    if (prefersReducedMotion) { onComplete(); return; }
    onBegin?.();
    setIsLeaving(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={`intro-experience ${isLeaving ? "intro-leaving" : ""}`}
        animate={{ opacity: isLeaving ? [1, 1, .75, 0] : 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 1.35, times: [0, .3, .6, 1], ease: "easeInOut" }}
        onAnimationComplete={() => { if (leavingRef.current) onComplete(); }}
      >
        <HeartRain rising={isLeaving} />
        <div className="intro-ambient intro-ambient--one" aria-hidden="true" />
        <div className="intro-ambient intro-ambient--two" aria-hidden="true" />

        <AnimatePresence mode="wait" initial={false}>
          {step === "envelope" ? (
            <EnvelopeIntro
              key="envelope"
              heading={content.heading}
              label={content.label}
              helperText={content.envelopeHelper}
              onOpen={() => setStep("scratch")}
            />
          ) : (
            <ScratchReveal
              key="scratch"
              image={content.surpriseImage}
              imageAlt={content.surpriseImageAlt}
              instruction={content.scratchInstruction}
              hiddenMessage={content.hiddenMessage}
              onContinue={finishIntro}
              leaving={isLeaving}
            />
          )}
        </AnimatePresence>

        <p className="intro-corner-note" aria-hidden="true">made with love</p>
        {isLeaving && <motion.div className="intro-rose-wash" aria-hidden="true"
          initial={{ opacity: 0 }} animate={{ opacity: [0, .8, .45] }}
          transition={{ duration: 1.35, ease: "easeInOut" }} />}
      </motion.div>
    </MotionConfig>
  );
}

export default IntroExperience;
