import { useRef, useState } from "react";
import IntroExperience from "./components/intro/IntroExperience";
import AnniversaryMain from "./components/anniversary/AnniversaryMain";
import AnniversaryMusic from "./components/AnniversaryMusic";

export default function App() {
  const [phase, setPhase] = useState("intro");
  const musicRef = useRef(null);
  return (
    <>
      <AnniversaryMusic ref={musicRef} />
      {phase !== "intro" && <div className={phase === "entering" ? "story-underlay" : undefined} inert={phase === "entering"}>
        <AnniversaryMain active={phase === "main"} onOpenGift={() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          setPhase("intro");
        }} />
      </div>}
      {phase !== "main" && <IntroExperience
        onEnvelopeOpen={() => musicRef.current?.start()}
        onBegin={() => setPhase("entering")}
        onComplete={() => setPhase("main")} />}
    </>
  );
}
