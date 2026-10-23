// Nachtrit, Rotterdam (tier 7, A2 to B1): level 80 De sport. Running and cycling along the Maas, the Erasmusbrug,
// the park by the Euromast, De Kuip, the gym, the golf course outside the city, the wind off the harbour.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (golfte, fietste against voelde,
// vergisten), the common irregulars (was, zag, kocht, deed, liet, liepen), reflexive verbs in the past
// (voelde me, vergisten ons, vervelen zich), zou plus infinitive for polite requests (Zou je ... kunnen vasthouden,
// Ik zou graag ... willen reserveren), comparatives and superlatives (sneller, het verst).
// Review of earlier tiers: perfectum with zijn (gegaan), separable verbs in the imperfectum (liet ... uit), the adjective -e,
// geen against niet, V2 after a fronted time phrase.
// Still inside the fence: 12 words max, no sub-clauses with the verb at the end (want keeps V2), no passive, no relative clauses.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum (golfte, wandelde, liet ... uit), reflexieve werkwoorden
// (voelen, vergissen, vervelen), 't kofschip, zachtmakers; 03 - Verbs/uitlaten (the imperfectum table: Ik liet de honden uit),
// wandelen, zullen; 04 - Phrases & Scenarios/Op de golfbaan (Ik zou graag een starttijd willen reserveren,
// Jij ligt het verst, Het waait weer eens, Een buitje deert ons niet); _site/situations/small-talk (Wat een weer, hè?);
// _site/words (de sportschool, de sport, het golfen); content/towns.js for Rotterdam (De Erasmusbrug, De Euromast,
// de Maas, de watertaxi, de metro, een bakkie pleur, Niet lullen maar poetsen).
// New rules: zou and vergl are guarded below (vergl may already exist from another level). imp, refl, kof, perf, sep, adj, neg, aux, modal
// and woord are in data.js and levels.js.
// New props: none. Only fiets, boom and hond are used. The word pool has no plain de fiets, de boom or de hond (only
// het fietspad, het fietsslot, het rondje), so no look prop is also a right answer for a word item. brug is left out on
// purpose: de Erasmusbrug is a word item, and a bridge prop would make it a second right answer.
// Replay from L78 and L79: de metro, de watertaxi, de vergadering. No de Kuip listen, because it would be a right answer
// for the word item het stadion.
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou for polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 80, act: 7, name: 'De sport', town: 'rotterdam', place: 'sport', theme: 'square', ...P,
    intro: 'In Rotterdam you do not talk about sport, you do it. Since the mist the dead do it too, and nobody can tell who is winning.',
    introNl: 'In Rotterdam praat je niet over sport, je doet het. Sinds de mist doen de doden mee, en niemand kan zien wie er wint.',
    mission: {
      where: 'Along the Maas from the Erasmusbrug to the park under the Euromast, past the glass towers, with De Kuip waiting on the south side and a cycle path nobody warned you about. The wind comes straight off the harbour and is never behind you.',
      carry: 'A golf bag, two dog leads, a bidon and a new bike lock. The dogs still need a walk. The grammar book is still at the bottom of the bag, unopened. No helmet. The wind has opinions about that.',
      want: 'The dead run, cycle and referee beside you, and all they want to know is what happened yesterday: was, zag, kocht, liep. Rotterdam says niet lullen maar poetsen, so answer fast and keep moving. At the clubhouse they still split the bill, and the women on the treadmills are still taller than you.' },
    items: [
      // ---- builds: the imperfectum, regular by 't kofschip
      { en: 'I used to play golf every Saturday.', parts: ['Vroeger', FK(['golfte ik', 'ik golfte', 'golfde ik'], 0, 'imp',
        'golf ends in f, a ketchup letter, so -te: golfte. Vroeger takes slot 1, so the verb comes before ik.'), 'elke zaterdag.'] },
      { en: 'I cycled along the Maas every day.', parts: ['Ik', FK(['fietste', 'fietsde', 'fietsten'], 0, 'imp',
        'fiets ends in s, a ketchup letter, so -te: fietste. -ten is for we, jullie and zij.'), 'elke dag langs de Maas.'] },
      { en: 'After the run I felt great.', parts: ['Na het hardlopen', FK(['voelde ik', 'ik voelde', 'voelte ik'], 0, 'imp',
        'voel ends in l, not a ketchup letter, so -de: voelde. Na het hardlopen takes slot 1, so the verb comes before ik.'), FK(['me', 'zich', 'je'], 0, 'refl',
        'The self-word matches the subject: ik goes with me, and it sits right after ik.'), 'geweldig.'] },
      { en: 'We were late because we got the time wrong.', parts: ['We kwamen te laat, want we', FK(['vergisten', 'vergisden', 'vergist'], 0, 'imp',
        'vergis ends in s, a ketchup letter, so -ten for we: vergisten.'), FK(['ons', 'zich', 'me'], 0, 'refl',
        'we goes with ons, and it sits right after the verb.'), 'in de tijd.'] },
      { en: 'The dogs get bored in the rain.', parts: ['De honden', FK(['vervelen zich', 'zich vervelen', 'verveelt zich'], 0, 'refl',
        'For he, she and they the self-word is zich, and it follows the verb. Two dogs keep the plural verb: vervelen.'), 'in de regen.'] },

      // ---- builds: the common irregulars
      { en: 'On Sunday we walked along the Maas to the Erasmus Bridge.', parts: ['Zondag', FK(['liepen we', 'we liepen', 'liep we'], 0, 'imp',
        'lopen is irregular: liep, liepen for we. Zondag takes slot 1, so the verb comes before we.'), 'langs de Maas naar de Erasmusbrug.'] },
      { en: 'After the match I was dead tired.', parts: ['Na de wedstrijd', FK(['was ik', 'ik was', 'waren ik'], 0, 'imp',
        'zijn becomes was with ik. Na de wedstrijd takes slot 1, so was comes before ik.'), 'doodmoe.'] },
      { en: 'I saw the Euromast above the trees.', parts: ['Ik', FK(['zag', 'zagen', 'zien'], 0, 'imp',
        'zien is irregular: zag for ik, zagen for we. zien is only the infinitive.'), 'de Euromast boven de bomen.'] },
      { en: 'Yesterday I bought a new golf bag.', parts: ['Ik', FK(['kocht', 'kochte', 'kochten'], 0, 'imp',
        'kopen is irregular: kocht, with no extra -e and no plural.'), 'gisteren een', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'golftas is a de-word, so the adjective takes -e: een nieuwe golftas.'), 'golftas.'] },
      { en: 'What did you do after training?', parts: ['Wat', FK(['deed je', 'je deed', 'doede je'], 0, 'imp',
        'doen is irregular: deed. A question word takes slot 1, so the verb comes before je.'), 'na de training?'] },
      { en: 'I walked the dogs along the Maas at seven.', parts: ['Ik', FK(['liet', 'laatte', 'liette'], 0, 'imp',
        'laten is irregular: liet.'), 'om zeven uur de honden langs de Maas', FK(['uit', 'uitliet', 'uitgelaten'], 0, 'sep',
        'In the imperfectum the prefix stays behind at the very end: liet ... uit.'), '.'] },

      // ---- builds: polite requests with zou
      { en: 'Could you hold my bag for a moment?', parts: [FK(['Zou', 'Zouden', 'Zoud'], 0, 'zou',
        'zou plus infinitive is the polite request. With je it is zou, never zouden.'), 'je mijn tas even', FK(['kunnen vasthouden', 'te kunnen vasthouden', 'kan vasthouden'], 0, 'modal',
        'After zou the infinitive pair goes to the end, with the modal first and no te: kunnen vasthouden.'), '?'] },
      { en: "I'd like to book a tee time for Saturday.", parts: ['Ik', FK(['zou', 'zal', 'zouden'], 0, 'zou',
        'Ik zou graag is the polite way to ask for something.'), 'graag een starttijd', FK(['willen reserveren', 'te willen reserveren', 'wil reserveren'], 0, 'modal',
        'zou needs an infinitive, and the pair sits at the end with the modal first and no te: willen reserveren.'), 'voor zaterdag.'] },

      // ---- builds: comparatives and superlatives
      { en: 'Today I cycle faster than yesterday.', parts: ['Vandaag fiets ik', FK(['sneller', 'snellere', 'meer snel'], 0, 'vergelijk',
        'A short adjective takes -er: snel becomes sneller. -e is only for an adjective before a noun.'), 'dan gisteren.'] },
      { en: 'You are the furthest from the flag, so you go first.', parts: ['Jij ligt', FK(['het verst', 'het verder', 'de verst'], 0, 'vergelijk',
        'The superlative of ver is verst, and after liggen it takes het: het verst. verder is the comparative.'), 'van de vlag, dus jij mag eerst.'] },

      // ---- builds: review
      { en: 'On Saturday we went to De Kuip.', parts: ['Zaterdag', FK(['zijn we', 'we zijn', 'hebben we'], 0, 'aux',
        'Going somewhere takes zijn. Zaterdag takes slot 1, so the verb comes before we.'), 'naar De Kuip', FK(['gegaan', 'gegaat', 'gegaand'], 0, 'perf',
        'gaan is irregular: gegaan.'), '.'] },
      { en: 'Today I have no time for the gym.', parts: ['Vandaag heb ik', FK(['geen', 'niet'], 0, 'neg',
        'A noun with no article after it takes geen: geen tijd, not niet tijd.'), 'tijd voor de sportschool.'] },

      // ---- words: Rotterdam, the gym, the match, the road
      { w: 'the Euromast', nl: 'de Euromast' },
      { w: 'the Erasmus Bridge', nl: 'de Erasmusbrug' },
      { w: 'the stadium', nl: 'het stadion', wrong: 'de stadion' },
      { w: 'the treadmill', nl: 'de loopband' },
      { w: 'the changing room', nl: 'de kleedkamer' },
      { w: 'the weight (at the gym)', nl: 'het gewicht', wrong: 'de gewicht' },
      { w: 'the towel', nl: 'de handdoek' },
      { w: 'the water bottle on the bike', nl: 'de bidon' },
      { w: 'the helmet (which you do not wear)', nl: 'de helm' },
      { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the bike lock', nl: 'het fietsslot' },
      { w: 'the headwind', nl: 'de tegenwind' },
      { w: 'the goal (scored)', nl: 'het doelpunt', wrong: 'de doelpunt' },
      { w: 'the referee', nl: 'de scheidsrechter' },
      { w: 'the pitch', nl: 'het veld' },
      { w: 'the walk round the block with the dogs', nl: 'het rondje', wrong: 'de rondje' },
      { w: 'the marathon', nl: 'de marathon' },
      { w: 'the water taxi', nl: 'de watertaxi' },
      { w: 'the underground', nl: 'de metro' },
      { w: 'the meeting', nl: 'de vergadering' },

      // ---- reads: three traps with their own options, three lines from the road and the course
      { read: true, nl: 'We liepen langs de Maas.', o: ['We walked along the Maas.', 'We are walking along the Maas.', 'We will walk along the Maas.'], a: 0, r: 'imp',
        w: 'liepen is the past of lopen, so it is over. Walking now would be we lopen, and later we gaan lopen.' },
      { read: true, nl: 'Zou u mijn fiets even in de gaten kunnen houden?', o: ['Could you keep an eye on my bike for a moment?', 'Did you keep an eye on my bike?', 'I will keep an eye on your bike.'], a: 0, r: 'zou',
        w: 'zou plus kunnen is a polite request. A question about the past would use heeft u ... gehouden.' },
      { read: true, nl: 'De tegenwind was erger dan gisteren.', o: ['The headwind was worse than yesterday.', 'The headwind is the worst of the week.', 'The headwind will be worse than yesterday.'], a: 0, r: 'vergelijk',
        w: 'erger dan is the comparative, so it is worse than something. The worst would be het ergst.' },
      { read: true, nl: 'Het waait weer eens.', en: 'It is windy again.' },
      { read: true, nl: 'Een buitje deert ons niet.', en: 'A little shower does not bother us.' },
      { read: true, nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' },

      // ---- listens: the gym by ear, two verb forms
      { listen: true, nl: 'de sportschool', en: 'the gym' },
      { listen: true, nl: 'ze kwam', en: 'she came' },
      { listen: true, nl: 'sneller', en: 'faster' },

      // ---- looks: the bike, the trees by the Euromast, the dog
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },

      // ---- de or het
      { dehet: true, nl: 'golfen', art: 'het', en: 'the golfing', w: 'A verb used as a noun is always het: het golfen, het eten.' },
      { dehet: true, nl: 'sporttas', art: 'de', en: 'the gym bag', w: 'A compound takes the article of its last part: de tas, so de sporttas.' },
    ] }]);
})();
