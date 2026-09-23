import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { anniversaryData } from "../data/anniversaryData";
import "./anniversaryMusic.css";

// Lives outside the intro/main switch so the same audio keeps playing throughout.
const AnniversaryMusic = forwardRef(function AnniversaryMusic(_, ref) {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setStarted(true);
    setError("");
    if (audio.error) audio.load();
    audio.volume = anniversaryData.music.volume;
    // Called directly inside the envelope click, before any timer/animation.
    // This preserves the user gesture required by mobile audio playback.
    const pending = audio.play();
    pending?.catch(() => setError("Tap the music button to try playing again."));
  };
  useImperativeHandle(ref, () => ({ start: play }));

  return <>
    <audio ref={audioRef} src={anniversaryData.music.src} preload="none" loop
      onPlaying={() => { setPlaying(true); setError(""); }}
      onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setError("Music couldn't load. Tap to try again."); }} />
    {started && <div className="ann-music-control">
      <button type="button" aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause music" : "Play music"} aria-pressed={playing}
        onClick={() => playing ? audioRef.current?.pause() : play()}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10 17V6l10-2v11M10 9l10-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="7" cy="17.5" rx="3" ry="2.5" fill="currentColor" />
          <ellipse cx="17" cy="15.5" rx="3" ry="2.5" fill="currentColor" />
          {!playing && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
        </svg>
      </button>
      {error && <p role="status">{error}</p>}
    </div>}
  </>;
});

export default AnniversaryMusic;
