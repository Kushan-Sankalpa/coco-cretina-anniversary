import test from "node:test";
import assert from "node:assert/strict";
import { nextSpinRotation, normalizeDegrees, segmentPath, wheelPoint, winnerAtRotation } from "../src/components/anniversary/wheelGeometry.js";
import { anniversaryData } from "../src/data/anniversaryData.js";

const count = anniversaryData.spinWheel.items.length;
test("seven unique configured outcomes have short two-line labels", () => {
  assert.equal(count, 7);
  assert.equal(new Set(anniversaryData.spinWheel.items.map((item) => item.id)).size, 7);
  for (const item of anniversaryData.spinWheel.items) {
    assert.equal(item.lines.length, 2);
    assert.ok(item.lines.every((line) => line.length <= 10));
    assert.ok(item.message && item.color);
  }
});
test("each segment center lands precisely beneath the noon pointer", () => {
  for (let selected = 0; selected < count; selected++) {
    const target = nextSpinRotation(0, selected, count);
    assert.equal(winnerAtRotation(target, count), selected);
    const pointerError = normalizeDegrees(target + selected * 360 / count);
    assert.ok(Math.min(pointerError, 360 - pointerError) < 1e-8);
    assert.ok(target >= 2160);
  }
});
test("repeated spins advance smoothly, preserve alignment and never hit dividers", () => {
  let angle = 0;
  for (let spin = 0; spin < 1000; spin++) {
    const selected = spin % count;
    const offset = ((spin % 9) - 4) * 2;
    const target = nextSpinRotation(angle, selected, count, 6, offset);
    assert.ok(target - angle >= 2160);
    assert.ok(target - angle < 2520.00001);
    assert.equal(winnerAtRotation(target, count), selected);
    angle = target;
  }
});
test("reduced motion can settle directly without extra rotations", () => {
  for (let selected = 0; selected < count; selected++) {
    const target = nextSpinRotation(95, selected, count, 0);
    assert.ok(target - 95 < 360);
    assert.equal(winnerAtRotation(target, count), selected);
  }
});
test("extreme offsets are clamped inside the chosen segment", () => {
  for (const offset of [-10000, 10000]) {
    for (let i = 0; i < count; i++) assert.equal(winnerAtRotation(nextSpinRotation(1391.32, i, count, 6, offset), count), i);
  }
});
test("SVG geometry stays within the rim and uses valid paths", () => {
  for (let i = 0; i < count; i++) {
    const point = wheelPoint(-90 + i * 360 / count);
    assert.ok(point.x >= 36 && point.x <= 524);
    assert.ok(point.y >= 36 && point.y <= 524);
    assert.ok(segmentPath(i, count).startsWith("M280 280 L"));
    assert.ok(!segmentPath(i, count).includes("NaN"));
  }
});
