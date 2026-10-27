// Nachtrit, Nijmegen (tier 12, B1 to B2): level 122 De Vierdaagse, the town's own place. The four days in one night: from the
// Wedren over the Waalbrug into the Betuwe, through Wijchen on the pink Wednesday, over the seven hills to Groesbeek, across the
// army's pontoon bridge over the Maas at Cuijk, and back into town along the Via Gladiola for the gladioli and the cross. Since
// 1909, the third week of July, thirty, forty or fifty kilometres a day, tens of thousands of walkers. The lamps of De Oversteek
// and 1944 are told once, plainly, in a read, and without a joke.
// Rewritten from the unaudited draft in content/pending/L122.js (named De Waalbrug there; CONTENT-BRIEF.md names Nijmegen's own
// place De Vierdaagse): kept its particle, compound, formal and Roman forks, dropped the space-only distractor Waal brug, the
// mixed jouw option and the 1944 build, and grounded the rest in the route of the four days.
// New at tier 12 and drilled here: modal particles (zal wel moe zijn, even before the participle, het komt wel goed, kom eens
// kijken, Paola komt wel in a read), compound nouns (het Vierdaagsekruis, de Waalbrug, de stadsmuur with its s), the formal
// register (Geachte heer of mevrouw, ik schrijf u, Uw inschrijving is in goede orde ontvangen, Zou u mij kunnen vertellen),
// idioms (Zeg dat wel, op van de zenuwen, Nou breekt mijn klomp, Zet hem op and tegenvallen in the reads), the Vierdaagse with
// its distances, its days and its years.
// Review: V2 after a fronted phrase, the passive with worden and zijn, indirect speech with dat, an indirect question, hoewel,
// the comparative, 't kofschip, a separable participle (toegejuicht), hun before a noun, numbers, a relative clause in a read.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar (Mooi weertje toch, Ik pak wel even een biertje), V2 word
// order, bijzin - werkwoord naar het einde, imperfectum, 't kofschip, scheidbare werkwoorden, de vs het; MOC Lidwoorden &
// voornaamwoorden (hun, uw), MOC Getallen; _site/words (de spierpijn, het publiek, het feest, zeg dat wel, hoewel); levels 112,
// 116, 120 and 121 for the replayed words (de rugzak, de wandelschoen, de blaar, de spierpijn, de finish, het feest);
// content/towns.js for Nijmegen (de Vierdaagse, de wandelaar, de gladiool, de Waalbrug, het Valkhof, De Oversteek, de Romeinen,
// de oudste stad, the rumour about Maastricht); the Vierdaagse facts checked against the organisers and NOS, October 2026.
// New rules: idioom, samen, formeel, datum (guarded, same text in every Nijmegen and Amsterdam file). passief, zou, bezit,
// hoewel, indirect and vergelijk are guarded copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, lamp and boom are used (not brug: de pontonbrug is a word item and the Waalbrug is in the builds).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 122, act: 12, name: 'De Vierdaagse', town: 'nijmegen', place: 'eigen', theme: 'dyke', ...P,
    intro: 'Since 1909 people have walked four days in July around Nijmegen for one small cross and a bunch of gladioli. The dead understand that completely.',
    introNl: 'Sinds 1909 lopen mensen in juli vier dagen rond Nijmegen voor één kruisje en een bos gladiolen. De doden begrijpen dat helemaal.',
    mission: {
      where: 'The four days of the Vierdaagse in one night: from the Wedren over the Waalbrug into the Betuwe, where Elst is painted blue, through Wijchen on the pink Wednesday, over the seven hills to Groesbeek, across the pontoon bridge over the Maas at Cuijk, and back into town along the Via Gladiola. Downstream the lamps of De Oversteek come on one by one.',
      carry: 'A start card, a box of blister plasters, two dogs who walk the forty every year and have never been given a cross, a bunch of gladioli split to the cent with the neighbours, and the grammar book, still never opened. No helmet. You are walking.',
      want: 'Since the mist the dead walk the Vierdaagse every night, tens of thousands of them, and they still ask where the party is. Along the route they talk in small words, het komt wel goed, kom eens kijken, in compound words, het Vierdaagsekruis, de stadsmuur, and in sayings, zeg dat wel. The letter with your registration comes in the formal register. Paola, still taller than you, gets her gladioli first. On the Friday you get yours, and the language gives you one more word back.' },
    items: [
      // ---- builds: modal particles along the route
      { en: 'He will probably be tired after forty kilometres.', parts: ['Hij zal na veertig kilometer', FK(['wel moe zijn', 'moe wel zijn', 'moe zijn wel'], 0, 'soft',
        'wel goes right before moe zijn, and the infinitive zijn closes the sentence. With zal, wel means probably.'), '.'] },
      { en: 'I have quickly cleaned the walking shoes.', parts: ['Ik heb de wandelschoenen', FK(['even schoongemaakt', 'schoongemaakt even', 'schoon even gemaakt'], 0, 'soft',
        'even goes before the participle that closes the clause, never after it, and schoongemaakt stays one word.'), '.'] },
      { en: "Don't worry, it will be fine.", parts: ['Maak je', FK(['geen', 'niet'], 0, 'neg',
        'zorgen is a noun, so geen: geen zorgen.'), 'zorgen, het komt', FK(['wel goed', 'goed wel'], 0, 'soft',
        'wel comes right after the verb and turns it into a reassurance: het komt wel goed.'), '.'] },
      { en: 'Come and look, the view from the Valkhof is beautiful.', parts: ['Kom', FK(['eens', 'een'], 0, 'soft',
        'eens turns it into a friendly invitation: kom eens kijken. een is only the article a.'), 'kijken, het uitzicht vanaf het Valkhof is prachtig.'] },

      // ---- builds: compound nouns
      { en: 'You only get the Vierdaagse cross after four days.', parts: [FK(['Het', 'De'], 0, 'samen',
        'Vierdaagse + kruis: kruis is het, so het Vierdaagsekruis.'), 'Vierdaagsekruis krijg je pas na vier dagen.'] },
      { en: 'On Tuesday the walkers go over the Waalbrug to Elst.', parts: ['Op dinsdag', FK(['lopen de wandelaars', 'de wandelaars lopen'], 0, 'v2',
        'Op dinsdag fills slot 1, so the verb comes second: lopen de wandelaars.'), 'over', FK(['de', 'het'], 0, 'samen',
        'Waal + brug: brug is de, so de Waalbrug.'), 'Waalbrug naar Elst.'] },
      { en: 'Parts of the old city wall still stand in the Kronenburgerpark.', parts: ['Delen van de oude', FK(['stadsmuur', 'stadmuur', 'stedenmuur'], 0, 'samen',
        'Many compounds glue their parts with an s: stad + s + muur. Not all of them: it is stadhuis. Learn them one by one.'), 'staan nog in het Kronenburgerpark.'] },

      // ---- builds: the formal register of the registration
      { en: 'Dear Sir or Madam, I am writing to you about my registration.', parts: [FK(['Geachte', 'Hoogachtend', 'Gegroet'], 0, 'formeel',
        'A formal letter opens with Geachte. Hoogachtend is how it closes.'), 'heer of mevrouw, ik schrijf', FK(['u', 'uw'], 0, 'formeel',
        'You write to the person, so the object is u. uw needs a noun after it.'), 'over mijn inschrijving.'] },
      { en: 'Your registration has been duly received.', parts: ['Uw inschrijving', FK(['is', 'heeft'], 0, 'passief',
        'A finished passive takes zijn: is ontvangen. A registration does not receive anything itself.'), FK(['in goede orde', 'in goed orde', 'op goede orde'], 0, 'formeel',
        'in goede orde ontvangen is the fixed formal phrase for duly received. orde is a de-word, so goede.'), 'ontvangen.'] },
      { en: 'Could you tell me where the Wedren is?', parts: [FK(['Zou u', 'Zouden u'], 0, 'zou',
        'u takes the singular verb, like jij: zou u.'), 'mij kunnen vertellen', FK(['waar de Wedren is', 'waar is de Wedren'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verb goes to the end.'), '?'] },

      // ---- builds: idioms
      { en: 'What a long day. You can say that again.', parts: ['Wat een lange dag.', FK(['Zeg dat wel', 'Zeg dat goed'], 0, 'idioom',
        'Fixed reply: zeg dat wel means I agree completely.'), '.'] },
      { en: 'The evening before the start I am a nervous wreck.', parts: ['De avond voor de start ben ik', FK(['op van de zenuwen', 'op van de nerven', 'uit van de zenuwen'], 0, 'idioom',
        'op zijn van de zenuwen means to be worn out by nerves. Only op, and only zenuwen.'), '.'] },
      { en: 'Well I never: Paola is walking the fifty.', parts: ['Nou', FK(['breekt mijn klomp', 'breekt mijn schoen', 'breekt mijn kom'], 0, 'idioom',
        'Nou breekt mijn klomp says you are amazed. It is always the clog.'), ': Paola loopt de vijftig.'] },

      // ---- builds: the Vierdaagse, its numbers and its years
      { en: 'The walkers walk thirty, forty or fifty kilometres a day, depending on their age.', parts: ['De wandelaars lopen elke dag', FK(['dertig', 'dertien'], 0, 'getal',
        'The tens end in -tig: dertig is 30. dertien is 13.'), ', veertig of vijftig kilometer, afhankelijk van', FK(['hun', 'hen', 'zij'], 0, 'bezit',
        'Before a noun the word for their is hun: hun leeftijd. hen and zij are never possessives.'), 'leeftijd.'] },
      { en: 'In 2020 and 2021 the Vierdaagse did not go ahead.', parts: [FK(['In', 'Op'], 0, 'datum',
        'Years take in: in 2020.'), '2020 en 2021', FK(['ging de Vierdaagse', 'de Vierdaagse ging'], 0, 'v2',
        'The years fill slot 1, so the verb comes second: ging de Vierdaagse niet door.'), 'niet door.'] },
      { en: 'After four days we had walked a hundred and sixty kilometres.', parts: ['Na vier dagen', FK(['hadden we', 'we hadden'], 0, 'v2',
        'Na vier dagen fills slot 1, so the verb comes second: hadden we.'), 'honderdzestig kilometer', FK(['gelopen', 'geloopt', 'gelopt'], 0, 'perf',
        'lopen is irregular: gelopen.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'On Friday the walkers are cheered on along the Via Gladiola.', parts: ['Op vrijdag', FK(['worden de wandelaars', 'de wandelaars worden'], 0, 'v2',
        'Op vrijdag fills slot 1, so the verb comes second: worden de wandelaars.'), 'langs de Via Gladiola', FK(['toegejuicht', 'toegejuichd', 'getoejuicht'], 0, 'sep',
        'toejuichen is separable: toe + gejuicht, and juich ends in ch, a ketchup letter, so -t.'), '.'] },
      { en: 'Although it is raining, the walkers keep going.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'hoewel opens a clause with its own verb: hoewel het regent. ondanks needs a noun.'), 'het regent,', FK(['lopen de wandelaars', 'de wandelaars lopen'], 0, 'v2',
        'After a sub-clause the main clause starts with its verb: lopen de wandelaars.'), 'door.'] },
      { en: 'Nijmegen says that it is older than Maastricht.', parts: ['Nijmegen zegt', FK(['dat', 'of'], 0, 'indirect',
        'zeggen reports a statement with dat. of belongs to questions.'), 'het', FK(['ouder', 'oudst', 'oud'], 0, 'vergelijk',
        'Comparing two things takes the comparative: ouder dan. oudst is for the top of a list.'), 'is dan Maastricht.'] },
      { en: 'The Romans lived here two thousand years ago.', parts: ['De Romeinen', FK(['woonden', 'woondden', 'woonde'], 0, 'kof',
        'woon ends in n, not a ketchup letter, so -de, and the plural takes -den: woonden.'), 'hier', FK(['tweeduizend', 'tweehonderd', 'tweeduizenden'], 0, 'getal',
        'Two thousand is tweeduizend, written as one word. tweehonderd is 200.'), 'jaar geleden.'] },

      // ---- words: the walk, the route, the city, six replayed from earlier places
      { w: 'the walker', nl: 'de wandelaar' }, { w: 'the gladiolus, handed to the finishers', nl: 'de gladiool' },
      { w: 'the Vierdaagse cross', nl: 'het Vierdaagsekruis', wrong: 'de Vierdaagsekruis' }, { w: 'the pontoon bridge', nl: 'de pontonbrug' },
      { w: 'the field where the walk starts and ends', nl: 'de Wedren' }, { w: 'the crowd', nl: 'het publiek', wrong: 'de publiek' },
      { w: 'the soldier', nl: 'de militair' }, { w: 'the rest stop', nl: 'de rustpost' },
      { w: 'the Roman', nl: 'de Romein' }, { w: 'the oldest city', nl: 'de oudste stad' },
      { w: 'the Valkhof (the park on the hill by the river)', nl: 'het Valkhof', wrong: 'de Valkhof' }, { w: 'the rucksack', nl: 'de rugzak' },
      { w: 'the walking shoe', nl: 'de wandelschoen' }, { w: 'the blister', nl: 'de blaar' },
      { w: 'the sore muscles', nl: 'de spierpijn' }, { w: 'the finish', nl: 'de finish' },
      { w: 'the party', nl: 'het feest', wrong: 'de feest' }, { w: 'the route', nl: 'de route' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Paola komt wel.', o: ['Paola is coming, no doubt about it.', 'Paola is not coming.', 'Paola is coming as well.'], a: 0, r: 'soft',
        w: 'wel stresses that it will happen. As well would be ook.' },
      { read: true, nl: 'Zet hem op.', o: ['Go for it.', 'Put it on.', 'Put him down.'], a: 0, r: 'idioom',
        w: 'Zet hem op is what the crowd calls to the walkers: go for it. Nothing is put anywhere.' },
      { read: true, nl: 'Nou, dat valt tegen.', o: ['Well, that is disappointing.', 'Well, that is a lovely surprise.', 'Well, that falls over.'], a: 0, r: 'idioom',
        w: 'tegenvallen means to turn out worse than hoped. A nice surprise would be meevallen.' },
      { read: true, nl: 'Deelnemers die de finish niet halen, krijgen geen Vierdaagsekruis.', o: ['Walkers who do not reach the finish do not get a cross.', 'Walkers who do not get a cross do not reach the finish.', 'Walkers reach the finish without a cross.'], a: 0, r: 'diedat',
        w: 'die de finish niet halen describes the walkers: only the ones who finish get the cross.' },
      { read: true, nl: 'Op De Oversteek gaan elke avond de lampen een voor een aan, ter herinnering aan de soldaten van 1944.', en: 'Every evening the lamps on De Oversteek come on one by one, in memory of the soldiers of 1944.' },
      { read: true, nl: 'Op de laatste dag lopen de wandelaars bij Cuijk over een pontonbrug die het leger over de Maas legt.', en: 'On the last day the walkers cross the Maas at Cuijk on a pontoon bridge laid by the army.' },

      // ---- listens: the last stretch, the crowd of walkers, the flowers, the river land
      { listen: true, nl: 'de Via Gladiola', en: 'the last stretch, where the walkers get their gladioli' }, { listen: true, nl: 'tienduizenden wandelaars', en: 'tens of thousands of walkers' },
      { listen: true, nl: 'de gladiolen', en: 'the gladioli' }, { listen: true, nl: 'de Betuwe', en: 'the river land north of the Waal' },

      // ---- looks: the dog, a lamp on the dyke, a tree on the route
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
      { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },

      // ---- de of het
      { dehet: true, nl: 'kruisje', art: 'het', en: 'the small cross', w: 'Every -je word is het: het kruisje.' },
      { dehet: true, nl: 'wandeltocht', art: 'de', en: 'the long walk', w: 'The last part decides: de tocht, so de wandeltocht.' },
    ] }]);
})();
