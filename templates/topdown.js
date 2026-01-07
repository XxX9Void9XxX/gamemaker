const keys = {};
document.onkeydown = e => keys[e.key] = true;
document.onkeyup = e => keys[e.key] = false;

let p = { x:200, y:200 };

function updateTopdown() {
  if (keys.w) p.y -= 4;
  if (keys.s) p.y += 4;
  if (keys.a) p.x -= 4;
  if (keys.d) p.x += 4;

  ctx.fillStyle = "cyan";
  ctx.fillRect(p.x, p.y, 30, 30);

  requestAnimationFrame(updateTopdown);
}

updateTopdown();
