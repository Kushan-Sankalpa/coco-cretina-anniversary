import { useState } from "react";

export default function LoveWhisper() {
  const [open, setOpen] = useState(false);
  return <div className="ann-love-whisper">
    <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="A little secret from Coco">♡</button>
    <p aria-live="polite">{open ? "psst... Coco loves you ♥️" : "a little secret, just for you"}</p>
  </div>;
}
