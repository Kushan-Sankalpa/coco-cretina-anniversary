import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { anniversaryData } from "../../data/anniversaryData";
import AnniversaryHero from "./AnniversaryHero";
import LoveLetter from "./LoveLetter";
import MemoryGallery from "./MemoryGallery";
import ReasonsILoveYou from "./ReasonsILoveYou";
import LoveTimeline from "./LoveTimeline";
import FutureTogether from "./FutureTogether";
import FinalLoveMessage from "./FinalLoveMessage";
import YearsTogether from "./YearsTogether";
import AnniversaryCountdown from "./AnniversaryCountdown";
import LoveSpinWheel from "./LoveSpinWheel";
import "@fontsource/allura/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./anniversary.css";

export default function AnniversaryMain({ active = true, onOpenGift }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("ann-hero-title")?.focus({ preventScroll: true });
  }, [active]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  const replay = () => {
    document.getElementById("ann-hero-title")?.focus({ preventScroll: true });
    scrollTo("anniversary-top");
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="ann-main">
        <AnniversaryHero data={anniversaryData.hero} onReadLetter={() => scrollTo("anniversary-letter")} />
        <YearsTogether data={anniversaryData} />
        <AnniversaryCountdown data={anniversaryData} />
        <LoveLetter data={anniversaryData.letter} cuteLabel={anniversaryData.cuteLabel} />
        <MemoryGallery data={anniversaryData.memories} />
        <LoveSpinWheel data={anniversaryData.spinWheel} />
        <ReasonsILoveYou data={anniversaryData.reasons} />
        <LoveTimeline data={anniversaryData.timeline} />
        <FutureTogether data={anniversaryData.future} />
        <FinalLoveMessage data={anniversaryData.final} onReplay={replay} onOpenGift={onOpenGift} />
      </main>
    </MotionConfig>
  );
}
