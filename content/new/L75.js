// Nachtrit, Rotterdam (tier 7, A2 to B1): level 75 Thuis. A cube house on its corner next to the Markthal, harbour
// cranes in the kitchen window, the Maas down the road. Rooms, furniture, the daily routine, the dogs, the wife,
// told as what happened: the past of the day, the self-words, polite requests, who is bigger than whom.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (werkte, kookte, verveelden,
// bestelden, herinnerde) and of the common irregulars (ging, kwam, zag, kocht, sprak, liep, deed, had), reflexive
// verbs (zich voelen, zich vergissen, zich herinneren, zich vervelen), zou plus infinitive for polite requests
// (uitlaten, aanzetten, kunnen krijgen, liever), comparatives and superlatives (groter dan, langer dan, het beste,
// het liefst). Review: V2 after a time word, adjective -e, possessives ons/onze, object pronouns, perfectum with
// hebben and a separable participle, niet against geen.
// Still inside the fence: 12 words max, no sub-clauses with the verb at the end (no omdat, dat, als, toen).
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum, 't kofschip, reflexieve werkwoorden, V2 word order,
// zachtmakers; 03 - Verbs/zullen (zou), uitlaten; 04 - Phrases & Scenarios/Thuis met je vrouw (Hoe was jouw dag?,
// Ik heb een lange dag gehad, Sorry, ik heb me vergist, Je hebt gelijk, Zal ik thee zetten?); _site/words (de afwas,
// de rommel, de verwarming, het kopje koffie, graag liever liefst, goed beter best, hij voelt zich niet zo lekker,
// hij verveelt zich, ik zou graag een kopje koffie willen, wil je de verwarming aanzetten, de zus, de schat);
// content/towns.js for Rotterdam (de kubuswoning, de hijskraan, de wolkenkrabber, de Maas, de Markthal,
// een bakkie pleur, Niet lullen maar poetsen, the Erasmusbrug).
// New rules: zou (the vault note zullen); vergelijk, bezit and obj are guarded below.
// Replay: het balkon, de stofzuiger and de hondenmand from the earlier thuis levels (L67 and before).
// New props: none. Only hond, huis and brug are used.
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou: polite requests', note: 'zullen' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 75, act: 7, name: 'Thuis', town: 'rotterdam', place: 'thuis', theme: 'street', ...P,
    intro: 'In Rotterdam the dead do not talk, they polish. The cube house stands on its corner, so the dogs slide and nobody gets worked up.',
    introNl: 'In Rotterdam praten de doden niet, ze poetsen. De kubuswoning staat op zijn punt, dus de honden glijden en niemand maakt zich druk.',
    mission: {
      where: 'A yellow cube house on its corner next to the Markthal, the harbour cranes in the kitchen window and the Maas at the end of the road. From the bedroom down the stairs to the front door, then along the water and back, because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the keys to a door that is not square, a mug of bakkie pleur gone cold, and the grammar book, still never opened. No helmet. The metro does not wait for anyone, with a helmet or without.',
      want: 'Since the mist everyone who spoke Dutch has changed, and the dead of Rotterdam still do not chat. They stand in your rooms and ask how the day went, and you answer in the past: werkte, kookte, ging, kwam. They want the words me and zich in the right place, and they only accept a favour that starts with zou. The women are still taller than you. They still split the bill for the polish to the cent.' },
    items: [
      // ---- builds: the imperfectum, regular by 't kofschip and irregular by heart
      { en: 'Yesterday I worked at home all day.', parts: ['Gisteren', FK(['werkte ik', 'ik werkte', 'werkde ik'], 0, 'kof',
        'Gisteren takes slot 1, so the verb comes second. werk ends in k, a ketchup letter: werkte with a t.'), 'de hele dag thuis.'] },
      { en: 'Paola cooked and I did the dishes.', parts: ['Paola', FK(['kookte', 'kookde', 'kookten'], 0, 'kof',
        'kook ends in k, a ketchup letter: kookte with a t. One person, so no -n.'), 'en ik', FK(['deed', 'doede', 'deden'], 0, 'imp',
        'doen is irregular: deed. With ik there is no ending.'), 'de afwas.'] },
      { en: 'Paola came home and saw the mess.', parts: ['Paola', FK(['kwam', 'komde', 'kwamen'], 0, 'imp',
        'komen is irregular: kwam. One person, so no ending.'), 'thuis en', FK(['zag', 'ziede', 'zagen'], 0, 'imp',
        'zien is irregular: zag. One person, so no -en.'), 'de rommel.'] },
      { en: 'The dogs followed Paola around all day.', parts: ['De honden', FK(['liepen', 'liep', 'loopten'], 0, 'imp',
        'lopen is irregular: liep, and the plural takes -en: liepen.'), 'de hele dag achter Paola aan.'] },
      { en: 'Paola bought a new lamp for the living room.', parts: ['Paola', FK(['kocht', 'koopte', 'kochten'], 0, 'imp',
        'kopen is irregular: kocht. The regular pattern koopte is wrong.'), 'een', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'lamp is a de-word, so the adjective takes -e: een nieuwe lamp.'), 'lamp voor de woonkamer.'] },
      { en: 'Paola spoke softly to the dogs and sternly to me.', parts: ['Paola', FK(['sprak', 'sprekte', 'spraken'], 0, 'imp',
        'spreken is irregular: sprak. One person, so no ending.'), 'zacht tegen de honden en streng tegen', FK(['mij', 'ik'], 0, 'obj',
        'After tegen comes the object form: tegen mij, not tegen ik.'), '.'] },
      { en: 'We had no time, so we ordered pizza.', parts: ['We', FK(['hadden', 'had', 'haden'], 0, 'imp',
        'hebben is irregular: had, and wij takes -den: hadden.'), 'geen tijd, daarom', FK(['bestelden we', 'we bestelden'], 0, 'v2',
        'daarom takes slot 1, so the verb comes second, then we. bestel ends in l, so -den.'), 'pizza.'] },

      // ---- builds: reflexive verbs, the self-word right after the verb
      { en: 'Paola does not feel so well tonight.', parts: ['Paola voelt', FK(['zich', 'me', 'haar'], 0, 'refl',
        'Paola is zij, so the self-word is zich, right after the verb: voelt zich.'), 'vanavond niet zo lekker.'] },
      { en: 'Sorry, I was wrong. You are right.', parts: ['Sorry, ik heb', FK(['me', 'zich', 'ons'], 0, 'refl',
        'ik takes me, right after the verb: heb me vergist.'), 'vergist. Je hebt gelijk.'] },
      { en: 'I did not remember the neighbour’s name.', parts: ['Ik', FK(['herinnerde me', 'herinnerte me', 'me herinnerde'], 0, 'kof',
        'herinner ends in r, no ketchup letter: herinnerde with a d. The me comes right after the verb.'), 'de naam van de buurman', FK(['niet', 'geen'], 0, 'neg',
        'geen goes in front of a noun with een. Here de naam is already named, so niet at the end.'), '.'] },
      { en: 'The dogs were bored in the living room.', parts: ['De honden', FK(['verveelden zich', 'verveelde zich', 'zich verveelden'], 0, 'refl',
        'Two dogs, so verveelden, and zich comes right after the verb.'), 'in de woonkamer.'] },

      // ---- builds: zou plus the infinitive at the end, polite requests
      { en: 'Would you walk the dogs for a moment?', parts: ['Zou je de honden even', FK(['uitlaten', 'uitgelaten', 'uit te laten'], 0, 'zou',
        'zou takes the bare infinitive at the end: uitlaten, written as one word.'), '?'] },
      { en: 'Would you turn on the heating?', parts: ['Zou je de verwarming even', FK(['aanzetten', 'aangezet', 'aan te zetten'], 0, 'zou',
        'zou takes the bare infinitive at the end: aanzetten. The ge belongs to the perfectum, not here.'), '?'] },
      { en: 'Could I get a coffee, Rotterdam style?', parts: ['Zou ik een bakkie pleur', FK(['kunnen krijgen', 'kan krijgen', 'kunnen gekregen'], 0, 'zou',
        'Behind zou both verbs stand at the end as infinitives: kunnen krijgen.'), '?'] },
      { en: 'I would rather stay home than go to the borrel.', parts: ['Ik zou', FK(['liever', 'liefer', 'graag'], 0, 'vergelijk',
        'graag, liever, liefst. graag is the plain form; for rather, with dan after it, you need liever.'), 'thuisblijven', FK(['dan', 'dat'], 0, 'vergelijk',
        'Comparing two things takes dan.'), 'naar de borrel gaan.'] },

      // ---- builds: comparing, bigger than, the most, the best
      { en: 'Our living room is bigger than the old one.', parts: [FK(['Onze', 'Ons'], 0, 'bezit',
        'woonkamer is a de-word: onze.'), 'woonkamer is', FK(['groter', 'grotere', 'groot'], 0, 'vergelijk',
        'groot plus -er makes groter, and dan follows.'), 'dan de oude.'] },
      { en: 'Paola is still taller than I am, and she knows it.', parts: ['Paola is nog steeds', FK(['langer', 'lang', 'langst'], 0, 'vergelijk',
        'lang plus -er makes langer, and dan follows. langst needs a het or de in front of it.'), 'dan ik, en ze weet het.'] },
      { en: 'Our bed is the best bed in Rotterdam.', parts: [FK(['Ons', 'Onze'], 0, 'bezit',
        'bed is a het-word: ons bed.'), 'bed is het', FK(['beste', 'best', 'goedste'], 0, 'vergelijk',
        'goed is irregular: goed, beter, best. In front of a noun the best takes -e: het beste bed.'), 'bed van Rotterdam.'] },
      { en: 'The dogs like to lie on the couch most of all.', parts: ['De honden liggen het', FK(['liefst', 'liever'], 0, 'vergelijk',
        'graag, liever, liefst. Most of all is het liefst; liever does not take het.'), 'op de bank.'] },

      // ---- build: review of the perfectum with a separable participle
      { en: 'Paola has already tidied up the mess.', parts: ['Paola', FK(['heeft', 'is'], 0, 'aux',
        'Tidying up is an activity, not a journey: hebben.'), 'de rommel al', FK(['opgeruimd', 'geopruimd', 'opruimd'], 0, 'sep',
        'The ge goes in the middle: op + geruimd, written as one word at the end.'), '.'] },

      // ---- words: rooms, furniture, the routine, the dogs, Rotterdam
      { w: 'the kitchen', nl: 'de keuken' }, { w: 'the bedroom', nl: 'de slaapkamer' }, { w: 'the bathroom', nl: 'de badkamer' },
      { w: 'the couch', nl: 'de bank' }, { w: 'the fridge', nl: 'de koelkast' }, { w: 'the window', nl: 'het raam', wrong: 'de raam' },
      { w: 'the pillow', nl: 'het kussen', wrong: 'de kussen' }, { w: 'the curtain', nl: 'het gordijn', wrong: 'de gordijn' },
      { w: 'the lift', nl: 'de lift' }, { w: 'the stairs', nl: 'de trap' }, { w: 'the alarm clock', nl: 'de wekker' },
      { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the dinner', nl: 'het avondeten' },
      { w: 'the key', nl: 'de sleutel' }, { w: 'the balcony', nl: 'het balkon', wrong: 'de balkon' },
      { w: 'the dog basket', nl: 'de hondenmand' }, { w: 'the vacuum cleaner', nl: 'de stofzuiger' },
      { w: 'the skyscraper', nl: 'de wolkenkrabber' },

      // ---- reads: three traps with their own options, three lines from the house and from the city
      { read: true, nl: 'Paola kocht gisteren een nieuwe bank.', o: ['Paola bought a new couch yesterday.', 'Paola is buying a new couch tomorrow.', 'Paola has to buy a new couch.'], a: 0, r: 'imp',
        w: 'kocht is the past of kopen, and gisteren says it is done.' },
      { read: true, nl: 'Zou je even de afwas kunnen doen?', o: ['Could you do the dishes for a moment?', 'Did you do the dishes?', 'You have to do the dishes now.'], a: 0, r: 'zou',
        w: 'zou plus kunnen and an infinitive is a polite request, and even keeps it light. It is not a question about the past.' },
      { read: true, nl: 'Ik voel me hier thuis.', o: ['I feel at home here.', 'I feel unwell at home.', 'I am going home from here.'], a: 0, r: 'refl',
        w: 'zich voelen plus thuis is to feel at home. thuis says how you feel, not where you are going.' },
      { read: true, nl: 'Hoe was jouw dag?', en: 'How was your day?' },
      { read: true, nl: 'Het huis was kouder dan buiten.', en: 'The house was colder than outside.' },
      { read: true, nl: 'Niet lullen maar poetsen.', en: 'Stop talking and get to work.' },

      // ---- listens: two Rotterdam words and one irregular past by ear
      { listen: true, nl: 'de kubuswoning', en: 'the cube house' }, { listen: true, nl: 'de hijskraan', en: 'the crane' },
      { listen: true, nl: 'ging', en: 'went' },

      // ---- looks: the dog, the house, the bridge down the road
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'tapijt', art: 'het', en: 'the carpet' },
      { dehet: true, nl: 'gezin', art: 'het', en: 'the family', w: 'het gezin. The plural is de gezinnen, because every plural takes de.' },
    ] }]);
})();
