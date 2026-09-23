// Canvas-only engine, independent of React so the pointer and Retina cases can be tested.
export class ScratchEngine {
  constructor(canvas, createCanvas, paintCover) {
    this.canvas = canvas;
    this.createCanvas = createCanvas;
    this.paintCover = paintCover;
    this.mask = createCanvas();
    this.mask.width = 80;
    this.mask.height = 100;
    this.context = canvas.getContext("2d");
    this.maskContext = this.mask.getContext("2d", { willReadFrequently: true });
    this.maskContext.fillRect(0, 0, 80, 100);
    this.pointerId = null;
    this.previous = null;
    this.width = 0;
    this.height = 0;
    this.started = false;
  }

  resize(width, height, dpr = 1) {
    if (width <= 0 || height <= 0) return;
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    if (this.width === width && this.height === height && this.canvas.width === pixelWidth && this.canvas.height === pixelHeight) return;
    let snapshot;
    if (this.started && this.width) {
      snapshot = this.createCanvas();
      snapshot.width = this.canvas.width;
      snapshot.height = this.canvas.height;
      snapshot.getContext("2d").drawImage(this.canvas, 0, 0);
    }
    this.width = width;
    this.height = height;
    this.canvas.width = pixelWidth;
    this.canvas.height = pixelHeight;
    if (snapshot) {
      this.context.drawImage(snapshot, 0, 0, pixelWidth, pixelHeight);
    } else {
      this.context.save();
      this.context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
      this.paintCover(this.context, width, height);
      this.context.restore();
    }
    // Don't join an old-orientation coordinate to a new-orientation coordinate.
    this.previous = null;
  }

  point(event, bounds) {
    return {
      x: (event.clientX - bounds.left) * this.width / bounds.width,
      y: (event.clientY - bounds.top) * this.height / bounds.height,
    };
  }

  begin(event, bounds) {
    if (this.pointerId !== null || !this.width || event.isPrimary === false ||
      (event.pointerType === "mouse" && event.button !== 0)) return false;
    this.pointerId = event.pointerId;
    this.started = true;
    this.previous = null;
    this.stroke(this.point(event, bounds), event.pointerType);
    return true;
  }

  move(event, bounds) {
    if (this.pointerId !== event.pointerId) return false;
    const coalesced = event.getCoalescedEvents?.();
    // Safari can return an empty array. Always include the latest dispatched point.
    for (const point of coalesced || []) this.stroke(this.point(point, bounds), event.pointerType);
    this.stroke(this.point(event, bounds), event.pointerType);
    return true;
  }

  end(event) {
    if (event.pointerId !== this.pointerId) return false;
    this.pointerId = null;
    this.previous = null;
    return true;
  }

  stroke(point, type) {
    const diameter = type === "touch"
      ? Math.min(48, Math.max(34, this.width * .115))
      : Math.min(40, Math.max(28, this.width * .095));
    const from = this.previous || point;
    const erase = (context, scaleX, scaleY) => {
      context.save();
      context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = diameter;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      // A tap also clears a visible dab; strokes remain connected line segments.
      if (!this.previous) {
        context.beginPath();
        context.arc(point.x, point.y, diameter / 2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    };
    erase(this.context, this.canvas.width / this.width, this.canvas.height / this.height);
    erase(this.maskContext, 80 / this.width, 100 / this.height);
    this.previous = point;
  }

  coverage() {
    // Only 8,000 mask pixels, independent of phone DPR. Called on a timer or pointerup.
    const pixels = this.maskContext.getImageData(0, 0, 80, 100).data;
    let removed = 0;
    for (let i = 3; i < pixels.length; i += 4) removed += 1 - pixels[i] / 255;
    return removed / 8000;
  }
}

export function paintScratchCover(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#d7a6ad");
  gradient.addColorStop(.45, "#a85f77");
  gradient.addColorStop(1, "#70364f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#ffe8dc";
  context.textAlign = "center";
  context.font = "14px Georgia";
  context.globalAlpha = .12;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      context.fillText((col + row) % 3 === 0 ? "♡" : "·", (col + .5 + (row % 2) * .25) * width / 6, (row + .5) * height / 8);
    }
  }
  context.globalAlpha = 1;
  context.font = `italic ${Math.max(19, width * .063)}px Georgia`;
  context.fillText("Something special", width / 2, height * .31);
  context.fillText("is hiding here ♥", width / 2, height * .38);
  context.font = `${Math.max(12, width * .04)}px sans-serif`;
  context.fillText("Scratch gently to reveal it...", width / 2, height * .47);
}
