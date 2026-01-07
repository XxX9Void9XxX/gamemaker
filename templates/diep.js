let bullets = [];
let angle = 0;

document.onmousemove = e => {
  angle = Math.atan2(e.clientY - p.y, e.clientX - p.x);
};

document.onclick = () => {
  bullets.push({
    x: p.x,
    y: p.y,
    vx: Math.cos(angle) * 8,
    vy: Math.sin(angle) * 8
  });
};

function updateDiep() {
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, 6, 6);
  });

  ctx.save();
  ctx.translate(p.x+15, p.y+15);
  ctx.rotate(angle);
  ctx.fillStyle = "white";
  ctx.fillRect(-10, -10, 40, 20);
  ctx.restore();
}
