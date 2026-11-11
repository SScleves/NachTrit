// The intro and the title: the painted panels (intro/panel-N.js, with the pixel paintings here as their fallback), captions
// and their Dutch line read aloud, the level card with the town's rumour, and the live title painting (startArt).
import { $ } from './engine.js?v=39';
import { THEMES } from './scenery.js?v=39';
import { S } from './state.js?v=39';
import { speak, voiceTalking } from './speech.js?v=39';
import './input.js?v=39';   // keeps the order the game's code runs in
import { CINE, cineBegin, cineEnd, cineShot, TOWN_OF, towns } from './main.js?v=39';   // later modules, through the hub

// ---------- the intro: six pixel panels ----------
const PANELS = [
  { text: 'The night the mist came in, the windmills turned the wrong way.', nl: 'De nacht dat de mist kwam, draaiden de molens de verkeerde kant op.', draw: (g, t) => {
      px_sky(g, '#0b1430', '#1d3a52'); px_stars(g, t); px_moon(g, 150, 22, 9); px_mist(g, t, 62, 0.5);
      px_ground(g, 78, '#0e1a22');
      px_windmill(g, 60, 78, 26, -t * 1.2); px_windmill(g, 130, 82, 16, -t * 1.6);
    } },
  { text: 'By morning everyone had changed. Two things had not: they still split the bill, and the women were still taller than him.', nl: 'Tegen de ochtend was iedereen veranderd. Twee dingen niet: ze deelden de rekening nog steeds, en de vrouwen waren nog steeds langer dan hij.', draw: (g, t) => {
      px_sky(g, '#13203a', '#2a4a5e'); px_ground(g, 84, '#101a24');
      for (let i = 0; i < 7; i++) px_house(g, i * 28 - 6, 84, 24, 36 + (i * 7) % 16, i % 2 === 0);
      px_zombie(g, 30, 84, t, '€4,50'); px_zombie(g, 150, 84, t + 2, 'Tikkie?'); px_tallwoman(g, 108, 84, t + 1); px_man(g, 84, 62, t);
      px_mist(g, t, 90, 0.4);
    } },
  { text: 'Two years here and he never practised. Everyone spoke English. Everyone was so nice about it.', nl: 'Twee jaar hier en hij oefende nooit. Iedereen sprak Engels. Iedereen was er zo aardig over.', draw: (g, t) => {
      px_sky(g, '#2a4a5e', '#6d8ea0'); px_ground(g, 86, '#2b3a3e');
      px_cafe(g); px_man(g, 60, 60, t); px_bubble(g, 50, 30, 'Hoi!'); px_friend(g, 124, 62, t, 'English is fine!');
    } },
  { text: 'Now the only ones who still understand him are two dogs and a grammar book he never opened.', nl: 'Nu zijn de enigen die hem nog begrijpen twee honden en een grammaticaboek dat hij nooit heeft opengeslagen.', draw: (g, t) => {
      px_room(g); px_man(g, 70, 56, t); px_dog(g, 120, 86, t); px_dog(g, 140, 88, t + 1); px_book(g, 92, 72);
    } },
  { text: 'Page one: de or het. There is no rule. There is never a rule.', nl: 'Bladzijde één: de of het. Er is geen regel. Er is nooit een regel.', draw: (g, t) => {
      g.fillStyle = '#0a0b0e'; g.fillRect(0, 0, 192, 108);
      g.fillStyle = '#e4dcc6'; g.fillRect(28, 14, 64, 82); g.fillRect(100, 14, 64, 82);
      g.fillStyle = '#9a927f'; g.fillRect(92, 14, 8, 82);
      px_text(48, 44, 'DE', '#2a2a2e', 14, true); px_text(116, 44, 'HET', '#2a2a2e', 14, true);
      ['de hond', 'de vrouw', 'de fiets', 'de nacht'].forEach((w, i) => px_text(36, 58 + i * 9, w, '#555', 7));
      ['het huis', 'het brood', 'het ei', 'het water'].forEach((w, i) => px_text(108, 58 + i * 9, w, '#555', 7));
      if (Math.floor(t * 1.5) % 2) px_text(93, 88, '?', '#b8282a', 12, true);
    } },
  { text: '...', nl: '...', draw: (g, t) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, 192, 108);
      const blink = Math.sin(t * 2.5) > 0.92;
      if (!blink) { g.fillStyle = '#e8e4d8'; [[70, 60], [78, 60], [112, 66], [120, 66]].forEach(([x, y]) => g.fillRect(x, y, 3, 2)); }
      g.fillStyle = '#d9792a'; g.fillRect(94, 30, 6, 10);
    } },
  { text: 'No helmet. A helmet would make him look enthusiastic.', nl: 'Geen helm. Met een helm zou hij enthousiast lijken.', draw: (g, t) => {
      px_sky(g, '#0b1430', '#1a3246'); px_stars(g, t); px_ground(g, 88, '#0e1a22');
      px_omafiets(g, 112, 88, t, true); px_man(g, 60, 64, t); g.fillStyle = '#e8e4d8'; g.fillRect(70, 82, 11, 6); g.fillStyle = '#d9792a'; g.fillRect(72, 88, 7, 1);
      if (Math.floor(t * 2) % 3 === 0) px_text(52, 44, 'nee.', '#e8e4d8', 7, true);
    } },
  { text: 'Fak. Oké. One man, one omafiets, three hundred and sixty words. Nachtrit.', nl: 'Fak. Oké. Eén man, één omafiets, driehonderdzestig woorden. Nachtrit.', draw: (g, t) => {
      px_sky(g, '#0b1430', '#1a3246'); px_stars(g, t); px_ground(g, 88, '#0e1a22');
      px_omafiets(g, 88, 88, t); px_beam(g, 112, 72, t);
    } },
];
let pxLabels = [];
function px_text(x, y, str, color, size = 7, bold = false) { pxLabels.push({ x, y, str, color, size, bold }); }
function px_sky(g, top, bottom) { const gr = g.createLinearGradient(0, 0, 0, 108); gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 192, 108); }
function px_stars(g, t) { g.fillStyle = '#c9d4e0'; for (let i = 0; i < 18; i++) { if (Math.sin(t * 2 + i * 7) > -0.3) g.fillRect((i * 37) % 192, (i * 23) % 50, 1, 1); } }
function px_moon(g, x, y, r) { g.fillStyle = '#e6e2c8'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = '#b9b49a'; g.fillRect(x - 3, y - 2, 2, 2); g.fillRect(x + 2, y + 3, 3, 2); }
function px_mist(g, t, y, a) { g.fillStyle = `rgba(190,205,215,${a * 0.5})`; for (let i = 0; i < 4; i++) { const x = ((i * 61 + t * 6) % 230) - 30; g.fillRect(x, y + i * 4, 50 + i * 10, 5); } }
function px_ground(g, y, c) { g.fillStyle = c; g.fillRect(0, y, 192, 108 - y); }
function px_windmill(g, x, y, h, a) {
  g.fillStyle = '#1c2a36'; g.fillRect(x - 4, y - h, 8, h); g.fillRect(x - 6, y - h - 4, 12, 4);
  g.fillStyle = '#c9a04a'; g.fillRect(x - 1, y - h + 6, 2, 3);
  g.strokeStyle = '#223344'; g.lineWidth = 2;
  for (let i = 0; i < 4; i++) { const ang = a + i * Math.PI / 2; g.beginPath(); g.moveTo(x, y - h - 2); g.lineTo(x + Math.cos(ang) * h * 0.8, y - h - 2 + Math.sin(ang) * h * 0.8); g.stroke(); }
}
function px_house(g, x, y, w, h, lit) {
  g.fillStyle = '#1a2430'; g.fillRect(x, y - h, w, h); g.fillStyle = '#121a24'; g.beginPath(); g.moveTo(x - 2, y - h); g.lineTo(x + w / 2, y - h - 10); g.lineTo(x + w + 2, y - h); g.fill();
  g.fillStyle = lit ? '#e0b45a' : '#0e141c'; g.fillRect(x + 6, y - h + 10, 4, 5); g.fillRect(x + w - 10, y - h + 10, 4, 5); g.fillRect(x + 6, y - 20, 4, 5);
}
function px_zombie(g, x, y, t, label) {
  const lean = Math.round(Math.sin(t * 1.5) * 2);
  g.fillStyle = '#263238'; g.fillRect(x - 3 + lean, y - 24, 7, 6); g.fillRect(x - 4 + lean, y - 18, 9, 12); g.fillRect(x - 3 + lean, y - 6, 3, 6); g.fillRect(x + 1 + lean, y - 6, 3, 6);
  g.fillStyle = '#2f3d44'; g.fillRect(x + 5 + lean, y - 16, 8, 2);
  g.fillStyle = '#7fe0ff'; g.fillRect(x + 11 + lean, y - 19, 4, 6);
  g.fillStyle = '#b8282a'; g.fillRect(x - 1 + lean, y - 22, 1, 1); g.fillRect(x + 2 + lean, y - 22, 1, 1);
  px_text(x - 6, y - 28, label, '#e8e4d8', 6, true);
}
function px_tallwoman(g, x, y, t) { const lean = Math.round(Math.sin(t * 1.5) * 2); g.fillStyle = '#263238'; g.fillRect(x - 3 + lean, y - 38, 7, 7); g.fillRect(x - 5 + lean, y - 31, 11, 20); g.fillRect(x - 4 + lean, y - 11, 3, 11); g.fillRect(x + 1 + lean, y - 11, 3, 11); g.fillStyle = '#3a2a2e'; g.fillRect(x - 4 + lean, y - 40, 9, 4); g.fillStyle = '#b8282a'; g.fillRect(x - 1 + lean, y - 35, 1, 1); g.fillRect(x + 2 + lean, y - 35, 1, 1); g.fillStyle = '#7fe0ff'; g.fillRect(x + 7 + lean, y - 28, 4, 6); }
function px_cafe(g) { g.fillStyle = '#5a4634'; g.fillRect(40, 70, 110, 3); g.fillRect(44, 73, 3, 14); g.fillRect(143, 73, 3, 14); g.fillStyle = '#d9d2bf'; g.fillRect(84, 62, 8, 8); g.fillStyle = '#6b4a2b'; g.fillRect(85, 64, 6, 4); g.fillStyle = '#e0b45a'; g.fillRect(20, 20, 14, 14); g.fillRect(158, 20, 14, 14); }
function px_bubble(g, x, y, txt) { g.fillStyle = '#f2eee2'; g.fillRect(x, y, txt.length * 4.4 + 6, 11); g.fillRect(x + 4, y + 11, 3, 3); px_text(x + 3, y + 8, txt, '#1a1a1e', 7, true); }
function px_friend(g, x, y, t, txt) { const bob = Math.round(Math.sin(t * 2 + 1)); g.fillStyle = '#e8c9a0'; g.fillRect(x - 3, y - 14 + bob, 7, 7); g.fillStyle = '#3f6e8c'; g.fillRect(x - 5, y - 7 + bob, 11, 16); g.fillStyle = '#1a1a1e'; g.fillRect(x - 4, y + 9 + bob, 4, 14); g.fillRect(x + 1, y + 9 + bob, 4, 14); px_bubble(g, x - 40, y - 36, txt); }
function px_room(g) { g.fillStyle = '#1a1c24'; g.fillRect(0, 0, 192, 108); g.fillStyle = '#262330'; g.fillRect(0, 70, 192, 38); g.fillStyle = '#2f4a66'; g.fillRect(20, 16, 30, 26); g.fillStyle = '#e0b45a'; g.fillRect(150, 10, 10, 10); g.fillStyle = '#5a4634'; g.fillRect(80, 66, 50, 4); g.fillRect(82, 70, 3, 20); g.fillRect(125, 70, 3, 20); }
function px_man(g, x, y, t) { const bob = Math.round(Math.sin(t * 2)); g.fillStyle = '#e8c9a0'; g.fillRect(x - 3, y - 14 + bob, 7, 7); g.fillStyle = '#2a2a2e'; g.fillRect(x - 3, y - 16 + bob, 7, 3); g.fillStyle = '#d9792a'; g.fillRect(x - 5, y - 7 + bob, 11, 16); g.fillStyle = '#1a1a1e'; g.fillRect(x - 4, y + 9 + bob, 4, 14); g.fillRect(x + 1, y + 9 + bob, 4, 14); }
function px_omafiets(g, x, y, t, empty) {
  // wheels, mudguards, swept frame, basket, rider sitting upright, lamp
  g.strokeStyle = '#8a9096'; g.lineWidth = 2; g.beginPath(); g.arc(x - 14, y - 2, 8, 0, 7); g.arc(x + 14, y - 2, 8, 0, 7); g.stroke();
  g.strokeStyle = '#1a1d22'; g.lineWidth = 1; g.beginPath(); g.arc(x - 14, y - 2, 9, Math.PI, Math.PI * 1.9); g.arc(x + 14, y - 2, 9, Math.PI * 1.1, Math.PI * 2); g.stroke();
  g.strokeStyle = '#2b4a5e'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 14, y - 2); g.lineTo(x - 2, y - 20); g.lineTo(x + 12, y - 20); g.lineTo(x + 14, y - 2); g.moveTo(x - 2, y - 20); g.quadraticCurveTo(x + 4, y - 8, x + 14, y - 2); g.stroke();
  g.fillStyle = '#6b4a2b'; g.fillRect(x + 8, y - 30, 12, 8); g.fillStyle = '#8a6a3b'; for (let i = 0; i < 3; i++) g.fillRect(x + 9 + i * 4, y - 29, 1, 6);
  if (empty) return;
  g.fillStyle = '#e8c9a0'; g.fillRect(x - 4, y - 38, 7, 6); g.fillStyle = '#2a2a2e'; g.fillRect(x - 4, y - 40, 7, 3);
  g.fillStyle = '#d9792a'; g.fillRect(x - 6, y - 32, 11, 13); g.fillStyle = '#1a1a1e'; g.fillRect(x - 4, y - 19, 4, 9); g.fillRect(x + 2, y - 19, 4, 11);
  g.fillStyle = '#eaf2f5'; g.fillRect(x + 20, y - 22, 3, 3);
}
function px_beam(g, x, y, t) { g.fillStyle = `rgba(220,230,235,${0.14 + Math.sin(t * 6) * 0.03})`; g.beginPath(); g.moveTo(x, y + 2); g.lineTo(192, y - 26); g.lineTo(192, y + 26); g.fill(); }
function px_dog(g, x, y, t) { const w = Math.round(Math.sin(t * 5)); g.fillStyle = '#3a2f28'; g.fillRect(x, y - 6, 12, 6); g.fillRect(x + 10, y - 10, 5, 5); g.fillRect(x + 1, y, 2, 4); g.fillRect(x + 9, y, 2, 4); g.fillRect(x - 3, y - 8 + w, 3, 2); g.fillStyle = '#e8e4d8'; g.fillRect(x + 13, y - 9, 1, 1); }
function px_book(g, x, y) { g.fillStyle = '#e4dcc6'; g.fillRect(x, y - 6, 14, 6); g.fillStyle = '#b8282a'; g.fillRect(x, y - 7, 14, 1); }

