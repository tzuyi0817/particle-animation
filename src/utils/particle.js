export default class Particle {
  constructor ({ x, y, targetX, targetY, radius = 2, color = "#F00000" }) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.radius = radius;
    this.color = color;
  }

  drawCanvas(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}