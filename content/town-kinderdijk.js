// Kinderdijk en Dordrecht (tier 2): the three places the town still lacks. A1 phrases, 3 lanes, 5 words max.
//   46 Het werk   (place werk)   the standup on the square under the Grote Kerk
//   47 De sport   (place sport)  golf and the dog walk on the dyke, the mills on the horizon
//   48 De mensen  (place mensen) neighbours, the borrel, the bill split to the cent
//
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios (De standup - tech talk, Koffiepraatje op kantoor,
// Op de golfbaan, De nieuwe buren ontmoeten, Borrel met vrienden), 💼 Werk / ⛳ Golf / 🏘️ Buren & Vrienden MOCs,
// 01 - Vocabulary (storing, vergadering, golfbaan, borrel, buur, gezellig), 03 - Verbs (werken, spelen, uitlaten),
// _site/situations (office, neighbours, small-talk, friends, pub), content/towns.js (kinderdijk).
//
// New props: none. Only kerk, lamp, nummer, molen, water, hond, huis, tuin and deur are used.
// New rules: none. pres comes from district2.js; it is set again below only if that file did not load first.
// Uses the existing rules pres, dehet, neg, woord, cult.
// `wrong` on word items: the same noun with the wrong article. itemToEntry puts it in as the first distractor,
//   so those forks become de/het gates. Two per level.
// Read items with their own o / a / r / w: the English signs are written as traps (weer = again, not weather;
//   gaat het = are you okay, not are you going). The other reads take their distractors from the level.
// Niet/geen appears in reading forks only. Every build is SVO present tense with one fork.
// The file is wrapped in a function so FK does not clash with the FK const in levels.js.
// Not loaded yet: index.html needs <script src="content/town-kinderdijk.js"></script> after levels.js.

(() => {
  window.RULES.pres = window.RULES.pres || { name: 'Present tense', note: 'presens' };

  const WIJK = { lanes: 3, speed: 12, maxSpeed: 14, ramp: false, lampDecay: 0.45, forkSlow: 0.3, hint: 'letter', obstacles: 'puddles', filler: [26, 36], deliveries: 10, cefr: 'A1', maxWords: 5 };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    // ---------------------------------------------------------------- 46 Het werk
    { id: 46, act: 2, town: 'kinderdijk', place: 'werk', name: 'Het werk', theme: 'square', ...WIJK,
      intro: 'The standup still starts at nine. The team is dead. Nobody has blockers.',
      introNl: 'De standup begint nog steeds om negen uur. Het team is dood. Niemand heeft blockers.',
      mission: { where: 'An office on the square in Dordrecht, under the Grote Kerk. The tower leans more than two metres and all four clocks say nine.', carry: 'A laptop on four percent and a coffee from the machine, which works again.', want: 'The dead still do the standup. Say what works, say you have no blockers, say tot morgen. Keep it under a minute.' },
      items: [
        { w: 'the meeting', nl: 'de vergadering', wrong: 'het vergadering' }, { w: 'the outage', nl: 'de storing' }, { w: 'the alert', nl: 'de melding' },
        { w: 'the dashboard', nl: 'het dashboard', wrong: 'de dashboard' }, { w: 'the office', nl: 'het kantoor' }, { w: 'the colleague', nl: 'de collega' },
        { w: 'the screen', nl: 'het scherm' }, { w: 'the problem', nl: 'het probleem' }, { w: 'the coffee machine', nl: 'het koffieapparaat' },
        { w: 'the team', nl: 'het team' }, { w: 'the deadline', nl: 'de deadline' },
        { w: 'today', nl: 'vandaag' }, { w: 'tomorrow', nl: 'morgen' }, { w: 'Monday', nl: 'maandag' },
        { read: true, nl: 'Ik heb geen blockers.', en: 'I have no blockers.',
          o: ['I have no blockers.', 'I have blockers.', 'I am not a blocker.'], a: 0, r: 'neg', w: 'geen goes with a noun: geen blockers, none at all.' },
        { read: true, nl: 'Het werkt weer.', en: 'It works again.',
          o: ['It works again.', "It's the weather.", 'He is working again.'], a: 0, r: 'woord', w: 'werken also means to function, and weer here is again, not the weather.' },
        { read: true, nl: 'Even kijken.', en: 'Let me have a look.' },
        { read: true, nl: 'Komt goed.', en: "It'll be fine." },
        { read: true, nl: 'Tot morgen.', en: 'See you tomorrow.' },
        { listen: true, nl: 'de standup', en: 'the standup' }, { listen: true, nl: 'goedemorgen', en: 'good morning' }, { listen: true, nl: 'het mailtje', en: 'the quick email' },
        { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
        { look: true, prop: 'nummer', value: 9, nl: 'negen', en: '9' },
        { en: 'The dashboard is working again.', parts: ['Het dashboard', FK(['werkt', 'werken', 'werk'], 0, 'pres', 'het dashboard is one thing, like hij: stem plus t, werkt.'), 'weer.'] },
        { en: 'I work from home today.', parts: ['Ik', FK(['werk', 'werkt', 'werken'], 0, 'pres', 'ik takes the bare stem: ik werk, no t.'), 'vandaag thuis.'] },
        { en: 'The meeting takes a long time.', parts: ['De vergadering', FK(['duurt', 'duur', 'duren'], 0, 'pres', 'One meeting is a hij: stem plus t, duurt.'), 'lang.'] },
        { en: 'I see the problem.', parts: ['Ik zie', FK(['het', 'de'], 0, 'dehet', 'probleem is a het-word: het probleem. Learn it with the het.'), 'probleem.'] },
      ] },

    // ---------------------------------------------------------------- 47 De sport
    { id: 47, act: 2, town: 'kinderdijk', place: 'sport', name: 'De sport', theme: 'dyke', ...WIJK,
      intro: 'Nineteen mills turn on the horizon without any wind. Your ball still finds the water.',
      introNl: 'Aan de horizon draaien negentien molens zonder wind. Je balletje ligt nog steeds in het water.',
      mission: { where: 'The dyke path from the golf course to the mills of Kinderdijk. Water on both sides.', carry: 'A golf bag, two dogs on one lead, and a ball that is not yours.', want: 'The dead play eighteen holes at night. Say mooie slag at every shot, even the bad ones. Then the dogs need to go out. They always need to go out.' },
      items: [
        { w: 'the golf course', nl: 'de golfbaan' }, { w: 'the shot', nl: 'de slag' }, { w: 'the (little) ball', nl: 'het balletje', wrong: 'de balletje' },
        { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' }, { w: 'the tee time', nl: 'de starttijd' }, { w: 'the flag', nl: 'de vlag' },
        { w: 'the bunker', nl: 'de bunker' }, { w: 'the dog lead', nl: 'de riem' }, { w: 'the walk round the block', nl: 'het rondje' },
        { w: 'the dyke', nl: 'de dijk' }, { w: 'the rain shower', nl: 'de bui' },
        { w: 'Saturday', nl: 'zaterdag' }, { w: 'the week', nl: 'de week' }, { w: 'the colleague', nl: 'de collega' },
        { read: true, nl: 'Mooie slag.', en: 'Nice shot.' },
        { read: true, nl: 'Gaat het?', en: 'Are you okay?',
          o: ['Are you okay?', 'Are you going?', 'Is it yours?'], a: 0, r: 'woord', w: 'Gaat het? asks if someone is okay. Nobody is going anywhere.' },
        { read: true, nl: 'De honden moeten uit.', en: 'The dogs need a walk.',
          o: ['The dogs need a walk.', 'The dogs are out.', 'The dogs are tired.'], a: 0, r: 'woord', w: 'moeten uit: the dogs have to go out. They always have to go out.' },
        { read: true, nl: 'Jij mag eerst.', en: 'You go first.' },
        { read: true, nl: 'Het waait weer eens.', en: "It's windy again." },
        { listen: true, nl: 'de wieken', en: 'the sails of a mill' }, { listen: true, nl: 'de polder', en: 'the polder' }, { listen: true, nl: 'achttien', en: '18' },
        { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' }, { look: true, prop: 'water', nl: 'het water', en: 'the water' },
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
        { en: 'I play golf on Saturday.', parts: ['Ik', FK(['speel', 'speelt', 'spelen'], 0, 'pres', 'ik takes the bare stem: speel, with ee to keep the sound long.'), 'zaterdag golf.'] },
        { en: 'We walk along the dyke.', parts: ['Wij', FK(['lopen', 'loopt', 'loop'], 0, 'pres', 'wij is plural, so the whole infinitive: lopen.'), 'over de dijk.'] },
        { en: 'The mill turns without wind.', parts: ['De molen', FK(['draait', 'draai', 'draaien'], 0, 'pres', 'One mill is a hij: stem plus t, draait.'), 'zonder wind.'] },
        { en: 'I am sitting in the clubhouse.', parts: ['Ik zit in', FK(['het', 'de'], 0, 'dehet', 'A compound takes the article of its last part: het huis, so het clubhuis.'), 'clubhuis.'] },
      ] },

    // ---------------------------------------------------------------- 48 De mensen
    { id: 48, act: 2, town: 'kinderdijk', place: 'mensen', name: 'De mensen', theme: 'street', ...WIJK,
      intro: 'The Friday borrel at the neighbours goes ahead as usual. Everyone is dead. It is still gezellig.',
      introNl: 'De vrijdagborrel bij de buren gaat gewoon door. Iedereen is dood. Het is nog steeds gezellig.',
      mission: { where: 'A borrel three doors down, then the café by the Groothoofdspoort, where three rivers meet.', carry: 'A plate of bitterballen. Wait before you bite. They are still molten.', want: 'Ask everyone hoe gaat het, tell them it was gezellig, then split the bill. To the cent. They will check it again.' },
      items: [
        { w: 'the neighbour (man)', nl: 'de buurman' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' }, { w: 'the neighbours', nl: 'de buren' },
        { w: 'the neighbourhood', nl: 'de buurt' }, { w: 'the drinks party', nl: 'de borrel' }, { w: 'the bill', nl: 'de rekening', wrong: 'het rekening' },
        { w: 'the cent', nl: 'de cent' }, { w: 'the small beer', nl: 'het biertje', wrong: 'de biertje' }, { w: 'the bitterbal (fried snack)', nl: 'de bitterbal' },
        { w: '€ 12,50', nl: 'twaalf euro vijftig' }, { w: '€ 6,25', nl: 'zes euro vijfentwintig' },
        { w: 'the colleague', nl: 'de collega' }, { w: 'the clubhouse', nl: 'het clubhuis' }, { w: 'Saturday', nl: 'zaterdag' },
        { read: true, nl: 'Hoe gaat het?', en: 'How are you?',
          o: ['How are you?', 'Where are you going?', 'How old are you?'], a: 0, r: 'woord', w: 'Hoe gaat het? is how are you. gaat does not mean anyone is leaving.' },
        { read: true, nl: 'Goed, dank je.', en: 'Fine, thanks.' },
        { read: true, nl: 'Het was gezellig.', en: 'It was a lovely time.',
          o: ['It was a lovely time.', 'It was very quiet.', 'It is getting late.'], a: 0, r: 'cult', w: 'gezellig is a good time together. You say it every time you leave.' },
        { read: true, nl: 'Zullen we het even splitten?', en: 'Shall we split it?' },
        { read: true, nl: 'Lekker weertje, hè?', en: 'Nice weather, eh?' },
        { listen: true, nl: 'gezellig', en: 'cosy, a good time together' }, { listen: true, nl: 'proost', en: 'cheers' }, { listen: true, nl: 'hiernaast', en: 'next door' },
        { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },
        { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
        { en: 'I live next door.', parts: ['Ik', FK(['woon', 'woont', 'wonen'], 0, 'pres', 'ik takes the bare stem: woon, with oo to keep the sound long.'), 'hiernaast.'] },
        { en: 'You pay €6,25.', parts: ['Jij', FK(['betaalt', 'betaal', 'betalen'], 0, 'pres', 'jij before the verb takes stem plus t: jij betaalt.'), 'zes euro vijfentwintig.'] },
        { en: 'The bill adds up exactly.', parts: ['De rekening', FK(['klopt', 'klop', 'kloppen'], 0, 'pres', 'One bill is a hij: stem plus t, klopt.'), 'precies.'] },
        { en: 'Welcome to the neighbourhood.', parts: ['Welkom in', FK(['de', 'het'], 0, 'dehet', 'buurt is a de-word, like de straat and de wijk.'), 'buurt.'] },
      ] },
  ]);
})();
