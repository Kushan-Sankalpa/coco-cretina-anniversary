import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { anniversaryData } from "../src/data/anniversaryData.js";
import { getAnniversaryCountdownState } from "../src/data/anniversaryDates.js";

// Optional path to the original brief verifies the letter has been preserved verbatim.
if (process.argv[2]) {
  const request = readFileSync(process.argv[2], "utf8").replaceAll("\r\n", "\n");
  const expected = request.split('Use this exact love message:\n\n"')[1]?.split('"\n\nAnimate the paper')[0];
  assert.equal(anniversaryData.letter.message, expected, "The love letter must match the original brief exactly");
  console.log("PASS: complete love letter matches the original brief.");
}

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { default: Main } = await server.ssrLoadModule("/src/components/anniversary/AnniversaryMain.jsx");
  const markup = renderToStaticMarkup(createElement(Main));
  assert.equal((markup.match(/<section\b/g) || []).length, 10, "All original sections plus milestone, countdown and wheel must render");
  assert.equal((markup.match(/class="ann-polaroid"/g) || []).length, 6);
  assert.equal((markup.match(/class="ann-reason"/g) || []).length, 8);
  assert.equal((markup.match(/class="ann-timeline-dot"/g) || []).length, 5);
  assert.ok(markup.includes("Replay Our Story"));
  assert.ok(markup.includes('loading="eager"'));
  assert.ok(markup.includes('loading="lazy"'));
  assert.ok(markup.includes('class="ann-photo-placeholder"'), "Image placeholders must render before images load");
  assert.ok(!markup.includes("Alex"), "The old starter names must not appear");
  const countdown = getAnniversaryCountdownState(anniversaryData);
  assert.ok(markup.includes("Until Our Next Anniversary"));
  assert.ok(countdown.nextDate, "The default countdown must have a real target instead of dashes");
  assert.ok(markup.includes("Celebrating Us"));
  assert.ok(!/(?:\d+(?:st|nd|rd|th) Anniversary|Four years|Years of Us|Years Together|Months of Us)/i.test(markup), "Anniversary year counts must not be displayed");
  assert.ok(markup.includes("my precious sosa mala"));
  assert.ok(!markup.includes("my favorite human"));
  assert.ok(markup.includes("ann-wheel-disc"));
  console.log("PASS: ten sections, six memories, eight reasons, five timeline entries, countdown, spin wheel, exact cute label and photo fallbacks.");

  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  const introMarkup = renderToStaticMarkup(createElement(App));
  assert.ok(introMarkup.includes("Open your anniversary surprise"));
  assert.ok(introMarkup.includes("Happy Anniversary"));
  assert.ok(!/\d+(?:st|nd|rd|th) Anniversary/i.test(introMarkup));
  assert.equal((introMarkup.match(/<audio\b/g) || []).length, 1, "One persistent audio element must serve the whole experience");
  assert.ok(introMarkup.includes('src="/music/until-i-found-you.mp3"'));
  assert.ok(introMarkup.includes('preload="none"'));
  assert.ok(!/autoplay/i.test(introMarkup), "Music must wait for the envelope tap");
  assert.ok(!introMarkup.includes('class="ann-main"'), "The main page must not bypass the intro");
  console.log("PASS: app starts with the envelope; main page is gated behind completion.");
} finally {
  await server.close();
}

console.log("These are rendering checks, not browser or touch-interaction tests.");
