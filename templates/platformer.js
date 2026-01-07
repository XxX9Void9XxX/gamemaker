const c = document.getElementById("c");
const ctx = c.getContext("2d");
c.width = innerWidth;
c.height = innerHeight;

let player = { x:100, y:300, vx:0, vy:0, onGround:false };

function loop() {
  player.vy += 0.7;
  player.y += player.vy;

  if (player.y > c.height - 50) {
    player.y = c.height - 50;
    player.vy = 0;
    player.onGround = true;
  }

  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, 40, 40);

  requestAnimationFrame(loop);
}

document.onkeydown = e => {
  if (e.key === " " && player.onGround) {
    player.vy = -15;
    player.onGround = false;
  }
};

loop();
