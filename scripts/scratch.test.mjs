import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { ScratchEngine, paintScratchCover } from "../src/components/intro/scratchEngine.js";

function setup(width = 320, height = 400, dpr = 3) {
  const canvas = createCanvas(1, 1);
  const engine = new ScratchEngine(canvas, () => createCanvas(1, 1), paintScratchCover);
  engine.resize(width, height, dpr);
  const bounds = { left: 23, top: 87, width, height };
  const pointer = (x, y, extra = {}) => ({ pointerId: 1, isPrimary: true, pointerType: "touch", button: 0, clientX: x + bounds.left, clientY: y + bounds.top, ...extra });
  const alpha = (x, y) => canvas.getContext("2d").getImageData(Math.round(x * canvas.width / width), Math.round(y * canvas.height / height), 1, 1).data[3];
  return { canvas, engine, bounds, pointer, alpha };
}

test("one finger scratches an opaque Retina mask in the exact local position", () => {
  const { canvas, engine, bounds, pointer, alpha } = setup();
  assert.equal(canvas.width, 960);
  assert.equal(canvas.height, 1200);
  assert.equal(alpha(100, 110), 255);
  assert.ok(engine.begin(pointer(100, 110), bounds));
  assert.equal(alpha(100, 110), 0);
  assert.equal(alpha(170, 110), 255);
  assert.ok(engine.coverage() > 0);
});
test("rapid movement connects a continuous diagonal without gaps", () => {
  const { engine, bounds, pointer, alpha } = setup();
  engine.begin(pointer(20, 20), bounds);
  engine.move(pointer(290, 350), bounds);
  for (let t = 0; t <= 1; t += .05) assert.equal(alpha(20 + 270 * t, 20 + 330 * t), 0);
});
test("coalesced points preserve a curved fast stroke and include the final dispatched point", () => {
  const { engine, bounds, pointer, alpha } = setup();
  engine.begin(pointer(40, 40), bounds);
  engine.move(pointer(240, 220, { getCoalescedEvents: () => [pointer(70, 110), pointer(140, 160)] }), bounds);
  for (const [x, y] of [[70, 110], [140, 160], [240, 220]]) assert.equal(alpha(x, y), 0);
});
test("empty Safari coalesced event lists still draw the latest point", () => {
  const { engine, bounds, pointer, alpha } = setup();
  engine.begin(pointer(40, 40), bounds);
  engine.move(pointer(220, 40, { getCoalescedEvents: () => [] }), bounds);
  assert.equal(alpha(160, 40), 0);
});
test("edge strokes and captured movements outside the canvas remain continuous", () => {
  const { engine, bounds, pointer, alpha } = setup();
  engine.begin(pointer(2, 2), bounds);
  engine.move(pointer(-60, 150), bounds);
  engine.move(pointer(80, 220), bounds);
  assert.equal(alpha(2, 2), 0);
  assert.equal(alpha(80, 220), 0);
});
test("pointercancel, lifting, and resuming do not join separate scratches", () => {
  const { engine, bounds, pointer, alpha } = setup();
  engine.begin(pointer(30, 30), bounds);
  assert.ok(engine.end(pointer(30, 30, { type: "pointercancel" })));
  assert.equal(engine.move(pointer(230, 330), bounds), false);
  engine.begin(pointer(230, 330), bounds);
  assert.equal(alpha(130, 180), 255);
  assert.equal(alpha(230, 330), 0);
  engine.end(pointer(230, 330));
  assert.equal(engine.pointerId, null);
});
test("second fingers and right-clicks cannot hijack a stroke", () => {
  const { engine, bounds, pointer } = setup();
  assert.equal(engine.begin(pointer(10, 10, { pointerType: "mouse", button: 2 }), bounds), false);
  engine.begin(pointer(20, 20), bounds);
  assert.equal(engine.begin(pointer(120, 120, { pointerId: 2, isPrimary: false }), bounds), false);
  assert.equal(engine.move(pointer(200, 200, { pointerId: 2 }), bounds), false);
  assert.equal(engine.end(pointer(200, 200, { pointerId: 2 })), false);
  assert.equal(engine.pointerId, 1);
});
test("Retina / orientation resize preserves erased pixels and coverage", () => {
  const { canvas, engine, bounds, pointer } = setup();
  engine.begin(pointer(80, 100), bounds);
  engine.move(pointer(240, 300), bounds);
  const coverage = engine.coverage();
  engine.resize(400, 500, 2);
  assert.equal(canvas.width, 800);
  assert.equal(canvas.height, 1000);
  assert.equal(engine.previous, null);
  assert.equal(canvas.getContext("2d").getImageData(200, 250, 1, 1).data[3], 0);
  assert.ok(Math.abs(engine.coverage() - coverage) < .00001);
});
test("CSS scaling and offset map correctly to local coordinates", () => {
  const { engine, alpha } = setup();
  engine.begin({ pointerId: 1, pointerType: "touch", button: 0, clientX: 120, clientY: 200 }, { left: 20, top: 100, width: 640, height: 800 });
  assert.equal(alpha(50, 50), 0);
});
test("coverage reaches the reveal threshold through ordinary strokes", () => {
  const { engine, bounds, pointer } = setup();
  for (let y = 20; y < 250; y += 36) {
    engine.begin(pointer(0, y), bounds);
    engine.move(pointer(320, y), bounds);
    engine.end(pointer(320, y));
  }
  assert.ok(engine.coverage() >= .42);
  assert.ok(engine.coverage() < .8);
});
test("canvas sizing covers requested mobile/tablet/desktop widths at DPR 1, 2, and 3", () => {
  for (const [width, height] of [[320,568],[360,800],[375,812],[390,844],[393,852],[414,896],[430,932],[440,956],[768,1024],[1024,768],[1440,900],[844,390]]) {
    const cssWidth = Math.min(width - 40, 390) - 20;
    for (const dpr of [1, 2, 3]) {
      const { canvas, engine } = setup(cssWidth, cssWidth * 1.25, dpr);
      assert.equal(canvas.width, Math.round(cssWidth * dpr), `${width}×${height} DPR ${dpr}`);
      assert.equal(canvas.height, Math.round(cssWidth * 1.25 * dpr));
      assert.equal(engine.coverage(), 0);
    }
  }
});
