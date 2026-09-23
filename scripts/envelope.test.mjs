import test from "node:test";
import assert from "node:assert/strict";
import { flapPath, projectFlapPoint } from "../src/components/intro/envelopeGeometry.js";

test("flap hinge stays fixed throughout opening", () => {
  for (let angle = 0; angle <= 180; angle++) {
    assert.deepEqual(projectFlapPoint(26, 145, angle), { x: 26, y: 145 });
    assert.deepEqual(projectFlapPoint(414, 145, angle), { x: 414, y: 145 });
  }
});

test("flap turns edge-on before revealing its reverse face", () => {
  assert.equal(projectFlapPoint(220, 278, 0).y, 278);
  assert.equal(projectFlapPoint(220, 278, 90).y, 145);
  assert.equal(projectFlapPoint(220, 278, 180).y, 12);
  assert.equal(flapPath(0), "M26 145 L414 145 L238.000 265.000 Q220.000 278.000 202.000 265.000Z");
});

test("front/back projection stays continuous, symmetric and within the artwork", () => {
  let previous = projectFlapPoint(238, 265, 0);
  for (let angle = .5; angle <= 180; angle += .5) {
    const right = projectFlapPoint(238, 265, angle);
    const left = projectFlapPoint(202, 265, angle);
    assert.ok(Math.abs(right.x + left.x - 440) < 1e-8);
    assert.equal(right.y, left.y);
    assert.ok(Math.hypot(right.x - previous.x, right.y - previous.y) < 2);
    assert.ok(right.y >= 0 && right.y <= 390 && right.x < 440);
    assert.ok(!/NaN|Infinity/.test(flapPath(angle)));
    previous = right;
  }
});
