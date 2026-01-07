import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/generate", (req, res) => {
  const opts = req.body;
  let gameJS = "";

  if (opts.platformer) {
    gameJS += fs.readFileSync("templates/platformer.js", "utf8");
  }

  if (opts.topdown) {
    gameJS += fs.readFileSync("templates/topdown.js", "utf8");
  }

  if (opts.diep) {
    gameJS += fs.readFileSync("templates/diep.js", "utf8");
  }

  if (opts.multiplayer) {
    gameJS += fs.readFileSync("templates/multiplayer-client.js", "utf8");
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<title>Generated Game</title>
<style>
body{margin:0;overflow:hidden;background:#111}
canvas{display:block}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
${gameJS}
</script>
</body>
</html>
`;

  const id = Math.random().toString(36).slice(2);
  fs.writeFileSync(`public/game-${id}.html`, html);

  res.json({ url: `/game-${id}.html` });
});

app.listen(PORT, () => {
  console.log("AI Game Maker running on port", PORT);
});
