// Nachtrit, Utrecht (tier 5, A2): level 59 Thuis. A narrow house on the Oudegracht, a wharf cellar below, students upstairs.
// New at tier 5 and drilled here: separable verbs split in the present (Ik laat de honden uit), zijn + aan het + infinitive,
// gaan + infinitive, the imperative (Kom binnen, Sta op), and telling the time (half negen, kwart voor zeven).
// Sources: dutch-lessons vault, 04 - Phrases & Scenarios/Thuis met je vrouw, 03 - Verbs/uitlaten,
// 02 - Grammar (scheidbare werkwoorden, aan het + infinitief, futurum - gaan + infinitief, V2 word order),
// _site/grammar/de-imperatief-commands, _site/situations (daily-life, visiting), _site/words (de wekker, de rommel,
// de verwarming, de zus, de moeder, de schat, opstaan, koken), MOC Tijd, dagen & maanden,
// and content/towns.js for Utrecht (de Domtoren, de werf, de kelder, de student, the 12,500-bike garage).
// New rules: gebod (the imperative, vault note de-imperatief-commands) and klok (telling the time, MOC Tijd, dagen & maanden).
// New props: none.
(() => {
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([
    { id: 59, act: 5, name: 'Thuis', town: 'utrecht', place: 'thuis', theme: 'street', ...P,
      intro: 'A narrow house on the Oudegracht. The Dom strikes every quarter of an hour. The dogs want to go out every quarter of an hour.',
      introNl: 'Een smal huis aan de Oudegracht. De Dom slaat elk kwartier. De honden willen elk kwartier naar buiten.',
      mission: {
        where: 'Your house on the Oudegracht, from the wharf cellar up to the attic, and back down because the dogs heard the bell.',
        carry: 'The house keys, two leads and the grammar book, still in its plastic. No helmet. Your bike is somewhere under the station with 12,500 others.',
        want: 'In every room someone asks what you are doing, what you are going to do and what time it is. The students upstairs want the rent split to the cent. Paola, still taller than you, checks where you put the prefix.' },
      items: [
        // ---- builds: separable verbs split in the present, the prefix at the end
        { en: 'Every evening I walk the dogs.', parts: ['Elke avond', FK(['laat', 'uitlaat'], 0, 'sep',
          'uitlaten splits in the present: laat in slot 2, uit at the very end.'), 'ik de honden uit.'] },
        { en: 'The Dom wakes me up every morning.', parts: ['De Dom', FK(['maakt', 'maken', 'maak'], 0, 'sep', 'One Dom, so stem plus t: maakt, and wakker waits at the end.'), 'me elke ochtend wakker.'] },
        { en: 'Every Sunday Paola calls her mother.', parts: ['Elke zondag', FK(['belt Paola', 'Paola belt', 'opbelt Paola'], 0, 'v2',
          'A time in slot 1 pushes Paola behind the verb: belt Paola.'), 'haar moeder', FK(['op', 'opbellen'], 0, 'sep',
          'opbellen splits in the present. Only op goes to the end.'), '.'] },
        { en: 'The neighbours are coming round tonight.', parts: ['De buren', FK(['komen', 'langskomen'], 0, 'sep', 'langskomen splits: komen in slot 2, langs at the end.'), 'vanavond langs.'] },
        // ---- builds: zijn + aan het + infinitive
        { en: 'The dogs are barking again.', parts: ['De honden', FK(['zijn', 'hebben'], 0, 'aanhet', 'aan het always runs on zijn, never on hebben.'), 'weer aan het', FK(['blaffen', 'blaft'], 0, 'aanhet',
          'After aan het comes the whole infinitive: blaffen.'), '.'] },
        { en: 'We are doing the dishes.', parts: ['We zijn aan het', FK(['afwassen', 'afwast', 'af te wassen'], 0, 'aanhet',
          'After aan het the separable verb stays whole as an infinitive: afwassen.'), '.'] },
        { en: 'The students upstairs are having a party.', parts: ['De studenten boven', FK(['zijn', 'is'], 0, 'aanhet',
          'Students are plural, so zijn: zij zijn aan het feesten.'), 'aan het feesten.'] },
        // ---- builds: gaan + infinitive for the future
        { en: 'Tonight we are going to watch a film.', parts: ['Vanavond', FK(['gaan we', 'we gaan'], 0, 'v2', 'Vanavond in slot 1, gaan second, then we.'), 'een film', FK(['kijken', 'kijk', 'te kijken'], 0, 'fut',
          'gaan sends the second verb to the end, whole, no te.'), '.'] },
        { en: 'Tomorrow I am going to tidy the kitchen.', parts: ['Morgen', FK(['ga ik', 'ik ga'], 0, 'v2',
          'Morgen takes slot 1, so the verb jumps in front of ik.'), 'de keuken', FK(['opruimen', 'opruimt', 'op te ruimen'], 0, 'fut', 'After gaan the separable verb goes whole to the end, without te: opruimen.'), '.'] },
        { en: 'What are we going to eat tonight?', parts: ['Wat', FK(['gaan we', 'we gaan'], 0, 'v2',
          'Question word in slot 1, the verb next: gaan we.'), 'vanavond', FK(['eten', 'eet', 'te eten'], 0, 'fut',
          'The real verb closes the sentence as an infinitive: eten.'), '?'] },
        // ---- builds: the imperative
        { en: "Come in, the dogs don't bite.", parts: [FK(['Kom', 'Gekomen', 'Komen'], 0, 'gebod',
          'A command is the bare stem: kom. No ge-, no -en. (Komt belongs to Komt u binnen.)'), 'binnen, de honden bijten niet.'] },
        { en: 'Get up, the dogs need to go out.', parts: [FK(['Sta op', 'Opsta'], 0, 'sep', 'In a command the separable verb still splits: sta op.'), ', de honden moeten uit.'] },
        { en: 'Tidy up your mess, honey.', parts: [FK(['Ruim', 'Ruimt', 'Ruimen'], 0, 'gebod', 'A command is the bare stem: ruim; op still goes to the end.'), 'je rommel', FK(['op', 'opruimen'], 0, 'sep',
          'Only op goes to the end, not the whole verb.'), ', schat.'] },
        // ---- builds: telling the time
        { en: 'At quarter to seven the alarm goes off.', parts: ['Om', FK(['kwart voor zeven', 'kwart over zeven'], 0, 'klok',
          'kwart voor is quarter to, before the hour. kwart over is quarter past.'), FK(['gaat de wekker', 'de wekker gaat'], 0, 'v2',
          'Om kwart voor zeven fills slot 1, so the verb comes before de wekker.'), '.'] },
        { en: 'At half past nine I have the standup.', parts: ['Om', FK(['half tien', 'half negen'], 0, 'klok',
          'Dutch counts towards the next hour: half tien is half way to ten, so 9:30.'), FK(['heb ik', 'ik heb'], 0, 'v2',
          'The time takes slot 1, then the verb, then ik.'), 'de standup.'] },

        // ---- words: rooms, furniture, the routine, the family
        { w: 'the living room', nl: 'de woonkamer' }, { w: 'the kitchen', nl: 'de keuken' }, { w: 'the bedroom', nl: 'de slaapkamer' },
        { w: 'the bathroom', nl: 'de badkamer' }, { w: 'the attic', nl: 'de zolder' }, { w: 'the cellar', nl: 'de kelder' },
        { w: 'the stairs', nl: 'de trap' }, { w: 'the couch', nl: 'de bank' }, { w: 'the cupboard', nl: 'de kast' },
        { w: 'the fridge', nl: 'de koelkast' }, { w: 'the dishwasher', nl: 'de vaatwasser' }, { w: 'the alarm clock', nl: 'de wekker' },
        { w: 'the bed', nl: 'het bed', wrong: 'de bed' }, { w: 'the window', nl: 'het raam', wrong: 'de raam' },
        { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the family (parents and kids)', nl: 'het gezin', wrong: 'de gezin' },
        { w: 'the pet', nl: 'het huisdier', wrong: 'de huisdier' }, { w: 'the sister', nl: 'de zus' },
        { w: 'to get up', nl: 'opstaan' }, { w: 'to tidy up', nl: 'opruimen' },

        // ---- reads: three traps with their own options, three lines from the house
        { read: true, nl: 'Het is half acht.', o: ['It is half past seven.', 'It is half past eight.', 'It is quarter to eight.'], a: 0, r: 'klok',
          w: 'half acht is half way to eight, so 7:30. Dutch counts towards the next hour.' },
        { read: true, nl: 'De honden moeten nog uit.', o: ['The dogs still need to go out.', 'The dogs are still out.', 'The dogs must not go out.'], a: 0, r: 'modal',
          w: 'moeten nog uit: they still have to go out. A modal can drop the verb of motion.' },
        { read: true, nl: 'Ik ben de keuken aan het opruimen.', o: ['I am tidying the kitchen.', 'I have tidied the kitchen.', 'I am going to tidy the kitchen.'], a: 0, r: 'aanhet',
          w: 'zijn + aan het is busy right now. Not done yet, not later.' },
        { read: true, nl: 'Ik laat de honden wel even uit.', en: "I'll walk the dogs." },
        { read: true, nl: 'Kom je bij me zitten?', en: 'Come and sit with me?' },
        { read: true, nl: 'Zal ik thee zetten?', en: 'Shall I make tea?' },

        // ---- listens: two times by ear, two Utrecht words
        { listen: true, nl: 'half negen', en: '8:30' }, { listen: true, nl: 'kwart voor zeven', en: '6:45' },
        { listen: true, nl: 'de Domtoren', en: 'the Dom tower' }, { listen: true, nl: 'de werf', en: 'the wharf' },

        // ---- looks: the dog at the door, the canal below the window
        { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
        { look: true, prop: 'water', nl: 'het water', en: 'the water' },

        // ---- de of het
        { dehet: true, nl: 'gordijn', art: 'het', en: 'the curtain' },
        { dehet: true, nl: 'kussen', art: 'het', en: 'the cushion', w: 'het kussen. Only the plural is de: de kussens.' },
      ] },
  ]);
})();
