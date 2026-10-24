// Nachtrit, Amsterdam (tier 13, B1 to B2): level 128 De sport. Along the Amstel out of the city, past the Magere Brug and the
// rowing clubs to the Riekermolen, where a statue of Rembrandt sits drawing, then back through the Vondelpark, past the Olympic
// Stadium of 1928 and the Johan Cruijff ArenA. Running, rowing, golf, football, skating when the canals freeze, and the Dam tot
// Damloop: ten English miles from Amsterdam to Zaandam, through the tunnel under the IJ.
// New at tier 13 and drilled here: long builds with three forks, results and times in words (zestien kilometer, vierenveertig
// minuten), the local cheer next to polite directions, subtle pairs (geslagen against geslaagd, al against pas, bijna gelukt,
// het scheelde weinig, doet pijn against heeft pijn), directions along the river (naar het zuiden, aan je rechterkant), and sport
// idioms (op de valreep, de lat hoog leggen).
// Review of every tier: the passive in the past, zou for excuses, the conditional pluperfect, the present plural, gaan with an
// infinitive, V2, die for a de-word, the plural paden, the imperative, a sub-clause with tot, indirect speech, the
// plusquamperfectum with zijn, om ... te, the comparative, the imperfectum scoorde, a separable participle.
// Sources: dutch-lessons vault, _site/words (de sport, de spierpijn, golf, wandelen, fietsen); 01 - Vocabulary/golfbaan and
// 04 - Phrases & Scenarios/Op de golfbaan (de strafslag, de sloot); MOC Vrije tijd, H14 In de sportschool; 02 - Grammar/V2 word
// order, bijzin, perfectum, 't kofschip; level 120 for the replayed words (de supporter, de scheidsrechter, het doelpunt, de
// wielrenner, de blaar, de spierpijn); content/towns.js for Amsterdam (de Magere Brug, de gracht, the bikes). Facts: the
// Olympic Stadium was built for 1928, the ArenA carries Johan Cruijff's name since 2018, the Dam tot Damloop runs through the
// IJtunnel, the Rembrandt statue stands by the Riekermolen.
// New rules: weg (guarded, the same text in every Amsterdam file); idioom keeps the Nijmegen text. passief, zou, presens,
// meervoud, gebod, indirect, omte, vergelijk and plusq are guarded copies of the existing definitions.
// New props: none. Only hond, fiets and molen are used (no word, listen or look answer here is a bike or a mill).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 128, act: 13, name: 'De sport', town: 'amsterdam', place: 'sport', theme: 'dyke', ...P,
    intro: 'Amsterdam runs in the Vondelpark, rows on the Amstel and cycles everywhere, mostly through red lights. The dead have kept the habit.',
    introNl: 'Amsterdam rent in het Vondelpark, roeit op de Amstel en fietst overal, vooral door rood. De doden hebben die gewoonte gehouden.',
    mission: {
      where: 'Along the Amstel out of the city, past the Magere Brug and the rowing clubs to the old mill where a statue of Rembrandt sits drawing, then back through the Vondelpark, past the Olympic Stadium of 1928 and the Johan Cruijff ArenA. If the canals ever freeze, the whole town goes skating and nobody goes to work.',
      carry: 'Running shoes, a rowing club membership split to the cent with three colleagues, two dogs who run faster than you, a golf glove from last summer, and the grammar book, still never opened. No helmet. In Amsterdam a helmet is for tourists on rental bikes.',
      want: 'Since the mist the dead of Amsterdam keep fit with long sentences: the passive for the results, zou for the excuses, numbers for the times. They cheer you on the local way and ask the way the polite way, and they know exactly how long the Dam tot Damloop is: ten English miles, through the tunnel under the IJ. The women in the Vondelpark are still taller than you, and faster.' },
    items: [
      // ---- builds: the races and the results
      { en: 'The Dam tot Damloop goes from Amsterdam to Zaandam, through the tunnel under the IJ.', parts: ['De Dam tot Damloop gaat van Amsterdam naar Zaandam, door', FK(['de', 'het'], 0, 'dehet',
        'tunnel is a de-word: de tunnel.'), 'tunnel onder', FK(['het', 'de'], 0, 'dehet',
        'The IJ, the water behind the station, is a het-word: het IJ.'), 'IJ.'] },
      { en: 'The race is ten English miles, that is about sixteen kilometres.', parts: ['De loop is tien', FK(['Engelse', 'Engels'], 0, 'adj',
        'mijl is a de-word, so the adjective takes -e: Engelse mijl.'), 'mijl, dat is ongeveer', FK(['zestien', 'zesentien', 'zeventien'], 0, 'getal',
        'Sixteen is zestien, one word. zeventien is 17.'), 'kilometer.'] },
      { en: 'The race was won by a woman from Kenya, in forty-four minutes.', parts: ['De wedstrijd', FK(['werd', 'wordt'], 0, 'passief',
        'It is over, so the past: werd gewonnen.'), FK(['gewonnen', 'gewint', 'gewonen'], 0, 'perf',
        'winnen is irregular: gewonnen, with a double n.'), 'door een vrouw uit Kenia, in', FK(['vierenveertig', 'veerenveertig', 'vierveertig'], 0, 'getal',
        'Units first, then en, then the tens: vierenveertig. vier keeps its own spelling here.'), 'minuten.'] },
      { en: 'Ajax scored at the very last moment.', parts: ['Ajax', FK(['scoorde', 'scoorden', 'scorede'], 0, 'imp',
        'One club, so scoorde. The stem scoor keeps its double o before -de.'), FK(['op de valreep', 'op de valtrap', 'in de valreep'], 0, 'idioom',
        'op de valreep means at the very last moment. Only op, only valreep.'), '.'] },

      // ---- builds: excuses, conditions, the weather
      { en: "I'd love to come running, but my knee hurts.", parts: ['Ik zou graag', FK(['meelopen', 'mee te lopen'], 0, 'zou',
        'zou takes a bare infinitive at the end: zou graag meelopen.'), ', maar mijn knie', FK(['doet pijn', 'heeft pijn'], 0, 'woord',
        'A body part doet pijn. Only a person heeft pijn.'), '.'] },
      { en: 'If I had trained more, I would have run faster.', parts: ['Als ik meer', FK(['had getraind', 'had getraint'], 0, 'kof',
        'train ends in n, not a ketchup letter, so -d: getraind.'), ',', FK(['had ik', 'was ik'], 0, 'aux',
        'Running fast, without a direction, takes hebben: had ik ... gelopen.'), FK(['sneller', 'snelder'], 0, 'vergelijk',
        'snel becomes sneller. -der only comes after an r.'), 'gelopen.'] },
      { en: 'When the canals freeze, the whole city goes skating.', parts: ['Als de grachten', FK(['bevriezen', 'bevriest'], 0, 'presens',
        'grachten is plural, so the verb takes -en: bevriezen.'), ',', FK(['gaat de hele stad', 'de hele stad gaat'], 0, 'v2',
        'The als-clause fills slot 1, so the main clause starts with its verb.'), FK(['schaatsen', 'te schaatsen'], 0, 'fut',
        'gaan takes a bare infinitive: gaat schaatsen.'), '.'] },
      { en: 'At six in the morning the rowers are already out on the Amstel.', parts: ["Om zes uur 's ochtends", FK(['zitten de roeiers', 'de roeiers zitten'], 0, 'v2',
        'The time fills slot 1, so the verb comes second: zitten de roeiers.'), FK(['al', 'pas'], 0, 'woord',
        'al means already, early. pas would mean not until six.'), 'op de Amstel.'] },
      { en: 'I hit the ball into the ditch, so I get a penalty stroke.', parts: ['Ik heb de bal in', FK(['de', 'het'], 0, 'dehet',
        'sloot is a de-word: de sloot.'), 'sloot', FK(['geslagen', 'geslaagd', 'gesloegen'], 0, 'perf',
        'slaan, to hit, becomes geslagen. geslaagd is from slagen, to pass a test.'), ', dus ik krijg een strafslag.'] },

      // ---- builds: the parks, the stadiums, the river
      { en: 'Ajax plays in the Johan Cruijff ArenA, named after the most famous player of the club.', parts: ['Ajax speelt in de Johan Cruijff ArenA, genoemd naar de', FK(['beroemdste', 'beroemste'], 0, 'vergelijk',
        'beroemd keeps its d before -ste: beroemdste.'), 'speler van', FK(['de', 'het'], 0, 'dehet',
        'club is a de-word: de club.'), 'club.'] },
      { en: 'The Olympic Stadium was built for the Games of 1928.', parts: ['Het Olympisch Stadion', FK(['werd', 'wordt'], 0, 'passief',
        '1928 is the past, so werd: werd gebouwd.'), 'gebouwd', FK(['voor', 'om'], 0, 'woord',
        'Built for something is gebouwd voor.'), 'de Spelen van 1928.'] },
      { en: 'In the Vondelpark you run on the paths around the ponds.', parts: ['In het Vondelpark', FK(['loop je', 'je loopt'], 0, 'v2',
        'In het Vondelpark fills slot 1, so the verb comes second, and je loses its -t: loop je.'), 'hard op de', FK(['paden', 'paaden', 'pads'], 0, 'meervoud',
        'het pad becomes paden: the syllable is open, so one a is enough.'), 'rond de vijvers.'] },
      { en: 'From the Magere Brug follow the Amstel south until you see the mill on your right.', parts: [FK(['Volg', 'Volgt'], 0, 'gebod',
        'A command is the bare stem: volg.'), 'vanaf de Magere Brug de Amstel naar', FK(['het', 'de'], 0, 'weg',
        'The points of the compass are het-words: het zuiden, het noorden.'), 'zuiden', FK(['tot je de molen aan je rechterkant ziet', 'tot je ziet de molen aan je rechterkant'], 0, 'bijzin',
        'tot opens a sub-clause, so the verb goes to the very end: ziet.'), '.'] },

      // ---- builds: the coach, the cheer, the idioms
      { en: 'Come on, faster, you can do it, mate.', parts: ['Kom op,', FK(['harder', 'harter'], 0, 'vergelijk',
        'hard becomes harder: the d stays and -er is added.'), ', je', FK(['kunt het wel', 'kunt wel het'], 0, 'soft',
        'The small pronoun het comes before wel.'), ', gabber.'] },
      { en: 'My trainer sets the bar very high.', parts: ['Mijn trainer', FK(['legt de lat', 'ligt de lat', 'legt de stok'], 0, 'idioom',
        'de lat hoog leggen means to set high standards, from the high jump. liggen takes no object, and it is always the lat.'), 'erg hoog.'] },

      // ---- builds: review of earlier tiers
      { en: 'Paola asked whether I had run the whole route.', parts: ['Paola vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'ik de', FK(['hele', 'heel'], 0, 'adj',
        'route is a de-word, and after de the adjective takes -e: de hele route.'), 'route had gelopen.'] },
      { en: 'When I arrived, the others had already gone home.', parts: ['Toen ik aankwam,', FK(['waren de anderen', 'hadden de anderen', 'de anderen waren'], 0, 'plusq',
        'Going home takes zijn, so waren, and after the toen-clause the verb comes first.'), 'al naar huis', FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan has its own participle: gegaan.'), '.'] },
      { en: 'I go to the golf course early to avoid the crowds.', parts: ['Ik ga vroeg naar de golfbaan', FK(['om de drukte te vermijden', 'om de drukte vermijden', 'om te vermijden de drukte'], 0, 'omte',
        'om goes first, the object in the middle, te plus the verb last.'), '.'] },
      { en: 'Running along the Amstel is nicer than on a treadmill, but colder.', parts: ['Hardlopen langs de Amstel is', FK(['leuker', 'leukere'], 0, 'vergelijk',
        'After is, with no noun after it, the comparative takes no -e: leuker.'), 'dan op een loopband, maar wel', FK(['kouder', 'meer koud'], 0, 'vergelijk',
        'koud becomes kouder. meer koud is not Dutch.'), '.'] },
      { en: 'I am stiff because I warmed up too little.', parts: ['Ik ben stijf omdat ik te weinig heb', FK(['opgewarmd', 'geopwarmd', 'opgewarmt'], 0, 'sep',
        'The ge goes in the middle: op + gewarmd, and warm ends in m, so -d.'), '.'] },

      // ---- words: the river, the rink, the course, six replayed from Nijmegen
      { w: 'the rower', nl: 'de roeier' }, { w: 'the rowing club', nl: 'de roeivereniging' },
      { w: 'the skate', nl: 'de schaats' }, { w: 'the ice rink', nl: 'de ijsbaan' },
      { w: 'the treadmill', nl: 'de loopband' }, { w: 'the runner', nl: 'de loper' },
      { w: 'the warm-up', nl: 'de warming-up' }, { w: 'the tracksuit', nl: 'het trainingspak', wrong: 'de trainingspak' },
      { w: 'the golf course', nl: 'de golfbaan' }, { w: 'the penalty stroke', nl: 'de strafslag' },
      { w: 'the stadium', nl: 'het stadion', wrong: 'de stadion' }, { w: 'the river through the city', nl: 'de Amstel' },
      { w: 'the supporter', nl: 'de supporter' }, { w: 'the referee', nl: 'de scheidsrechter' },
      { w: 'the goal (the score)', nl: 'het doelpunt', wrong: 'de doelpunt' }, { w: 'the racing cyclist', nl: 'de wielrenner' },
      { w: 'the blister', nl: 'de blaar' }, { w: 'the sore muscles', nl: 'de spierpijn' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'Ik ben geslaagd voor mijn zwemdiploma.', o: ['I passed my swimming test.', 'I hit my swimming certificate.', 'I failed my swimming test.'], a: 0, r: 'woord',
        w: 'slagen voor is passing a test: geslaagd. Hitting is slaan, geslagen, and failing is zakken.' },
      { read: true, nl: 'Het is bijna gelukt.', o: ['It almost worked.', 'It just about worked.', 'It worked again.'], a: 0, r: 'woord',
        w: 'bijna means almost, so it did not work. Just about worked would be net gelukt.' },
      { read: true, nl: 'We hebben verloren, maar het scheelde weinig.', o: ['We lost, but it was close.', 'We lost, and it was not close at all.', 'We won by a narrow margin.'], a: 0, r: 'woord',
        w: 'het scheelde weinig means it was a close call. verloren means lost.' },
      { read: true, nl: 'Je hoeft niet te rennen, de pont wacht wel.', o: ['You do not need to run, the ferry will wait.', 'You are not allowed to run, the ferry is waiting.', 'You did not run, so the ferry left.'], a: 0, r: 'mag',
        w: 'hoeft niet te means it is not necessary. Not allowed would be mag niet.' },
      { read: true, nl: 'Bij de Riekermolen aan de Amstel staat een beeld van Rembrandt.', en: 'By the Riekermolen on the Amstel there is a statue of Rembrandt.' },
      { read: true, nl: 'De Johan Cruijff ArenA heet sinds 2018 naar de beroemdste speler van Ajax.', en: 'Since 2018 the Johan Cruijff ArenA has been named after the most famous Ajax player.' },

      // ---- listens: the park, the stadium, a distance, the race
      { listen: true, nl: 'het Vondelpark', en: 'the big park in the south of the centre' }, { listen: true, nl: 'de Johan Cruijff ArenA', en: 'the Ajax stadium' },
      { listen: true, nl: 'zestien kilometer', en: '16 kilometres' }, { listen: true, nl: 'de Dam tot Damloop', en: 'the ten-mile race from Amsterdam to Zaandam' },

      // ---- looks: the dog, a bike on the river path, the mill on the Amstel
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' },

      // ---- de of het
      { dehet: true, nl: 'trainingsschema', art: 'het', en: 'the training plan', w: 'The last part decides: het schema, so het trainingsschema.' },
      { dehet: true, nl: 'roeien', art: 'het', en: 'rowing (the sport)', w: 'A verb used as a noun is het: het roeien, het schaatsen.' },
    ] }]);
})();
