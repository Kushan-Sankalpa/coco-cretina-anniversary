import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "./siteConfig";

function getNextAnniversary(startDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();

  let next = new Date(
    today.getFullYear(),
    start.getMonth(),
    start.getDate(),
    0,
    0,
    0,
    0
  );

  if (next <= today) {
    next = new Date(
      today.getFullYear() + 1,
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
      0
    );
  }

  return next;
}

function getRelationshipStats(startDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  const diff = Math.max(0, today - start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365.2425);

  return { days, years };
}

function getCountdown(target) {
  const difference = Math.max(0, target - new Date());

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function FloatingHearts() {
  const hearts = ["♡", "♥", "♡", "♥", "♡", "♥", "♡", "♥"];

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <span
          key={index}
          className={`floating-heart floating-heart-${index + 1}`}
        >
          {heart}
        </span>
      ))}
    </div>
  );
}

function MainSite() {
  const { couple, hero, timeline, reasons, memories, loveLetter, footer } =
    siteConfig;

  const nextAnniversary = useMemo(
    () => getNextAnniversary(siteConfig.relationshipStart),
    []
  );

  const relationshipStats = useMemo(
    () => getRelationshipStats(siteConfig.relationshipStart),
    []
  );

  const [countdown, setCountdown] = useState(() =>
    getCountdown(nextAnniversary)
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(nextAnniversary));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [nextAnniversary]);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const formattedStartDate = new Date(
    `${siteConfig.relationshipStart}T00:00:00`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <FloatingHearts />

      <header className="navbar">
        <button
          className="brand"
          onClick={() => scrollToSection("home")}
          aria-label="Go to home"
        >
          <span>{couple.firstName}</span>
          <span className="brand-heart">♥</span>
          <span>{couple.secondName}</span>
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {[
            ["home", "Home"],
            ["story", "Our Story"],
            ["memories", "Memories"],
            ["letter", "Love Note"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => scrollToSection(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-pad">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>

            <h1>
              {hero.title.split(". ").map((part, index) => (
                <span key={part}>
                  {part}
                  {index === 0 ? "." : ""}
                </span>
              ))}
            </h1>

            <p className="hero-message">{hero.message}</p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => scrollToSection("story")}
              >
                Walk through our story
                <span>↓</span>
              </button>

              <p className="since-label">
                Together since <strong>{formattedStartDate}</strong>
              </p>
            </div>
          </div>

          <div className="hero-card-wrap">
            <div className="photo-card photo-card-back">
              <div className="polaroid-art">
                <span>☁️</span>
                <span>💗</span>
                <span>✨</span>
              </div>
            </div>

            <div className="photo-card photo-card-front">
              <div className="photo-placeholder">
                <div className="photo-placeholder-inner">
                  <span className="camera-icon">♡</span>
                  <p>Your favorite photo</p>
                  <small>
                    Add <code>/public/photos/hero.jpg</code> and use it here
                  </small>
                </div>
              </div>
              <p className="polaroid-caption">
                {couple.firstName} + {couple.secondName}
              </p>
            </div>

            <div className="tiny-note tiny-note-one">my precious sosa mala ♥️🦋</div>
            <div className="tiny-note tiny-note-two">forever sounds good</div>
          </div>

          <button
            className="scroll-cue"
            onClick={() => scrollToSection("countdown")}
            aria-label="Scroll down"
          >
            <span />
          </button>
        </section>

        <section id="countdown" className="countdown-section section-pad">
          <div className="section-heading centered">
            <p className="eyebrow">THE NEXT CHAPTER</p>
            <h2>Counting down to our next anniversary</h2>
            <p>
              Because apparently I need a timer to remind me how lucky I am.
            </p>
          </div>

          <div className="countdown-grid">
            {Object.entries(countdown).map(([label, value]) => (
              <div className="countdown-card" key={label}>
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="relationship-stats">
            <div>
              <strong>{relationshipStats.days.toLocaleString()}</strong>
              <span>days of us</span>
            </div>
            <div className="stats-divider" />
            <div>
              <strong>{relationshipStats.years}+</strong>
              <span>beautiful year{relationshipStats.years === 1 ? "" : "s"}</span>
            </div>
            <div className="stats-divider" />
            <div>
              <strong>∞</strong>
              <span>memories to make</span>
            </div>
          </div>
        </section>

        <section id="story" className="story-section section-pad">
          <div className="section-heading">
            <p className="eyebrow">HOW WE GOT HERE</p>
            <h2>Our story, one little moment at a time.</h2>
            <p>
              Edit these milestones in <code>src/siteConfig.js</code> and make
              this part completely yours.
            </p>
          </div>

          <div className="timeline">
            {timeline.map((item, index) => (
              <article className="timeline-item" key={`${item.date}-${item.title}`}>
                <div className="timeline-marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="timeline-content">
                  <p className="timeline-date">{item.date}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="memories" className="memories-section section-pad">
          <div className="section-heading centered">
            <p className="eyebrow">OUR CAMERA ROLL</p>
            <h2>Favorite memories</h2>
            <p>
              Use your own photos, captions, trips, dates, screenshots — whatever
              feels like you two.
            </p>
          </div>

          <div className="memory-grid">
            {memories.map((memory, index) => (
              <article
                className={`memory-card memory-card-${(index % 3) + 1}`}
                key={memory.title}
              >
                <div className="memory-visual">
                  {memory.image ? (
                    <img src={memory.image} alt={memory.title} />
                  ) : (
                    <div className="memory-placeholder">
                      <span>{memory.emoji}</span>
                    </div>
                  )}
                </div>
                <div className="memory-copy">
                  <h3>{memory.title}</h3>
                  <p>{memory.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="reasons-section section-pad">
          <div className="section-heading">
            <p className="eyebrow">JUST IN CASE YOU FORGOT</p>
            <h2>A few reasons I adore you</h2>
          </div>

          <div className="reasons-layout">
            <div className="reasons-list">
              {reasons.map((reason, index) => (
                <div className="reason-row" key={reason}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{reason}</p>
                  <b>♡</b>
                </div>
              ))}
            </div>

            <div className="quote-card">
              <span className="quote-mark">“</span>
              <p>{couple.shortLine}</p>
              <small>
                — {couple.firstName} & {couple.secondName}
              </small>
              <div className="quote-heart">♥</div>
            </div>
          </div>
        </section>

        <section id="letter" className="letter-section section-pad">
          <div className="letter-envelope" aria-hidden="true">
            <div className="envelope-flap" />
            <span>♥</span>
          </div>

          <article className="letter-card">
            <p className="eyebrow">ONE LAST THING</p>
            <h2>{loveLetter.title}</h2>

            {loveLetter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <strong className="signature">{loveLetter.signature}</strong>
          </article>
        </section>
      </main>

      <footer>
        <div className="footer-heart">♥</div>
        <h2>
          {couple.firstName} & {couple.secondName}
        </h2>
        <p>{footer.note}</p>
        <small>React + Vite • Ready for Vercel</small>
      </footer>
    </div>
  );
}

// Original starter homepage, retained for reference. The active page is AnniversaryMain.
export default MainSite;
