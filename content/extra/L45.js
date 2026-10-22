(() => {
  // Level 45, Alblasserdam, De sport (tier 1, A1 words): golf, the gym, the dog walk, the bike, the weather on the course.
  // Fence: single words and two-word phrases, at most 5 words a line, every build has one fork on zijn, hebben or de/het.
  // Sources in the vault: 01 - Vocabulary/golfbaan (de starttijd), 04 - Phrases & Scenarios/Op de golfbaan and
  //   Golf MOC (Het waait weer eens, Even zoeken, het buitje, de vlag, achttien holes), _site/dialogues/op-het-terras-na-het-golfen
  //   (Ik ben kapot, de spierpijn), naar-de-sportschool, de-hond-uitlaten, een-praatje-over-het-weer (de paraplu),
  //   een-lekke-band (het stuur), _site/situations/neighbours (Lekker weertje, hè?), _site/words (fietsen, sporten,
  //   de sportschool, het weer, moe), sentence pfoe-ik-ben-helemaal-buiten-adem, 03 - Verbs/hebben and zijn.
  // Replays from level 43: rechts, rechtdoor, daar.
  // New rule: hebben, linked to the vault note 03 - Verbs/hebben. New props: none (fiets, brug, nummer).
  // Word, listen and look forks take their wrong signs from each other, so no two Dutch answers here mean the same
  //   thing: no lopen next to wandelen, no de lijn next to de riem, no de sloot next to the water prop.
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(45, { deliveries: 20, items: [
    // words: golf, the gym, the dog walk, the bike, the weather, then three replays from level 43
    { w: 'the tee time', nl: 'de starttijd' }, { w: 'the grass', nl: 'het gras', wrong: 'de gras' },
    { w: 'the gym', nl: 'de sportschool' }, { w: 'to work out', nl: 'sporten' }, { w: 'tired', nl: 'moe' },
    { w: 'the walk', nl: 'de wandeling' }, { w: "the dog's owner", nl: 'het baasje', wrong: 'de baasje' }, { w: 'the gate', nl: 'het hek', wrong: 'de hek' },
    { w: 'the bike path', nl: 'het fietspad', wrong: 'de fietspad' }, { w: 'the helmet', nl: 'de helm' },
    { w: 'the handlebars', nl: 'het stuur', wrong: 'de stuur' }, { w: 'to cycle', nl: 'fietsen' },
    { w: 'the weather', nl: 'het weer' }, { w: 'the rain', nl: 'de regen' }, { w: 'the sun', nl: 'de zon' }, { w: 'the umbrella', nl: 'de paraplu' },
    { w: 'right', nl: 'rechts' }, { w: 'straight on', nl: 'rechtdoor' }, { w: 'there', nl: 'daar' },

    // reads: three meaning traps, three plain lines
    { read: true, nl: 'Ik ben kapot.', en: "I'm exhausted.",
      o: ["I'm exhausted.", "I'm broke.", "I'm late."], a: 0, r: 'woord', w: 'kapot is broken for a thing and worn out for a person. Broke, with no money, is blut.' },
    { read: true, nl: 'De hond is los.', en: 'The dog is off the lead.',
      o: ['The dog is off the lead.', 'The dog is lost.', 'The dog is asleep.'], a: 0, r: 'woord', w: 'los means loose, off the lead. A lost dog is kwijt.' },
    { read: true, nl: 'Het waait weer eens.', en: "It's windy again.",
      o: ["It's windy again.", "It's raining again.", "It's windy for once."], a: 0, r: 'woord', w: 'waaien is what the wind does, and weer eens means yet again, with a sigh.' },
    { read: true, nl: 'Lekker weertje, hè?', en: 'Nice weather, eh?' },
    { read: true, nl: 'Honden aan de lijn.', en: 'Dogs on the lead.' },
    { read: true, nl: 'Even zoeken.', en: 'Let me look for it.' },

    // listen: ie and ij, ui and -tje, a g at the end that sounds like ch
    { listen: true, nl: 'de spierpijn', en: 'the muscle ache' }, { listen: true, nl: 'het buitje', en: 'the little rain shower' },
    { listen: true, nl: 'de vlag', en: 'the flag' },

    // look: the bike, the bridge over the Noord, the number on the last flag
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
    { look: true, prop: 'nummer', value: 18, nl: 'achttien', en: '18' },

    // builds: one fork each, zijn, hebben or de/het
    { en: 'I have sore muscles.', parts: ['Ik', FK(['heb', 'heeft'], 0, 'hebben', 'ik heb. heeft is only for hij, zij and het.'), 'spierpijn.'] },
    { en: 'I am out of breath.', parts: ['Ik', FK(['ben', 'bent'], 0, 'zijn', 'ik ben. The t of bent belongs to jij.'), 'buiten adem.'] },
    { en: 'Paola has a helmet.', parts: ['Paola', FK(['heeft', 'hebt'], 0, 'hebben', 'Paola is a zij, and zij heeft. hebt is for jij.'), 'een helm.'] },
    { en: 'The golf course has eighteen holes.', parts: ['De golfbaan', FK(['heeft', 'hebben'], 0, 'hebben', 'One golf course, so heeft. The eighteen holes are not the subject.'), 'achttien holes.'] },
    { en: 'The bike path is wet.', parts: [FK(['Het', 'De'], 0, 'dehet', 'A compound takes the article of its last part: het pad, so het fietspad.'), 'fietspad is nat.'] },
  ] });
})();
