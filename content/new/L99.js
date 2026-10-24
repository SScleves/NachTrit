// Nachtrit, Groningen (tier 10, B1): level 99 Thuis. A narrow brick house with a stepped gable near the canal ring,
// a bike in the hall older than the mist, the grey Martinitoren over the roofs. Rooms, furniture, the family,
// the daily routine, the dogs, the wife, all told with opinions, doubts and small words.
// New at tier 10 and drilled here: opinions (ik vind dat, volgens mij, Volgens Paola), hoewel plus a clause and
// ondanks plus a noun, zullen for probability (Paola zal wel in de supermarkt zijn), separable verbs inside sub-clauses
// (omdat Paola zo vroeg opstaat, dat ik de honden te laat uitlaat, Als de wekker afgaat), diminutives and their het-article
// (het hondje, ons huisje, twee hondjes, dat kleine hondje) and the adjective -e in every case (een grote tuin, een nieuw
// bureau, ons oude huis, warme melk, koud water, nieuwe gordijnen).
// Review: the perfectum with zijn and an irregular participle, 't kofschip in the imperfectum (woonde), om ... te,
// the superlative, a reflexive verb with hoewel, and the replay of four words from L83 (Urk) and L91 (Texel).
// Still inside the fence: 16 words max, no passive, no plusquamperfectum, no indirect speech, no modal particles
// beyond wel, no formal register.
// Sources: dutch-lessons vault, 02 - Grammar/de vs het (diminutives are het, the adjective -e), bijzin - werkwoord naar
// het einde, scheidbare werkwoorden, V2 word order, 't kofschip, perfectum, trappen van vergelijking; 03 - Verbs/zullen,
// uitlaten; _site/situations/opinions (Ik vind, Volgens mij), _site/words (hoewel, het ontbijt, de zus,
// de verwarming, het huiswerk); 04 - Phrases & Scenarios/Thuis met je vrouw (Ik laat de honden wel even uit, Het ruikt
// heerlijk); content/towns.js for Groningen (de Martinitoren, de Grote Markt, de scheur, de aardbeving, de gaswinning,
// de studentenkamer, Er zit een scheur in de muur sinds de beving as a plain read, Kon minder). No jokes on the quakes.
// Replay: het ontbijt and de zwager from L83 (Urk), de brievenbus and het stopcontact from L91 (Texel).
// New rules: mening, hoewel, zullen, verklein (guarded below). omte and vergelijk are guarded too; v2, bijzin, sep, adj,
// kof, perf, refl, dehet are in data.js.
// New props: none. Only hond, huis and fiets are used (not tuin, deur or lamp: no word item here is their answer).
(() => {
  window.RULES.mening = window.RULES.mening || { name: 'Opinions: ik vind dat, volgens mij', note: 'ik-vind' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.omte = window.RULES.omte || { name: 'te plus infinitive: om ... te', note: 'Thuis met je vrouw' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[10];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 99, act: 10, name: 'Thuis', town: 'groningen', place: 'thuis', theme: 'street', ...P,
    intro: 'In Groningen everyone is a student or used to be one. At your house that is the dogs, who know exactly one word: walk.',
    introNl: 'In Groningen is iedereen student of was dat vroeger. Bij jou thuis zijn dat de honden, die precies één woord kennen: wandelen.',
    mission: {
      where: 'A narrow brick house with a stepped gable near the canal ring, a bike in the hall that nobody has moved since before the mist, the grey Martinitoren looking over the roofs. From the attic room down to the hall, and out along the canal because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the house keys, a slice of Groninger koek split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The students do not wear one either, so nobody looks twice.',
      want: 'Since the mist everyone who spoke Dutch has changed, and in Groningen they changed into students: they have an opinion about everything and they say it first. Ik vind dat, volgens mij, hoewel, ondanks. They want to know what you think of the house, the dogs and the neighbours, and they listen for where you put the verb. Paola, still taller than you, will probably be home already. Zal wel. The tower hears it all and says nothing. It is used to students.' },
    items: [
      // ---- builds: opinions, the verb after dat goes to the end, the verb after volgens mij comes second
      { en: 'I think the dogs sleep too much.', parts: ['Ik vind', FK(['dat de honden te veel slapen', 'dat de honden slapen te veel', 'dat slapen de honden te veel'], 0, 'mening',
        'dat opens a sub-clause, so the verb goes to the very end: dat de honden te veel slapen.'), '.'] },
      { en: 'In my opinion the big couch does not fit through the door.', parts: ['Volgens mij', FK(['past de grote bank', 'de grote bank past'], 0, 'v2',
        'Volgens mij fills slot 1, so the verb comes next: past de grote bank.'), 'niet door de deur.'] },

      // ---- builds: hoewel with a clause, ondanks with a noun
      { en: 'Although it is raining, I walk the dogs.', parts: [FK(['Hoewel het regent,', 'Hoewel regent het,'], 0, 'hoewel',
        'hoewel opens a sub-clause, so regent goes to the end: het regent.'), FK(['laat ik', 'ik laat'], 0, 'v2',
        'The whole sub-clause fills slot 1, so the main clause starts with its verb: laat ik.'), 'de honden uit.'] },
      { en: 'Although the house is old, the kitchen is brand new.', parts: ['Hoewel het huis', FK(['oud is,', 'is oud,'], 0, 'hoewel',
        'hoewel sends is to the end of its clause: oud is.'), FK(['is de keuken', 'de keuken is'], 0, 'v2',
        'After the hoewel-clause the main clause starts with its verb: is de keuken.'), 'helemaal nieuw.'] },
      { en: 'Despite the noise of the students we like living here.', parts: [FK(['Ondanks', 'Hoewel'], 0, 'hoewel',
        'ondanks takes a noun, het lawaai. hoewel needs a whole clause with a verb of its own.'), 'het lawaai van de studenten', FK(['wonen we', 'we wonen'], 0, 'v2',
        'The ondanks phrase fills slot 1, so the verb comes next: wonen we.'), 'hier graag.'] },

      // ---- builds: zullen for probability
      { en: 'Paola is probably in the supermarket.', parts: ['Paola', FK(['zal', 'zult', 'zullen'], 0, 'zullen',
        'zal wel is a guess about now. With Paola it is zal. zult goes with je and zullen with we and zij.'), 'wel in de supermarkt', FK(['zijn', 'is'], 0, 'zullen',
        'zal pushes the main verb to the end as an infinitive: zijn.'), '.'] },
      { en: 'The dogs are probably hungry by now.', parts: ['De honden', FK(['zullen', 'zal'], 0, 'zullen',
        'Two dogs, plural: zullen. zal is for one person or thing.'), 'nu wel', FK(['honger hebben', 'hebben honger'], 0, 'zullen',
        'zullen sends the infinitive to the end, so honger hebben.'), '.'] },

      // ---- builds: separable verbs inside sub-clauses
      { en: 'I am tired because Paola gets up so early.', parts: ['Ik ben moe', FK(['omdat Paola zo vroeg opstaat', 'omdat Paola zo vroeg staat op', 'omdat Paola opstaat zo vroeg'], 0, 'sep',
        'In a sub-clause the separable verb stays in one piece at the very end: opstaat.'), '.'] },
      { en: 'Paola thinks I walk the dogs too late.', parts: ['Paola vindt', FK(['dat ik de honden te laat uitlaat', 'dat ik de honden te laat laat uit', 'dat laat ik de honden te laat uit'], 0, 'sep',
        'After dat the verb goes last and uitlaten does not split: uitlaat.'), '.'] },
      { en: 'When the alarm goes off, I get up straight away.', parts: [FK(['Als de wekker afgaat,', 'Als de wekker gaat af,'], 0, 'sep',
        'Inside the als-clause the separable verb stays together at the end: afgaat.'), FK(['sta ik meteen op', 'ik sta meteen op'], 0, 'v2',
        'The clause fills slot 1, so the verb comes next: sta ik. In a main clause op goes to the end.'), '.'] },

      // ---- builds: diminutives are het
      { en: 'That little dog belongs to the neighbour.', parts: [FK(['Dat', 'Die'], 0, 'verklein',
        'A word ending in -je is always het: dat hondje, not die.'), FK(['kleine', 'klein'], 0, 'adj',
        'After dat the adjective takes -e: dat kleine hondje.'), 'hondje is van de buurvrouw.'] },
      { en: 'Our little house is small, but two dogs fit in.', parts: [FK(['Ons huisje', 'Onze huisje'], 0, 'verklein',
        'huisje ends in -je, so it is het: ons, not onze.'), 'is klein, maar er passen twee', FK(['hondjes', 'hondjen'], 0, 'verklein',
        'The plural of a diminutive is -s: hondjes.'), 'in.'] },

      // ---- builds: the adjective -e in all cases
      { en: 'Our old house has a big garden and a small kitchen.', parts: [FK(['Ons oude huis', 'Ons oud huis'], 0, 'adj',
        'With a possessive the adjective keeps its -e, even before a het-word: ons oude huis.'), 'heeft een', FK(['grote', 'groot'], 0, 'adj',
        'tuin is a de-word, so een grote tuin.'), 'tuin en een kleine keuken.'] },
      { en: 'I would rather drink warm milk than cold water.', parts: ['Ik drink liever', FK(['warme', 'warm'], 0, 'adj',
        'melk is a de-word, so even without an article it takes -e: warme melk.'), 'melk dan', FK(['koud', 'koude'], 0, 'adj',
        'water is a het-word with no article, so no -e: koud water.'), 'water.'] },
      { en: 'Paola buys a new desk and new curtains.', parts: ['Paola koopt een', FK(['nieuw', 'nieuwe'], 0, 'adj',
        'bureau is a het-word after een, so no -e: een nieuw bureau.'), 'bureau en', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'A plural always takes -e: nieuwe gordijnen.'), 'gordijnen.'] },

      // ---- builds: review of earlier tiers
      { en: 'Yesterday we walked to the Grote Markt with the dogs.', parts: ['Gisteren', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteren fills slot 1, so the verb comes second.'), 'met de honden naar de Grote Markt', FK(['gelopen', 'gelopt', 'gelopte'], 0, 'perf',
        'lopen is irregular, so gelopen. Going to a place takes zijn.'), '.'] },
      { en: 'I used to live in a student house without heating.', parts: ['Vroeger', FK(['woonde', 'woonte'], 0, 'kof',
        'woon ends in n, not a ketchup letter, so the past ends in -de: woonde.'), 'ik in een studentenhuis zonder verwarming.'] },
      { en: 'I go to the kitchen to make coffee.', parts: ['Ik ga naar de keuken', FK(['om koffie te zetten', 'om te koffie zetten', 'om koffie zetten te'], 0, 'omte',
        'om opens the purpose and te sits right before the infinitive at the end: om koffie te zetten.'), '.'] },
      { en: 'Of all the rooms the kitchen is the coziest.', parts: ['Van alle kamers is de keuken', FK(['de gezelligste', 'de gezelligst', 'de meest gezelligste'], 0, 'vergelijk',
        'The superlative is -st plus -e after de: de gezelligste. meest and -ste together would double it.'), '.'] },
      { en: 'I feel at home here, although the neighbours upstairs sometimes party.', parts: ['Ik voel', FK(['me', 'zich'], 0, 'refl',
        'The self-word matches ik, so me.'), 'hier thuis,', FK(['hoewel de buren boven ons soms feesten', 'hoewel de buren boven ons feesten soms'], 0, 'hoewel',
        'hoewel sends feesten to the end of its clause: soms feesten.'), '.'] },

      // ---- words: rooms, furniture, the family, the dogs, the crack in the wall
      { w: 'the alarm clock', nl: 'de wekker' }, { w: 'the fridge', nl: 'de koelkast' }, { w: 'the bookcase', nl: 'de boekenkast' },
      { w: 'the desk', nl: 'het bureau', wrong: 'de bureau' }, { w: 'the stairs', nl: 'de trap' },
      { w: 'the remote control', nl: 'de afstandsbediening' }, { w: 'the stove', nl: 'het fornuis', wrong: 'de fornuis' },
      { w: 'the slipper', nl: 'de pantoffel' }, { w: 'the crack', nl: 'de scheur' },
      { w: 'the foundation', nl: 'het fundament', wrong: 'de fundament' }, { w: 'the student room', nl: 'de studentenkamer' },
      { w: 'the housemate', nl: 'de huisgenoot' }, { w: 'the grandmother', nl: 'de oma' }, { w: 'the little toy', nl: 'het speeltje' },
      { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the brother-in-law', nl: 'de zwager' },
      { w: 'the letterbox', nl: 'de brievenbus' }, { w: 'the wall socket', nl: 'het stopcontact', wrong: 'de stopcontact' },

      // ---- reads: three traps with their own options, three lines from the house and from the city
      { read: true, nl: 'Hoewel de keuken klein is, eten we er graag.', o: ['Although the kitchen is small, we like eating there.', 'Because the kitchen is small, we like eating there.', 'The kitchen is small, so we want a bigger one.'], a: 0, r: 'hoewel',
        w: 'hoewel means although: the small size is a fact and we eat there anyway. Because would be omdat.' },
      { read: true, nl: 'Paola zal nu wel moe zijn van de borrel.', o: ['Paola is probably tired from the drinks by now.', 'Paola will be tired from the drinks tomorrow.', 'Paola wants to be tired from the drinks.'], a: 0, r: 'zullen',
        w: 'zal nu wel is a guess about now: she is probably tired. Tomorrow would need morgen, and wants would be wil.' },
      { read: true, nl: 'Volgens Paola is de bank te groot.', o: ['According to Paola the couch is too big.', 'Paola thinks that I find the couch too big.', 'Paola says the couch is big enough.'], a: 0, r: 'mening',
        w: 'volgens Paola is according to Paola, and te groot is too big. Big enough would be groot genoeg.' },
      { read: true, nl: 'Er zit een scheur in de muur sinds de beving.', en: 'There has been a crack in the wall since the quake.' },
      { read: true, nl: 'Ik vind dat het te vroeg is om op te staan.', en: 'I think it is too early to get up.' },
      { read: true, nl: 'Hoe was je dag? Kon minder.', en: 'How was your day? Could be worse.' },

      // ---- listens: the tower, the quake and the word of the level
      { listen: true, nl: 'de Martinitoren', en: 'the Martini Tower' }, { listen: true, nl: 'de aardbeving', en: 'the earthquake' },
      { listen: true, nl: 'ondanks', en: 'despite' },

      // ---- looks: the dog, the house, the bike against the wall
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },

      // ---- de of het
      { dehet: true, nl: 'kopje', art: 'het', en: 'the little cup', w: 'het kopje. Every word ending in -je is het: het kopje, het hondje, het huisje.' },
      { dehet: true, nl: 'studentenhuis', art: 'het', en: 'the student house', w: 'het studentenhuis. A compound takes the article of its last word, and it is het huis.' },
    ] }]);
})();
