# Coco & Cretina photos

Put your real photos in this folder, using these exact names:

- `surprise.jpg` — existing scratch intro
- `hero-coco-cretina.jpg` — full-screen hero (landscape works best)
- `love-letter-photo.jpg` — letter portrait
- `memory-1.jpg` through `memory-6.jpg` — six gallery memories
- `future-us.jpg` — wide future section
- `forever.jpg` — final portrait

Missing or failed images show a romantic monogram placeholder. Crop positions default to center.
Compress photos before adding them (around 1600–2000px wide for the hero, 800–1200px for cards).
The hero loads eagerly; the remaining photos load lazily.

Edit main-page text, photo paths, captions, reasons and timeline in `src/data/anniversaryData.js`.
The five timeline entries use the memory photos by default; replace their dates and messages with your real milestones.
Edit intro text in `src/components/intro/introConfig.js`.
Replay scrolls to the main hero and does not reset the intro.
The separate "Open my gift again" link intentionally restarts the envelope and scratch.

## Anniversary date and spin wheel

Set `relationshipStartDate` in `src/data/anniversaryData.js` to your real `YYYY-MM-DD`.
It is intentionally blank: the old Alex/Jamie template date was not your confirmed date.
Until you set it, the cards show dashes and the page uses your stated 4th-anniversary milestone.
Once configured, elapsed years/months and the next anniversary are computed from that date.
At each anniversary midnight (visitor's local time), the countdown rolls forward one year.
February 29 anniversaries use February 28 in non-leap years.

The same data file contains `cuteLabel`, countdown labels, and all seven `spinWheel.items`.
For wheel text, keep the `lines` array to two short lines. The full `label` and `message`
appear below the wheel after it stops. No server or storage is needed.
