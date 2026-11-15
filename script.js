/* =====================================================================
   ✏️  EDIT EVERYTHING PERSONAL HERE
   Put your photos in  assets/photos/  and your song in  assets/music.mp3
   Any photo that is missing shows a pretty placeholder instead.
   ===================================================================== */
const CONFIG = {
  introTitle: "Thank You Love for Everything",

  // Background music. If this file doesn't exist yet, a soft music-box
  // melody is played instead so the site is never silent.
  music: "assets/music.mp3",

  // YouTube song: paste only the ID (the part after "watch?v=").
  // e.g. https://www.youtube.com/watch?v=AbCdEf12345  ->  "AbCdEf12345"
  youtubeId: "uyupd2PXbSQ",

  letter: [
    "Hello Wav Wav my Kristine, I hope you are doing fine todeh. I made this letter and website so I can remind you that I really appreciate you coming into my life and that I love you so very much.",
    "I'm sorry that I'm very busy most days and that sometimes we aren't able to see each other, but I still hope you are aware that I think of you every day, even if I sometimes reply late or sometimes make you mad hehehehe.",
    "But I really really love you Kristine, thank you for coming into my life and I really appreciate all our small moments. I hope we last until the deh we bye bye from this world, and I hope you know that I will always be here if you ever need me.",
    "I LOVE YOU MAH BUBU!!! MWAH MWAH. 💛",
  ],
  signature: "Forever yours ♥",
  // Little Bubu & Dudu at the bottom of the letter ("" to hide it)
  letterGif: "assets/gifs/together.gif",

  songPhotos: ["assets/photos/song1.jpg", "assets/photos/song2.jpg"],

  revealPhoto: "assets/photos/reveal.jpg",
  revealTitle: "I LOVE YOU VERY MUCH BUBU!!!",

  // pos = which part of the photo stays visible in the square frame
  memories: [
    { src: "assets/photos/memory1.jpg", caption: "Peace signs at Sky Cafe ✌️", date: "", pos: "50% 25%" },
    { src: "assets/photos/memory2.jpg", caption: "My coconut girl 🥥", date: "", pos: "30% 40%" },
    { src: "assets/photos/memory3.jpg", caption: "Pouty selfie duo", date: "", pos: "50% 45%" },
    { src: "assets/photos/memory4.jpg", caption: "Mwah mwah", date: "", pos: "50% 45%" },
    { src: "assets/photos/memory5.jpg", caption: "Screaming on the rides", date: "", pos: "60% 50%" },
    { src: "assets/photos/memory6.jpg", caption: "Blurry but happy", date: "", pos: "50% 55%" },
  ],
};

/* ===================================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Photo placeholders ---------- */
function placeholder(label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#fdf0c4'/><stop offset='1' stop-color='#f1cf6a'/></linearGradient></defs>
    <rect width='600' height='600' fill='url(#g)'/>
    <path d='M300 380 C230 330 200 290 225 262 C245 240 280 248 300 275 C320 248 355 240 375 262 C400 290 370 330 300 380Z' fill='#fff' opacity='.75'/>
    ${label ? `<text x='300' y='450' text-anchor='middle' font-family='Georgia, serif' font-size='30' fill='#5b3a10'>${label}</text>
    <text x='300' y='488' text-anchor='middle' font-family='Georgia, serif' font-size='18' fill='#5b3a10' opacity='.7'>your photo goes here</text>` : ""}
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function setPhoto(img, src, label) {
  img.onerror = () => { img.onerror = null; img.src = placeholder(label); };
  img.src = src || placeholder(label);
}

/* ---------- Ambient floating hearts ---------- */
function floatingHearts() {
  const layer = $("#bg-hearts");
  const n = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() < 0.7 ? "♥" : "✿";
    h.style.left = rand(0, 100) + "vw";
    h.style.fontSize = rand(10, 26) + "px";
    h.style.setProperty("--o", rand(0.25, 0.5).toFixed(2));
    h.style.setProperty("--sway", rand(-60, 60) + "px");
    h.style.animationDuration = rand(12, 24) + "s";
    h.style.animationDelay = -rand(0, 24) + "s";
    layer.appendChild(h);
  }
}

