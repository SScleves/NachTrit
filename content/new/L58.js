// Nachtrit, Zeeland (tier 4, A2 entry): level 58 De Deltawerken, place 'eigen'.
// Fence: 8 words max, present tense only. New at tier 4: object pronouns (me, hem, haar, ons, ze),
// er is / er zijn, comparatives and superlatives (groter dan, het grootst), adjective -e (incl. een + het-word).
// No separable verbs split, no future with gaan, no perfectum, no sub-clauses.
// Sources: dutch-lessons vault: _site/words (het eiland, het land, het schip, het museum, de vis, het weer, koud, nat),
// _site/grammar/trappen-van-vergelijking-comparison, het-adjectief-de-e-regel-adjectives,
// er-het-kleine-woord-met-veel-banen-the-little-word, _site/words/hem-haar, MOC Lidwoorden & voornaamwoorden,
// 02 - Grammar/de vs het, V2 word order; content/towns.js for Zeeland (de stormvloedkering, de pijler, de schuif,
// het eiland, de zeedijk, eb en vloed, de watersnoodramp, de mossel, Het waait vandaag hard, the 62 doors joke).
// New rules: vergelijk, objpron, eris (each guarded so a sibling file can declare them first).
// New props: none. Only water, deur and brug are used.

(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 58, act: 4, name: 'De Deltawerken', town: 'zeeland', place: 'eigen', theme: 'dyke', ...P,
    intro: 'Zeeland built 62 doors in the sea to keep the water out. The mist came in through the letterbox.',
    introNl: 'Zeeland bouwde 62 deuren in de zee om het water buiten te houden. De mist kwam gewoon door de brievenbus.',
    mission: {
      where: 'The road on top of the storm barrier, nine kilometres of pillars across the Oosterschelde, past Neeltje Jans, and the long way round to Middelburg.',
      carry: 'A bag of mussels, a Zeeuwse bolus for Paola, and no helmet. The wind has opinions about the helmet.',
      want: 'The dead on the sea dyke compare everything: higher, colder, sweeter, the biggest. Then they ask who you can see in the mist. Him, her, them. It is all on a page of the grammar book you never opened.' },
    items: [
      // ---- words
      { w: 'the sea', nl: 'de zee', wrong: 'het zee' },
      { w: 'the storm surge barrier', nl: 'de stormvloedkering' },
      { w: 'the tourist', nl: 'de toerist' },
      { w: 'the feeling', nl: 'het gevoel', wrong: 'de gevoel' },
      { w: 'the island', nl: 'het eiland', wrong: 'de eiland' },
      { w: 'the sea dyke', nl: 'de zeedijk' },
      { w: 'the flood disaster of 1953', nl: 'de watersnoodramp' },
      { w: 'the mussel', nl: 'de mossel' },
      { w: 'the storm', nl: 'de storm' },
      { w: 'the wind', nl: 'de wind' },
      { w: 'the wave', nl: 'de golf' },
      { w: 'the beach', nl: 'het strand', wrong: 'de strand' },
      { w: 'the harbour', nl: 'de haven' },
      { w: 'the ship', nl: 'het schip', wrong: 'de schip' },
      { w: 'the tower', nl: 'de toren' },
      { w: 'the rising tide', nl: 'de vloed' },
      { w: 'low tide', nl: 'de eb' },
      { w: 'the swimming pool', nl: 'het zwembad', wrong: 'de zwembad' },
      { w: 'the museum', nl: 'het museum', wrong: 'de museum' },
      { w: 'the coach', nl: 'de trainer' },
      { w: 'the helmet', nl: 'de helm' },

      // ---- builds: er is / er zijn
      { en: 'There are 62 doors in the sea.', parts: ['Er', FK(['zijn', 'is'], 0, 'er', 'Sixty-two doors is plural, so er zijn.', 'verb'), 'tweeënzestig deuren in de zee.'] },
      { en: 'There is a museum in Ouwerkerk.', parts: ['In Ouwerkerk', FK(['is er', 'er is'], 0, 'v2', 'In Ouwerkerk takes slot 1, so the verb comes next and er follows it.'), 'een museum.'] },
      { en: 'Tonight there is a storm at sea.', parts: ['Vannacht', FK(['is er', 'er is'], 0, 'v2', 'Vannacht takes slot 1, so the verb comes next and er follows it.'), 'een storm op zee.'] },

      // ---- builds: comparing
      { en: 'The sea is bigger than the river.', parts: ['De zee is', FK(['groter', 'groot', 'grootst'], 0, 'vergelijk', 'Two things with dan between them: add -er, groter.'), 'dan de rivier.'] },
      { en: 'The women are still taller than me.', parts: ['De vrouwen zijn nog steeds', FK(['langer', 'lang', 'langst'], 0, 'vergelijk', 'Comparing two with dan: lang plus -er, langer.'), 'dan ik.'] },
      { en: 'The Oosterscheldekering is the biggest.', parts: ['De Oosterscheldekering is', FK(['het grootst', 'het groter', 'het groot'], 0, 'vergelijk', 'With no dan and no noun after it, the top step is het plus -st.'), '.'] },
      { en: 'A Zeeland bolus is sweeter than a stroopwafel.', parts: ['Een Zeeuwse bolus is', FK(['zoeter', 'zoet', 'zoetst'], 0, 'vergelijk', 'Two things with dan between them: zoet plus -er, zoeter.'), 'dan een stroopwafel.'] },
      { en: 'The barrier is stronger than the old dyke.', parts: ['De kering is', FK(['sterker', 'sterk', 'sterkst'], 0, 'vergelijk', 'Comparing two with dan: sterk plus -er, sterker.'), 'dan de',
        FK(['oude', 'oud'], 0, 'adj', 'de dijk, adjective in front of the noun: -e, de oude dijk.'), 'dijk.'] },

      // ---- builds: adjective -e
      { en: 'The tastiest mussels come from Zeeland.', parts: ['De', FK(['lekkerste', 'lekkerst', 'lekker'], 0, 'adj', 'In front of a noun even the top step takes -e: de lekkerste mosselen.'), 'mosselen',
        FK(['komen', 'komt'], 0, 'presens', 'mosselen is plural, so komen.'), 'uit Zeeland.'] },
      { en: 'Neeltje Jans is a big island.', parts: ['Neeltje Jans is een', FK(['groot', 'grote'], 0, 'adj', 'een plus a het-word is the one cell without -e: een groot eiland.'), 'eiland.'] },

      // ---- builds: object pronouns
      { en: "Someone is knocking. I can't see him.", parts: ['Er klopt iemand. Ik zie', FK(['hem', 'hij', 'zijn'], 0, 'obj', 'He gets seen, he does not do the seeing: hem.'), 'niet.'] },
      { en: "In the mist I can't see her.", parts: ['In de mist', FK(['zie ik', 'ik zie'], 0, 'v2', 'In de mist takes slot 1, so the verb comes second, then ik.'), 'haar niet.'] },
      { en: "The dogs are gone. I'm looking for them.", parts: ['De honden zijn weg. Ik zoek', FK(['ze', 'zij'], 0, 'obj', 'After the verb, them is ze. zij is only the one doing it.'), '.'] },
      { en: 'Sir, can you help us?', parts: ['Meneer, kunt u', FK(['ons', 'wij', 'onze'], 0, 'obj', 'We get the help, so ons. wij does things, onze goes before a noun.'), 'helpen?'] },
      { en: 'Paola calls me. Where are you?', parts: ['Paola belt', FK(['me', 'ik', 'mijn'], 0, 'obj', 'Paola does the calling, I get called: me.'), '. Waar ben je?'] },

      // ---- reading
      { read: true, nl: 'Het waait vandaag hard.', en: 'It is blowing hard today.' },
      { read: true, nl: 'De kering is dicht.', o: ['The barrier is closed.', 'The barrier is close by.', 'The barrier is broken.'], a: 0, r: 'woord', w: 'dicht means shut. Close by is dichtbij, broken is kapot.' },
      { read: true, nl: 'De golven zijn hoog.', o: ['The waves are high.', 'The golfers are high.', 'The gulls are high.'], a: 0, r: 'woord', w: 'de golf is a wave, de golven the waves. The sport is het golf. Gulls are meeuwen.' },
      { read: true, nl: 'Het is eb.', o: ['The tide is out.', 'It is evening.', 'It is over.'], a: 0, r: 'woord', w: 'eb is low tide, vloed is the rising tide. Evening is de avond.' },
      { read: true, nl: 'Er is geen gevaar.', en: 'There is no danger.' },
      { read: true, nl: 'Mosselen zijn hier het lekkerst.', en: 'Mussels taste best here.' },

      // ---- listening
      { listen: true, nl: 'eb en vloed', en: 'low and high tide' },
      { listen: true, nl: 'tweeënzestig deuren', en: '62 doors' },
      { listen: true, nl: 'de Zeeuwse bolus', en: 'the Zeeland bolus' },

      // ---- look
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
      { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },

      // ---- de of het
      { dehet: true, nl: 'land', art: 'het', en: 'the land' },
      { dehet: true, nl: 'rivier', art: 'de', en: 'the river' },
    ] }]);
})();
