import { useState } from "react";
import IntroExperience from "./components/intro/IntroExperience";
import AnniversaryMain from "./components/anniversary/AnniversaryMain";

export default function App() {
  const [phase, setPhase] = useState("intro");
  return (
    <>
      {phase !== "intro" && <div className={phase === "entering" ? "story-underlay" : undefined} inert={phase === "entering"}>
        <AnniversaryMain active={phase === "main"} onOpenGift={() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          setPhase("intro");
        }} />
      </div>}
      {phase !== "main" && <IntroExperience
        onBegin={() => setPhase("entering")}
        onComplete={() => setPhase("main")} />}
    </>
  );
}
