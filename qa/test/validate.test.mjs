// The content validator's rules (qa/lib/validate.mjs, which qa/validate-content.mjs runs over every level): a clean made-up
// level passes, and each rule fires on the one fault it is for.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkLevel } from '../lib/validate.mjs';

const RULES = { presens: {}, v2: {}, zou: {} }, towns = new Set(['alblasserdam', 'gouda']);
const word = n => ({ nl: `de hond${n}`, w: `the dog ${n}` });
function level(extra = {}) {
  return {
    id: 500, town: 'gouda', place: 'thuis', name: 'Test', intro: 'An intro.', introNl: 'Een intro.', deliveries: 10, maxWords: 8,
    mission: { where: 'Home.', carry: 'A dog.', want: 'Sleep.' },
    items: [
      word(1), word(2), word(3),
      { dehet: true, art: 'het', nl: 'huis', en: 'house' },
      { look: true, prop: 'molen', nl: 'de molen', en: 'the mill' },
      { listen: true, nl: 'de brug', en: 'the bridge' },
      { read: true, nl: 'Ik ben moe.', en: 'I am tired.' },
      { read: true, nl: 'Hij zou komen.', o: ['He would come.', 'He will come.'], a: 0, r: 'zou' },
      { en: 'I ride home.', parts: ['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens', w: 'Ik takes the stem.' }, 'naar huis', '.'] },
      { en: 'Now I ride.', parts: [{ o: ['Nu fiets ik', 'Nu ik fiets'], a: 0, r: 'v2', w: 'The verb comes second.' }, '.'] },
    ],
    ...extra,
  };
}
const run = (lv, ids) => checkLevel(lv, { towns, RULES, ids });
const withItem = (i, it) => { const lv = level(); lv.items[i] = it; return lv; };
const fires = (lv, re, which = 'E') => { const r = run(lv); assert.ok(r[which].some(m => re.test(m)), `expected ${which === 'E' ? 'an error' : 'a warning'} ${re}, got E=${JSON.stringify(r.E)} W=${JSON.stringify(r.W)}`); };

test('a clean level passes with no errors and no warnings, and its kinds are counted', () => {
  const r = run(level());
  assert.deepEqual(r.E, []); assert.deepEqual(r.W, []);
  assert.deepEqual(r.kinds, { word: 3, dehet: 1, look: 1, listen: 1, read: 2, build: 2 });
  assert.equal(r.town, 'gouda'); assert.equal(r.place, 'thuis');
});
test('level rules', () => {
  const ids = new Set(); run(level(), ids); assert.ok(run(level(), ids).E.some(m => /duplicate level id 500/.test(m)));
  fires(level({ town: 'atlantis' }), /unknown town atlantis/);
  fires(level({ place: 'maan' }), /unknown place maan/);
  fires(level({ name: '' }), /no name/);
  fires(level({ introNl: '' }), /no intro or introNl/, 'W');
  fires(level({ mission: { where: 'x', carry: 'y' } }), /mission incomplete/, 'W');
  const short = level(); short.items = short.items.slice(0, 9); fires(short, /only 9 items/);
  fires(level({ deliveries: 0 }), /no deliveries/);
  fires(level({ intro: 'Ride now!' }), /exclamation mark in level text/);
  fires(level({ deliveries: 14 }), /deliveries 14 > items 10, items will repeat/, 'W');
  assert.equal(run(level({ town: undefined, id: 12 })).town, 'gouda', 'a level without a town takes it from its id');
});
test('item rules: kind, duplicates, exclamation marks', () => {
  fires(withItem(0, { foo: 1 }), /unknown kind/);
  fires(withItem(1, word(1)), /duplicate of item 0/, 'W');
  fires(withItem(0, { nl: 'de hond!', w: 'the dog' }), /exclamation mark in item 0/);
});
test('word rules', () => {
  fires(withItem(0, { w: 'the dog' }), /word without nl/);
  fires(withItem(0, { nl: 'hond', w: 'the dog' }), /has no article/, 'W');
  fires(withItem(0, { nl: 'de hond', w: 'the dog', wrong: 'de hond' }), /wrong equals nl/);
});
test('de/het, look and listen rules', () => {
  fires(withItem(3, { dehet: true, art: 'een', nl: 'huis', en: 'house' }), /art must be de or het/);
  fires(withItem(3, { dehet: true, art: 'het', nl: 'huis' }), /dehet needs nl and en/);
  fires(withItem(4, { look: true, prop: 'ufo', nl: 'de ufo', en: 'the ufo' }), /unknown prop ufo/);
  fires(withItem(4, { look: true, prop: 'molen', nl: 'de molen' }), /look needs nl and en/);
  fires(withItem(5, { listen: true, nl: 'de brug' }), /listen needs nl and en/);
});
test('read rules', () => {
  fires(withItem(6, { read: true, en: 'I am tired.' }), /read needs nl/);
  fires(withItem(6, { read: true, nl: 'Ik ben moe.' }), /read needs en or o/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a'], a: 0 }), /read o needs 2 or 3 options/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a', 'b', 'c', 'd'], a: 0 }), /read o needs 2 or 3 options/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a', 'b'], a: 2 }), /read answer index out of range/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a', 'a'], a: 0 }), /duplicate options/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a', 'b'], a: 0, r: 'nope' }), /unknown rule nope/);
  fires(withItem(7, { read: true, nl: 'x', o: ['a', 'b!'], a: 0 }), /exclamation mark/);
});
test('build rules', () => {
  const b = parts => withItem(8, { en: 'I ride home.', parts });
  fires(b(['Ik fiets naar huis.']), /build without a fork/);
  fires(b(['Ik', { o: ['fiets'], a: 0, r: 'presens', w: 'x' }]), /fork needs 2 or 3 options/);
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 2, r: 'presens', w: 'x' }]), /fork answer index out of range/);
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 0.5, r: 'presens', w: 'x' }]), /fork answer index out of range/);
  fires(b(['Ik', { o: ['Fiets', 'fiets '], a: 0, r: 'presens', w: 'x' }]), /duplicate fork options/);
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'nope', w: 'x' }]), /unknown rule nope/);
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens' }]), /fork without a why line/, 'W');
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens', w: 'een twee drie vier vijf zes zeven acht negen tien elf twaalf dertien veertien vijftien zestien zeventien achttien negentien' }]), /why line over 18 words/, 'W');
  fires(b(['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens', w: 'Ja!' }]), /exclamation mark/);
  fires(withItem(8, { parts: ['Ik', { o: ['fiets', 'fietst'], a: 0, r: 'presens', w: 'x' }] }), /build needs en/);
});
test('sentence length: up to two words over maxWords is a warning, more is an error; punctuation does not count', () => {
  const s = n => withItem(8, { en: 'x', parts: [{ o: ['Ik', 'Jij'], a: 0, r: 'presens', w: 'x' }, Array.from({ length: n - 1 }, (_, i) => 'w' + i).join(' '), '.'] });
  assert.deepEqual(run(s(8)).E, []); assert.deepEqual(run(s(8)).W, []);
  fires(s(9), /9 words, max 8/, 'W'); fires(s(10), /10 words, max 8/, 'W');
  fires(s(11), /11 words, max 8/);
});
