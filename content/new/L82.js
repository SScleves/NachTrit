// Nachtrit, Rotterdam (tier 7, A2 to B1): level 82 De haven, the town's own place. The quays of the Nieuwe Maas under the
// cranes, the container ships and tugs, the dockworkers on the night shift, the Erasmusbrug, the Markthal and the cube
// houses at Blaak, the Euromast and the Witte Huis, the motto Niet lullen maar poetsen, the 1940 bombing and the rebuilding.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (werkte, woonden, voelde, vergiste),
// the common irregulars (was, had, ging, kwam, zag, wilden), a separable verb in the imperfectum (kwam ... binnen),
// reflexive verbs (zich voelen, zich vergissen), zou plus infinitive for polite requests, comparatives and superlatives
// (drukker dan, de grootste, het beste). Review: the perfectum with hebben and zijn (gevaren, gelost), V2 after a time
// word, the adjective -e, geen against niet.
// Still inside the fence: 12 words max, no sub-clauses with the verb at the end, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum (werkte, woonde, was, had, ging, deed, kwam, sprak, kocht),
// reflexieve werkwoorden, 't kofschip, perfectum, zijn of hebben, V2 word order, scheidbare werkwoorden, zachtmakers;
// _site/words (het schip, de schepen, het centrum, Vroeger werkte mijn vader in een fabriek, werkte, woonden);
// content/towns.js for Rotterdam (de haven, de hijskraan, de Maas, de wolkenkrabber, de kubuswoning, de markthal,
// de watertaxi, de metro, een bakkie pleur, Niet lullen maar poetsen, De Erasmusbrug, De Euromast, Het Witte Huis).
// New rules: zou (polite requests); vergelijk is guarded here and defined the same way in the other levels.
// New props: none. Only hond, fiets and lamp are used (not brug, water, huis or winkel: de Erasmusbrug, de Maas, de haven,
// de watertaxi, de kubuswoning and de markthal are in the word pool and would be right answers for those props).
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou for polite requests', note: 'zachtmakers - wel even maar' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 82, act: 7, name: 'De haven', town: 'rotterdam', place: 'eigen', theme: 'dyke', ...P,
    intro: 'The harbour of Rotterdam never sleeps, and since the mist neither do the dead. They still split the bill, down to the last container.',
    introNl: 'De haven van Rotterdam slaapt nooit, en sinds de mist slapen de doden ook niet meer. Ze delen de rekening nog steeds, tot op de laatste container.',
    mission: {
      where: 'The quays of the Nieuwe Maas, under the cranes, then over the light-blue Erasmusbrug to the Markthal and the yellow cube houses at Blaak. Wide roads, tram rails, and a few old buildings that survived 1940.',
      carry: 'Two dogs who want to see the ships, a flask of bakkie pleur, and the grammar book, never opened. No helmet. The wind on the bridge has an opinion about that.',
      want: 'The dead dockworkers are on the night shift and want to know how it was. Was, had, ging, kwam, and werkte with a t. Nobody talks, they work. Politely, with zou, because the women among them are still taller than you, and the dogs still need a walk.' },
    items: [
      // ---- builds: the imperfectum, regular and irregular
      { en: 'My grandfather used to work in the harbour.', parts: ['Mijn opa', FK(['werkte', 'werkde', 'werkten'], 0, 'kof',
        'werk ends in k, a soft ketchup letter, so the past is werkte. One person, so no -n.'), 'vroeger in de haven.'] },
      { en: 'We used to live right by the Maas.', parts: ['Vroeger', FK(['woonden we', 'woonde we', 'we woonden'], 0, 'imp',
        'Vroeger takes slot 1, so the verb comes second. Plural we and stem woon: woonden.'), 'vlak bij de Maas.'] },
      { en: 'The ship came in at eight o\'clock.', parts: ['Het schip', FK(['kwam', 'komde', 'kwamen'], 0, 'imp',
        'komen is irregular: kwam. One ship, so no -en.'), 'om acht uur', FK(['binnen', 'in', 'binnengekomen'], 0, 'sep',
        'The separable part stays behind and goes to the end: kwam ... binnen.'), '.'] },
      { en: 'The dockworkers had no time for coffee.', parts: ['De havenarbeiders', FK(['hadden', 'had', 'haden'], 0, 'imp',
        'hebben is irregular: had, and hadden for more than one person.'), 'geen tijd voor koffie.'] },
      { en: 'Yesterday I saw an enormous crane.', parts: ['Gisteren', FK(['zag ik', 'ik zag'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second: zag ik. zien is irregular, zag.'), 'een', FK(['enorme', 'enorm'], 0, 'adj',
        'hijskraan is a de-word, so the adjective after een takes -e.'), 'hijskraan.'] },
      { en: 'Paola took the metro to the Markthal.', parts: ['Paola', FK(['ging', 'gingen', 'gaan'], 0, 'imp',
        'gaan is irregular: ging. One person, so no -en.'), 'met de metro naar de Markthal.'] },
      { en: 'The dogs wanted to see the ships.', parts: ['De honden', FK(['wilden', 'wilde', 'wilt'], 0, 'imp',
        'Two dogs, plural, so wilden.'), 'de', FK(['schepen', 'scheepen', 'schipen'], 0, 'woord',
        'The plural of het schip is de schepen, one p and a long e. Learn the pair.'), 'zien.'] },
      { en: 'After the night shift the dockworker felt tired.', parts: ['Na de nachtdienst', FK(['voelde', 'voelte'], 0, 'kof',
        'voel ends in l, which is not a soft ketchup letter, so -de: voelde.'), 'de havenarbeider', FK(['zich', 'me', 'je'], 0, 'refl',
        'A third person (hij, zij, de havenarbeider) takes zich, and it sits right after the subject.'), 'moe.'] },
      { en: 'Last night I made a mistake. It was the wrong quay.', parts: ['Gisteravond vergiste ik', FK(['me', 'zich', 'ons'], 0, 'refl',
        'zich vergissen: ik takes me, and it sits right after ik: vergiste ik me.'), '. Het was de', FK(['verkeerde', 'verkeerd'], 0, 'adj',
        'After de the adjective takes -e: de verkeerde kade.'), 'kade.'] },

      // ---- builds: zou for polite requests
      { en: 'Could you show me the way to the quay?', parts: ['Zou u me de weg naar de kade', FK(['kunnen wijzen', 'kan wijzen', 'kunt wijzen'], 0, 'zou',
        'zou makes the request polite and the next verbs stay as infinitives at the end: kunnen wijzen.'), '?'] },
      { en: 'Could you keep an eye on the dogs for a moment?', parts: ['Zou je even', FK(['op', 'voor', 'aan'], 0, 'woord',
        'letten goes with op: op iets letten.'), 'de honden', FK(['willen letten', 'wil letten', 'te letten'], 0, 'zou',
        'After zou je the verbs go to the end as infinitives: willen letten.'), '?'] },

      // ---- builds: comparatives and superlatives
      { en: 'Rotterdam has the biggest port in Europe.', parts: ['Rotterdam heeft de', FK(['grootste', 'groter', 'groots'], 0, 'vergelijk',
        'After de the superlative takes -ste: de grootste. groter only compares, as in groter dan.'), 'haven van Europa.'] },
      { en: 'It is busier here than in Alblasserdam.', parts: ['Het is hier', FK(['drukker', 'druker', 'drukter'], 0, 'vergelijk',
        'druk is short and closed, so the k doubles when -er is added: drukker.'), 'dan in Alblasserdam.'] },
      { en: 'Here you get the best coffee in town.', parts: ['Hier krijg je het', FK(['beste', 'best', 'goedste'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best. After het the superlative takes -e: het beste.'), 'bakkie pleur van de stad.'] },

      // ---- builds: the perfectum and geen as review
      { en: 'Yesterday we sailed to the Markthal by water taxi.', parts: ['Gisteren', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Gisteren takes slot 1, so the verb comes second, then we.'), 'met de watertaxi naar de Markthal', FK(['gevaren', 'gevaard', 'gevarend'], 0, 'perf',
        'varen is irregular: gevaren. Going somewhere by boat takes zijn.'), '.'] },
      { en: 'The dockworkers unloaded the ship.', parts: ['De havenarbeiders', FK(['hebben', 'zijn'], 0, 'aux',
        'Unloading is something you do to a ship, not a trip: hebben.'), 'het schip', FK(['gelost', 'gelosd', 'gelossen'], 0, 'kof',
        'los ends in s, a soft ketchup letter, so gelost with a t.'), '.'] },
      { en: 'I had no helmet on and the bridge was slippery.', parts: ['Ik had', FK(['geen', 'niet'], 0, 'neg',
        'geen takes the place of een: een helm becomes geen helm. niet cannot stand before a noun like that.'), 'helm op en de brug', FK(['was', 'waren', 'ben'], 0, 'imp',
        'zijn is irregular: was for one thing, waren for more.'), 'glad.'] },

      // ---- words: the harbour, the bridge and the city
      { w: 'the harbour', nl: 'de haven' }, { w: 'the container', nl: 'de container' }, { w: 'the container ship', nl: 'het containerschip', wrong: 'de containerschip' },
      { w: 'the crane', nl: 'de hijskraan' }, { w: 'the river Maas', nl: 'de Maas' }, { w: 'the quay', nl: 'de kade', wrong: 'het kade' },
      { w: 'the tugboat', nl: 'de sleepboot' }, { w: 'the dockworker', nl: 'de havenarbeider' }, { w: 'the warehouse', nl: 'het pakhuis', wrong: 'de pakhuis' },
      { w: 'the skyscraper', nl: 'de wolkenkrabber' }, { w: 'the cable', nl: 'de kabel' }, { w: 'the cube house', nl: 'de kubuswoning' },
      { w: 'the market hall', nl: 'de markthal' }, { w: 'the water taxi', nl: 'de watertaxi' }, { w: 'the underground', nl: 'de metro' },
      { w: 'the city centre', nl: 'het centrum', wrong: 'de centrum' }, { w: 'the bombing', nl: 'het bombardement', wrong: 'de bombardement' },
      { w: 'the rebuilding', nl: 'de wederopbouw' }, { w: 'a coffee (Rotterdam slang)', nl: 'een bakkie pleur' },

      // ---- reads: the motto, the bombing and the rebuilding, and two polite lines
      { read: true, nl: 'Niet lullen maar poetsen.', o: ['Stop talking and get to work.', 'Keep talking until the work is done.', 'Do not clean up, just talk.'], a: 0, r: 'cult',
        w: 'lullen is talking rubbish and poetsen is cleaning. The Rotterdam motto: less talk, more work.' },
      { read: true, nl: 'In 1940 bombardeerden de Duitsers het centrum.', o: ['In 1940 the Germans bombed the centre.', 'In 1940 the Germans rebuilt the centre.', 'The centre has been bombed since 1940.'], a: 0, r: 'imp',
        w: 'bombardeerden is the imperfectum of bombarderen, plural -den: they bombed. Rebuilding would be bouwden ... op.' },
      { read: true, nl: 'Na de oorlog bouwden ze de stad weer op.', en: 'After the war they rebuilt the city.' },
      { read: true, nl: 'Ik voelde me niet lekker op de boot.', o: ['I did not feel well on the boat.', 'I do not feel well on the boat.', 'I did not feel the boat at all.'], a: 0, r: 'refl',
        w: 'voelde me is the past of zich voelen: I felt. Now it would be voel me.' },
      { read: true, nl: 'Ik liep langs de kade en zag een sleepboot.', en: 'I walked along the quay and saw a tugboat.' },
      { read: true, nl: 'Zou u dat nog een keer kunnen zeggen?', en: 'Could you say that one more time?' },

      // ---- listens: three landmarks and the verb of the motto
      { listen: true, nl: 'de Erasmusbrug', en: 'the Erasmus Bridge' }, { listen: true, nl: 'de Euromast', en: 'the Euromast' },
      { listen: true, nl: 'het Witte Huis', en: 'the White House of Rotterdam' }, { listen: true, nl: 'poetsen', en: 'to clean, to polish' },

      // ---- looks: the dog, the bike, the lamp on the quay
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'schip', art: 'het', en: 'the ship' },
      { dehet: true, nl: 'bom', art: 'de', en: 'the bomb' },
    ] }]);
})();
