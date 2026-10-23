// Nachtrit, Rotterdam (tier 7, A2 to B1): level 77 Eten en drinken. Under the giant fruit of the Markthal at Blaak,
// the yellow cube houses next door, a café on the quay where the water taxi stops, the Erasmusbrug over the Maas,
// the kapsalon and the bakkie pleur. Ordering, the plates, the bill, splitting it, and everything told back in the past.
// New at tier 7 and drilled here: the imperfectum of regular verbs by 't kofschip (werkte, haalde, opende, verveelde)
// and of the common irregulars (was/waren, had/hadden, ging/gingen, kwam, sprak, liep, kocht, at/aten), reflexives
// in the past (zich vergissen, zich vervelen), zou plus infinitive for polite requests (Zou ik ... mogen zien,
// Wat zou u ons aanraden), comparatives and superlatives (duurder dan, de lekkerste, liever, beter, het beste).
// Review: V2 after a time word, the perfectum with zijn (gegaan), modal plus bare infinitive (kunnen splitsen),
// separable verbs (ophalen), geen against niet, de against het.
// Still inside the fence: 12 words max, no sub-clause with the verb at the end (no omdat, dat, als clauses), no relative
// clauses, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/imperfectum, reflexieve werkwoorden, 't kofschip, V2 word order,
// scheidbare werkwoorden, de vs het; 03 - Verbs/zullen (zou, zouden: the politeness engine); _site/situations/restaurant
// (Mag ik de kaart zien, Wat kunt u aanraden, Is alles naar wens, Kunnen we apart betalen), pub (Doe mij maar een biertje),
// takeaway (Ik haal het over twintig minuten op); 04 - Phrases & Scenarios/Borrel met vrienden (Zullen we het even splitten);
// _site/words (het café, het restaurant, de taart, de vis, inschenken); content/towns.js for Rotterdam (de markthal,
// de kubuswoningen, de watertaxi, een bakkie pleur, Niet lullen maar poetsen, the Erasmusbrug, the Euromast).
// New rules: zou (note: zullen). vergr is guarded below in case levels 52, 57 and 76 are not loaded.
// New props: none. Only water, brug and deur are used, and none of them is in the word pool of this level.
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou + infinitive: polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[7];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 77, act: 7, name: 'Eten en drinken', town: 'rotterdam', place: 'eten', theme: 'square', ...P,
    intro: 'The Markthal has a hundred stalls and the dead still order a kapsalon. The mist changed everything except the order.',
    introNl: 'De Markthal heeft honderd kramen en de doden bestellen toch weer een kapsalon. De mist heeft alles veranderd, behalve de bestelling.',
    mission: {
      where: 'Under the giant painted fruit of the Markthal at Blaak, past the yellow cube houses and along the quay to a café where the water taxi stops. The Erasmusbrug glows blue over the Maas and the Euromast stands alone in the dark.',
      carry: 'A tray with a bakkie pleur and a kapsalon going cold, two dogs who can smell the market from the bridge, and the grammar book, never opened. No helmet. The trams do not slow down for a kapsalon.',
      want: 'Since the mist the dead are regulars, and they want your order told back in the past tense: was, had, ging, kwam, aten, and zou for everything polite. Nobody here talks, niet lullen maar poetsen (stop talking, start working), so answer fast. The women at the table are still taller than you, the dogs still need a walk, and the bill is still split to the cent.' },
    items: [
      // ---- builds: the imperfectum, regular and irregular
      { en: 'Last night we ate a kapsalon in the Markthal.', parts: ['Gisteravond', FK(['aten we', 'eten we', 'we aten'], 0, 'imp',
        'Gisteravond is past and fills slot 1, so the verb comes second and in the past: aten we. eten we is the present tense.'), 'een kapsalon in de Markthal.'] },
      { en: 'The chef worked in the kitchen all night.', parts: ['De kok', FK(['werkte', 'werkde', 'werkten'], 0, 'kof',
        'werk ends in k, a soft ketchup letter: werkte with a t. werkten is for more than one chef.'), 'de hele nacht in de keuken.'] },
      { en: 'The Markthal opened in 2014. Then the tourists came.', parts: ['In 2014', FK(['opende', 'opente', 'opend'], 0, 'imp',
        'open ends in n, no ketchup letter: opende with a d.'), 'de Markthal. Daarna kwamen de toeristen.'] },
      { en: 'The terrace was full and we went inside.', parts: ['Het terras', FK(['was', 'waren'], 0, 'imp',
        'One terrace, so was. waren is for more than one.'), 'vol en we', FK(['gingen', 'ging'], 0, 'imp',
        'gaan is irregular: ging for one, gingen for more. We is more than one.'), 'naar binnen.'] },
      { en: 'We had no reservation, but the waiter still had a table.', parts: ['We', FK(['hadden', 'had'], 0, 'imp',
        'hebben is irregular: had for one, hadden for more. We is more than one.'), FK(['geen', 'niet'], 0, 'neg',
        'reservering has no article, so geen takes its place: geen reservering. niet does not go in front of a bare noun.'), 'reservering, maar de ober had nog een tafel.'] },
      { en: 'The waitress came with the menu and spoke only Dutch.', parts: ['De serveerster', FK(['kwam', 'komde', 'kwamen'], 0, 'imp',
        'komen is irregular: kwam for one person. komde does not exist.'), 'met de kaart en', FK(['sprak', 'spreekte', 'sprekte'], 0, 'imp',
        'spreken is irregular: sprak, the e turns into an a.'), 'alleen Nederlands.'] },
      { en: 'I walked to the market and bought a herring.', parts: ['Ik', FK(['liep', 'loopte', 'liepte'], 0, 'imp',
        'lopen is irregular: liep. It takes no -te or -de.'), 'naar de markt en', FK(['kocht', 'kochte', 'koopte'], 0, 'imp',
        'kopen is irregular: kocht, the stem changes. kochte and koopte do not exist.'), 'een haring.'] },

      // ---- builds: reflexives in the past
      { en: 'Sorry, I made a mistake. This is not my bill.', parts: ['Sorry, ik vergiste', FK(['me', 'zich'], 0, 'refl',
        'The self word matches the subject: ik goes with me. zich is for hij, zij, het and the plural they.'), '. Dit is niet mijn rekening.'] },
      { en: 'The dogs were bored under the table.', parts: ['De honden', FK(['verveelden', 'verveelde'], 0, 'imp',
        'verveel ends in l, no ketchup letter: verveelden, and two dogs take -den.'), FK(['zich', 'zij'], 0, 'refl',
        'A reflexive verb needs its self word: zich for the dogs. zij is a subject word and cannot stand after the verb.'), 'onder de tafel.'] },

      // ---- builds: zou plus infinitive
      { en: 'May I see the menu, please?', parts: [FK(['Zou', 'Zouden', 'Zoud'], 0, 'zou',
        'Zou is the polite form of zullen for one person: Zou ik. Zouden is for more than one.'), 'ik de menukaart mogen', FK(['zien', 'te zien'], 0, 'modal',
        'mogen sends a bare infinitive to the end: zien, with no te.'), ', alstublieft?'] },
      { en: 'What would you recommend to us?', parts: ['Wat', FK(['zou', 'zouden'], 0, 'zou',
        'u is one person and takes the singular: zou u. zouden is for more than one.'), 'u ons', FK(['aanraden', 'aan raden', 'raden aan'], 0, 'sep',
        'aanraden stays in one piece when it is the infinitive at the end.'), '?'] },

      // ---- builds: comparatives and superlatives
      { en: 'The food in the Markthal is more expensive than at the snack bar.', parts: ['Het eten in de Markthal is', FK(['duurder', 'duurdere', 'meer duur'], 0, 'vergelijk',
        'duur ends in r, so the -er becomes -der: duurder. duurdere is the form in front of a noun.'), 'dan bij de snackbar.'] },
      { en: 'This is the tastiest croquette in all of Rotterdam.', parts: ['Dit is', FK(['de', 'het'], 0, 'dehet',
        'kroket is a de-word, so de.'), FK(['lekkerste', 'lekkerst', 'lekkerder'], 0, 'vergelijk',
        'The superlative before a noun is -ste: de lekkerste. lekkerder means tastier than something.'), 'kroket van heel Rotterdam.'] },
      { en: 'Paola would rather drink a bakkie pleur than tea.', parts: ['Paola drinkt', FK(['liever', 'graager', 'beter'], 0, 'vergelijk',
        'The comparative of graag is liever. graager does not exist, and beter would mean better.'), 'een bakkie pleur dan thee.'] },
      { en: 'The soup was better yesterday than today.', parts: ['De soep', FK(['was', 'is'], 0, 'imp',
        'gisteren is past, so the verb is past too: was.'), 'gisteren', FK(['beter', 'goeder', 'gooder'], 0, 'vergelijk',
        'goed has its own comparative: goed, beter, best. goeder does not exist.'), 'dan vandaag.'] },

      // ---- builds: review of the earlier tiers
      { en: 'After dinner we went home by water taxi.', parts: ['Na het eten', FK(['zijn we', 'we zijn'], 0, 'v2',
        'Na het eten fills slot 1, so the verb comes second, then we.'), 'met de watertaxi naar huis', FK(['gegaan', 'gegaat', 'gegaand'], 0, 'perf',
        'gaan has its own participle: gegaan, and it takes zijn.'), '.'] },
      { en: 'Can we split the bill?', parts: ['Kunnen we de rekening', FK(['splitsen', 'gesplitst', 'te splitsen'], 0, 'modal',
        'kunnen sends a bare infinitive to the end: splitsen. No ge, no te.'), '?'] },
      { en: 'I picked up the kapsalon at seven o\'clock.', parts: ['Ik', FK(['haalde', 'haalte'], 0, 'imp',
        'haal ends in l, no ketchup letter: haalde with a d.'), 'de kapsalon om zeven uur', FK(['op', 'opgehaald'], 0, 'sep',
        'ophalen splits: haalde stays in slot 2 and op goes to the end.'), '.'] },

      // ---- words: the table, the menu, the bill, Rotterdam on a plate
      { w: 'the kapsalon', nl: 'de kapsalon' }, { w: 'the market hall', nl: 'de markthal' }, { w: 'the water taxi', nl: 'de watertaxi' },
      { w: 'a cup of coffee (Rotterdam slang)', nl: 'een bakkie pleur' },
      { w: 'the café', nl: 'het café', wrong: 'de café' }, { w: 'the sandwich', nl: 'het broodje', wrong: 'de broodje' },
      { w: 'the soup', nl: 'de soep' }, { w: 'the salt', nl: 'het zout', wrong: 'de zout' }, { w: 'the plate', nl: 'het bord', wrong: 'de bord' },
      { w: 'the fork', nl: 'de vork' }, { w: 'the reservation', nl: 'de reservering' },
      { w: 'the portion of fries', nl: 'het patatje', wrong: 'de patatje' }, { w: 'the meat', nl: 'het vlees' },
      { w: 'the herring', nl: 'de haring' }, { w: 'the bill', nl: 'de rekening' }, { w: 'the dessert', nl: 'het toetje' },
      { w: 'the tip', nl: 'de fooi' }, { w: 'the dinner', nl: 'het avondeten' },
      { w: 'the fruit', nl: 'het fruit', wrong: 'de fruit' }, { w: 'the price', nl: 'de prijs' }, { w: 'tasty', nl: 'lekker' }, { w: 'to split', nl: 'splitsen' },

      // ---- reads: three traps with their own options, three straight from the table
      { read: true, nl: 'Het eten was koud, maar de bediening was vriendelijk.', o: ['The food was cold, but the service was friendly.', 'The food is cold, but the service was friendly.', 'The food was cold because the service was friendly.'], a: 0, r: 'imp',
        w: 'was is the past, and maar means but. Both halves are already over.' },
      { read: true, nl: 'Ik zou graag een tafel voor twee reserveren.', o: ['I would like to reserve a table for two.', 'I reserved a table for two.', 'I have to reserve a table for two.'], a: 0, r: 'zou',
        w: 'zou plus the infinitive at the end is the polite want. A finished booking would be heb gereserveerd.' },
      { read: true, nl: 'Dit is de beste kapsalon van Rotterdam.', o: ['This is the best kapsalon in Rotterdam.', 'This is better than the kapsalon in Rotterdam.', 'This is the biggest kapsalon in Rotterdam.'], a: 0, r: 'vergelijk',
        w: 'de beste is the superlative: the best of them all. Better than would be beter dan.' },
      { read: true, nl: 'Doe mij maar een bakkie pleur.', en: "I'll just have a coffee." },
      { read: true, nl: 'Zullen we de rekening even splitten?', en: 'Shall we just split the bill?' },
      { read: true, nl: 'Is alles naar wens?', en: 'Is everything to your liking?' },

      // ---- listens: a past tense and a price by ear, one landmark
      { listen: true, nl: 'bestelde', en: 'ordered' }, { listen: true, nl: 'de kubuswoningen', en: 'the cube houses' },
      { listen: true, nl: 'twaalf euro vijftig', en: '€ 12,50' },

      // ---- looks: the Maas, the Erasmusbrug, the door of the café
      { look: true, prop: 'water', nl: 'het water', en: 'the water' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'ontbijt', art: 'het', en: 'the breakfast' },
      { dehet: true, nl: 'kopje', art: 'het', en: 'the little cup', w: 'het kopje. Every -je word is het, even for de kop.' },
    ] }]);
})();
