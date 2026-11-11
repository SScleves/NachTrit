# Status: what is live, what is pending (11 November 2026)

Play: https://sscleves.github.io/NachTrit/ (hard-refresh once after a release; the version number is
in index.html as NR_VERSION). Santi is testing this week; the live site is frozen after the
reading-time change lands, until his feedback.

## Live now

- The world: atmosphere, composition, materials, cast, a look per town (13 towns), 3D intro (14 shots),
  3D title screen, 3D level cards, the diorama map of the real Netherlands with warm town scenes.
- Content: 130 levels in 13 towns, audited three times; the fourth audit (distractors a native could
  accept) fixed 29 items on 2 November.
- Fares and euros, the wallet, tips and refusals.
- The lamp and night: the scene darkens through a level, wisps are the fuel; capped so hard tiers get
  harder through speed and obstacles, not an impossible lamp.
- Voice: every Dutch line pre-rendered with neural Dutch voices (Maarten, Fenna), device voice as
  fallback.
- First five minutes: live start screen, eight-panel first-run intro with whole captions, town card
  with one highlighted next ride and finished places as stars, three-word mission card with
  pictograms, teaching forks (arrows, lane labels, glowing right sign) on a first ride, one-row HUD,
  lamp hint toast, the Endless night link.
- Cache versioning on every script.

## Landed on 11 November 2026 (NR_VERSION 36, tag v0.2-combined)

The combined branch `dt/all` is merged into `main` and live.
- New 3D models: the rider on the omafiets, two dogs, gabled houses, windmills, street props.
- Reading time: every fork keeps a reading budget at every tier.
- The go key: up arrow, W or swipe up ends the wait once the player has chosen.
- Clear forks: a task label per fork (nine types, Spelling included), the gap marked on the card.
- Content rewrite (`reports/dt-content-rewrite.md`): one thing per fork in every town (481 mixed forks to 0),
  wrong options are real Dutch except in Spelling forks (650 non-words to 0), V2 practice in every level from 11,
  short why lines. 104 new voice lines rendered. Audits run inside `npm run validate`.
- three.js 0.187. The WebGPU renderer is opt-in with `?renderer=webgpu` and stays parked.
- Fixed: pale strips beside the rider's head, the 03:00 alarm clock in the intro, dogs in the wrong intro
  scenes, the missing torso in the sofa scene, listen cards asking for the wrong voice file. The wheels tumble
  the old way on purpose.
- Phase 0 checks (`reports/dt-phase0.md`): reading boards no longer make the bike creep for minutes, the fork
  camera drops its speed pull-back so signs read where planned, the lamp retuned (level 75 with wisps finishes
  with about half a lamp; ignoring wisps dies from town 2 on, level 11 mostly survives), fork signs sit above
  the rider's head, ground mist costs 17 fewer draw calls. GPU run of 1, 12, 58, 75, 123 with 0 errors at
  59-60 fps; all 14 intro shots checked.

## Pending

The plan and its order are in `PLAN.md` in this folder. In short: tests, the code split,
the learning core (missed items return, one thing per fork everywhere, real Dutch wrong options, a why
line that is seen), save with a word book and spaced review, the story payoff, writing mode, moves and
hazards, then phone, native-speaker review and release.

## How to give feedback (what helps most)

For each thing, say where (town, level, screen), what you expected, what happened, and on which
device (laptop Chrome, phone). Short notes are fine; a screenshot with the level name is better.
Things worth a look this week: is the first ride clear without reading anything; does reading time
feel fair at Rotterdam and later; does the voice sound right; does anything stutter on the laptop;
does the phone layout work; is the humour landing in the town cards and intros.
