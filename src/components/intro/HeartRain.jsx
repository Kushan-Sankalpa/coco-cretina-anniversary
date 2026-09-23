const HEARTS = [
  { left: 7, delay: -3, duration: 18, size: 12, drift: 18, glyph: "♡" },
  { left: 22, delay: -11, duration: 22, size: 8, drift: -12, glyph: "♥" },
  { left: 43, delay: -7, duration: 20, size: 7, drift: 15, glyph: "·" },
  { left: 68, delay: -14, duration: 25, size: 11, drift: -18, glyph: "♡" },
  { left: 90, delay: -5, duration: 19, size: 9, drift: 10, glyph: "♥" },
  { left: 15, delay: -18, duration: 27, size: 6, drift: -15, glyph: "·" },
  { left: 55, delay: -10, duration: 24, size: 10, drift: 16, glyph: "♡" },
  { left: 80, delay: -21, duration: 29, size: 7, drift: -8, glyph: "♥" },
];
export default function HeartRain({ rising = false }) {
  return <div className={`intro-heart-rain ${rising ? "hearts-rising" : ""}`} aria-hidden="true">
    {HEARTS.map((heart, index) => <span className="intro-raining-heart" key={index} style={{
      left: `${heart.left}%`, fontSize: heart.size, "--delay": `${heart.delay}s`,
      "--duration": `${heart.duration}s`, "--drift": `${heart.drift}px`,
    }}>{heart.glyph}</span>)}
  </div>;
}
