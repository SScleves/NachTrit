// Nachtrit, Groningen (tier 10, B1): level 104 De sport. Sport and the outdoors: the gym, golf, the dog walk,
// cycling, skating on the Paterswoldsemeer, football at the Euroborg, the weather over the flat north.
// New at tier 10 and drilled here: opinions (ik vind dat, volgens mij), hoewel against ondanks (a clause against
// a noun), zullen for probability (zal wel), separable verbs in sub-clauses (omdat ik opsta, dat ik hem opzet),
// diminutives and their het-article (het balletje, het rondje, het sporttasje), the adjective -e in all cases
// (een echte sport, het oude sportshirt, nieuwe hardloopschoenen, een klein hondje, predicative with no -e).
// Review from earlier tiers: perfectum with irregular participles, imperfectum by 't kofschip (schaatste),
// comparatives and superlatives (het beste), mag niet against hoeft niet te, V2 after a fronted phrase.
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech.
// Sources: dutch-lessons vault, _site/situations/opinions (Ik vind, Volgens mij, Wat vind je van), dialogue
// "Op het terras na het golfen" (spierpijn, zal wel), 02 - Grammar (bijzin, scheidbare werkwoorden, de vs het,
// 't kofschip, modale werkwoorden, futurum), _site/words (de spierpijn, de sport, de sportschool, golf, wandelen,
// zwemmen, sporten, opstaan, het weer, slecht weer), MOC Het weer, MOC Vrije tijd, MOC Voegwoorden.
// Groningen colour from content/towns.js: Noorderplantsoen is a real park in the city, the Paterswoldsemeer a real
// lake just south of it, the Euroborg is the stadium of FC Groningen, the Noorderderby is Groningen against
// Heerenveen, and "Kon minder." (could be worse) is the local verdict on everything.
// New rules: mening, concessie, verklein (all guarded). New props: none. Look props: hond, fiets, brug only.
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 104, act: 10, name: 'De sport', town: 'groningen', place: 'sport', theme: 'dyke', ...P,
    intro: 'In Groningen the wind comes from every side, the forecast always says could be worse, and the dogs still need a walk.',
    introNl: 'In Groningen waait het van alle kanten, zegt het weerbericht altijd kon minder en moeten de honden gewoon uit.',
    mission: {
      where: 'The Noorderplantsoen, the long straight path out to the Paterswoldsemeer, and a student gym near the station where every mirror has an opinion about your technique. The Martinitoren watches every lap and says nothing. Flat country, so the headwind has had all day to prepare.',
      carry: 'Two leads, a golf bag nobody in the north believes in, a water bottle and a sports bill split to the cent with the neighbours. The grammar book is at the bottom of the bag, still closed. No helmet. Paola is still taller than you, and so is everyone at the gym.',
      want: 'Since the mist the dead have an opinion about sport, and they all start with ik vind dat or volgens mij. Give the right word order, say hoewel with a verb and ondanks with a noun, and put every separable verb back together at the end. Could be worse. Kon minder.' },
    items: [
      // ---- builds: opinions and arguments
      { en: 'I think golf is a real sport.', parts: ['Ik vind dat golf een', FK(['echte', 'echt'], 0, 'adj',
        'sport is a de-word, so after een it takes the -e: een echte sport.'), FK(['sport is', 'is sport'], 0, 'mening',
        'ik vind dat opens a sub-clause, so the verb goes to the end: dat golf een echte sport is.'), '.'] },
      { en: 'I think Groningen will win the derby tonight.', parts: ['Volgens mij', FK(['wint Groningen', 'Groningen wint'], 0, 'v2',
        'Volgens mij takes slot 1, so the verb comes second: wint Groningen.'), 'vanavond de derby.'] },
      { en: 'The referee is probably tired after ninety minutes.', parts: ['De scheidsrechter', FK(['zal', 'zult', 'zullen'], 0, 'fut',
        'One referee, so zal. Zal wel says it is probably so, a guess and not a promise.'), 'wel moe zijn na negentig minuten.'] },
      { en: 'The neighbours will probably cycle to the lake.', parts: ['De buren', FK(['zullen', 'zal', 'zult'], 0, 'fut',
        'Two or more people take zullen. With wel it means they will probably do it.'), 'wel naar het Paterswoldsemeer fietsen.'] },

      // ---- builds: hoewel and ondanks
      { en: 'Although it is raining hard, I still cycle to the lake.', parts: ['Hoewel het hard regent,', FK(['fiets ik', 'ik fiets'], 0, 'hoewel',
        'After a hoewel clause the main clause starts with its verb: fiets ik.'), 'toch naar het meer.'] },
      { en: 'I am going for a run despite my muscle ache.', parts: ['Ik ga hardlopen,', FK(['ondanks', 'hoewel'], 0, 'hoewel',
        'ondanks takes a noun and no verb: ondanks mijn spierpijn. hoewel needs a whole clause.'), 'mijn spierpijn.'] },
      { en: 'Paola comes along, although it is cold.', parts: ['Paola gaat mee,', FK(['hoewel', 'ondanks'], 0, 'hoewel',
        'hoewel opens a clause with a verb of its own: hoewel het koud is. ondanks only takes a noun.'), 'het', FK(['koud is', 'is koud'], 0, 'bijzin',
        'After hoewel the verb goes to the end: het koud is.'), '.'] },

      // ---- builds: separable verbs in sub-clauses
      { en: 'I am tired because I get up at six every morning.', parts: ['Ik ben moe, omdat ik elke ochtend om zes uur', FK(['opsta', 'sta op', 'opstaat'], 0, 'sep',
        'In a sub-clause the separable verb stays in one piece at the end: omdat ik opsta.'), '.'] },
      { en: 'Paola thinks I never put my helmet on.', parts: ['Paola denkt dat ik mijn helm nooit', FK(['opzet', 'zet op', 'opzetten'], 0, 'sep',
        'After dat the verb is last and in one piece: dat ik mijn helm nooit opzet. She is right, which is the problem.'), '.'] },
      { en: 'The match started late because the crowd arrived late.', parts: ['De wedstrijd begon later, omdat het publiek te laat', FK(['binnenkwam', 'kwam binnen'], 0, 'sep',
        'omdat sends the verb to the end and the prefix sticks back on: binnenkwam.'), '.'] },

      // ---- builds: diminutives
      { en: 'The neighbours have a small dog.', parts: ['De buren hebben een', FK(['klein', 'kleine'], 0, 'adj',
        'hondje is a diminutive, so it is a het-word: een klein hondje, no -e after een.'), 'hondje.'] },
      { en: 'He hits the ball into the bunker.', parts: ['Hij slaat het', FK(['balletje', 'baltje'], 0, 'verklein',
        'After a short vowel plus l the l doubles and the ending is -etje: bal becomes balletje.'), 'in de bunker.'] },
      { en: 'Shall we walk another little round through the Noorderplantsoen?', parts: ['Zullen we nog een', FK(['rondje', 'rondtje'], 0, 'verklein',
        'rond already ends in d, so just add -je: rondje.'), 'door het Noorderplantsoen lopen?'] },
      { en: "Have you seen Paola's little sports bag?", parts: ['Heb je', FK(['het', 'de'], 0, 'verklein',
        'Every -je word is het, even when the original is de: de tas, het tasje.'), 'sporttasje van Paola gezien?'] },

      // ---- builds: the adjective -e in all cases
      { en: "I like wearing my father's old sports shirt.", parts: ['Ik draag graag het', FK(['oude', 'oud'], 0, 'adj',
        'After het (or dit, dat, mijn) the adjective takes -e, even with a het-word: het oude sportshirt.'), 'sportshirt van mijn vader.'] },
      { en: 'Yesterday I bought new running shoes.', parts: ['Ik heb gisteren', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'A plural noun with no article always takes the -e: nieuwe hardloopschoenen.'), 'hardloopschoenen', FK(['gekocht', 'gekoopt', 'gekoch'], 0, 'perf',
        'kopen is irregular: gekocht.'), '.'] },
      { en: 'It is a beautiful course, but the wind is cold.', parts: ['Het is een', FK(['mooie', 'mooi'], 0, 'adj',
        'baan is a de-word: een mooie baan.'), 'baan, maar de wind is', FK(['koud', 'koude'], 0, 'adj',
        'After zijn the adjective stands alone, no -e: de wind is koud.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'I think this is the best team in the north.', parts: ['Volgens mij is dit het', FK(['beste', 'goedste'], 0, 'vergelijk',
        'goed is irregular: beter, het beste.'), 'team van het noorden.'] },
      { en: 'I used to skate on the Paterswoldsemeer every winter.', parts: ['Vroeger', FK(['schaatste', 'schaatsde'], 0, 'kof',
        'schaats ends in s, a ketchup letter: schaatste with a t.'), 'ik elke winter op het Paterswoldsemeer.'] },
      { en: 'You are not allowed to skate here, the ice is too thin.', parts: ['Je', FK(['mag', 'hoeft'], 0, 'mag',
        'mag niet means not allowed. hoeft would need te: hoeft niet te schaatsen.'), 'hier niet schaatsen, het ijs is te dun.'] },

      // ---- words: sport, matches and the weather over the flat north
      { w: 'the muscle ache', nl: 'de spierpijn' }, { w: 'the stamina', nl: 'de conditie' }, { w: 'the referee', nl: 'de scheidsrechter' },
      { w: 'the audience', nl: 'het publiek', wrong: 'de publiek' }, { w: 'the opponent', nl: 'de tegenstander' }, { w: 'the result', nl: 'de uitslag' },
      { w: 'the ice', nl: 'het ijs', wrong: 'de ijs' }, { w: 'the lake', nl: 'het meer', wrong: 'de meer' }, { w: 'the frost', nl: 'de vorst' },
      { w: 'the hail', nl: 'de hagel' }, { w: 'the drizzle', nl: 'de motregen' }, { w: 'the bunker', nl: 'de bunker' }, { w: 'the green', nl: 'de green' },
      { w: 'the season', nl: 'het seizoen', wrong: 'de seizoen' },
      { w: 'the dog lead', nl: 'de hondenriem' }, { w: 'the cycle path', nl: 'het fietspad', wrong: 'de fietspad' },
      { w: 'the towel', nl: 'de handdoek' }, { w: 'the match', nl: 'de wedstrijd' },

      // ---- reads: four traps with their own options, two plain lines from the town
      { read: true, nl: 'Het zal wel meevallen.', o: ['It will probably turn out fine.', 'It will certainly turn out badly.', 'It has already turned out fine.'], a: 0, r: 'fut',
        w: 'zal wel is a guess: probably. A promise would be zeker.' },
      { read: true, nl: 'Ondanks de regen gaat de wedstrijd door.', o: ['Despite the rain the match goes ahead.', 'Because of the rain the match is cancelled.', 'The rain stops before the match.'], a: 0, r: 'hoewel',
        w: 'ondanks means despite. doorgaan means to go ahead.' },
      { read: true, nl: 'Volgens mij is het te warm om te schaatsen.', o: ['I think it is too warm to skate.', 'Everyone says it is too warm to skate.', 'It is warm, so we are going to skate.'], a: 0, r: 'mening',
        w: 'volgens mij is your own opinion. te warm om te means too warm to.' },
      { read: true, nl: 'Hoewel ik moe ben, ga ik toch hardlopen.', o: ['Although I am tired, I am still going for a run.', 'Because I am tired, I am not going for a run.', 'I am tired after my run.'], a: 0, r: 'hoewel',
        w: 'hoewel gives the contrast, and toch confirms it: tired, but going anyway.' },
      { read: true, nl: 'Kon minder.', en: 'Could be worse.' },
      { read: true, nl: 'Ik vind dat de scheidsrechter blind is.', en: 'I think the referee is blind.' },

      // ---- listens: two Groningen places and one weather word by ear
      { listen: true, nl: 'het Noorderplantsoen', en: 'the Noorderplantsoen (the city park)' }, { listen: true, nl: 'de Euroborg', en: 'the Euroborg (the stadium of FC Groningen)' },
      { listen: true, nl: 'het onweer', en: 'the thunderstorm' },

      // ---- looks: the dog, the bike, the bridge over the canal
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'doelpunt', art: 'het', en: 'the goal (a score)', w: 'het doelpunt, because het punt is het.' },
      { dehet: true, nl: 'stadion', art: 'het', en: 'the stadium', w: 'het stadion. The plural is de stadions, because every plural is de.' },
    ] }]);
})();
