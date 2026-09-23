import Reveal from "./Reveal";
import LoveWhisper from "./LoveWhisper";

export default function YearsTogether({ data }) {
  return <section className="ann-years ann-section" aria-labelledby="ann-years-title">
    <Reveal className="ann-centered">
      <p className="ann-eyebrow">OUR FAVORITE CHAPTER YET</p>
      <h2 id="ann-years-title">{data.yearsTogether.heading}</h2>
      <p className="ann-years-message">{data.yearsTogether.message}</p>
    </Reveal>
    <LoveWhisper />
  </section>;
}
