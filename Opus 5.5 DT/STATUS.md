# Status: what is live, what is pending (2 November 2026)

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

## Landing today, then frozen

- Reading time as a rule (backlog A0b): every fork keeps a reading budget from its word count at
  every tier; the first gate of a first ride holds until the player moves; a dog bark on the right
  side for the teaching forks.

## Pending, in order, after Santi's feedback

1. A1 The code split into modules with type checks (the base for the rest).
2. A2 Writing mode: type the Dutch, tolerant matcher, dictation, plus 50 percent fare.
3. A3 Jump, slide, power-ups (slow motion, shield, magnet, double fare), trams and canal edges.
4. A4 Save that travels between devices, vocabulary book, practice and trophy rides.
5. A5 Saved-town dawn, the Amsterdam ending, phone polish, ambience.
6. Smaller: Gouda and Kinderdijk map vignettes stay compact (layout limit); passenger-style place
   sentences on the town card; the LEVELS.md and in-game help; unit tests and CI (D2, D3).

## How to give feedback (what helps most)

For each thing, say where (town, level, screen), what you expected, what happened, and on which
device (laptop Chrome, phone). Short notes are fine; a screenshot with the level name is better.
Things worth a look this week: is the first ride clear without reading anything; does reading time
feel fair at Rotterdam and later; does the voice sound right; does anything stutter on the laptop;
does the phone layout work; is the humour landing in the town cards and intros.
