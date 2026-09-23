export default function ButterflyAccent({ className = "" }) {
  return (
    <span className={`ann-butterfly ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 48" fill="none">
        <path d="M32 26C22 1 3 1 7 18c1 8 10 11 20 10C8 27 13 45 23 39c5-3 7-8 9-13Zm0 0C42 1 61 1 57 18c-1 8-10 11-20 10 19-1 14 17 4 11-5-3-7-8-9-13Z" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth=".8" />
        <path d="M32 19v17m0-15-5-7m5 7 5-7" stroke="currentColor" strokeLinecap="round" />
      </svg>
    </span>
  );
}