/* ---------- Heart burst effect ---------- */
function heartBurst(x, y, count = 14, spread = 160) {
  const layer = $("#fx-layer");
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "burst-heart";
    h.textContent = "♥";
    const size = rand(12, 28);
    h.style.fontSize = size + "px";
    h.style.left = x - size / 2 + "px";
    h.style.top = y - size / 2 + "px";
    h.style.color = ["#f4c025", "#ffe27a", "#e09a12", "#fff3c4"][i % 4];
    layer.appendChild(h);
    const ang = rand(0, Math.PI * 2);
    const dist = rand(spread * 0.4, spread);
    h.animate(
      [
        { transform: "translate(0,0) scale(.3)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 40}px) scale(1) rotate(${rand(-40, 40)}deg)`, opacity: 0 },
      ],
      { duration: rand(800, 1400), easing: "cubic-bezier(.2,.8,.2,1)" }
    ).onfinish = () => h.remove();
  }
}

/* ---------- Scene navigation ---------- */
let current = "intro";
const sceneHooks = {
  message: { enter: revealLetter },
  song: { enter: enterSong, leave: leaveSong },
  flowers: { leave: resetFlowers },
};

function go(id) {
  if (id === current) return;
  const from = document.getElementById(current);
  const to = document.getElementById(id);
  sceneHooks[current]?.leave?.();
  from.classList.add("leaving");
  from.classList.remove("active");
  setTimeout(() => from.classList.remove("leaving"), 800);
  to.scrollTop = 0;
  to.classList.add("active");
  current = id;
  sceneHooks[id]?.enter?.();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-go]");
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  heartBurst(r.left + r.width / 2, r.top + r.height / 2, 8, 90);
  setTimeout(() => go(btn.dataset.go), 220);
});

