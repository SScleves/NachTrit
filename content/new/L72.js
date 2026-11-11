// Nachtrit, Den Haag (tier 6, A2+): level 72 De sport. Golf in the wind, the gym, the dogs on the beach at Scheveningen,
// the Haagse Bos, the tram that comes late. Everything told afterwards, in the perfectum.
// Fence: tier 5 plus the perfectum with hebben and zijn, regular participles with 't kofschip (gespeeld, gefietst, gesport),
// common irregular participles (gegaan, geweest, gedaan, gedronken, geslagen), separable participles (uitgelaten, opgegeten,
// opgebeld, aangekomen). 10 words max. No imperfectum, no sub-clauses, no passive.
// Sources: dutch-lessons vault: 02 - Grammar/perfectum (Ik heb dit weekend golf gespeeld, uitgelaten), 't kofschip
// (gegolft, gefietst, gespeeld), zijn of hebben (Ik ben naar de golfbaan gegaan, Ik heb de honden uitgelaten, blijven),
// 04 - Phrases & Scenarios/Op de golfbaan (het balletje in het water geslagen, Ik baal, De baan ligt er mooi bij, de starttijd,
// het clubhuis), _site/situations/small-talk and friends (Wat heb je dit weekend gedaan?, Goed weekend gehad?,
// Heb je de wedstrijd gezien?), _site/words (de sport, de spierpijn, de gezondheid, het park, wandelen, een rondje fietsen),
// MOC Het weer, and content/towns.js for Den Haag (het strand, de pier, het reuzenrad of about 40 metres, de minister,
// Dat is geen antwoord op mijn vraag, the politicians gone from the Binnenhof and nobody noticing the difference).
// New rules: none. aux, kof, perf, sep, mag and woord already exist.
// New props: none. Only hond, fiets and water are used.
(() => {
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 72, act: 6, name: 'De sport', town: 'denhaag', place: 'sport', theme: 'dyke', ...P,
    intro: 'In Den Haag the ministers jog past the Binnenhof, and everyone sees them. Since the mist the dead jog along. Nobody has noticed the difference.',
    introNl: 'In Den Haag joggen de ministers langs het Binnenhof, en iedereen ziet ze. Sinds de mist joggen de doden mee. Niemand heeft het verschil gemerkt.',
    mission: {
      where: 'Through the dunes to Scheveningen, along the beach under the pier and its Ferris wheel, back through the Haagse Bos to a golf course where the wind never stops.',
      carry: 'A golf bag, two dog leads, a roll of poo bags and an umbrella that blew inside out at the first hole. The dogs still need a walk. You still have no helmet.',
      want: 'The dead run beside you and ask what you did today, like a debate in the Tweede Kamer. Answer in the past: heb or ben near the front, the participle at the very end. It is all in the grammar book you never opened. At the clubhouse they still split the bill, and the women at the bar are still taller than you.' },
    items: [
      // ---- words
      { w: 'the beach', nl: 'het strand', wrong: 'de strand' },
      { w: 'the sea', nl: 'de zee' },
      { w: 'the dunes', nl: 'de duinen' },
      { w: 'the wave (at sea)', nl: 'de golf' },
      { w: 'the pier', nl: 'de pier' },
      { w: 'the Ferris wheel', nl: 'het reuzenrad', wrong: 'de reuzenrad' },
      { w: 'the sand', nl: 'het zand', wrong: 'de zand' },
      { w: 'the storm', nl: 'de storm' },
      { w: 'the park', nl: 'het park', wrong: 'de park' },
      { w: 'the umbrella', nl: 'de paraplu' },
      { w: 'the woods (Den Haag has the Haagse Bos)', nl: 'het bos', wrong: 'de bos' },
      { w: 'the poo bag', nl: 'het poepzakje', wrong: 'de poepzakje' },
      { w: 'the dog lead', nl: 'de riem' },
      { w: 'the shower (after the gym)', nl: 'de douche' },
      { w: 'the running shoes', nl: 'de hardloopschoenen' },
      { w: 'the match', nl: 'de wedstrijd' },
      { w: 'the wind (it never stops on the course)', nl: 'de wind' },
      { w: 'the clubhouse', nl: 'het clubhuis' },
      { w: 'the tee time', nl: 'de starttijd' },
      { w: 'the muscle ache', nl: 'de spierpijn' },
      { w: 'the gym', nl: 'de sportschool' },

      // ---- builds: hebben or zijn, then the participle at the end
      { en: 'I played golf on Saturday.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux', 'Golf is something you do, not a trip somewhere: hebben.'), 'zaterdag golf',
        FK(['gespeeld', 'gespeelt'], 0, 'kof', 'speel ends in l, not a ketchup letter, so the participle ends in d: gespeeld.', 'spell'), '.'] },
      { en: 'We walked the dogs on the beach.', parts: ['Op het strand', FK(['hebben we', 'we hebben'], 0, 'v2', 'Op het strand takes slot 1, so the verb comes next, then we.'), 'de honden',
        FK(['uitgelaten', 'uitlieten', 'uitlaten'], 0, 'sep', 'A separable verb puts ge between uit and the verb: uitgelaten.'), '.'] },
      { en: 'I cycled to the golf course.', parts: ['Ik ben naar de golfbaan',
        FK(['gefietst', 'gefietsd'], 0, 'kof', 'fiets ends in s, a ketchup letter, so the participle ends in t: gefietst.', 'spell'), '.'] },
      { en: 'The minister went to the beach.', parts: ['De minister', FK(['is', 'heeft'], 0, 'aux', 'Going somewhere is movement, and movement takes zijn.'), 'naar het strand',
        FK(['gegaan', 'ging', 'gaat'], 0, 'perf', 'gaan is irregular: the participle is gegaan.'), '.'] },
      { en: 'Have you been to Scheveningen yet?', parts: [FK(['Ben', 'Heb'], 0, 'aux', 'zijn takes zijn in the perfectum: ik ben geweest.'), 'je al in Scheveningen',
        FK(['geweest', 'was', 'bent'], 0, 'perf', 'zijn is irregular: the participle is geweest.'), '?'] },
      { en: 'What did you do this weekend?', parts: ['Wat', FK(['heb je', 'ben je'], 0, 'aux', 'doen takes hebben in the perfect: wat heb je gedaan.'), 'dit weekend',
        FK(['gedaan', 'deed', 'doet'], 0, 'perf', 'doen is irregular: the participle is gedaan.'), '?'] },
      { en: 'Yesterday I worked out at the gym.', parts: ['Gisteren', FK(['heb', 'ben'], 0, 'aux', 'Working out is something you do: hebben.'), 'ik in de sportschool',
        FK(['gesport', 'gesportt', 'gesportd'], 0, 'kof', 'The stem sport already ends in t, so nothing is added: gesport.', 'spell'), '.'] },
      { en: 'Paola walked with the dogs in the Haagse Bos.', parts: ['In het Haagse Bos', FK(['heeft Paola', 'Paola heeft'], 0, 'v2', 'In het Haagse Bos takes slot 1, so the verb comes next, then Paola.'), 'met de honden',
        FK(['gewandeld', 'gewandelt'], 0, 'kof', 'wandel ends in l, not a ketchup letter, so the participle ends in d.', 'spell'), '.'] },
      { en: 'The dogs ate my sandwich.', parts: ['De honden', FK(['hebben', 'zijn'], 0, 'aux', 'Eating is no trip and no change of state: hebben.'), 'mijn broodje',
        FK(['opgegeten', 'opaten', 'opeten'], 0, 'sep', 'A separable verb puts ge between op and the verb: opgegeten.'), '.'] },
      { en: 'We had a beer in the clubhouse.', parts: ['In het clubhuis', FK(['hebben we', 'we hebben'], 0, 'v2', 'In het clubhuis takes slot 1, so the verb comes next, then we.'), 'een biertje',
        FK(['gedronken', 'dronk', 'drinken'], 0, 'perf', 'drinken is irregular: the participle is gedronken.'), '.'] },
      { en: 'I rang the neighbour about the tee time.', parts: ['Ik heb de buurman over de starttijd',
        FK(['opgebeld', 'opbelde', 'opbel'], 0, 'sep', 'A separable verb puts ge between op and the verb: opgebeld.'), '.'] },
      { en: 'The tram arrived late in Scheveningen.', parts: ['De tram', FK(['is', 'heeft'], 0, 'aux', 'Arriving is movement to a place: zijn.'), 'te laat in Scheveningen',
        FK(['aangekomen', 'aankwam', 'aankomt'], 0, 'sep', 'A separable verb puts ge between aan and the verb: aangekomen.'), '.'] },
      { en: 'It rained all day on the course.', parts: ['Het', FK(['heeft', 'is'], 0, 'aux', 'Weather is no movement and no change: hebben.'), 'de hele dag op de baan',
        FK(['geregend', 'geregent'], 0, 'kof', 'regen ends in n, not a ketchup letter, so the participle ends in d.', 'spell'), '.'] },
      { en: 'I hit my ball into the water.', parts: ['Ik', FK(['heb', 'ben'], 0, 'aux', 'Hitting a ball is something you do: hebben.'), 'mijn balletje in het water',
        FK(['geslagen', 'sloeg', 'sla'], 0, 'perf', 'slaan is irregular: the participle is geslagen.'), '.'] },

      // ---- reading
      { read: true, nl: 'Goed weekend gehad?', o: ['Did you have a good weekend?', 'Have a good weekend.', 'Is it a long weekend?'], a: 0, r: 'perf',
        w: 'gehad is the participle of hebben, so the weekend is over. Have a good weekend is Fijn weekend.' },
      { read: true, nl: 'Heb je de wedstrijd gezien?', o: ['Did you see the match?', 'Are you going to watch the match?', 'Did you win the match?'], a: 0, r: 'perf',
        w: 'gezien is the participle of zien, to see. Winning would be gewonnen.' },
      { read: true, nl: "'s Zomers mogen honden niet op het strand.", o: ['In summer dogs are not allowed on the beach.', 'In summer dogs do not have to go on the beach.', 'In summer dogs must stay on the beach.'], a: 0, r: 'mag',
        w: 'mogen niet means not allowed (mag niet in the singular). Not having to is hoeven niet.' },
      { read: true, nl: 'Die is de bunker in. Ik baal.', o: ["That one is in the bunker. I'm gutted.", "That one is in the bunker. I'm bored.", "That one is in the bunker. I'm going home."], a: 0, r: 'woord',
        w: 'balen means to be gutted. Watch the spelling: ballen are balls.' },
      { read: true, nl: 'De baan ligt er mooi bij.', en: 'The course is looking good.' },
      { read: true, nl: 'Dat is geen antwoord op mijn vraag.', en: 'That is not an answer to my question.' },

      // ---- listening
      { listen: true, nl: 'het reuzenrad', en: 'the Ferris wheel' },
      { listen: true, nl: 'gegolft', en: 'played golf' },
      { listen: true, nl: 'uitgelaten', en: 'walked (the dogs)' },
      { listen: true, nl: 'veertig meter', en: '40 metres' },

      // ---- looking
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },

      // ---- de or het
      { dehet: true, nl: 'zwembad', art: 'het', en: 'the swimming pool', w: 'A compound takes the article of its last part: het bad, so het zwembad.' },
      { dehet: true, nl: 'balletje', art: 'het', en: 'the little ball', w: 'Every -je word is het: het balletje, the little ball.' },
    ] }]);
})();
