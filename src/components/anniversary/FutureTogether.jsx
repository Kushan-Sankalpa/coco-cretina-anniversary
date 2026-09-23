import Reveal from "./Reveal";
import PhotoBackdrop from "./PhotoBackdrop";

export default function FutureTogether({ data }) {
  return (
    <section className="ann-future" aria-labelledby="ann-future-title">
      <PhotoBackdrop image={data.image} />
      <Reveal className="ann-future-copy"><p className="ann-eyebrow">05 / THE BEST IS STILL AHEAD</p><h2 id="ann-future-title">All our tomorrows.</h2><p className="ann-future-message">{data.message}</p><span className="ann-fine-rule" aria-hidden="true" /><p className="ann-script ann-future-promise">{data.promise}</p></Reveal>
    </section>
  );
}
