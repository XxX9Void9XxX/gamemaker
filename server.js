import express from "express";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* =========================
   MULTIPLAYER GAME STATE
========================= */
const players = {};

io.on("connection", socket => {
  players[socket.id] = {
    x: Math.random() * 600,
    y: Math.random() * 400
  };

  socket.on("move", data => {
    players[socket.id] = data;
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

/* Broadcast state */
setInterval(() => {
  io.emit("state", players);
}, 50);

/* =========================
   GAME GENERATOR
========================= */
app.post("/generate", (req, res) => {
  const opts = req.body;
  let gameJS = "";

  if (opts.platformer) gameJS += fs.readFileSync("templates/platformer.js", "utf8");
  if (opts.topdown) gameJS += fs.readFileSync("templates/topdown.js", "utf8");
  if (opts.diep) gameJS += fs.readFileSync("templates/diep.js", "utf8");
  if (opts.multiplayer) gameJS += fs.readFileSync("templates/multiplayer-client.js", "utf8");

  const html = `
<!DOCTYPE html>
<html>
<head>
<title>Generated Multiplayer Game</title>
<style>
body{margin:0;overflow:hidden;background:#000}
canvas{display:block}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script src="/socket.io/socket.io.js"></script>
<script>
${gameJS}
</script>
</body>
</html>
`;

  const id = Math.random().toString(36).slice(2);
  fs.writeFileSync(`public/game-${id}.html`, html);

  res.json({ url: "/game-" + id + ".html" });
});

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
