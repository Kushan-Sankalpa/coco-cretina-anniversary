export const normalizeDegrees = (angle) => ((angle % 360) + 360) % 360;

// Segment zero is centered at noon, exactly under the fixed pointer.
export function wheelPoint(degrees, radius = 244, center = 280) {
  const radians = degrees * Math.PI / 180;
  return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
}

export function segmentPath(index, count) {
  const step = 360 / count;
  const start = wheelPoint(-90 + index * step - step / 2);
  const end = wheelPoint(-90 + index * step + step / 2);
  return `M280 280 L${start.x} ${start.y} A244 244 0 ${step > 180 ? 1 : 0} 1 ${end.x} ${end.y} Z`;
}

export function winnerAtRotation(rotation, count) {
  return Math.floor((normalizeDegrees(-rotation) + 180 / count) / (360 / count)) % count;
}

export function wheelLabelPoint(index, count, rotation) {
  return wheelPoint(-90 + index * 360 / count + normalizeDegrees(rotation), 161);
}

export function nextSpinRotation(previous, selected, count, turns = 6, offset = 0) {
  const step = 360 / count;
  // Keep the pointer safely inside a segment, never on its divider.
  const boundedOffset = Math.max(-step * .2, Math.min(step * .2, offset));
  const target = normalizeDegrees(-selected * step + boundedOffset);
  return previous + turns * 360 + normalizeDegrees(target - normalizeDegrees(previous));
}