/* ---------- 1. Intro envelope ---------- */
function buildSeal() {
  // wobbly wax blob outline
  const pts = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 52 + Math.sin(i * 2.7) * 3 + (i % 2 ? 2.5 : -1.5);
    pts.push([60 + Math.cos(a) * r, 60 + Math.sin(a) * r]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q${px.toFixed(1)} ${py.toFixed(1)} ${((px + x) / 2).toFixed(1)} ${((py + y) / 2).toFixed(1)}`;
  }
  $("#seal-blob").setAttribute("d", d + "Z");
}

let opened = false;
async function openEnvelope() {
  if (opened) return;
  opened = true;
  startMusic();
  const env = $("#envelope");
  const r = $("#seal").getBoundingClientRect();
  heartBurst(r.left + r.width / 2, r.top + r.height / 2, 26, 240);
  env.classList.add("opened");
  await wait(2500);
  $(".intro-inner").classList.add("fade");
  await wait(500);
  go("gifts");
}
$("#envelope").addEventListener("click", openEnvelope);
$("#envelope").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
});

/* ---------- 3. Letter ---------- */
function buildLetter() {
  const box = $("#letter-text");
  box.innerHTML = "";
  CONFIG.letter.forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    box.appendChild(p);
  });
  const s = document.createElement("p");
  s.className = "sign";
  s.textContent = CONFIG.signature;
  box.appendChild(s);
  if (CONFIG.letterGif) {
    const g = document.createElement("p");
    g.className = "letter-gif-line";
    g.innerHTML = `<img class="letter-gif" src="${CONFIG.letterGif}" alt="" />`;
    box.appendChild(g);
  }
}
function revealLetter() {
  const ps = $$("#letter-text p");
  ps.forEach((p) => p.classList.remove("show"));
  ps.forEach((p, i) => setTimeout(() => current === "message" && p.classList.add("show"), 900 + i * 900));
}

/* ---------- 4. Song ---------- */
function buildSong() {
  const frame = $("#video-frame");
  if (!CONFIG.youtubeId) {
    frame.innerHTML = `<div class="video-placeholder">
        <div class="mini-vinyl"></div>
        <div>Our song goes here ♪</div>
        <code>set youtubeId in script.js</code>
      </div>`;
  }
  $$("[data-photo^='song']").forEach((img, i) => setPhoto(img, CONFIG.songPhotos[i], "Us ♥"));
}
// YouTube won't play embeds on a page opened straight from a file (file://),
// so in that case show a tap-to-play card that opens the song on YouTube.
function songCard() {
  const id = encodeURIComponent(CONFIG.youtubeId);
  $("#video-frame").innerHTML = `<a class="song-card" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">
      <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="" />
      <span class="song-play" aria-hidden="true"></span>
      <span class="song-card-text">tap to play our song ♪</span>
    </a>`;
}
function enterSong() {
  if (!CONFIG.youtubeId) return;
  if (location.protocol === "file:") { songCard(); return; }
  // Load the player only when the page opens, and quiet the background music
  // so the song can be heard.
  $("#video-frame").innerHTML = `<iframe
      src="https://www.youtube.com/embed/${encodeURIComponent(CONFIG.youtubeId)}?rel=0&playsinline=1"
      title="Song for you" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  music.pause();
}
function leaveSong() {
  if (!CONFIG.youtubeId || location.protocol === "file:") return;
  $("#video-frame").innerHTML = ""; // stops the video
  music.resume();
}

/* ---------- 5. Memories ---------- */
function buildMemories() {
  const box = $("#polaroids");
  CONFIG.memories.forEach((m, i) => {
    const wrap = document.createElement("div");
    wrap.className = "polaroid-wrap";
    wrap.style.setProperty("--i", i);
    wrap.innerHTML = `<figure class="polaroid" style="--rot:${rand(-6, 6).toFixed(1)}deg">
        <img alt="${m.caption}" loading="lazy" />
        <figcaption>${m.caption}<small>${m.date || ""}</small></figcaption>
      </figure>`;
    const img = $("img", wrap);
    if (m.pos) img.style.objectPosition = m.pos;
    setPhoto(img, m.src, `Memory ${i + 1}`);
    $(".polaroid", wrap).addEventListener("click", () => openLightbox(img.src, m));
    box.appendChild(wrap);
  });
}
function openLightbox(src, m) {
  $("#lightbox-img").src = src;
  $("#lightbox-cap").textContent = m.caption + (m.date ? " · " + m.date : "");
  $("#lightbox").hidden = false;
}
$("#lightbox").addEventListener("click", () => ($("#lightbox").hidden = true));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") $("#lightbox").hidden = true; });

/* ---------- 6. Flowers: burst → cover screen → reveal photo ---------- */
const PEONY_COLORS = ["#f4c025", "#f7d24a", "#f9dc6e", "#fbe7a1", "#fff1c4", "#f6c93a", "#f8b85c"];
const FLOWER_TYPES = [
  { id: "peony", colors: PEONY_COLORS },
  { id: "peony-bud", colors: ["#f4c025", "#f9dc6e", "#fbe39a"] },
  { id: "blossom", colors: ["#fff4cf", "#ffe27a", "#fffdf7"] },
  { id: "daisy", colors: ["#fffdf7", "#fff6d8"] },
];
let blooming = false;

function makeFlower(size) {
  // mostly peonies, with a few buds and little blossoms tucked in
  const t = FLOWER_TYPES[Math.random() < 0.7 ? 0 : Math.floor(rand(1, FLOWER_TYPES.length))];
  const color = t.colors[Math.floor(Math.random() * t.colors.length)];
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("class", "bloom");
  el.setAttribute("width", size);
  el.setAttribute("height", size);
  el.innerHTML = `<use href="#${t.id}" style="color:${color}"/>`;
  return el;
}

async function bloom() {
  if (blooming) return;
  blooming = true;
  const bq = $("#big-bouquet");
  const layer = $("#bloom-layer");
  const r = bq.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height * 0.35;

  bq.classList.add("shake");
  heartBurst(ox, oy, 18, 200);
  await wait(500);
  bq.classList.add("gone");
  $("#flower-hint").style.opacity = 0;

  const W = window.innerWidth, H = window.innerHeight;
  const cell = Math.max(56, Math.min(95, W / 9));
  const cols = Math.ceil(W / cell) + 1;
  const rows = Math.ceil(H / cell) + 1;
  const maxDist = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy));
  const items = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let k = 0; k < 2; k++) { // two layers so no gaps show
        const size = cell * rand(1.15, 1.75);
        const tx = x * cell + rand(-cell * 0.35, cell * 0.35) - size / 2 + (k ? cell / 2 : 0);
        const ty = y * cell + rand(-cell * 0.35, cell * 0.35) - size / 2 + (k ? cell / 2 : 0);
        const el = makeFlower(size);
        layer.appendChild(el);
        const dist = Math.hypot(tx + size / 2 - ox, ty + size / 2 - oy);
        const rot = rand(-180, 180);
        const delay = (dist / maxDist) * 1100 + rand(0, 250);
        el.animate(
          [
            { transform: `translate(${ox - size / 2}px, ${oy - size / 2}px) scale(0) rotate(0deg)`, opacity: 0 },
            { opacity: 1, offset: 0.25 },
            { transform: `translate(${tx}px, ${ty}px) scale(1) rotate(${rot}deg)`, opacity: 1 },
          ],
          { duration: 1100, delay, easing: "cubic-bezier(.17,.84,.44,1)", fill: "both" }
        );
        items.push({ el, tx, ty, rot, size });
      }
    }
  }

  await wait(1100 + 1350 + 300);

  // Photo goes underneath, then flowers drift away to reveal it
  showReveal();
  await wait(250);
  const cx = W / 2, cy = H / 2;
  const far = Math.hypot(cx, cy);
  items.forEach(({ el, tx, ty, rot, size }) => {
    const mx = tx + size / 2 - cx, my = ty + size / 2 - cy;
    const d = Math.hypot(mx, my) || 1;
    const push = rand(120, 260);
    el.animate(
      [
        { transform: `translate(${tx}px, ${ty}px) scale(1) rotate(${rot}deg)`, opacity: 1 },
        { transform: `translate(${tx + (mx / d) * push}px, ${ty + (my / d) * push + 80}px) scale(1.5) rotate(${rot + rand(-90, 90)}deg)`, opacity: 0 },
      ],
      { duration: 1300, delay: (d / far) * 700 + rand(0, 200), easing: "cubic-bezier(.5,0,.75,0)", fill: "both" }
    );
  });
  await wait(2300);
  layer.innerHTML = "";
  startPetals();
}

