/* =========================
   SOCKET.IO MULTIPLAYER
========================= */

const socket = io();

const myPlayer = {
  x: 200,
  y: 200
};

const keys = {};
onkeydown = e => keys[e.key] = true;
onkeyup = e => keys[e.key] = false;

socket.on("state", players => {
  ctx.clearRect(0, 0, c.width, c.height);

  for (let id in players) {
    const p = players[id];

    ctx.fillStyle = id === socket.id ? "lime" : "red";
    ctx.fillRect(p.x, p.y, 30, 30);
  }
});

function move() {
  if (keys.w) myPlayer.y -= 4;
  if (keys.s) myPlayer.y += 4;
  if (keys.a) myPlayer.x -= 4;
  if (keys.d) myPlayer.x += 4;

  socket.emit("move", myPlayer);
  requestAnimationFrame(move);
}

move();
