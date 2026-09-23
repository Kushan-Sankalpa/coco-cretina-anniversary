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