function showReveal() {
  const rv = $("#reveal");
  const big = $("#reveal-big");
  big.innerHTML = "";
  // letters rise one by one; words stay together so long titles wrap nicely
  let n = 0;
  CONFIG.revealTitle.split(" ").forEach((word, w) => {
    if (w) big.appendChild(document.createTextNode(" "));
    const ws = document.createElement("span");
    ws.className = "word";
    [...word].forEach((ch) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.animationDelay = 1 + n++ * 0.07 + "s";
      ws.appendChild(s);
    });
    big.appendChild(ws);
  });
  // restart CSS animations
  rv.hidden = true;
  void rv.offsetWidth;
  rv.hidden = false;
}

let petalTimer = null;
function startPetals() {
  stopPetals();
  const rv = $("#reveal");
  const spawn = () => {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const size = rand(16, 34);
    p.setAttribute("class", "petal");
    p.setAttribute("width", size);
    p.setAttribute("height", size);
    p.setAttribute("viewBox", "0 0 50 50");
    const kind = Math.random() < 0.6 ? "peony" : "blossom";
    const col = ["#f4c025", "#ffe27a", "#fff1c4", "#f8b85c", "#fff"][Math.floor(rand(0, 5))];
    p.innerHTML = `<use href="#${kind}" style="color:${col}"/>`;
    p.style.left = rand(0, 100) + "vw";
    p.style.setProperty("--dx", rand(-120, 120) + "px");
    p.style.setProperty("--rot", rand(-540, 540) + "deg");
    p.style.animationDuration = rand(6, 11) + "s";
    p.style.opacity = 0;
    p.addEventListener("animationend", () => p.remove());
    rv.appendChild(p);
  };
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 300);
  petalTimer = setInterval(spawn, 650);
}
function stopPetals() {
  clearInterval(petalTimer);
  $$(".petal").forEach((p) => p.remove());
}