// one-panel scenes per theme, used by the level intros
const SCENES = {
  street: (g, t) => { px_sky(g, '#0b1430', '#1d3a52'); px_stars(g, t); px_ground(g, 84, '#101a24'); for (let i = 0; i < 7; i++) px_house(g, i * 28 - 6, 84, 24, 36 + (i * 7) % 16, i % 3 === 0); px_dog(g, 40, 92, t); px_dog(g, 60, 94, t + 1); px_omafiets(g, 120, 92, t); px_mist(g, t, 88, 0.3); },
  dyke: (g, t) => { px_sky(g, '#0b1430', '#1d3a52'); px_stars(g, t); px_moon(g, 150, 22, 9); px_ground(g, 78, '#0e1a22'); g.fillStyle = '#16303c'; g.fillRect(0, 90, 192, 18); px_windmill(g, 60, 78, 26, -t * 1.2); px_windmill(g, 130, 82, 16, -t * 1.6); px_mist(g, t, 70, 0.4); },
  square: (g, t) => { px_sky(g, '#0b1430', '#1d3a52'); px_stars(g, t); px_ground(g, 86, '#121a24'); g.fillStyle = '#1a2430'; g.fillRect(80, 30, 34, 56); g.fillRect(90, 10, 14, 20); g.beginPath(); g.moveTo(88, 10); g.lineTo(97, -2); g.lineTo(106, 10); g.fill(); g.fillStyle = '#e0b45a'; g.fillRect(94, 40, 6, 12); g.fillStyle = '#1d2a22'; g.beginPath(); g.arc(30, 70, 14, 0, 7); g.arc(160, 72, 12, 0, 7); g.fill(); g.fillStyle = '#17171a'; g.fillRect(28, 70, 4, 16); g.fillRect(158, 72, 4, 14); if (Math.floor(t * 2) % 2) px_text(96, 28, '♪', '#e8e4d8', 7, true); },
  nightshop: (g, t) => { px_sky(g, '#0a0f1c', '#162638'); px_ground(g, 86, '#121820'); g.fillStyle = '#1a2430'; g.fillRect(50, 30, 92, 56); g.fillStyle = '#8fd0ff'; g.fillRect(58, 48, 76, 30); g.fillStyle = '#0d1420'; for (let i = 0; i < 4; i++) g.fillRect(62 + i * 18, 52, 12, 22); g.fillStyle = '#1b1d21'; g.fillRect(54, 34, 84, 10); px_text(70, 42, 'NACHTWINKEL', Math.floor(t * 3) % 4 ? '#ffd27a' : '#5a4a2a', 7, true); px_zombie(g, 150, 86, t, '€4,50'); },
  shops: (g, t) => { px_sky(g, '#0a0f1c', '#162638'); px_ground(g, 86, '#121820'); [['BAKKER', 10], ['SLAGER', 70], ['KAAS', 130]].forEach(([n, x], i) => { g.fillStyle = i % 2 ? '#2a2e38' : '#1a2430'; g.fillRect(x, 36, 54, 50); g.fillStyle = '#e0b45a'; g.fillRect(x + 8, 60, 38, 20); px_text(x + 6, 48, n, '#e8e4d8', 7, true); }); px_zombie(g, 100, 86, t, 'Tikkie?'); },
  polder: (g, t) => SCENES.dyke(g, t),
};
const rumourShown = new Set();
// the card before a level: a few seconds of the level's own town in 3D under its line, so every level opens on its place.
// k 0 is the wide shot under the town's rumour (high at the side, craning down the street), k 1 the low shot behind him under
// the level's line. Seeded per level, so a level always opens the same way. The painting stays as the fallback.
function levelCard(lv, k) {
  const town = lv.town || TOWN_OF(lv.id), themeKey = (lv.theme && THEMES[lv.theme]) ? lv.theme : 'polder';
  const side = (lv.id % 2) ? 1 : -1;   // which side of the street the camera favours, varied per level
  return {
    hold: 4, dogs: true,   // he rides out with his dogs, as on the street shots
    build(W) {
      W.stage({ town, theme: themeKey, seed: lv.id * 7 + k, preroll: 60 });
      W.speed(k ? 6 : 3); W.face('deadpan');
      this.update(W, 0, 0);
    },
    update(W, t) {
      const s = W.smooth(W.clamp(t / 7, 0, 1));
      if (!k) W.cam(side * W.lerp(5.5, 3.2, s), W.lerp(8.5, 4.6, s), W.lerp(9, 6.5, s), side * 0.6, 1.6, -38, 56);
      else W.cam(side * W.lerp(2.3, 1.5, s), W.lerp(1.5, 2.1, s), W.lerp(5.6, 4.4, s), 0, 1.35, -18, 52);
      W.drift(t, 0.6);
    },
  };
}
function showLevelIntro(lv, then) {
  if (!lv.intro) return then();
  const NA = window.NRART, sc = NA && (NA.scenes[lv.theme] || NA.scenes.street);
  const draw = sc || SCENES[lv.theme] || SCENES.street;
  const panels = [];
  const t = towns().find(x => x.id === (lv.town || TOWN_OF(lv.id)));
  if (t && t.rumour && !rumourShown.has(t.id)) { rumourShown.add(t.id); panels.push({ text: `${t.name}. Nobody agrees on what caused it. Here they say: ${t.rumour}`, nl: `${t.name}. Niemand is het eens over de oorzaak. Hier zeggen ze: ${t.rumourNl}`, draw, nr: !!sc, cine: levelCard(lv, 0) }); }
  panels.push({ text: lv.intro, nl: lv.introNl || '', draw, nr: !!sc, cine: levelCard(lv, 1) });
  showIntro(then, panels);
}

