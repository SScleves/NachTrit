// Nachtrit, Maastricht (tier 11, B1 to B2): level 107 Thuis. A tall house in pale yellow marl on a steep little street
// near the Helpoort, a cellar cut into the hill, the Maas at the bottom of the road. Rooms, furniture, the family,
// the daily routine, the dogs, the wife, all told as what is being done, what had been done and what somebody said.
// New at tier 11 and drilled here: the passive with worden (De keuken wordt verbouwd, Ons huis werd gebouwd, with door
// for the doer), the perfect passive with zijn and no geworden (De muur is geschilderd), the passive with a modal
// (moet uitgeruimd worden), the plusquamperfectum (had gekookt, was gegaan, hadden geblaft, was weggegaan) and
// indirect speech (Paola zei dat ..., Paola vroeg of ...). One dialect word, marked as such: de bomma, plus Noondezju
// as a plain read and the friet-not-patat rumour from the town entry.
// Review: V2 after a fronted phrase, the perfectum with zijn, the superlative, a reflexive separable verb, om ... te
// with a separable verb, the adjective -e, and the replay of four words from L99 (Groningen): de koelkast, de trap,
// het ontbijt, het stopcontact.
// Still inside the fence: 16 words max, no modal particles beyond what the vault uses, no formal register.
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, zijn of hebben, 't kofschip, bijzin - werkwoord naar het
// einde, scheidbare werkwoorden, reflexieve werkwoorden, V2 word order, trappen van vergelijking; 03 - Verbs/uitlaten;
// _site/sentences (De vaatwasser moet nog uitgeruimd worden), _site/words (worden, Hij zei dat hij ziek was, het
// ontbijt, de koelkast, de trap, het stopcontact, de afwas); 04 - Phrases & Scenarios/Thuis met je vrouw (Het ruikt
// heerlijk, Ik ruim de vaatwasser wel in); content/towns.js for Maastricht (de vlaai, de mergel, de bomma, Noondezju,
// Doe mij maar een stuk kersenvlaai, het verdrag, de Helpoort, the carnaval joke, the friet rumour).
// New rules: passief, plusq, indirect (guarded below). vergelijk and omte are guarded too; v2, perf, kof, sep, refl,
// adj, dehet are in data.js.
// New props: none. Only hond, huis and deur are used (not tuin, lamp or fiets: no word item here is their answer).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 107, act: 11, name: 'Thuis', town: 'maastricht', place: 'thuis', theme: 'street', ...P,
    intro: 'In Maastricht they signed the treaty that led to the euro. At your house nobody signs anything, and the bill is still split to the cent.',
    introNl: 'In Maastricht hebben ze het verdrag getekend waar de euro uit voortkwam. Bij jou thuis tekent niemand iets, en de rekening wordt nog steeds tot op de cent gedeeld.',
    mission: {
      where: 'A tall house in pale yellow marl on a steep little street near the Helpoort, a cellar cut into the hill, the Maas at the bottom of the road. Half of it is always being renovated by a man who is never there. From the cellar up to the attic, and out along the river because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the house keys, a cherry vlaai split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The hills are steep, but Limburg has seen worse.',
      want: 'Since the mist everyone who spoke Dutch has changed, and in Maastricht they changed into carnival: you cannot tell the living from the dead and nobody really tries. The dead in this house only talk about what is being done, what had already been done and what somebody said. Het huis wordt verbouwd. Paola had al gekookt. De bomma zei dat het eten klaar was. Paola, still taller than you, says friet and never patat. Noondezju.' },
    items: [
      // ---- builds: the passive with worden, with door, with a modal, and the perfect passive with zijn
      { en: 'The kitchen is being renovated at the moment.', parts: ['De keuken', FK(['wordt', 'word', 'worden'], 0, 'passief',
        'The passive is worden + participle. With de keuken (hij, zij, het) it is wordt: word is only for ik.'), 'op dit moment', FK(['verbouwd', 'geverbouwd', 'verbouwen'], 0, 'perf',
        'ver- verbs never take ge. The stem verbouw ends in w, no ketchup letter, so -d: verbouwd.'), '.'] },
      { en: 'The dogs are walked three times a day.', parts: ['De honden', FK(['worden', 'wordt', 'werd'], 0, 'passief',
        'Two dogs, plural, present tense: worden. wordt is for one thing, werd is the past.'), 'drie keer per dag', FK(['uitgelaten', 'geuitgelaten', 'uitlaten'], 0, 'sep',
        'The participle goes to the end, and the ge sits in the middle: uit + gelaten, one word.'), '.'] },
      { en: 'Our house was built from marl in 1890.', parts: ['Ons huis', FK(['werd', 'werden', 'word'], 0, 'passief',
        'The past passive is werd + participle. One house, so werd. werden is for plurals, and word is the present for ik.'), 'in 1890 van mergel', FK(['gebouwd', 'gebouwt', 'gebouwen'], 0, 'kof',
        'bouw ends in w, not in t, k, f, s, ch or p, so the ending is -d: gebouwd.'), '.'] },
      { en: 'The wall was painted yesterday.', parts: ['De muur', FK(['is', 'heeft', 'wordt'], 0, 'passief',
        'The perfect passive uses zijn and leaves worden out: de muur is geschilderd. heeft would make the wall do the painting, and wordt is the present, but gisteren is past.'), 'gisteren', FK(['geschilderd', 'geschildert', 'schilderd'], 0, 'kof',
        'schilder ends in r, no ketchup letter, so ge + stem + d: geschilderd.'), '.'] },
      { en: 'The dishwasher still has to be unloaded tonight.', parts: ['De vaatwasser moet vanavond nog', FK(['uitgeruimd worden', 'uitgeruimd wordt', 'uitgeruimd te worden'], 0, 'passief',
        'After a modal the passive ends in participle + worden, a bare infinitive. No te, and not wordt.'), '.'] },
      { en: "The dogs are spoiled by the neighbours' bomma (Maastricht dialect for grandma).", parts: ['De honden worden', FK(['door', 'met', 'tot'], 0, 'passief',
        'The one who does it in a passive sentence comes with door: door de bomma van de buren.'), 'de bomma van de buren', FK(['verwend', 'geverwend', 'verwent'], 0, 'perf',
        'ver- verbs never take ge: verwend. verwent is the present tense, and the passive needs the participle.'), '.'] },

      // ---- builds: the plusquamperfectum, had or was plus the participle
      { en: 'When I came home, Paola had already cooked.', parts: ['Toen ik thuiskwam,', FK(['had', 'hadden', 'heeft'], 0, 'plusq',
        'The plusquamperfectum is the imperfectum of the helper + participle. koken takes hebben, so had. hadden is plural, and heeft is the present.'), 'Paola al', FK(['gekookt', 'gekookd', 'gekoken'], 0, 'kof',
        'kook ends in k, a ketchup letter: gekookt with a t.'), '.'] },
      { en: 'Paola had already gone to bed, so I walked the dogs alone.', parts: ['Paola', FK(['was', 'had'], 0, 'plusq',
        'Going somewhere takes zijn, so the plusquamperfectum takes was: was gegaan.'), 'al naar bed', FK(['gegaan', 'gegaat'], 0, 'perf',
        'gaan has its own participle: gegaan.'), ', dus ik liet de honden alleen uit.'] },
      { en: 'We had not slept because the dogs had barked all night.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'slapen takes hebben, so the plusquamperfectum is hadden geslapen. Plural, so hadden.'), 'niet geslapen, want de honden hadden de hele nacht', FK(['geblaft', 'geblafd'], 0, 'kof',
        'blaf ends in f, a ketchup letter: geblaft with a t.'), '.'] },
      { en: 'Paola had already left when I woke up.', parts: ['Paola', FK(['was', 'had'], 0, 'plusq',
        'weggaan is going away, so zijn: Paola was weggegaan.'), 'al', FK(['weggegaan', 'geweggaan'], 0, 'sep',
        'The ge goes in the middle: weg + gegaan, written as one word at the end.'), 'toen ik wakker werd.'] },

      // ---- builds: indirect speech, zei dat and vroeg of send the verb to the end
      { en: 'Paola said that dinner was almost ready.', parts: ['Paola zei dat het eten bijna', FK(['klaar was', 'was klaar'], 0, 'indirect',
        'dat opens a sub-clause, so the verb goes to the very end: klaar was. The tense moves back with zei.'), '.'] },
      { en: 'The neighbour said that the dogs had barked again.', parts: ['De buurman zei', FK(['dat de honden weer hadden geblaft', 'dat de honden hadden weer geblaft', 'dat de honden geblaft weer hadden'], 0, 'indirect',
        'After dat the verbs go to the end, but weer stays in front of them: dat de honden weer hadden geblaft.'), '.'] },
      { en: 'Paola asked if I had already walked the dogs.', parts: ['Paola vroeg', FK(['of', 'wat'], 0, 'indirect',
        'A yes-or-no question turns into indirect speech with of. wat asks for a thing, and this question has no question word.'), 'ik de honden al', FK(['had uitgelaten', 'had uitlaten', 'uitgelaten heeft'], 0, 'plusq',
        'vroeg is past, so the helper is had, and uitlaten takes hebben. The participle uitgelaten follows it.'), '.'] },
      { en: 'Paola said that here you say friet, not patat.', parts: ['Paola zei dat je hier', FK(['friet zegt', 'zegt friet', 'friet zeggen'], 0, 'indirect',
        'dat sends the verb to the end: je hier friet zegt. With je it ends in -t.'), ', geen patat.'] },

      // ---- builds: review of earlier tiers
      { en: 'The bedroom is the quietest room in the house.', parts: ['De slaapkamer is de', FK(['rustigste', 'rustigst', 'rustiger'], 0, 'vergelijk',
        'Before a noun the superlative takes -e: de rustigste kamer. rustiger is the comparative, for dan.'), 'kamer van het huis.'] },
      { en: 'After work I first change my clothes.', parts: ['Na het werk', FK(['kleed ik me', 'ik kleed me', 'kleed ik zich'], 0, 'refl',
        'Na het werk fills slot 1, so the verb comes next. The reflexive pronoun for ik is me, never zich.'), 'eerst even', FK(['om', 'omkleden'], 0, 'sep',
        'In a main clause the prefix is left behind at the end: kleed me om.'), '.'] },
      { en: 'Last Sunday we walked to the Helpoort with the dogs.', parts: ['Afgelopen zondag', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Afgelopen zondag takes slot 1, so the verb comes second, then we.'), 'met de honden naar de Helpoort', FK(['gelopen', 'gelopt', 'gelopte'], 0, 'perf',
        'lopen is irregular: gelopen, and going somewhere takes zijn.'), '.'] },
      { en: 'I walk to the hall to take the dogs out.', parts: ['Ik loop naar de gang om de honden', FK(['uit te laten', 'te uitlaten', 'uitlaten te'], 0, 'omte',
        'With a separable verb the te sits between the prefix and the verb: uit te laten.'), '.'] },
      { en: 'Paola wants a new couch and a big window.', parts: ['Paola wil een', FK(['nieuwe', 'nieuw'], 0, 'adj',
        'bank is a de-word, so the adjective takes -e after een: een nieuwe bank.'), 'bank en een', FK(['groot', 'grote'], 0, 'adj',
        'raam is a het-word, and after een a het-word takes no -e: een groot raam.'), 'raam.'] },

      // ---- words: rooms, furniture, the house, the family, with Maastricht colour
      { w: 'the kitchen', nl: 'de keuken' }, { w: 'the bedroom', nl: 'de slaapkamer' },
      { w: 'the window', nl: 'het raam', wrong: 'de raam' }, { w: 'the curtain', nl: 'het gordijn', wrong: 'de gordijn' },
      { w: 'the cupboard', nl: 'de kast' }, { w: 'the mirror', nl: 'de spiegel' },
      { w: 'the cushion', nl: 'het kussen', wrong: 'de kussen' }, { w: 'the drawer', nl: 'de la' },
      { w: 'the ceiling', nl: 'het plafond', wrong: 'de plafond' }, { w: 'the cellar', nl: 'de kelder' },
      { w: 'the washing-up', nl: 'de afwas' }, { w: 'the grandma (Maastricht dialect)', nl: 'de bomma' },
      { w: 'the Limburg fruit tart', nl: 'de vlaai' }, { w: 'the marl, the soft yellow local stone', nl: 'de mergel' },
      { w: 'the fridge', nl: 'de koelkast' }, { w: 'the stairs', nl: 'de trap' },
      { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the wall socket', nl: 'het stopcontact' },

      // ---- reads: four traps with their own options, one dialect line
      { read: true, nl: 'Het huis wordt volgend jaar verbouwd.', o: ['The house will be renovated next year.', 'The house was renovated last year.', 'Next year the house will be sold.'], a: 0, r: 'passief',
        w: 'wordt + verbouwd is a passive in the present, and volgend jaar points to the future. Last year would be werd verbouwd or is verbouwd.' },
      { read: true, nl: 'Toen ik thuiskwam, had Paola de honden al uitgelaten.', o: ['When I got home, Paola had already walked the dogs.', 'When I got home, Paola walked the dogs.', 'When I get home, Paola will walk the dogs.'], a: 0, r: 'plusq',
        w: 'had + uitgelaten: it was already done before I arrived. Without had it would be a plain past.' },
      { read: true, nl: 'De buurman zei dat hij de honden had gehoord.', o: ['The neighbour said that he had heard the dogs.', 'The neighbour said that the dogs had heard him.', 'The neighbour said that he would hear the dogs.'], a: 0, r: 'indirect',
        w: 'zei dat + had gehoord: he reports what he heard earlier. hij is the one who heard, and de honden is what he heard.' },
      { read: true, nl: 'Noondezju, het regent weer.', en: 'Damn it, it is raining again (mild Maastricht dialect).' },
      { read: true, nl: 'Doe mij maar een stuk kersenvlaai.', en: 'I will have a piece of cherry tart.' },

      // ---- listens: one passive participle, one room, one local bite
      { listen: true, nl: 'verbouwd', en: 'renovated' }, { listen: true, nl: 'de woonkamer', en: 'the living room' },
      { listen: true, nl: 'de kersenvlaai', en: 'the cherry tart' },

      // ---- looks: the dog, the house, the front door
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'kamertje', art: 'het', en: 'the little room', w: 'het kamertje. Every -je word is het, even when the room itself is de kamer.' },
      { dehet: true, nl: 'verdieping', art: 'de', en: 'the floor, the storey', w: 'Words ending in -ing are de: de verdieping, de verbouwing.' },
    ] }]);
})();
