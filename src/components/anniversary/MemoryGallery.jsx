import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import RomanticPhoto from "./RomanticPhoto";
import ButterflyAccent from "./ButterflyAccent";

export default function MemoryGallery({ data }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const photo = data.photos[selected];

  const openPhoto = (index) => {
    setSelected(index);
    dialogRef.current.showModal();
  };

  return (
    <section className="ann-memories-section" id="anniversary-memories" aria-labelledby="ann-memories-title">
      <div className="ann-section">
        <Reveal className="ann-section-heading ann-centered">
          <p className="ann-eyebrow">02 / THE MOMENTS WE KEEP</p>
          <h2 id="ann-memories-title">{data.heading}<ButterflyAccent /></h2>
          <p>{data.subtitle}</p>
        </Reveal>
        <div className="ann-memory-grid">
          {data.photos.map((item, index) => (
            <Reveal key={item.image} delay={reduced ? 0 : (index % 3) * 0.08}>
              <motion.button className="ann-polaroid" onClick={() => openPhoto(index)}
                style={{ rotate: reduced ? 0 : item.rotation }}
                whileHover={reduced ? undefined : { y: -5, rotate: 0, scale: 1.01 }}
                whileTap={reduced ? undefined : { scale: 1.02, rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-label={`View memory: ${item.caption}`} aria-haspopup="dialog">
                <RomanticPhoto src={item.image} alt={item.caption} />
                <span className="ann-polaroid-caption">{item.caption}</span>
                <span className="ann-polaroid-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </motion.button>
            </Reveal>
          ))}
        </div>
        <p className="ann-gallery-hint">A little closer? Tap a memory.</p>
      </div>
      {/* Native modal provides focus trapping, Escape dismissal and focus restoration. */}
      <dialog ref={dialogRef} className="ann-photo-dialog" aria-labelledby="ann-dialog-caption"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const direction = event.key === "ArrowLeft" ? -1 : 1;
            setSelected((current) => (current + direction + data.photos.length) % data.photos.length);
          }
        }}
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
        <div className="ann-dialog-content">
          <button className="ann-dialog-close" autoFocus onClick={() => dialogRef.current.close()} aria-label="Close photo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <RomanticPhoto key={photo.image} src={photo.image} alt={photo.caption} />
          <div className="ann-dialog-controls">
            <button onClick={() => setSelected((selected + data.photos.length - 1) % data.photos.length)} aria-label="Previous photo">←</button>
            <p id="ann-dialog-caption" aria-live="polite">{photo.caption}</p>
            <button onClick={() => setSelected((selected + 1) % data.photos.length)} aria-label="Next photo">→</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
