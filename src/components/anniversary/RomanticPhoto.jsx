import { useState } from "react";

export default function RomanticPhoto({ src, alt, className = "", eager = false, decorative = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const [loadedSource, setLoadedSource] = useState(null);
  const loaded = loadedSource === src;

  return (
    <div className={`ann-photo ${className}`} aria-hidden={decorative || undefined}>
      {/* A permanent backdrop also covers loading, missing files and network failures. */}
      <div className="ann-photo-placeholder" role={decorative || loaded ? undefined : "img"} aria-label={decorative || loaded ? undefined : alt}>
        <div className="ann-photo-orbit" aria-hidden="true" />
        <div className="ann-photo-monogram" aria-hidden="true"><span>C</span><i>♡</i><span>C</span></div>
        <span className="ann-photo-whisper" aria-hidden="true">Our memory goes here ♥️</span>
      </div>
      {src && failedSource !== src && (
        <img src={src} alt={decorative ? "" : alt} aria-hidden={!loaded || decorative || undefined} loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"} decoding="async"
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoadedSource(src)} onError={() => setFailedSource(src)} />
      )}
    </div>
  );
}