let introI = 0, introT = 0, introRaf = 0;
// a first run gets the cut with every joke: the mist came, still split the bill, the four rumours (cheese, the Flemish poll,
// the drunk-German tourist, the one-cent Tikkie), never practised, one man one omafiets. The premise is on the start screen.
// The intro link on the start screen plays all fourteen.
const INTRO_SHORT = [0, 1, 2, 3, 4, 5, 7, 13];
function showIntro(then, panels, full, from) {
  const NA = window.NRART, nrOk = NA && NA.panels.length >= 14 && NA.panels.slice(0, 14).every(Boolean);
  const all = panels || (nrOk ? NA.panels.slice(0, 14).map((p, i) => ({ text: p.text, nl: p.nl, draw: p.draw, nr: true, cine: i })) : PANELS);
  const short = !panels && !full && nrOk, PANELS_ = short ? INTRO_SHORT.map(i => all[i]) : all;
  introI = from || 0; introT = 0; $('intro').style.display = 'flex';
  const cv = $('pix'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false; const hg = $('pixhi').getContext('2d');
  const txt = $('pixtext'), nlEl = $('pixnl'), frameEl = $('pixframe'), cover = $('introfade'); PANELS_.forEach(p => { p._nlShown = false; });
  // captions appear whole with a fade, the Dutch a beat later and spoken; a panel holds for its reading time (and the
  // spoken Dutch, and a 3D shot's own length), then moves on by itself; tap, space or enter moves on sooner
  const hold = p => Math.max(3.2, 0.055 * p.text.length + 0.035 * (p.nl || '').length, (p._cine && (typeof p.cine === 'object' ? p.cine : CINE[p.cine]).hold) || 0);
  let shown = -1, leaving = false, last = performance.now();
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; introT += dt;
    const p = PANELS_[introI], hc = $('pixhi');
    if (!p) return;
    if (shown !== introI) {   // a new panel: its 3D shot if it has one (staged under the black), else its painting
      shown = introI; p._cine = p.cine != null && cineBegin(p.cine); if (!p._cine) cineEnd();
      frameEl.style.display = p._cine ? 'none' : '';
      txt.textContent = p.text; nlEl.textContent = ''; nlEl.style.opacity = 0; txt.style.opacity = 1; cover.style.opacity = 0;
    }
    hg.clearRect(0, 0, hc.width, hc.height);
    if (p._cine && !cineShot) { p._cine = false; frameEl.style.display = ''; }   // its shot broke: the painting takes over
    if (p._cine) { /* the game's own canvas shows through, drawn by the main loop */ }
    else if (p.nr) { NA.labels.length = 0; NA.paint(g, p.draw, introT); NA.drawLabels(hg, NA.labels, hc.width / cv.width); }
    else {   // legacy 192x108 drawings, scaled up to the canvas
      pxLabels = []; g.setTransform(cv.width / 192, 0, 0, cv.height / 108, 0, 0); p.draw(g, introT); g.setTransform(1, 0, 0, 1, 0, 0);
      const k = hc.width / 192; for (const l of pxLabels) { hg.font = `${l.bold ? 'bold ' : ''}${l.size * k}px "Segoe UI", system-ui, sans-serif`; hg.fillStyle = l.color; hg.fillText(l.str, l.x * k, l.y * k); }
    }
    if (introT > 0.6 && !p._nlShown) { p._nlShown = true; nlEl.textContent = p.nl || ''; nlEl.style.opacity = 1; if (p.nl && p.nl !== '...') speak(p.nl); }
    const talking = S.voice && voiceTalking();
    if (!leaving && introT > hold(p) && (!talking || introT > hold(p) + 6)) next();
    introRaf = requestAnimationFrame(frame);
  };
  introRaf = requestAnimationFrame(frame);
  // between panels the picture dips to black with the captions, so a 3D set is built out of sight
  const next = () => {
    if (leaving) return; leaving = true;
    cover.style.opacity = 1; txt.style.opacity = 0; nlEl.style.opacity = 0;
    setTimeout(() => { leaving = false; introI++; introT = 0; if (introI >= PANELS_.length) finish(); }, 260);
  };
  const finish = () => {
    cancelAnimationFrame(introRaf); cineEnd(); cover.style.opacity = 0; frameEl.style.display = ''; txt.style.opacity = 1; $('intro').style.display = 'none'; $('intro').onclick = null; onKey = null;
    if (!panels) { try { localStorage.setItem('nachtrit.intro', short ? 'short' : 'full'); } catch (e) {} }
    then();
  };
  $('intro').onclick = (e) => { if (e.target.id === 'skip') finish(); else next(); };
  onKey = (e) => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') next(); else if (e.key === 'Escape') finish(); };
}
let onKey = null;
addEventListener('keydown', e => { if (onKey && $('intro').style.display !== 'none') { onKey(e); e.preventDefault(); } });
let introSeen = false; try { introSeen = !!localStorage.getItem('nachtrit.intro'); } catch (e) {}
if (new URLSearchParams(location.search).has('intro')) introSeen = false;
function setIntroSeen(v) { introSeen = v; }   // the title's button and ?map / ?cine set it (an imported binding is read-only)
// the start screen: the intro's first shot, live in 3D behind the title (the mills of Kinderdijk at night, the moon, thin mist).
// It holds the shot's first beat, the camera sliding slowly along the row and back, so Start cuts into the same shot. The first
// painting, live, stands in until the 3D world is up and takes over if the shot cannot run; under it the loop skips the 3D render.
const startArt = (() => {
  const cv = $('startpix'), g = cv.getContext('2d'), NA = window.NRART, p = NA && NA.panels && NA.panels[0];
  let raf = 0, shot = null; const t0 = performance.now();
  const up = () => $('start').style.display !== 'none';
  const frame = now => { if (!up() || shot) { raf = 0; return; } NA.labels.length = 0; NA.paint(g, p.draw, (now - t0) / 1000); raf = requestAnimationFrame(frame); };
  const drop = () => { shot = null; $('start').classList.remove('live3d'); };
  return {
    on() { if (p && !raf && !shot) { g.imageSmoothingEnabled = false; raf = requestAnimationFrame(frame); } },
    on3d() {
      const s1 = CINE[0]; if (!s1 || !up()) return false;
      let T = 0;
      const s = {
        hold: 0, dogs: true,   // the title keeps the dogs it always had
        build(W) { s1.build(W); },
        // the shot's clock eases from 0 to 3.4 s and back every 28 s: always its first beat, the sails the right way, the mist breathing
        update(W, t, dt) { T += dt; s1.update(W, 3.4 * (0.5 - 0.5 * Math.cos(T * Math.PI / 14)), dt); },
        dispose(W) { if (s1.dispose) s1.dispose(W); },
        // its picture is the screen under the title, so the mills and the moon stand clear of the words
        band() { const top = Math.round(Math.min($('start').querySelector('.box').getBoundingClientRect().bottom, innerHeight * 0.6)); return { top, bottom: innerHeight, height: innerHeight - top, width: innerWidth, portrait: innerWidth < innerHeight - top }; },
      };
      if (!cineBegin(s)) return false;
      shot = s; if (raf) { cancelAnimationFrame(raf); raf = 0; } $('start').classList.add('live3d'); return true;
    },
    // leaving the start screen ends its shot; a shot that broke gives the screen back to the painting
    off() { if (!shot) return; const s = shot; drop(); if (cineShot === s) cineEnd(); },
    watch() { if (shot && cineShot !== shot) { drop(); if (up()) this.on(); } },
    get live() { return !!raf; },
  };
})();
$('replay').style.display = introSeen ? '' : 'none';   // the first run plays the intro after Start; the link is for the second time
startArt.on();

export { introSeen, setIntroSeen, showIntro, showLevelIntro, startArt };
