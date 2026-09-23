// Project a rigid paper flap around the fold at y=145. All layers share this
// projection, so the front/back exchange at 90 degrees has no geometry jump.
export function projectFlapPoint(x, y, angle) {
  const radians = Math.max(0, Math.min(180, angle)) * Math.PI / 180;
  const distance = y - 145;
  const perspective = 900 / (900 - distance * Math.sin(radians));
  return { x: 220 + (x - 220) * perspective, y: 145 + distance * Math.cos(radians) * perspective };
}

export function flapPath(angle) {
  const point = (x, y) => {
    const p = projectFlapPoint(x, y, angle);
    return `${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  };
  return `M26 145 L414 145 L${point(238, 265)} Q${point(220, 278)} ${point(202, 265)}Z`;
}
