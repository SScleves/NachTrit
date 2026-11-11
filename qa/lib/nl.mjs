// Small Dutch helpers for the content audits: tokens, a word list check, and a rough lemma.
// The word list is dictionary-nl (OpenTaal, BSD-3-Clause OR CC-BY-3.0) read with nspell (MIT).
// Both are devDependencies, used by qa/ only, never loaded by the game.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// words of a Dutch string, lower case, punctuation dropped, apostrophes kept inside words (pizza's, 't, m'n)
export function tokens(s) {
  return String(s).replace(/[“”"«»(),.?!:;…–—]/g, ' ').split(/\s+/).map(t => t.replace(/^'+(?=[a-zà-ÿ]{2,})|'+$/gi, '').replace(/^-+|-+$/g, '')).filter(t => /[\p{L}]/u.test(t));
}
export const lc = t => t.toLowerCase();

let SPELL = null;
export function speller(root = process.cwd()) {
  if (SPELL) return SPELL;
  const nspell = require('nspell');
  const dir = path.join(root, 'node_modules', 'dictionary-nl');
  SPELL = nspell(fs.readFileSync(path.join(dir, 'index.aff')), fs.readFileSync(path.join(dir, 'index.dic')));
  return SPELL;
}
// allow list: one word per line, # comments, a "## heading" line names the group the following words belong to
export function allowList(root = process.cwd()) {
  const file = path.join(root, 'qa', 'allow-words.txt'); const map = new Map(); let group = 'other';
  if (!fs.existsSync(file)) return map;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim(); if (!line) continue;
    if (line.startsWith('##')) { group = line.replace(/^#+\s*/, ''); continue; }
    if (line.startsWith('#')) continue;
    map.set(line.split(/\s+/)[0].toLowerCase(), group);
  }
  return map;
}
// is this token a Dutch word (dictionary or allow list)? Capitalised forms count when the dictionary knows them (names).
// compounds: accepted for right answers and sentence text; a wrong option must be in the list itself (gesp+eelt is not gespeelt)
export function isWord(tok, allow, compounds = true) {
  if (allow && !ALLOW_CACHE) ALLOW_CACHE = allow;
  const sp = speller();
  if (/^\d/.test(tok) || /^[€%]/.test(tok)) return true;
  if (allow && allow.has(tok.toLowerCase())) return true;
  // a capitalised dictionary entry (a name) only counts when the text itself is capitalised
  if (sp.correct(tok.toLowerCase())) return true;
  if (/^\p{Lu}/u.test(tok) && sp.correct(tok)) return true;
  if (tok.includes('-')) return tok.split('-').every(p => !p || isWord(p, allow, compounds));
  const low = tok.toLowerCase();
  if (NUM_MORPH.test(low)) return numerals().has(low);   // numbers are checked against every real numeral, so zesentien fails
  return compounds && isCompound(low, 2);
}
// a compound of dictionary words, with an optional linking s, e or en: kaas+boer, schapen+kaas, verjaardag+s+feest
const LINK = ['', 's', 'e', 'en', 'n'];
function known(w) { const sp = speller(); return w.length >= 3 && (sp.correct(w) || (ALLOW_CACHE && ALLOW_CACHE.has(w))); }
function isCompound(w, depth) {
  for (let i = 3; i <= w.length - 3; i++) {
    const head = w.slice(0, i);
    for (const l of LINK) {
      if (!head.endsWith(l) && l) continue;
      const h = l ? head.slice(0, head.length - l.length) : head; if (!known(h)) continue;
      const tail = w.slice(i); if (known(tail) || (depth > 1 && isCompound(tail, depth - 1))) return true;
    }
  }
  return false;
}
let ALLOW_CACHE = null;
// every Dutch numeral from 0 to 9999, spelled as one word (vijfentwintig, tweeënveertig, tweeduizendvijfhonderd)
const NUM_MORPH = /^(nul|een|één|twee|drie|vier|vijf|zes|zeven|acht|negen|tien|elf|twaalf|der|veer|tien|tig|twin|ders|zestig|zeventig|tachtig|negentig|honderd|duizend|en|ën)+$/;
let NUMS = null;
function numerals() {
  if (NUMS) return NUMS;
  const u = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
  const t = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];
  const lt100 = n => n < 20 ? u[n] : n % 10 === 0 ? t[n / 10] : u[n % 10] + (/e$/.test(u[n % 10]) ? 'ën' : 'en') + t[Math.floor(n / 10)];
  const lt1000 = n => n < 100 ? lt100(n) : (n >= 200 ? u[Math.floor(n / 100)] : '') + 'honderd' + (n % 100 ? lt100(n % 100) : '');
  NUMS = new Set();
  for (let n = 0; n < 10000; n++) NUMS.add(n < 1000 ? lt1000(n) : (n >= 2000 ? u[Math.floor(n / 1000)] : '') + 'duizend' + (n % 1000 ? lt1000(n % 1000) : ''));
  for (let h = 11; h < 100; h++) if (h % 10) for (let r = 0; r < 100; r++) NUMS.add(lt100(h) + 'honderd' + (r ? lt100(r) : ''));   // twaalfhonderd, negentienhonderdvijftig
  for (const k of ['honderd', 'tien', 'twintig', 'vijftig']) for (const m of ['', 'twee', 'drie', 'vier', 'vijf']) NUMS.add(m + k + 'duizend');
  NUMS.add('één'); NUMS.add('honderd'); NUMS.add('duizend'); NUMS.add('miljoen');
  return NUMS;
}

// ---- lemma: irregular table first, then a light stemmer ----
// strong and irregular verbs: infinitive -> forms (present stems, past, participle)
const IRREG = `zijn: ben bent is zijn was waren geweest wees
hebben: heb hebt heeft hebben had hadden gehad
kunnen: kan kunt kun kunnen kon konden gekund
willen: wil wilt willen wou wilde wouden wilden gewild
mogen: mag mogen mocht mochten gemogen
moeten: moet moeten moest moesten gemoeten
zullen: zal zult zullen zou zouden
gaan: ga gaat gaan ging gingen gegaan
doen: doe doet doen deed deden gedaan
zien: zie ziet zien zag zagen gezien
komen: kom komt komen kwam kwamen gekomen
worden: word wordt worden werd werden geworden
staan: sta staat staan stond stonden gestaan
slaan: sla slaat slaan sloeg sloegen geslagen
eten: eet eten at aten gegeten
drinken: drink drinkt drinken dronk dronken gedronken
lopen: loop loopt lopen liep liepen gelopen
zitten: zit zitten zat zaten gezeten
liggen: lig ligt liggen lag lagen gelegen
nemen: neem neemt nemen nam namen genomen
geven: geef geeft geven gaf gaven gegeven
krijgen: krijg krijgt krijgen kreeg kregen gekregen
blijven: blijf blijft blijven bleef bleven gebleven
schrijven: schrijf schrijft schrijven schreef schreven geschreven
lezen: lees leest lezen las lazen gelezen
spreken: spreek spreekt spreken sprak spraken gesproken
vinden: vind vindt vinden vond vonden gevonden
denken: denk denkt denken dacht dachten gedacht
brengen: breng brengt brengen bracht brachten gebracht
kopen: koop koopt kopen kocht kochten gekocht
zoeken: zoek zoekt zoeken zocht zochten gezocht
vragen: vraag vraagt vragen vroeg vroegen gevraagd
zeggen: zeg zegt zeggen zei zeiden gezegd
weten: weet weten wist wisten geweten
laten: laat laten liet lieten gelaten
slapen: slaap slaapt slapen sliep sliepen geslapen
beginnen: begin begint beginnen begon begonnen begonnen
rijden: rijd rijdt rijden reed reden gereden
vallen: val valt vallen viel vielen gevallen
houden: houd hou houdt houden hield hielden gehouden
helpen: help helpt helpen hielp hielpen geholpen
sterven: sterf sterft sterven stierf stierven gestorven
vergeten: vergeet vergeten vergat vergaten
verliezen: verlies verliest verliezen verloor verloren
winnen: win wint winnen won wonnen gewonnen
zwemmen: zwem zwemt zwemmen zwom zwommen gezwommen
roepen: roep roept roepen riep riepen geroepen
hangen: hang hangt hangen hing hingen gehangen
kiezen: kies kiest kiezen koos kozen gekozen
dragen: draag draagt dragen droeg droegen gedragen
sluiten: sluit sluiten sloot sloten gesloten
bieden: bied biedt bieden bood boden geboden
trekken: trek trekt trekken trok trokken getrokken
breken: breek breekt breken brak braken gebroken
vliegen: vlieg vliegt vliegen vloog vlogen gevlogen
wijzen: wijs wijst wijzen wees wezen gewezen
zingen: zing zingt zingen zong zongen gezongen
springen: spring springt springen sprong sprongen gesprongen
stijgen: stijg stijgt stijgen steeg stegen gestegen
verdwijnen: verdwijn verdwijnt verdwijnen verdween verdwenen
vertrekken: vertrek vertrekt vertrekken vertrok vertrokken
begrijpen: begrijp begrijpt begrijpen begreep begrepen
kijken: kijk kijkt kijken keek keken gekeken
schijnen: schijn schijnt schijnen scheen schenen geschenen
lijken: lijk lijkt lijken leek leken geleken
wegen: weeg weegt wegen woog wogen gewogen
vriezen: vries vriest vriezen vroor vroren gevroren
waaien: waai waait waaien woei waaide gewaaid
binden: bind bindt binden bond bonden gebonden
schieten: schiet schieten schoot schoten geschoten
sturen: stuur stuurt sturen stuurde stuurden gestuurd
heten: heet heten heette heetten geheten
bakken: bak bakt bakken bakte bakten gebakken
lachen: lach lacht lachen lachte lachten gelachen
wassen: was wast wassen waste gewassen
goed: goed beter best beste
veel: veel meer meest meeste
weinig: weinig minder minst minste
graag: graag liever liefst
mijn: mijn m'n
zijn_pos: z'n
een: een 'n`;
const IRREG_OF = new Map();
for (const line of IRREG.split('\n')) { const [lemma, forms] = line.split(':'); for (const f of forms.trim().split(/\s+/)) if (!IRREG_OF.has(f)) IRREG_OF.set(f, lemma.replace(/_pos$/, '')); }
// words that look alike but are not forms of one another (function words and pronouns)
const CLOSED = new Set('ik je jij u hij zij ze het we wij jullie me mij hem haar ons hen hun zich mijn jouw jou uw zijn onze ons hun die dat deze dit de een er hier daar waar wat wie welk welke niet geen wel nog al ook maar dan als of en want omdat dus toen te om aan op in uit bij met van voor naar door over onder tegen na tot sinds zonder'.split(' '));
const NUMBERS = new Set('nul een twee drie vier vijf zes zeven acht negen tien elf twaalf dertien veertien vijftien zestien zeventien achttien negentien twintig dertig veertig vijftig zestig zeventig tachtig negentig honderd duizend miljoen eerste tweede derde vierde vijfde zesde zevende achtste negende tiende'.split(' '));
export const PARTICLES = ['terug', 'samen', 'langs', 'voorbij', 'tegen', 'door', 'over', 'onder', 'mee', 'aan', 'uit', 'op', 'af', 'in', 'weg', 'toe', 'na', 'bij', 'voor', 'om', 'vast', 'thuis', 'binnen', 'buiten'];

// a rough stem: what is left of a form once inflection is cut off. Not a lemma, but forms of one word usually meet.
export function stem(w) {
  let s = w.toLowerCase().replace(/['’]s$/, '').replace(/['’]/g, '');
  if (IRREG_OF.has(s)) return IRREG_OF.get(s);
  // separable participle: opgelost -> oplost, meegenomen -> meenomen
  for (const p of PARTICLES) if (s.startsWith(p + 'ge') && s.length > p.length + 4) { s = p + s.slice(p.length + 2); break; }
  if (s.startsWith('ge') && s.length > 5 && /[dtn]$/.test(s)) s = s.slice(2);
  const strip = ['heden', 'etjes', 'tjes', 'pjes', 'jes', 'etje', 'tje', 'pje', 'ste', 'sten', 'ten', 'den', 'ere', 'ers', 'er', 'en', 'te', 'de', 'st', 'je', 'e', 's', 't', 'd', 'n'];
  for (const suf of strip) if (s.endsWith(suf) && s.length - suf.length >= 3 && !(suf === 'n' && /([aeou])\1n$/.test(s))) { s = s.slice(0, -suf.length); break; }   // woon is a stem, not woo + n
  s = s.replace(/([bcdfgklmnprstvz])\1$/, '$1').replace(/([aeou])\1([^aeiou])$/, '$1$2').replace(/z$/, 's').replace(/v$/, 'f');
  return s;
}
function lev(a, b) { const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
// two tokens are forms of one word (werk / werkte / gewerkt, groot / grote, ben / is)
export function sameLemma(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase(); if (a === b) return true;
  const ia = IRREG_OF.get(a), ib = IRREG_OF.get(b);
  if (ia || ib) { if (ia && ib) return ia === ib; }
  if (CLOSED.has(a) || CLOSED.has(b)) return false;
  if (NUMBERS.has(a) || NUMBERS.has(b) || /\d/.test(a + b)) return false;
  const [sh, lo] = a.length <= b.length ? [a, b] : [b, a];
  if (sh.length >= 3 && lo.startsWith(sh) && lo.length - sh.length <= 3) return true;   // woon / woont / wonen is caught below
  const sa = stem(a), sb = stem(b); if (sa === sb) return true;
  if (ia && ia === sb || ib && ib === sa) return true;
  if (Math.min(sa.length, sb.length) >= 4 && (sa.startsWith(sb) || sb.startsWith(sa)) && Math.abs(sa.length - sb.length) <= 2) return true;
  if (Math.min(a.length, b.length) >= 5 && lev(a, b) <= 1) return true;
  // degrees of one adjective: groot / groter / grootst, duur / duurder / duurst (the open syllable undoubles the vowel)
  const deg = x => { const y = x.replace(/(d?er|ste?)$/, ''); return y.length >= 4 ? y.replace(/([a-z])\1/g, '$1') : null; };
  const da = deg(a) || (a.length >= 4 ? a.replace(/([a-z])\1/g, '$1') : null), db = deg(b) || (b.length >= 4 ? b.replace(/([a-z])\1/g, '$1') : null);
  if (da && db && da.length >= 3 && da === db) return true;
  return false;
}
export const lemmaKey = w => stem(w);
