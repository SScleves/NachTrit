// Nachtrit, Zeeland (tier 4, A2 entry): level 56 De sport. Golf on the sea dyke, the gym, the dog walk, the wind.
// Fence: tier 3 plus object pronouns, er is / er zijn, comparatives and superlatives, adjective -e. 8 words max.
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios/Op de golfbaan, _site/maps/H14 — In de sportschool,
// MOC Vrije tijd, MOC Het weer, _site/grammar/trappen-van-vergelijking-comparison (ik speel liever golf dan tennis),
// _site/grammar/het-adjectief-de-e-regel-adjectives, _site/grammar/er-het-kleine-woord-met-veel-banen-the-little-word,
// _site/words/hem-haar, goed-beter-best, leuker-dan, de-spierpijn, sporten, de-sportschool, wandelen,
// _site/situations/small-talk, and content/towns.js for Zeeland (de kering, 62 deuren, Neeltje Jans, de zeedijk,
// het eiland, de mossel, Het waait vandaag hard, Gaat de kering vannacht dicht?).
// New rules: obj, er, vergl (same ids and notes as the other tier-4 levels, declared only if missing).
// New props: none. Only water, brug, hond and nummer are used.
(() => {
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, ze', note: 'hem-haar' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergl = window.RULES.vergl || { name: 'Comparison: -er dan, het -st', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 56, act: 4, name: 'De sport', town: 'zeeland', place: 'sport', theme: 'dyke', ...P,
    intro: 'In Zeeland the wind is in your face both ways. The dogs still need a walk, and the women at the gym are still taller than you.',
    introNl: 'In Zeeland heb je altijd tegenwind, heen en terug. De honden moeten nog steeds uit, en de vrouwen in de sportschool zijn nog steeds langer dan jij.',
    mission: {
      where: 'The sea dyke out to Neeltje Jans: a golf course in the wind, a gym, and the beach where the dogs run.',
      carry: 'A golf bag, two dog leads and no helmet. The wind would only take it anyway.',
      want: 'The dead jog past and compare everything: who is faster, who is taller, whose dog is the biggest. Answer with -er and dan, het -st, hem and haar. At the clubhouse they still split the bill to the cent.' },
    items: [
      // ---- builds: comparing, superlatives, object pronouns, er is / er zijn, adjective -e
      { en: 'The women are still taller than me.', parts: ['De vrouwen', FK(['zijn', 'is'], 0, 'presens', 'vrouwen is plural, so zijn.'), 'nog steeds',
        FK(['langer', 'lang', 'langst'], 0, 'vergl', 'Comparing two: add -er, then dan. People are lang, not groot.'), 'dan ik.'] },
      { en: 'On the dyke the wind is strongest.', parts: ['Op de dijk', FK(['is de wind', 'de wind is'], 0, 'v2', 'Op de dijk takes slot 1, so the verb comes next.'),
        FK(['het sterkst', 'het sterker', 'het sterk'], 0, 'vergl', 'The most of all after zijn: het plus -st, het sterkst.'), '.'] },
      { en: "Today it's colder than yesterday.", parts: ['Vandaag', FK(['is het', 'het is'], 0, 'v2', 'Vandaag in slot 1, then the verb, then het.'),
        FK(['kouder', 'koud', 'koudst'], 0, 'vergl', 'Two days compared: koud plus -er, then dan. kouder dan gisteren.'), 'dan gisteren.'] },
      { en: "I cycle faster than the dead, without a helmet.", parts: ['Ik fiets', FK(['harder', 'hard', 'hardst'], 0, 'vergl', 'On a bike, faster is harder. Comparing two: -er dan.'), 'dan de doden, zonder helm.'] },
      { en: "I'd rather play golf than tennis.", parts: ['Ik speel', FK(['liever', 'graag', 'liefst'], 0, 'vergl', 'graag, liever, liefst is one ladder. With dan you need the middle step: liever.'), 'golf dan tennis.'] },
      { en: 'This is the most beautiful golf course in Zeeland.', parts: ['Dit is de', FK(['mooiste', 'mooist', 'mooier'], 0, 'vergl', 'Before a noun the superlative takes the -e: de mooiste golfbaan.'), 'golfbaan van Zeeland.'] },
      { en: "I can't see him anywhere in the mist.", parts: ['Ik zie', FK(['hem', 'hij'], 0, 'obj', 'ik is the one seeing. The one being seen is hem, not hij.'), 'nergens in de mist.'] },
      { en: 'The dogs like her best.', parts: ['De honden vinden', FK(['haar', 'zij'], 0, 'obj', 'zij does things. When the dogs like her, she is haar.'),
        FK(['het leukst', 'het leuker', 'het leuk'], 0, 'vergl', 'Best of all after vinden: het leukst.'), '.'] },
      { en: 'Paola is waiting for us at the beach.', parts: ['Paola wacht op het strand op', FK(['ons', 'wij', 'onze'], 0, 'obj', 'After op, we becomes ons. onze only goes before a noun.'), '.'] },
      { en: 'Can you help me with my golf bag?', parts: ['Kun je', FK(['me', 'ik', 'mijn'], 0, 'obj', 'je does the helping. The one being helped is the object, so me, not ik.'), 'even helpen met mijn golftas?'] },
      { en: 'After the walk I give them water.', parts: ['Na de wandeling', FK(['geef ik', 'ik geef', 'geeft ik'], 0, 'v2', 'Na de wandeling takes slot 1, so the verb comes before ik.'),
        FK(['ze', 'zij'], 0, 'obj', 'The dogs get the water, so they are ze. zij only does things.'), 'water.'] },
      { en: 'There are sixty-two doors in the barrier.', parts: ['Er', FK(['zijn', 'is'], 0, 'er', 'Sixty-two doors is plural: er zijn.'), 'tweeënzestig deuren in de kering.'] },
      { en: 'Is there a gym on the island?', parts: [FK(['Is er', 'Zijn er'], 0, 'er', 'One gym, so is er. A question puts the verb first.'), 'een sportschool op',
        FK(['het eiland', 'de eiland'], 0, 'dehet', 'eiland is a het-word: het eiland.'), '?'] },
      { en: "There's a strong wind on the dyke.", parts: ['Er staat een', FK(['harde', 'hard'], 0, 'adj', 'wind is a de-word, so the adjective takes -e: een harde wind.'), 'wind op de dijk.'] },
      { en: 'Neeltje Jans is a small island.', parts: ['Neeltje Jans is een', FK(['klein', 'kleine'], 0, 'adj', 'A het-word after een loses the -e: een klein eiland.'), 'eiland.'] },
      { en: 'The cold water is twelve degrees.', parts: [FK(['Het koude', 'Het koud', 'De koude'], 0, 'adj', 'het water, and after het the adjective takes -e: het koude water.'), 'water is twaalf graden.'] },

      // ---- words: the sea, the wind, the gym, the course
      { w: 'the sea', nl: 'de zee' }, { w: 'the beach', nl: 'het strand', wrong: 'de strand' }, { w: 'the island', nl: 'het eiland', wrong: 'de eiland' },
      { w: 'the sea dyke', nl: 'de zeedijk' }, { w: 'the storm', nl: 'de storm' }, { w: 'the gust of wind', nl: 'de windstoot' },
      { w: 'the headwind', nl: 'de tegenwind' }, { w: 'the golf club', nl: 'de golfclub' }, { w: 'the gym', nl: 'de sportschool' },
      { w: 'the swimming pool', nl: 'het zwembad', wrong: 'de zwembad' }, { w: 'the team', nl: 'het team', wrong: 'de team' },
      { w: 'the match', nl: 'de wedstrijd' }, { w: 'the coach', nl: 'de trainer' }, { w: 'the weight', nl: 'het gewicht', wrong: 'de gewicht' },
      { w: 'the running shoes', nl: 'de hardloopschoenen' }, { w: 'the raincoat', nl: 'de regenjas' }, { w: 'the bike ride', nl: 'de fietstocht' },
      { w: 'the helmet', nl: 'de helm' }, { w: 'the muscle ache', nl: 'de spierpijn' }, { w: 'faster', nl: 'sneller' },

      // ---- reads
      { read: true, nl: 'Het waait harder dan gisteren.', en: "It's windier than yesterday.",
        o: ["It's windier than yesterday.", "It's less windy than yesterday.", "It's as windy as yesterday."], a: 0, r: 'vergl',
        w: 'harder dan compares today with yesterday. As windy as would be net zo hard als.' },
      { read: true, nl: 'Je hoeft geen helm te dragen.', en: "You don't have to wear a helmet.",
        o: ["You don't have to wear a helmet.", "You're not allowed to wear a helmet.", 'You have to wear a helmet.'], a: 0, r: 'mag',
        w: 'hoeven ... te is you don\'t have to. Not allowed would be je mag geen helm dragen.' },
      { read: true, nl: 'Ik zie hem niet meer.', en: "I can't see him any more.",
        o: ["I can't see him any more.", "He can't see me any more.", "I can't see her any more."], a: 0, r: 'obj',
        w: 'ik sees, hem is seen. Her would be haar.' },
      { read: true, nl: 'Gaat de kering vannacht dicht?', en: 'Is the barrier closing tonight?' },
      { read: true, nl: 'Er zijn geen golfballen meer.', en: 'There are no golf balls left.' },

      // ---- listen
      { listen: true, nl: 'windkracht acht', en: 'wind force 8' }, { listen: true, nl: 'het snelst', en: 'the fastest' },
      { listen: true, nl: 'de stormvloedkering', en: 'the storm surge barrier' },

      // ---- look
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'nummer', value: 62, nl: 'tweeënzestig', en: '62' },

      // ---- de of het
      { dehet: true, nl: 'zand', art: 'het', en: 'the sand' },
      { dehet: true, nl: 'golftas', art: 'de', en: 'the golf bag', w: 'A compound takes the article of its last part: de tas, so de golftas.' },
    ] }]);
})();
