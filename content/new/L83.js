// Nachtrit, Urk (tier 8, B1): level 83 Thuis. A narrow brick fisherman's house in a back alley of old Urk, tiled roof,
// the white lighthouse and the harbour at the end of the lane, the IJsselmeer behind. Rooms, furniture, the family,
// the daily routine, the dogs, the wife, all told in sub-clauses: why, when, while, before.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and
// voordat (single verbs, hebben plus participle, modal plus infinitive); want keeps V2; the main clause after a
// sub-clause starts with its verb. Review: reflexive verbs, comparatives, the imperfectum by 't kofschip, perfectum
// with zijn and a 't kofschip participle, V2 after a time word.
// Still inside the fence: 14 words max, no relative clauses, no te plus infinitive, no passive, no separable verbs
// inside a sub-clause (that is tier 10).
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, reflexieve werkwoorden,
// 't kofschip, zijn of hebben; _site/maps/MOC Voegwoorden (omdat, als, dat, toen, terwijl); 04 - Phrases & Scenarios/
// Thuis met je vrouw (Ik laat de honden wel even uit, Ik ruim de vaatwasser wel in); _site/words (ik blijf thuis omdat
// het regent, toen ik gisteren thuis was, de buurman, de zus); content/towns.js for Urk (de kotter, de klederdracht,
// de kraplap, de zondagsrust, de vuurtoren, de visafslag, Op zondag vaart hier niemand uit, Oe got ut, the Sunday joke).
// Replay: de woonkamer, het ontbijt, de hondenmand and het gordijn from the earlier thuis levels (L67, L75).
// New rules: none (bijzin, v2, refl, kof, vergelijk are in data.js or guarded elsewhere).
// New props: none. Only hond, huis and kerk are used (not water or deur: they are not in the word pool).
(() => {
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 83, act: 8, name: 'Thuis', town: 'urk', place: 'thuis', theme: 'street', ...P,
    intro: 'On Urk the families are bigger than the houses, so the dead queue in the hallway in their Sunday clothes, and nobody moves.',
    introNl: 'Op Urk zijn de gezinnen groter dan de huizen, dus de doden staan in de rij in de gang, in hun zondagse kleren, en niemand beweegt.',
    mission: {
      where: 'A narrow brick fisherman\'s house in a back alley of old Urk, tiled roof, the white lighthouse and the harbour at the end of the lane. From the cellar stairs up to the attic and out again, because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the house keys, a plate of herring split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The wind off the IJsselmeer does not care about that either.',
      want: 'Since the mist everyone who spoke Dutch has changed, and on Urk they changed into churchgoers. They fill every room and explain themselves in sub-clauses: omdat, als, toen, terwijl, voordat. The verb goes to the very end, and the main clause after it starts with its verb. The women are still taller than you, and on Sunday nothing moves, not even the dead.' },
    items: [
      // ---- builds: sub-clauses with the verb at the end, then the main clause that starts with its verb
      { en: 'I am tired because the dogs did not sleep last night.', parts: ['Ik ben moe', FK(['omdat de honden vannacht niet sliepen', 'omdat de honden sliepen vannacht niet', 'omdat sliepen de honden vannacht niet'], 0, 'bijzin',
        'omdat sends the verb to the very end: niet sliepen, not sliepen niet.'), '.'] },
      { en: 'We are staying home because the mist is too thick.', parts: ['We blijven thuis', FK(['omdat de mist is te dik', 'omdat is de mist te dik', 'omdat de mist te dik is'], 2, 'bijzin',
        'omdat sends is to the end of its clause: te dik is.'), '.'] },
      { en: 'I am not taking the bike, because it is blowing too hard.', parts: ['Ik neem de fiets niet,', FK(['want het te hard waait', 'want het waait te hard', 'want waait het te hard'], 1, 'bijzin',
        'want keeps normal word order: want het waait. Words like omdat, dat and als send the verb to the end, but want does not.'), '.'] },
      { en: 'I think the dogs are hungry again.', parts: ['Ik denk', FK(['dat hebben de honden weer honger', 'dat de honden weer honger hebben', 'dat de honden hebben weer honger'], 1, 'bijzin',
        'dat sends hebben to the end: weer honger hebben.'), '.'] },
      { en: 'When it is Sunday, everybody goes to church.', parts: [FK(['Als het zondag is,', 'Als is het zondag,', 'Als het is zondag,'], 0, 'bijzin',
        'als sends is to the end of its clause.'), FK(['gaat iedereen', 'iedereen gaat'], 0, 'v2',
        'The sub-clause fills slot 1, so the main clause starts with its verb: gaat iedereen.'), 'naar de kerk.'] },
      { en: 'When I was home yesterday, Paola was already asleep.', parts: [FK(['Toen ik gisteren was thuis,', 'Toen ik gisteren thuis was,'], 1, 'bijzin',
        'toen sends was to the end: thuis was.'), FK(['Paola sliep al', 'sliep Paola al'], 1, 'v2',
        'After a sub-clause the verb comes first in the main clause: sliep Paola al.'), '.'] },
      { en: 'While Paola cooks, I tidy up the kitchen.', parts: [FK(['Terwijl Paola kookt,', 'Terwijl kookt Paola,', 'Terwijl Paola koken,'], 0, 'bijzin',
        'terwijl works like omdat: the verb goes last, and with one person it ends in -t.'), FK(['ik ruim', 'ruim ik'], 1, 'v2',
        'The sub-clause is slot 1, so the verb comes next: ruim ik de keuken op.'), 'de keuken op.'] },
      { en: 'Before I go to bed, I let the dogs out once more.', parts: [FK(['Voordat ga ik naar bed,', 'Voordat ik naar bed ga,'], 1, 'bijzin',
        'voordat sends ga to the end: naar bed ga.'), FK(['laat ik', 'ik laat'], 0, 'v2',
        'The sub-clause is slot 1, so the verb comes next: laat ik.'), 'de honden nog even uit.'] },
      { en: 'Paola is angry because I have not done the dishes.', parts: ['Paola is boos', FK(['omdat ik heb de afwas niet gedaan', 'omdat heb ik de afwas niet gedaan', 'omdat ik de afwas niet heb gedaan'], 2, 'bijzin',
        'omdat sends both verbs to the end, after niet: niet heb gedaan.'), '.'] },
      { en: 'I stay awake because I still have to feed the dogs.', parts: ['Ik blijf wakker', FK(['omdat ik de honden nog moet voeren', 'omdat ik moet de honden nog voeren', 'omdat moet ik de honden nog voeren'], 0, 'bijzin',
        'The modal and its infinitive both go to the end: moet voeren.'), '.'] },
      { en: 'On Sunday nothing moves, because everybody is in church.', parts: ['Op zondag beweegt er niets,', FK(['omdat zit iedereen in de kerk', 'omdat iedereen in de kerk zit'], 1, 'bijzin',
        'omdat sends zit to the end: in de kerk zit.'), '.'] },
      { en: 'Paola says that the grammar book is still closed.', parts: ['Paola zegt', FK(['dat het grammaticaboek nog dicht is', 'dat het grammaticaboek is nog dicht', 'dat is het grammaticaboek nog dicht'], 0, 'bijzin',
        'dat sends is to the end: nog dicht is.'), '.'] },
      { en: 'When I pick up the lead, the dogs jump up.', parts: [FK(['Als ik pak de riem,', 'Als pak ik de riem,', 'Als ik de riem pak,'], 2, 'bijzin',
        'als sends pak to the end of its clause.'), FK(['de honden springen op', 'springen de honden op'], 1, 'v2',
        'The sub-clause is slot 1, so the verb comes next: springen de honden op.'), '.'] },
      { en: 'I say nothing because Paola is still taller.', parts: ['Ik zeg niets', FK(['omdat Paola nog steeds langer is', 'omdat Paola nog steeds is langer', 'omdat is Paola nog steeds langer'], 0, 'bijzin',
        'omdat sends is to the end: nog steeds langer is.'), '.'] },
      { en: 'When the waiter brought the bill, we split everything to the cent.', parts: [FK(['Toen de ober bracht de rekening,', 'Toen de ober de rekening bracht,'], 1, 'bijzin',
        'toen sends bracht to the end of its clause: de rekening bracht.'), FK(['hebben we', 'we hebben'], 0, 'v2',
        'After a sub-clause the verb comes first: hebben we.'), 'alles tot op de cent gesplitst.'] },
      { en: 'The dogs get bored when they are home alone.', parts: ['De honden', FK(['vervelen zich', 'zich vervelen', 'verveelt zich'], 0, 'refl',
        'Two dogs, so vervelen, and in a main clause zich comes right after the verb: vervelen zich.'), FK(['als ze zijn alleen thuis', 'als ze alleen thuis zijn'], 1, 'bijzin',
        'als sends zijn to the end.'), '.'] },
      { en: 'The families on Urk are bigger than the houses.', parts: ['De gezinnen op Urk zijn', FK(['groter', 'groot', 'grotere'], 0, 'vergelijk',
        'Compare two things with -er and dan: groter dan.'), 'dan de huizen.'] },
      { en: 'The neighbour used to work on a cutter.', parts: ['De buurman', FK(['werkte', 'werkde', 'werkten'], 0, 'kof',
        'werk ends in k, a ketchup letter: werkte with a t. One person, so no -n.'), 'vroeger op een kotter.'] },
      { en: 'Yesterday I cycled to the harbour without a helmet.', parts: ['Gisteren', FK(['ik ben', 'ben ik'], 1, 'v2',
        'Gisteren takes slot 1, so the verb comes second. Cycling to a place takes zijn: ben ik.'), 'zonder helm naar de haven', FK(['gefietsd', 'gefietst'], 1, 'kof',
        'fiets ends in s, a ketchup letter: ge + fiets + t, gefietst.'), '.'] },

      // ---- words: rooms, furniture, the house, the family, Urk
      { w: 'the living room', nl: 'de woonkamer' }, { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' },
      { w: 'the dog basket', nl: 'de hondenmand' }, { w: 'the curtain', nl: 'het gordijn' },
      { w: 'the chimney', nl: 'de schoorsteen' }, { w: 'the heating stove', nl: 'de kachel' }, { w: 'the roof', nl: 'het dak', wrong: 'de dak' },
      { w: 'the cooker', nl: 'het fornuis', wrong: 'de fornuis' }, { w: 'the towel', nl: 'de handdoek' },
      { w: 'the bed sheet', nl: 'het laken', wrong: 'de laken' }, { w: 'the coat rack', nl: 'de kapstok' },
      { w: 'the carpet', nl: 'het tapijt' }, { w: 'the toothbrush', nl: 'de tandenborstel' },
      { w: 'the grandfather', nl: 'de opa' }, { w: 'the brother-in-law', nl: 'de zwager' }, { w: 'the aunt', nl: 'de tante' },
      { w: 'the traditional dress', nl: 'de klederdracht' }, { w: 'the fishing cutter', nl: 'de kotter' },

      // ---- reads: three traps with their own options, two plain
      { read: true, nl: 'Als de kotters binnen zijn, is het stil in de haven.', o: ['When the cutters are in, it is quiet in the harbour.', 'The cutters are in because it is quiet in the harbour.', 'If the harbour is quiet, the cutters come in.'], a: 0, r: 'bijzin',
        w: 'als means when here: the cutters are in first, then the quiet. The verb zijn sits at the end of the als-clause.' },
      { read: true, nl: 'Voordat Paola thuis is, ruimen we de rommel op.', o: ['Before Paola gets home, we clear up the mess.', 'After Paola got home, we cleared up the mess.', 'Paola comes home because we clear up the mess.'], a: 0, r: 'bijzin',
        w: 'voordat is before. After would be nadat, and because would be omdat.' },
      { read: true, nl: 'Terwijl de buurvrouw praat, kijkt Paola op haar telefoon.', o: ['While the neighbour talks, Paola looks at her phone.', 'Because the neighbour talks, Paola looks at her phone.', 'After the neighbour talks, Paola looks at her phone.'], a: 0, r: 'bijzin',
        w: 'terwijl is while: both things happen at the same time. Because would be omdat.' },
      { read: true, nl: 'Op zondag vaart hier niemand uit.', en: 'On Sunday nobody sails out here.' },
      { read: true, nl: 'Oe got ut?', en: 'How are you? (Urker dialect, no h; in Dutch: Hoe gaat het?)' },

      // ---- listens: three words from the house and the island
      { listen: true, nl: 'de zondagsrust', en: 'the Sunday rest' }, { listen: true, nl: 'de visafslag', en: 'the fish auction' },
      { listen: true, nl: 'de vuurtoren', en: 'the lighthouse' },

      // ---- looks: the dog, the house, the church
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'huis', nl: 'het huis', en: 'the house' },
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },

      // ---- de of het
      { dehet: true, nl: 'bad', art: 'het', en: 'the bath', w: 'het bad. The plural is de baden, because every plural takes de.' },
      { dehet: true, nl: 'visje', art: 'het', en: 'the little fish', w: 'Every -je word is het: het visje, het hondje.' },
    ] }]);
})();
