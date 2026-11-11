// @ts-check
// The shapes of the game's data as JSDoc types (BACKLOG A1, the typing step). Nothing loads this file at run time: tsc reads
// it (npm run types, part of npm run validate) and checks every module in src/ that starts with // @ts-check against it.
// The content scripts (data.js, levels.js, content/*.js) fill window.LEVELS, window.TOWNS and window.RULES with these shapes.

/**
 * One choice on the signs: the options, the index of the right one, the rule it practises (an id in window.RULES) and the why
 * line the why card shows after a wrong answer. task overrides the task label the engine derives (src/tasks.js).
 * @typedef {{ o: string[], a: number, r: string, w: string, task?: string, fixed?: boolean }} Fork
 */

/** A word: English on the card, Dutch on the signs. wrong is the distractor shown first. @typedef {{ w: string, nl: string, wrong?: string }} WordItem */
/** Look and choose: a prop in the street, its Dutch name on the signs. value is a number some props show. @typedef {{ look: true, nl: string, en: string, prop: string, value?: number, side?: 'links' | 'rechts', wrong?: string }} LookItem */
/** Read: Dutch on the board, English (or o, its own options) on the signs. @typedef {{ read: true, nl: string, en?: string, o?: string[], a?: number, r?: string, w?: string, task?: string }} ReadItem */
/** Listen: the Dutch is spoken, the signs show Dutch words. @typedef {{ listen: true, nl: string, en: string, wrong?: string }} ListenItem */
/** Build: a sentence of fixed words and forks, ridden fork by fork. @typedef {{ parts: (string | Fork)[], en?: string, nl?: string, task?: string }} BuildItem */
/** De or het: the article is the fork. @typedef {{ dehet: true, art: 'de' | 'het', nl: string, en: string, w?: string }} DeHetItem */
/** @typedef {WordItem | LookItem | ReadItem | ListenItem | BuildItem | DeHetItem} Item */
/** Any item, read field by field (the engine tests read, dehet, look and so on in turn). @typedef {Partial<WordItem & LookItem & ReadItem & ListenItem & BuildItem & DeHetItem>} AnyItem */

/**
 * What the planner rides: an item turned into forks by itemToEntry (src/forks.js). A build item is its own entry, with nl
 * filled in from its parts. A missed item that comes back (src/review.js) is a copy with again (1 or 2: its first or second
 * return) and origin (the entry it was missed as).
 * @typedef {{ nl?: string, en?: string, parts?: (string | Fork)[], o?: string[], a?: number, r?: string, w?: string, task?: string,
 *   read?: boolean, dehet?: boolean, look?: boolean, listen?: boolean, word?: boolean, side?: string, prop?: string, value?: number,
 *   again?: number, origin?: object }} Entry
 */

/** @typedef {{ where: string, carry: string, want: string }} Mission */

/**
 * A level (levels.js and the content bundles). soon: a slot on the map that is not playable yet.
 * @typedef {{ id: number, act: number, name: string, town?: string, place?: string, theme: string, lanes: 2 | 3, speed: number,
 *   maxSpeed: number, ramp: boolean, lampDecay: number, forkSlow: number, hint: string | null, obstacles: 'none' | 'puddles' | 'light' | 'normal',
 *   filler: [number, number], deliveries: number, cefr: string, maxWords: number, intro?: string, introNl?: string, mission: Mission,
 *   items: AnyItem[], soon?: boolean }} Level
 */

/**
 * A town (content/towns.js): its tier orders the map, its rumour opens its first level, the rest dresses the world.
 * @typedef {{ id: string, name: string, tier: number, cefr: string, rumour: string, rumourNl: string, pos: [number, number],
 *   blurb: string, blurbNl: string, joke: string, jokeNl: string, look: string, landmarks: string[], words: string[], obstacles: string[] }} Town
 */

/**
 * The ride's state, S in src/state.js (window.NR). The fields the qa tools read; the engine keeps more. good and bad count
 * first rides only; a returned item's verdicts are in learn. whyT: seconds left on the why card. reviewRoad: [from, to) spans
 * of review road, reviewM the metres ridden on it, onReview whether the bike is on it now. missList: the end card's misses;
 * tally: first rides per task id.
 * @typedef {{ mode: 'start' | 'intro' | 'ride' | 'dying' | 'dead' | 'cine', t: number, dist: number, speed: number, lane: number,
 *   laneN: number, lamp: number, streak: number, good: number, bad: number, objs: object[], activeFork: object | null,
 *   mistakes: object[], cents: number, score: number, deliveriesTotal?: number, queue?: Entry[],
 *   whyT: number, reviewRoad: number[][], reviewM: number, onReview: boolean, missList?: import('./review.js').Miss[],
 *   tally?: import('./review.js').Tally, learn?: { returns: number, right: number, wrong: number, whyN: number, log: object[] } }} RideState
 */

export {};
