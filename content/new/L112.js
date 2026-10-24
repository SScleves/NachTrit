// Nachtrit, Maastricht (tier 11, B1 to B2): level 112 De sport, place sport. Maastricht as a sports ground: the hills
// (the Sint-Pietersberg with its caves and its old fort, the slopes on every route out of town), the towpath along the Maas
// under the Sint-Servaasbrug, a golf course with a view, a gym behind a cafe on a cobbled street, the peloton that comes
// through in spring, the weather that rolls up the valley, and a piece of cherry vlaai on a terrace at the Vrijthof afterwards.
// New at tier 11 and drilled here: the passive with worden (wordt verbouwd, werd afgesloten, werden gevonden, impersonal
// question word order with wordt), zijn plus participle for a result (is al een week afgesloten), the plusquamperfectum with
// hadden and waren (had gewerkt, was gegaan, had opgegeten), indirect speech (zei dat ..., vroeg of ..., zou regenen,
// had uitgelaten), and one word with dialect colour, marked as such in its prompt (de bomma, also Noondezju in a read).
// Review from earlier tiers: comparatives and superlatives (zwaarder, de zwaarste, de mooiste), imperfectum by 't kofschip
// (fietste), mag niet against hoeft niet te, V2 after a fronted phrase, the perfectum participles (gezien, gegaan, gewandeld).
// Still inside the fence: 16 words max, no idioms with wel/eens/hoor/toch of tier 12, no formal register.
// The one fixed phrase with maar (Doe mij maar een stuk kersenvlaai) comes from the Maastricht entry in towns.js, as a read only.
// Sources: dutch-lessons vault, _site/words (de sport, de spierpijn, de sportschool, golf, wandelen, fietsen, het weer,
// slecht weer, Hij zei dat hij ziek was), Dutch Lessons/04 - Phrases & Scenarios/Op de golfbaan (starttijd, het balletje,
// de baan ligt er mooi bij), 01 - Vocabulary/golfbaan (the golf dictionary), 02 - Grammar (perfectum, zijn of hebben,
// bijzin, 't kofschip, scheidbare werkwoorden, V2 word order, modale werkwoorden), MOC Vrije tijd, MOC Het weer,
// H14 In de sportschool.
// Maastricht colour from content/towns.js: de heuvel, de mergel, de vlaai (Doe mij maar een stuk kersenvlaai), de bomma,
// Noondezju, the Sint-Servaasbrug, het Vrijthof, the carnaval joke (you cannot tell the living from the dead).
// New rules: passief, plusq, indirect (all guarded). New props: none. Look props: hond, fiets, brug only.
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'Passive: worden plus participle, zijn plus participle', note: 'perfectum' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Past perfect: hadden / waren plus participle', note: 'zijn of hebben' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 112, act: 11, name: 'De sport', town: 'maastricht', place: 'sport', theme: 'street', ...P,
    intro: 'Maastricht has hills, which is nearly cheating in this country. The dogs still need a walk, and now it is uphill.',
    introNl: 'Maastricht heeft heuvels, en dat is in dit land bijna vals spelen. De honden moeten nog steeds uit, en nu is het bergop.',
    mission: {
      where: 'The Sint-Pietersberg south of the city with its caves and its old fort, a golf course with a view, the towpath along the Maas under the Sint-Servaasbrug and a gym behind a cafe on a cobbled street. Every route is on a slope, and every route ends on a terrace at the Vrijthof.',
      carry: 'Two leads, a golf bag, a rain jacket, a water bottle and the bill for the cherry vlaai afterwards, split to the cent with the neighbours. The grammar book is at the bottom of the rucksack, still closed. No helmet, not even on the descent. Paola is still taller than you, and so are the hills.',
      want: 'Since the mist the dead of Maastricht gossip about sport in the passive and the past perfect: what is being done, what had already been done, and what somebody said somebody said. Worden plus participle, had or was plus participle, zei dat with the verb at the end. At carnaval you cannot tell them from the living, so check their grammar instead. Noondezju.' },
    items: [
      // ---- builds: the passive with worden, in the present and the past
      { en: 'The golf course is being renovated this year.', parts: ['De golfbaan', FK(['wordt', 'worden', 'word'], 0, 'passief',
        'One course and something happening to it now: wordt plus the participle at the end.'), 'dit jaar', FK(['verbouwd', 'verbouwt', 'verbouwen'], 0, 'kof',
        'verbouw ends in w, not a ketchup letter, so -d: verbouwd. In the passive the participle goes last.'), '.'] },
      { en: 'The match is postponed because of the rain.', parts: ['Vanwege de regen', FK(['wordt de wedstrijd', 'de wedstrijd wordt'], 0, 'v2',
        'Vanwege de regen takes slot 1, so the verb comes second: wordt de wedstrijd.'), FK(['uitgesteld', 'geuitgesteld', 'uitgestelt'], 0, 'sep',
        'The ge goes in the middle of uitstellen: uitgesteld. stel ends in l, so -d, and the participle is last.'), '.'] },
      { en: 'Yesterday the Sint-Servaasbrug was closed to cyclists.', parts: ['Gisteren', FK(['werd', 'wordt', 'word'], 0, 'passief',
        'werd is the past of worden. Gisteren says it is over, so not wordt.'), 'de Sint-Servaasbrug voor fietsers', FK(['afgesloten', 'afgesluit', 'afgesloot'], 0, 'sep',
        'afsluiten is irregular: afgesloten. The ge sits between af and sloten.'), '.'] },
      { en: 'What time is the match played tomorrow?', parts: ['Hoe laat', FK(['wordt de wedstrijd', 'de wedstrijd wordt'], 0, 'v2',
        'A question word takes slot 1, so the verb comes next: wordt de wedstrijd.'), 'morgen', FK(['gespeeld', 'gespeelt', 'spelen'], 0, 'passief',
        'worden takes the participle at the end: gespeeld. speel ends in l, so -d.'), '?'] },
      { en: 'The golf balls were found by the dogs.', parts: ['De golfballen', FK(['werden', 'wordt', 'word'], 0, 'passief',
        'Plural golfballen in the past: werden. wordt is the present and goes with one thing.'), 'door de honden', FK(['gevonden', 'gevind', 'gevonde'], 0, 'passief',
        'vinden is irregular: gevonden. The dogs are the doer, introduced with door.'), '.'] },
      { en: 'The footpath has been closed for a week.', parts: ['Het wandelpad', FK(['is', 'heeft'], 0, 'passief',
        'al een week names a state that has lasted: is afgesloten, the result. heeft would need an object, and a path cannot close something.'), 'al een week', FK(['afgesloten', 'afgesluit'], 0, 'passief',
        'zijn plus the participle describes the result: it is closed. The participle of afsluiten is afgesloten.'), '.'] },

      // ---- builds: the past perfect with hadden and waren
      { en: 'We had already played when it started to rain.', parts: ['Wij', FK(['hadden', 'waren', 'had'], 0, 'plusq',
        'The past perfect is the past of hebben or zijn plus the participle. spelen takes hebben, and wij is plural, so hadden.'), 'al', FK(['gespeeld', 'gespeelt', 'speeld'], 0, 'kof',
        'speel ends in l, not a ketchup letter, so -d: gespeeld.'), 'toen het begon te regenen.'] },
      { en: 'Paola had already gone home when I arrived.', parts: ['Paola', FK(['was', 'had', 'waren'], 0, 'plusq',
        'gaan is going somewhere, so it takes zijn: was gegaan. had is for hebben-verbs, and waren is plural.'), 'al naar huis', FK(['gegaan', 'gegaat', 'gegaand'], 0, 'perf',
        'gaan is irregular: gegaan.'), 'toen ik aankwam.'] },
      { en: 'The dogs had eaten my golf glove.', parts: ['De honden', FK(['hadden', 'waren', 'had'], 0, 'plusq',
        'Plural honden, so hadden. Eating is not going anywhere, so hebben.'), 'mijn golfhandschoen', FK(['opgegeten', 'opgeeten', 'geopgegeten'], 0, 'sep',
        'opeten is separable: the ge goes in the middle, op + gegeten, written as one word.'), '.'] },
      { en: 'Before the mist I had never swum in the Maas.', parts: ['Voor de mist', FK(['had ik', 'ik had'], 0, 'v2',
        'Voor de mist takes slot 1, so the verb comes second: had ik.'), 'nooit in de Maas', FK(['gezwommen', 'gezwemd', 'gezwomd'], 0, 'plusq',
        'zwemmen is irregular: gezwommen. Had plus the same participle as the perfectum.'), '.'] },

      // ---- builds: indirect speech
      { en: 'The neighbour said that he was ill, but he was on the golf course.', parts: ['De buurman zei', FK(['dat hij ziek was', 'dat hij was ziek', 'dat was hij ziek'], 0, 'indirect',
        'zei dat opens a sub-clause: the verb goes to the end, and the past zei pulls the verb into the past: was.'), ', maar hij stond op de golfbaan.'] },
      { en: 'The referee asked whether we had seen the ball.', parts: ['De scheidsrechter vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of. dat is for statements.'), 'wij de bal hadden', FK(['gezien', 'geziet', 'gezeen'], 0, 'perf',
        'zien is irregular: gezien. The verb stands last in the clause.'), '.'] },
      { en: 'Paola said that she had already walked the dogs.', parts: ['Paola zei dat ze de honden al', FK(['had', 'was'], 0, 'plusq',
        'uitlaten takes hebben, and after zei the reported past is the past perfect: had.'), FK(['uitgelaten', 'geuitgelaten', 'uitgelaat'], 0, 'sep',
        'The ge goes in the middle: uit + gelaten, written as one word.'), '.'] },
      { en: 'The forecast said that it would rain tomorrow.', parts: ['Het weerbericht zei dat het morgen', FK(['zou', 'zouden', 'zoud'], 0, 'indirect',
        'zou is the past of zullen in reported speech. One het, so zou and not zouden.'), 'regenen.'] },

      // ---- builds: review of earlier tiers
      { en: 'On the hills cycling is harder than in Alblasserdam.', parts: ['Op de heuvels is fietsen', FK(['zwaarder', 'zwaarer', 'zwaar'], 0, 'vergelijk',
        'zwaar ends in r, so the comparative takes -der for the sound: zwaarder. dan follows.'), 'dan in Alblasserdam.'] },
      { en: 'This is the hardest route, but also the prettiest.', parts: ['Dit is de', FK(['zwaarste', 'zwaarst'], 0, 'vergelijk',
        'The superlative before a noun takes -ste: de zwaarste route.'), 'route, maar ook de', FK(['mooiste', 'mooist'], 0, 'vergelijk',
        'mooi becomes mooiste, again with -ste.'), '.'] },
      { en: 'I used to cycle every weekend with Paola.', parts: ['Vroeger', FK(['fietste', 'fietsde'], 0, 'kof',
        'fiets ends in s, a ketchup letter: fietste with a t.'), 'ik elk weekend met Paola.'] },
      { en: 'You are not allowed to cycle here, it is a pedestrian zone.', parts: ['Je', FK(['mag', 'hoeft'], 0, 'mag',
        'mag niet means not allowed. hoeft would need te: hoeft niet te fietsen.'), 'hier niet fietsen, het is een voetgangersgebied.'] },

      // ---- words: hills, hiking, cycling, injuries, a little Maastricht
      { w: 'the hill', nl: 'de heuvel' }, { w: 'the slope', nl: 'de helling' }, { w: 'the footpath', nl: 'het wandelpad', wrong: 'de wandelpad' },
      { w: 'the rucksack', nl: 'de rugzak' }, { w: 'the cave', nl: 'de grot' }, { w: 'the city wall', nl: 'de stadswal' },
      { w: 'the terrace', nl: 'het terras', wrong: 'de terras' }, { w: 'the running (the sport)', nl: 'het hardlopen', wrong: 'de hardlopen' },
      { w: 'the trainer', nl: 'de trainer' }, { w: 'the peloton', nl: 'het peloton', wrong: 'de peloton' }, { w: 'the climb', nl: 'de klim' },
      { w: 'the descent', nl: 'de afdaling' }, { w: 'the injury', nl: 'de blessure' }, { w: 'the ankle', nl: 'de enkel' },
      { w: 'the race course', nl: 'het parcours', wrong: 'de parcours' }, { w: 'the Limburg fruit tart', nl: 'de vlaai' },
      { w: 'granny (Maastricht dialect)', nl: 'de bomma' },
      { w: 'the weather forecast', nl: 'het weerbericht', wrong: 'de weerbericht' }, { w: 'the tee time', nl: 'de starttijd' },
      { w: 'the dog lead', nl: 'de hondenriem' },

      // ---- reads: four traps with their own options, two plain lines from the town
      { read: true, nl: 'De sportschool is verbouwd.', o: ['The gym has been renovated.', 'The gym is being renovated.', 'The gym will be renovated.'], a: 0, r: 'passief',
        w: 'is plus the participle is the result: the job is finished. Still going on would be wordt verbouwd.' },
      { read: true, nl: 'De wedstrijd was al begonnen toen wij aankwamen.', o: ['The match had already started when we arrived.', 'The match started because we arrived.', 'The match will start when we arrive.'], a: 0, r: 'plusq',
        w: 'was begonnen is the past perfect: it happened before we arrived. al means already.' },
      { read: true, nl: 'De trainer zei dat wij te laat waren.', o: ['The trainer said that we were late.', 'The trainer asked whether we were late.', 'The trainer said that we would be late.'], a: 0, r: 'indirect',
        w: 'zei dat reports a statement, and waren is the plain past: we were late. Asking would be vroeg of.' },
      { read: true, nl: 'Hij vroeg of ik mee wilde fietsen.', o: ['He asked if I wanted to cycle along.', 'He said that I had to cycle along.', 'He asked why I was cycling along.'], a: 0, r: 'indirect',
        w: 'vroeg of reports a yes-or-no question. mee wilde fietsen is the wish, not an order.' },
      { read: true, nl: 'Noondezju, het regent weer.', en: 'Damn it (Maastricht dialect), it is raining again.' },
      { read: true, nl: 'Doe mij maar een stuk kersenvlaai.', en: 'I will have a piece of cherry tart.' },

      // ---- listens: two Maastricht places and one weather word by ear
      { listen: true, nl: 'de Sint-Pietersberg', en: 'the Sint-Pietersberg (the hill south of the city)' }, { listen: true, nl: 'het Vrijthof', en: 'the Vrijthof (the big square)' },
      { listen: true, nl: 'de windstoot', en: 'the gust of wind' },

      // ---- looks: the dog, the bike, the old stone bridge over the Maas
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'weer', art: 'het', en: 'the weather', w: 'het weer. Bad weather is slecht weer, with no article and no -e.' },
      { dehet: true, nl: 'wielrennen', art: 'het', en: 'road cycling (the sport)', w: 'A verb used as a noun is het: het wielrennen, het hardlopen, het golfen.' },
    ] }]);
})();
