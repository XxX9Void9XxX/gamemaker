async function generate() {
  const settings = {
    platformer: platformer.checked,
    topdown: topdown.checked,
    diep: diep.checked,
    multiplayer: multiplayer.checked
  };

  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings)
  });

  const data = await res.json();
  document.getElementById("preview").src = data.url;
}
