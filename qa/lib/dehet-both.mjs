// Nouns the Woordenlijst (woordenlijst.org, MolexServe find_wordform, database gig_pro_wrdlst) gives with both articles
// (m/o, m/v/o, v/o), so a de/het test on them has two right answers. qa/data/dehet-both.txt lists them; the validator
// (qa/lib/validate.mjs) fails any de/het item, word `wrong` article or article build fork that tests one.
// No browser, no dependencies except the fs read in loadBoth.
import fs from 'node:fs'; import path from 'node:path';
export function loadBoth(root = process.cwd()) {
  const file = path.join(root, 'qa', 'data', 'dehet-both.txt');
  if (!fs.existsSync(file)) return new Set();
  return new Set(fs.readFileSync(file, 'utf8').split('\n').map(l => l.replace(/#.*/, '').trim().toLowerCase()).filter(Boolean));
}
const ARTS = new Set(['de', 'het']);
const clean = s => String(s || '').toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
const wordsOf = s => String(s || '').split(/\s+/).map(clean).filter(Boolean);
// The nouns an item tests the article of: [{ noun, how }]. how: 'dehet item', 'word wrong article', 'article fork'.
// A de/het item tests its nl; a word item tests nl only when it carries a `wrong` article; a build fork tests
// the words after the article, either the next words of the sentence (options de/het) or the rest of each option (het eerste slokje / de eerste slokje).
export function testedNouns(it) {
  const out = [];
  if (it.dehet) out.push({ noun: clean(it.nl), how: 'dehet item' });
  else if (it.parts) {
    it.parts.forEach((p, i) => {
      if (typeof p === 'string' || !Array.isArray(p.o)) return;
      const lo = p.o.map(s => String(s).trim().toLowerCase());
      if (lo.some(s => ARTS.has(s))) {
        const nxt = it.parts[i + 1]; if (typeof nxt === 'string') for (const w of wordsOf(nxt).slice(0, 3)) out.push({ noun: w, how: 'article fork' });
      } else if (lo.filter(s => /^(de|het) /.test(s)).length >= 2 && new Set(lo.map(s => s.split(' ')[0])).size > 1) {
        for (const w of wordsOf(lo[p.a]).slice(1)) out.push({ noun: w, how: 'article fork' });
      }
    });
  } else if (it.w != null && it.nl && it.wrong && /^(de|het) /i.test(it.wrong) && /^(de|het) /i.test(it.nl) && it.wrong.split(/\s+/)[0].toLowerCase() !== it.nl.split(/\s+/)[0].toLowerCase()) {
    out.push({ noun: wordsOf(it.nl).slice(1).join(' '), how: 'word wrong article' });
  }
  return out;
}
