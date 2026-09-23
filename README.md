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

Most text is inside:

```text
src/siteConfig.js
```

Change:

- Couple names
- Relationship start date
- Hero text
- Timeline
- Reasons
- Love letter
- Memory cards

## 3. Add your own photos

Put images inside:

```text
public/photos/
```

Example:

```text
public/photos/date-night.jpg
```

Then in `src/siteConfig.js`:

```js
{
  title: "Favorite date",
  caption: "A night I will always remember.",
  image: "/photos/date-night.jpg",
  emoji: "💗",
}
```

When `image` is empty, the site shows the sample gradient placeholder.

## 4. Change the hero placeholder to a real image

Inside `src/App.jsx`, find:

```jsx
<div className="photo-placeholder">
```

Replace the whole `photo-placeholder` div with:

```jsx
<img
  src="/photos/hero.jpg"
  alt="Our favorite memory"
  style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", display: "block" }}
/>
```

Put `hero.jpg` inside `public/photos`.

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
│  ├─ siteConfig.js
│  └─ styles.css
├─ .gitignore
├─ index.html
├─ package.json
├─ vercel.json
└─ vite.config.js
```

## Next features you can add

- Background music with play/pause
- Password screen
- Real image gallery/lightbox
- Video memory section
- Spotify song embed
- Secret message / surprise button
- Animated relationship timeline
- Confetti on anniversary day
- Dark mode
- Custom domain on Vercel

Have fun building it ❤️
