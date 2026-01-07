/* =========================
   TOP-DOWN GAME TEMPLATE
   Uses AI_CONFIG
========================= */

const c = document.getElementById("c");
const ctx = c.getContext("2d");
c.width = innerWidth;
c.height = innerHeight;

/* =========================
   PARSE AI INSTRUCTIONS
========================= */

const instr = (AI_CONFIG.instructions || "").toLowerCase();

const SPEED =
  instr.includes("fast") ? 7 :
  instr.includes("slow") ? 2 : 4;

const ENEMY_COUNT =
  instr.includes("many enemies") ? 15 :
  instr.includes("few enemies") ? 3 : 6;

const CAN_SHOOT = instr.includes("shoot");

/* =========================
   INPUT
========================= */

const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* =========================
   PLAYER
========================= */

const player = {
  x: c.width / 2,
  y: c.height / 2,
  size: 28,
  color: "cyan",
  hp: 100
};

/* =========================
   ENEMIES
========================= */

const enemies = [];
for (let i = 0; i < ENEMY_COUNT; i++) {
  enemies.push({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    size: 24,
    speed: 1.5 + Math.random(),
    hp: 40
  });
}

/* =========================
   BULLETS
========================= */

const bullets = [];

/* =========================
   SHOOTING
========================= */

if (CAN_SHOOT) {
  addEventListener("click", e => {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    bullets.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * 8,
      vy: Math.sin(angle) * 8,
      life: 60
    });
  });
}

/* =========================
   GAME LOOP
========================= */

function loop() {
  ctx.clearRect(0, 0, c.width, c.height);

  /* Player movement */
  if (keys.w) player.y -= SPEED;
  if (keys.s) player.y += SPEED;
  if (keys.a) player.x -= SPEED;
  if (keys.d) player.x += SPEED;

  /* Keep player on screen */
  player.x = Math.max(player.size, Math.min(c.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(c.height - player.size, player.y));

  /* Enemies chase player */
  enemies.forEach(e => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) {
      e.x += (dx / dist) * e.speed;
      e.y += (dy / dist) * e.speed;
    }
  });

  /* Update bullets */
  bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    b.life--;
  });

  /* Bullet-enemy collisions */
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const e = enemies[i];
      const b = bullets[j];
      if (Math.hypot(e.x - b.x, e.y - b.y) < e.size) {
        e.hp -= 20;
        bullets.splice(j, 1);
        if (e.hp <= 0) enemies.splice(i, 1);
        break;
      }
    }
  }

  /* Draw bullets */
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x - 3, b.y - 3, 6, 6));

  /* Draw player */
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.size / 2,
    player.y - player.size / 2,
    player.size,
    player.size
  );

  /* Draw enemies */
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(
      e.x - e.size / 2,
      e.y - e.size / 2,
      e.size,
      e.size
    );
  });

  /* UI */
  ctx.fillStyle = "white";
  ctx.fillText(`HP: ${player.hp}`, 10, 20);
  ctx.fillText(`Enemies: ${enemies.length}`, 10, 40);

  requestAnimationFrame(loop);
}

loop();

