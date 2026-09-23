# Anniversary React Site 💗

A simple, responsive anniversary website built with **React + Vite** and prepared for **Vercel**.

## 1. Run locally

Install Node.js 22+.

```bash
npm install
npm run dev
```

Open the local URL Vite shows in your terminal (usually `http://localhost:5173`).

## 2. Customize the website

The current Coco & Cretina experience is configured in:

```text
src/data/anniversaryData.js
```

Change:

- Couple names
- Relationship start date
- Hero text
- Timeline
- Reasons
- Love letter
- Memory cards
- Spin-wheel outcomes and messages
- The small romantic label

Set `relationshipStartDate` to your real date in `YYYY-MM-DD` format. It is intentionally blank: the old starter's sample date is not a confirmed personal date. Until configured, `countdown.fallbackTargetDate` provides a working, explicitly labelled temporary countdown to 2027-09-23 (one year from the 2026-09-23 request). It does not reset on reload and rolls forward annually. A real relationship start date takes priority automatically. Dates use the visitor's local timezone; February 29 falls on February 28 in non-leap years. Hours stay in the valid 0–23 range.

`currentAnniversaryNumber: 4` is the celebration's fallback, not a fixed countdown target. The hero and personal fourth-anniversary messages remain editable text.

Intro text and the scratch photograph are in `src/components/intro/introConfig.js`.
`src/siteConfig.js` and `src/LegacyAnniversary.jsx` preserve the original starter and are not used by the current experience.

## 3. Add your own photos

Put images inside:

```text
public/photos/
```

Example:

```text
public/photos/hero-coco-cretina.jpg
public/photos/surprise.jpg
public/photos/love-letter-photo.jpg
public/photos/memory-1.jpg
```

Continue with `memory-2.jpg` through `memory-6.jpg`, plus `future-us.jpg` and `forever.jpg`. Exact configured paths are in the two data files above; you can change them to match your own filenames.

For example, in `src/data/anniversaryData.js`:

```js
{
  caption: "A night I will always remember.",
  image: "/photos/date-night.jpg",
  rotation: -3,
}
```

Missing or unloaded images show a romantic monogram placeholder rather than a broken image. No JSX changes are needed to add photos.

## 4. Interactions and checks

The experience stays in order: envelope → scratch reveal → Continue → main story. Replay scrolls to the main-page top; Open the gift again restarts the intro.

- Scratch with mouse or touch; 42% coverage reveals the rest. A tap/keyboard alternative is available.
- After reveal, the heading folds away and the photo moves up. Continue stays fixed above the phone's bottom safe area; there is no forced auto-redirect.
- Tapping the envelope starts `public/music/until-i-found-you.mp3`. Playback continues through the main story. The small top-right button pauses/resumes music. Change the source and starting volume in `anniversaryData.music`. Browsers that block playback offer a manual retry.
- The seven-outcome spin wheel follows the memory gallery. Edit its labels, colors and messages in `anniversaryData.spinWheel`; keep wheel labels short.
- Reduced-motion preferences disable decorative motion and settle spins immediately.

```bash
npm test
node scripts/check-anniversary.mjs
```

Tests cover the canvas engine, pointer coordinates, resizing, yearly countdown rollover, and wheel alignment. The rendering check verifies the sections and intro entry point. These are not browser/device tests: check the full flow on iPhone Safari and desktop before sharing.

## 5. Build the project

```bash
npm run build
```

Vite creates the production version inside the `dist` folder.

## 6. Deploy to Vercel

### Easy method

1. Push this project to GitHub.
2. Go to Vercel.
3. Click **Add New → Project**.
4. Import your GitHub repository.
5. Vercel should detect **Vite** automatically.
6. Build command: `npm run build`
7. Output directory: `dist`
8. Click **Deploy**.

### Vercel CLI method

```bash
npm install -g vercel
vercel
```

Follow the prompts.

## Main project structure

```text
anniversary-react-site/
├─ public/
│  ├─ photos/
│  │  └─ README.txt
│  └─ favicon.svg
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ data/
│  │  ├─ anniversaryData.js
│  │  └─ anniversaryDates.js
│  ├─ components/
│  │  ├─ intro/
│  │  └─ anniversary/
│  └─ styles.css
├─ scripts/
├─ .gitignore
├─ index.html
├─ package.json
├─ vercel.json
└─ vite.config.js
```

## Next features you can add

- Password screen
- Video memory section
- Spotify song embed
- Secret message / surprise button
- Confetti on anniversary day
- Dark mode
- Custom domain on Vercel

Have fun building it ❤️
