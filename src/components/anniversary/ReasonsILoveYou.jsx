import Reveal from "./Reveal";
import { useState } from "react";

export default function ReasonsILoveYou({ data }) {
  const [loved, setLoved] = useState([]);
  return (
    <section className="ann-reasons-section ann-section" aria-labelledby="ann-reasons-title">
      <Reveal className="ann-section-heading ann-centered"><p className="ann-eyebrow">03 / THE LIST NEVER REALLY ENDS</p><h2 id="ann-reasons-title">{data.heading}</h2><p>Eight little reasons. A thousand more in my heart.</p></Reveal>
      <div className="ann-reasons-grid">
        {data.items.map((reason, index) => (
          <Reveal key={reason} delay={(index % 4) * 0.06}>
            <button className="ann-reason" aria-pressed={loved.includes(index)} aria-label={reason}
              onClick={() => setLoved((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}>
              <span className="ann-reason-top"><span>{String(index + 1).padStart(2, "0")}</span><span className="ann-reason-heart" aria-hidden="true">{loved.includes(index) ? "♥" : "♡"}</span></span>
              <span className="ann-reason-title">{reason}</span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
