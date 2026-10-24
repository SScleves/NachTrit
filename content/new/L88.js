// Nachtrit, Urk (tier 8, B1): level 88 De sport. The dyke round the old island, the lighthouse, the Kerkje aan de Zee,
// the Vissersmonument, the harbour with the cutters, the IJsselmeer on one side and the golf course out in the polder.
// The dog walk, the gym, cycling into the wind, the weather forecast, the Saturday match, and a Sunday on which nothing moves.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and voordat
// (including modals inside the clause: omdat ze altijd uit moeten, dat het zaterdag droog blijft),
// want keeping V2, and the main clause after a front sub-clause starting with its verb (Als het droog is, gaan we ...).
// als against toen: als for now and the future, toen for one moment in the past.
// Review of earlier tiers: imperfectum (zeilde, sloeg, wist, zag, voelden), 't kofschip (gewandeld, getraind),
// zou plus infinitive, reflexives (voelden we ons), geen against niet, gaan plus infinitive, V2 after a fronted phrase.
// Audit fixes: no te-infinitive, no wel/toch/zal-for-probability, no diminutive word items (those are tier 9 and 10 and up).
// Still inside the fence: 14 words max, no relative clauses, no te plus infinitive (om te), no passive, no opinions with hoewel.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde (the trigger words, the bonus rule,
// Ik denk dat hij beter golft dan ik), imperfectum, 't kofschip, reflexieve werkwoorden, zachtmakers;
// 03 - Verbs/uitlaten, wandelen, spelen; 04 - Phrases & Scenarios/Op de golfbaan (starttijd, balletje, Een buitje deert ons niet,
// de bunker, de handicap, het clubhuis); _site/maps/MOC Voegwoorden, MOC Het weer, MOC Vrije tijd, H14 In de sportschool;
// _site/words (de spierpijn, de sportschool, de golfbaan, omdat-dat-als-toen-terwijl); content/towns.js for Urk
// (de vuurtoren, Het Kerkje aan de Zee, Het Vissersmonument, de haven, de kotter, de visafslag, de zondagsrust,
// Op zondag vaart hier niemand uit, the Sunday joke).
// New rules: none (bijzin, v2, imp, kof, sep, modal, neg, refl, fut are in data.js; zou is guarded below).
// New props: none. Only hond, fiets and kerk are used. There is no plain word item de hond, de fiets or de kerk in the pool
// (de hondenriem and Het Kerkje aan de Zee are not words here), so no look prop is also a right answer for a word item.
// Replay: de handdoek, de scheidsrechter (tier 7 sport), the toen/imperfectum forms from L80.
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou for polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 88, act: 8, name: 'De sport', town: 'urk', place: 'sport', theme: 'dyke', ...P,
    intro: 'Urk is fit from hauling nets all week, and on Sunday it rests so hard that even the dead stay in church.',
    introNl: 'Urk is de hele week fit van het netten binnenhalen, en op zondag rust het zo hard dat zelfs de doden in de kerk blijven.',
    mission: {
      where: 'The dyke round the old island, from the harbour past the lighthouse, the Kerkje aan de Zee and the Vissersmonument, with the grey IJsselmeer on one side and the golf course out in the polder. The wind comes straight off the water and is never behind you.',
      carry: 'A golf bag, two dog leads, a rain jacket that stays dry because you never put it on, and the grammar book, still never opened. No helmet. The seagulls have seen worse.',
      want: 'The dead jog, row and referee beside you, and they want reasons: omdat, als, toen, terwijl, voordat, and every verb to the end of the clause. Since the mist everyone who spoke Dutch changed, so answer in the right order. At the clubhouse they still split the bill to the cent, the women on the dyke are still taller than you, the dogs still need a walk, and on Sunday nobody sails out.' },
    items: [
      // ---- builds: omdat, want and dat, the verb at the end
      { en: 'The dogs go outside even in a storm, because they always have to go out.', parts: ['De honden gaan ook bij storm naar buiten,', FK(['omdat ze altijd uit moeten', 'omdat ze moeten altijd uit', 'omdat moeten ze altijd uit'], 0, 'bijzin',
        'omdat sends every verb to the end of the clause: ze altijd uit moeten. The dogs always need a walk, and the verb waits.'), '.'] },
      { en: 'Paola says that I have to walk the dogs first.', parts: ['Paola zegt', FK(['dat ik eerst de honden moet uitlaten', 'dat ik moet eerst de honden uitlaten', 'dat moet ik eerst de honden uitlaten'], 0, 'bijzin',
        'dat opens a sub-clause, so the verbs go to the end of it: moet uitlaten, with the modal first and the infinitive last.'), '.'] },
      { en: 'I think he plays better golf than I do.', parts: ['Ik denk', FK(['dat hij beter golft', 'dat hij golft beter', 'dat golft hij beter'], 0, 'bijzin',
        'After dat the subject comes first and the verb goes to the end: dat hij beter golft.'), 'dan ik.'] },
      { en: 'We won, because we trained so hard.', parts: ['We hebben gewonnen,', FK(['omdat we zo hard getraind hebben', 'omdat we hebben zo hard getraind', 'omdat hebben we zo hard getraind'], 0, 'bijzin',
        'After omdat the participle and the helper both sit at the end of the clause. The helper never jumps forward to sit right after we.'), '.'] },
      { en: "I'm not coming, because I have sore muscles.", parts: ['Ik kom niet,', FK(['want ik heb spierpijn', 'want ik spierpijn heb', 'want heb ik spierpijn'], 0, 'bijzin',
        'want is not a sub-clause word. Normal V2 stays: want ik heb spierpijn. Only omdat would send heb to the end.'), '.'] },
      { en: 'I hope it stays dry on Saturday.', parts: ['Ik hoop', FK(['dat het zaterdag droog blijft', 'dat het zaterdag blijft droog', 'dat blijft het zaterdag droog'], 0, 'bijzin',
        'dat sends the verb to the end: droog blijft.'), '.'] },

      // ---- builds: als and toen
      { en: 'Call me when you are at the lighthouse.', parts: ['Bel me', FK(['als', 'toen'], 0, 'bijzin',
        'als is for now and the future. toen only points at one moment in the past.'), 'je bij de vuurtoren bent.'] },
      { en: 'Yesterday, when I was cycling on the dyke, it rained hard.', parts: [FK(['Toen', 'Als'], 0, 'bijzin',
        'A single moment in the past takes toen, and gisteren makes it a single moment. als is for now and the future.'), 'ik gisteren op de dijk fietste,', FK(['regende het', 'het regende'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: regende het.'), 'hard.'] },
      { en: "If it rains, I don't feel like going to the gym.", parts: ['Als het regent,', FK(['heb ik', 'ik heb'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: heb ik.'), FK(['geen', 'niet'], 0, 'neg',
        'zin is a noun without an article, so it takes geen: geen zin in de sportschool.'), 'zin in de sportschool.'] },
      { en: 'If it is dry tomorrow, we are going to cycle along the dyke.', parts: ['Als het morgen droog is,', FK(['gaan we', 'we gaan'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: gaan we.'), 'langs de dijk', FK(['fietsen', 'te fietsen', 'fietst'], 0, 'fut',
        'gaan plus a bare infinitive at the end, and no te.'), '.'] },
      { en: 'When I hit my ball into the water, Paola had to laugh.', parts: ['Toen ik mijn balletje in het water', FK(['sloeg', 'slagde', 'geslagen'], 0, 'imp',
        'slaan is irregular: sloeg. slagde does not exist, and geslagen needs a helper.'), ',', FK(['moest Paola', 'Paola moest'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: moest Paola.'), 'lachen.'] },
      { en: 'When I saw the lighthouse, I knew I was lost.', parts: ['Toen ik de vuurtoren zag,', FK(['wist ik', 'ik wist'], 0, 'bijzin',
        'The toen-clause came first, so the main clause starts with its verb: wist ik. weten is irregular: wist.'), FK(['dat ik verdwaald was', 'dat was ik verdwaald'], 0, 'bijzin',
        'dat sends the verb to the end of its clause: dat ik verdwaald was.'), '.'] },

      // ---- builds: terwijl and voordat
      { en: 'While I walk on the treadmill, I look at my dashboard.', parts: [FK(['Terwijl ik op de loopband loop,', 'Terwijl loop ik op de loopband,'], 0, 'bijzin',
        'terwijl sends the verb to the end: terwijl ik op de loopband loop.'), FK(['kijk ik', 'ik kijk'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: kijk ik.'), 'naar mijn dashboard.'] },
      { en: 'Before we start, I quickly put on my sports shoes.', parts: ['Voordat we beginnen,', FK(['trek ik even', 'ik trek even'], 0, 'bijzin',
        'The sub-clause came first, so the main clause starts with its verb: trek ik even.'), 'mijn sportschoenen', FK(['aan', 'aantrek', 'aangetrokken'], 0, 'sep',
        'aantrekken splits in the main clause: trek ... aan, with aan at the very end.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'I used to sail on the IJsselmeer every summer.', parts: ['Vroeger', FK(['zeilde ik', 'ik zeilde', 'zeilte ik'], 0, 'imp',
        'zeil ends in l, not a ketchup letter, so -de: zeilde. Vroeger takes slot 1, so the verb comes before ik.'), 'elke zomer op het IJsselmeer.'] },
      { en: 'I would like to play golf with you on Saturday.', parts: ['Ik', FK(['zou', 'zouden', 'zoud'], 0, 'zou',
        'zou is the polite form, and with ik it stays zou.'), 'zaterdag graag met jullie', FK(['willen golfen', 'te willen golfen', 'wil golfen'], 0, 'modal',
        'zou needs an infinitive, and the pair sits at the end with the modal first and no te: willen golfen.'), '.'] },
      { en: 'On Saturday we walked to the lighthouse.', parts: ['Zaterdag', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Zaterdag takes slot 1, so the verb comes before we.'), 'naar de vuurtoren', FK(['gewandeld', 'gewandelt', 'gewandeeld'], 0, 'kof',
        'wandel ends in l, not a ketchup letter, so -d: gewandeld.'), '.'] },
      { en: 'After the match we felt tired but happy.', parts: ['Na de wedstrijd', FK(['voelden we', 'we voelden'], 0, 'v2',
        'Na de wedstrijd takes slot 1, so the verb comes before we.'), FK(['ons', 'zich', 'me'], 0, 'refl',
        'we goes with ons, and it sits right after we.'), 'moe maar tevreden.'] },
      { en: 'On Sunday they play no matches on Urk.', parts: ['Op zondag', FK(['spelen ze', 'ze spelen'], 0, 'v2',
        'Op zondag takes slot 1, so the verb comes before ze.'), 'op Urk', FK(['geen', 'niet'], 0, 'neg',
        'wedstrijden has no article, so it takes geen.'), 'wedstrijden.'] },

      // ---- words: Urk, the dyke, the golf course, the weather, the gym
      { w: 'the fishing cutter', nl: 'de kotter' },
      { w: 'the lighthouse', nl: 'de vuurtoren' },
      { w: 'the fishermen\'s monument', nl: 'het Vissersmonument', wrong: 'de Vissersmonument' },
      { w: 'the harbour', nl: 'de haven' },
      { w: 'the Sunday rest', nl: 'de zondagsrust' },
      { w: 'the dyke', nl: 'de dijk' },
      { w: 'the weather forecast', nl: 'het weerbericht', wrong: 'de weerbericht' },
      { w: 'the rain jacket', nl: 'de regenjas' },
      { w: 'the wind', nl: 'de wind' },
      { w: 'the walk', nl: 'de wandeling' },
      { w: 'the dog lead', nl: 'de hondenriem' },
      { w: 'the golf course', nl: 'de golfbaan' },
      { w: 'the clubhouse', nl: 'het clubhuis', wrong: 'de clubhuis' },
      { w: 'the tee time', nl: 'de starttijd' },
      { w: 'the golf ball', nl: 'de golfbal' },
      { w: 'the bunker', nl: 'de bunker' },
      { w: 'the muscle ache', nl: 'de spierpijn' },
      { w: 'the towel', nl: 'de handdoek' },

      // ---- reads: three traps with their own options, three lines from the island and the course
      { read: true, nl: 'Ik ga niet golfen als het stormt.', o: ['I am not going to play golf if it storms.', 'I did not play golf because it stormed.', 'I am not going to play golf, but it is stormy.'], a: 0, r: 'bijzin',
        w: 'als is if or when, and gaan ... golfen looks ahead. omdat would give a reason, and maar a contrast.' },
      { read: true, nl: 'Toen ik uit de kleedkamer kwam, begon de wedstrijd al.', o: ['When I came out of the changing room, the match was already starting.', 'When I come out of the changing room, the match will start.', 'The match began because I came out of the changing room.'], a: 0, r: 'bijzin',
        w: 'toen points at one moment in the past, and begon is past too. A reason would use omdat.' },
      { read: true, nl: 'Voordat de kotters uitvaren, drinken de mannen koffie.', o: ['Before the cutters sail out, the men drink coffee.', 'After the cutters have sailed out, the men drink coffee.', 'The cutters sail out while the men drink coffee.'], a: 0, r: 'bijzin',
        w: 'voordat is before. After would be nadat, and while would be terwijl.' },
      { read: true, nl: 'Op zondag vaart hier niemand uit.', en: 'On Sunday nobody sails out here.' },
      { read: true, nl: 'Omdat het stormt, blijven de kotters in de haven.', en: 'Because it is storming, the cutters stay in the harbour.' },
      { read: true, nl: 'Het is droog, dus we gaan fietsen.', en: 'It is dry, so we are going cycling.' },

      // ---- listens: Urk and the conjunctions by ear
      { listen: true, nl: 'de visafslag', en: 'the fish auction' },
      { listen: true, nl: 'terwijl', en: 'while' },
      { listen: true, nl: 'voordat', en: 'before' },
      { listen: true, nl: 'de scheidsrechter', en: 'the referee' },

      // ---- looks: the dog on the dyke, the bike, the little church by the water
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de or het
      { dehet: true, nl: 'zeilen', art: 'het', en: 'the sailing', w: 'A verb used as a noun is always het: het zeilen, het golfen.' },
      { dehet: true, nl: 'regenbui', art: 'de', en: 'the rain shower', w: 'A compound takes the article of its last part: de bui, so de regenbui.' },
    ] }]);
})();
