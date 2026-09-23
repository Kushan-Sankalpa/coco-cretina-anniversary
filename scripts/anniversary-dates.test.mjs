import test from "node:test";
import assert from "node:assert/strict";
import { parseRelationshipDate, anniversaryDate, getAnniversaryState, getCountdown, ordinal } from "../src/data/anniversaryDates.js";
const config = { relationshipStartDate: "2022-09-23", currentAnniversaryNumber: 4 };
test("four years lead to the fifth anniversary, not the fourth", () => {
  const state = getAnniversaryState(config, new Date(2026, 8, 23, 12));
  assert.equal(state.years, 4);
  assert.equal(state.months, 48);
  assert.equal(state.nextNumber, 5);
  assert.equal(state.nextDate.getFullYear(), 2027);
  assert.equal(state.nextDate.getMonth(), 8);
  assert.equal(state.nextDate.getDate(), 23);
});
test("before the fourth celebration, countdown still targets the fifth chapter", () => {
  assert.equal(getAnniversaryState(config, new Date(2026, 8, 22)).nextNumber, 5);
});
test("on the fifth anniversary, the next target rolls to the sixth", () => {
  assert.equal(getAnniversaryState(config, new Date(2027, 8, 23)).nextNumber, 6);
});
test("unconfigured, invalid and future dates never fabricate countdowns", () => {
  for (const date of ["", "YYYY-MM-DD", "2022-02-30", "2099-01-01"]) {
    const state = getAnniversaryState({ ...config, relationshipStartDate: date }, new Date(2026, 8, 23));
    assert.equal(state.configured, false);
    assert.equal(state.nextNumber, 5);
    assert.equal(getCountdown(state.nextDate), null);
  }
});
test("leap dates are clamped to February 28 in non-leap years", () => {
  const start = parseRelationshipDate("2020-02-29");
  const target = anniversaryDate(start, 5);
  assert.equal(target.getMonth(), 1);
  assert.equal(target.getDate(), 28);
});
test("countdown units, past-date clamping and ordinal suffixes", () => {
  const now = new Date(2026, 0, 1);
  assert.deepEqual(getCountdown(new Date(now.getTime() + 90061000), now), { days: 1, hours: 1, minutes: 1, seconds: 1 });
  assert.deepEqual(getCountdown(new Date(2025, 0, 1), now), { days: 0, hours: 0, minutes: 0, seconds: 0 });
  assert.deepEqual([1,2,3,4,5,11,12,13,21].map(ordinal), ["1st","2nd","3rd","4th","5th","11th","12th","13th","21st"]);
});
