// The guard against testing the article of a noun that takes both de and het (qa/data/dehet-both.txt, qa/lib/dehet-both.mjs):
// the validator fails a de/het item, a word `wrong` article and an article build fork on such a noun, and the content itself is clean.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLevel } from '../lib/validate.mjs';
import { loadBoth, testedNouns } from '../lib/dehet-both.mjs';
import { ROOT, content_ } from './helpers.mjs';

const RULES = { dehet: {}, presens: {}, v2: {}, zou: {}, woord: {} }, towns = new Set(['gouda']);
const both = loadBoth(ROOT);
const word = n => ({ nl: `de hond${n}`, w: `the dog ${n}` });
function level(extra) {
  const items = [word(1), word(2), word(3), { look: true, prop: 'molen', nl: 'de molen', en: 'the mill' }, { listen: true, nl: 'de brug', en: 'the bridge' },
    { read: true, nl: 'Ik ben moe.', en: 'I am tired.' }, { read: true, nl: 'Ik ben blij.', en: 'I am glad.' },
    { en: 'I ride home.', parts: ['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens', w: 'Ik takes the stem.' }, 'naar huis', '.'] },
    { en: 'Now I ride.', parts: [{ o: ['Nu fiets ik', 'Nu ik fiets'], a: 0, r: 'v2', w: 'The verb comes second.' }, '.'] }];
  return { id: 500, town: 'gouda', place: 'thuis', name: 'Test', intro: 'An intro.', introNl: 'Een intro.', deliveries: 10, maxWords: 8,
    mission: { where: 'Home.', carry: 'A dog.', want: 'Sleep.' }, items: [...items, extra] };
}
const errors = extra => checkLevel(level(extra), { towns, RULES, both }).E;
const flagged = (extra, noun) => assert.ok(errors(extra).some(m => m.includes(`tests ${noun}`)), `expected a both-article error for ${noun}, got ${JSON.stringify(errors(extra))}`);

test('the list holds the ten nouns of the Dutch review', () => {
  for (const n of ['dashboard', 'ticket', 'schap', 'tikkie', 'kraam', 'marktkraam', 'gordijn', 'medicijn', 'zadel', 'schilderij', 'rooster']) assert.ok(both.has(n), n);
  assert.ok(!both.has('huis') && !both.has('scherm'));
});
test('a de/het item on a both-article noun fails, on a single-gender noun it passes', () => {
  flagged({ dehet: true, nl: 'rooster', art: 'het', en: 'the schedule' }, 'rooster');
  flagged({ dehet: true, nl: 'dashboard', art: 'het', en: 'the dashboard' }, 'dashboard');
  assert.deepEqual(errors({ dehet: true, nl: 'scherm', art: 'het', en: 'the screen' }), []);
});
test('a word item whose wrong option is the other article fails; without `wrong` it passes', () => {
  flagged({ nl: 'het gordijn', w: 'the curtain', wrong: 'de gordijn' }, 'gordijn');
  flagged({ nl: 'de marktkraam', w: 'the market stall', wrong: 'het marktkraam' }, 'marktkraam');
  assert.deepEqual(errors({ nl: 'het gordijn', w: 'the curtain' }), []);
  assert.deepEqual(errors({ nl: 'het kantoor', w: 'the office', wrong: 'de kantoor' }), []);
});
test('an article build fork fails: bare Het/De before the noun, and options that carry the noun', () => {
  flagged({ en: 'The ticket is here.', parts: [{ o: ['Het', 'De'], a: 0, r: 'dehet', w: 'ticket is het.' }, 'ticket is hier.'] }, 'ticket');
  flagged({ en: 'The saddle is wet.', parts: [{ o: ['Het', 'De'], a: 0, r: 'dehet', w: 'zadel is het.' }, 'mooie zadel is nat.'] }, 'zadel');
  flagged({ en: 'The painting.', parts: [{ o: ['het schilderij', 'de schilderij'], a: 0, r: 'dehet', w: 'x' }, 'hangt hier.'] }, 'schilderij');
  assert.deepEqual(errors({ en: 'The screen is here.', parts: [{ o: ['Het', 'De'], a: 0, r: 'dehet', w: 'scherm is het.' }, 'scherm is hier.'] }), []);
});
test('a both-article noun may stay a plain word, a look item or inside a sentence', () => {
  assert.deepEqual(testedNouns({ nl: 'het ticket', w: 'the ticket' }), []);
  assert.deepEqual(errors({ en: 'I lost the ticket.', parts: ['Ik ben het ticket', { o: ['kwijt', 'kwijtgeraakt'], a: 0, r: 'woord', w: 'x' }, '.'] }), []);
});
test('without a list the rule is off; the shipped content tests none of the listed nouns', () => {
  assert.deepEqual(checkLevel(level({ dehet: true, nl: 'rooster', art: 'het', en: 'the schedule' }), { towns, RULES }).E, []);
  const hits = [];
  for (const lv of content_().levels) lv.items.forEach((it, i) => { for (const t of testedNouns(it)) if (both.has(t.noun)) hits.push(`L${lv.id} #${i} ${t.how} ${t.noun}`); });
  assert.deepEqual(hits, []);
});