function resetFlowers() {
  setTimeout(() => {
    blooming = false;
    stopPetals();
    $("#reveal").hidden = true;
    $("#bloom-layer").innerHTML = "";
    const bq = $("#big-bouquet");
    bq.classList.remove("shake", "gone");
    $("#flower-hint").style.opacity = "";
  }, 700);
}

$("#big-bouquet").addEventListener("click", bloom);
$("#again-btn").addEventListener("click", () => {
  stopPetals();
  $("#reveal").hidden = true;
  $("#big-bouquet").classList.remove("shake", "gone");
  $("#flower-hint").style.opacity = "";
  blooming = false;
  setTimeout(bloom, 300);
});

/* ---------- Music ---------- */
const music = (() => {
  const audio = $("#bgm");
  const btn = $("#music-btn");
  let mode = null; // "file" | "synth"
  let muted = false;
  let paused = false;
  let ctx, master, timer, nextTime = 0, step = 0;

  // Soft music-box arpeggios: C – G – Am – F
  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const chords = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]];
  const melody = [[76, 79], [74, 71], [72, 76], [72, 69]];
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  const eighth = 60 / 70 / 2;

  function note(freq, t, vol, len = 2.2) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o1.type = "sine"; o2.type = "triangle";
    o1.frequency.value = freq; o2.frequency.value = freq * 2;
    const g2 = ctx.createGain(); g2.gain.value = 0.12;
    o1.connect(g); o2.connect(g2).connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o1.start(t); o2.start(t); o1.stop(t + len + 0.05); o2.stop(t + len + 0.05);
  }
  function schedule() {
    while (nextTime < ctx.currentTime + 0.3) {
      const bar = Math.floor(step / 8) % chords.length;
      const pos = step % 8;
      note(midi(chords[bar][pattern[pos]]), nextTime, 0.09);
      if (pos === 0) { note(midi(chords[bar][0] - 12), nextTime, 0.07, 3); note(midi(melody[bar][0]), nextTime, 0.06, 2.6); }
      if (pos === 4) note(midi(melody[bar][1]), nextTime, 0.05, 2.4);
      nextTime += eighth;
      step++;
    }
  }
  function startSynth() {
    mode = "synth";
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    const delay = ctx.createDelay(); delay.delayTime.value = eighth * 1.5;
    const fb = ctx.createGain(); fb.gain.value = 0.3;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2400;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, ctx.currentTime + 2.5);
    nextTime = ctx.currentTime + 0.1;
    timer = setInterval(schedule, 100);
  }
  function fadeInFile() {
    audio.volume = 0;
    let v = 0;
    const id = setInterval(() => { v = Math.min(0.6, v + 0.03); audio.volume = v; if (v >= 0.6) clearInterval(id); }, 120);
  }

  function start() {
    if (mode) return;
    btn.hidden = false;
    audio.src = CONFIG.music;
    audio.play()
      .then(() => { mode = "file"; fadeInFile(); })
      .catch(() => { if (!mode) startSynth(); });
  }
  function apply() {
    btn.classList.toggle("muted", muted);
    const silent = muted || paused;
    if (mode === "file") silent ? audio.pause() : audio.play().catch(() => {});
    if (mode === "synth") silent ? ctx.suspend() : ctx.resume();
  }
  btn.addEventListener("click", () => { muted = !muted; apply(); });

  return {
    start,
    pause() { paused = true; apply(); },
    resume() { paused = false; apply(); },
  };
})();
function startMusic() { music.start(); }

/* ---------- Init ---------- */
$("#intro-title").textContent = CONFIG.introTitle;
buildSeal();
buildLetter();
buildSong();
buildMemories();
setPhoto($("[data-photo='reveal']"), CONFIG.revealPhoto, "");
floatingHearts();

// Preview shortcut: open index.html#gifts, #message, #song, #memories or #flowers
const jump = location.hash.slice(1);
if (jump && jump !== "intro" && document.getElementById(jump)?.classList.contains("scene")) {
  opened = true;
  go(jump);
}