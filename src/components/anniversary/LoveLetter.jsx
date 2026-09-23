import Reveal from "./Reveal";
import RomanticPhoto from "./RomanticPhoto";

export default function LoveLetter({ data }) {
  const paragraphs = data.message.split("\n\n");
  return (
    <section className="ann-letter-section ann-section" id="anniversary-letter" aria-labelledby="ann-letter-title">
      <Reveal className="ann-section-heading"><p className="ann-eyebrow">01 / WORDS FROM MY HEART</p><h2 id="ann-letter-title">{data.heading}</h2></Reveal>
      <div className="ann-letter-layout">
        <Reveal className="ann-letter-reveal">
          <article className="ann-letter-paper">
            <div className="ann-letter-masthead" aria-hidden="true"><span>TO MY CRETINAAA</span><span>♡</span></div>
            {paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "ann-letter-opening" : index === paragraphs.length - 1 ? "ann-letter-signature" : ""} key={index}>{paragraph}</p>
            ))}
          </article>
        </Reveal>
        <aside className="ann-letter-aside">
          <Reveal>
            <figure className="ann-letter-portrait">
              <RomanticPhoto src={data.image} alt="Coco and Cretina, a moment close to my heart" />
              <figcaption>My favorite place is next to you.</figcaption>
            </figure>
            <p className="ann-sticky-note">my favorite human 🥹</p>
            <p className="ann-margin-note">Some things are too big<br />for words.<br /><span>You are one of them.</span></p>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
