// Nachtrit, Amsterdam (tier 13, B1 to B2): level 130 De grachten, the town's own place and the finale. The canal ring at the end
// of the night: the Herengracht, the Keizersgracht (the widest) and the Prinsengracht under the Westertoren (85 metres, the blue
// imperial crown of Maximilian), dug from 1612 and a world heritage site since 2010; the Amstel and the Magere Brug (rebuilt in
// 1934, outlined in small lights); houses that lean forward on purpose, houseboats at the quay, and the first grey of dawn.
// This level ends the game: when it is delivered the bells ring, the language comes home and the dead turn back into people,
// who still split the bill, now in Dutch.
// Drilled here: everything, as the last review of the whole ride. Long builds with three forks (up to 18 words) that each mix
// two or three tiers: the passive with worden and zijn, the present with sinds, the superlative, numbers in words, hoog against
// lang, the irregular participles gegraven and geworden, her- without ge, laten in the perfect, V2 after every kind of opening,
// sub-clauses with the verb last, the imperfectum (vertrok, luidden, moesten), compounds with their linking s, directions along
// the canals, the formal letter, idioms (Eind goed, al goed; Amsterdam is ook niet in één dag gebouwd), particles, de and het,
// in het Nederlands with its article, waar as a relative, om ... te with a separable verb, and the last word of the game,
// which is the first one: de hond.
// Sources: everything the earlier levels used, plus content/towns.js for Amsterdam (de Westertoren, de Magere Brug, de
// grachtengordel, de gracht, het grachtenpand, de hijsbalk, de woonboot, de fietsbel, Mokum, the drunk German rumour) and
// STORY.md for the premise and the ending (the language left because the Dutch always switched to English; Amsterdam is the
// last town; when it is saved the language comes home). Level 1 for the callback: De honden moeten uit. Facts checked
// October 2026: UNESCO 2010, Westertoren 85 m with Maximilian's crown, Magere Brug rebuilt 1934, about 2,500 houseboats.
// New rules: weg (guarded, the same text in every Amsterdam file); samen, formeel and idioom keep the Nijmegen text. passief,
// meervoud, indirect, obj, gebod, bezit, plusq, omte and vergelijk are guarded copies of the existing definitions.
// New props: none. Only hond, boom and lamp are used (not brug or water: de Magere Brug and the canals are in the word pool).
(() => {
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons, jullie, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was + participle', note: 'perfectum' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 130, act: 13, name: 'De grachten', town: 'amsterdam', place: 'eigen', theme: 'street', ...P,
    intro: 'This is the last canal. Deliver the last words right and at dawn the language comes home. The first thing it hears will be somebody switching to English. Ride anyway.',
    introNl: 'Dit is de laatste gracht. Lever de laatste woorden goed af en bij zonsopgang komt de taal thuis. Het eerste wat hij hoort, is iemand die op Engels overschakelt. Fiets toch maar.',
    mission: {
      where: 'The canal ring at the end of the night: the Herengracht, the Keizersgracht, the widest, and the Prinsengracht under the Westertoren with its blue crown, dug from 1612 and a world heritage site since 2010. Then the Amstel and the Magere Brug, outlined in small lights. Tall narrow houses lean forward on purpose, houseboats sleep at the quay, and behind the roofs in the east the sky is starting to turn grey.',
      carry: 'Everything from the whole ride: two dogs who still need a walk, gladioli from Nijmegen, a vlaai from Maastricht, the one-cent Tikkie from Alblasserdam, still open, the bills of thirteen towns split to the cent, and the grammar book, still never opened. You never needed it. No helmet, to the very end.',
      want: 'Since the mist everyone who spoke Dutch has changed, and the language left because nobody let it speak. Tonight the dead of the canals ask for everything you learned on the way: de and het, the verb at the end, the small words, the passive, the formal letter and the local word, the prices and the way to the Westertoren, in one long ride. Paola is waiting at the Magere Brug, still taller than you. When the bells ring at dawn the dead turn back into people. They will still split the bill, but now in Dutch.' },
    items: [
      // ---- builds: the canal ring, what it is
      { en: 'The canal ring was dug from 1612 and has been a world heritage site since 2010.', parts: ['De grachtengordel', FK(['werd', 'wordt'], 0, 'passief',
        'Digging from 1612 is the past, so werd: werd gegraven.'), 'vanaf 1612', FK(['gegraven', 'gegraafd', 'gegroeven'], 0, 'perf',
        'graven is irregular: groef, gegraven.'), 'en', FK(['staat', 'stond'], 0, 'al',
        'It is still on the list, so the present with sinds: staat sinds 2010.'), 'sinds 2010 op de Werelderfgoedlijst.'] },
      { en: 'Of the three main canals the Keizersgracht is the widest.', parts: ['Van de drie grote grachten', FK(['is de Keizersgracht', 'de Keizersgracht is'], 0, 'v2',
        'The opening phrase fills slot 1, so the verb comes second.'), FK(['het breedst', 'de breedst'], 0, 'vergelijk',
        'After is, without a noun, the superlative goes with het: het breedst. With de it would need -e and a noun.'), '.'] },
      { en: 'The Westertoren is eighty-five metres tall and carries the blue crown of Maximilian.', parts: ['De Westertoren is', FK(['vijfentachtig', 'achtenvijftig', 'vijfachttig'], 0, 'getal',
        'Units first, then en, then the tens: vijfentachtig is 85. achtenvijftig is 58.'), 'meter', FK(['hoog', 'lang'], 0, 'woord',
        'A tower is hoog. lang is for people and for long things lying down.'), 'en draagt de', FK(['blauwe', 'blauw'], 0, 'adj',
        'kroon is a de-word, so the adjective takes -e: de blauwe kroon.'), 'keizerskroon van Maximiliaan.'] },
      { en: 'The Magere Brug was rebuilt in 1934, and at night it is lit by hundreds of small lamps.', parts: ['De Magere Brug werd in 1934', FK(['herbouwd', 'geherbouwd', 'herbouwt'], 0, 'perf',
        'Verbs that start with her- take no ge: herbouwd.'), ", en 's nachts", FK(['wordt hij', 'hij wordt'], 0, 'v2',
        "'s nachts fills slot 1 of the second clause, so the verb comes next: wordt hij."), 'verlicht door', FK(['honderden', 'honderd'], 0, 'getal',
        'Hundreds is honderden. honderd is exactly one hundred.'), 'lampjes.'] },
      { en: 'About two and a half thousand houseboats lie in the canals.', parts: ['In de grachten', FK(['liggen', 'leggen'], 0, 'woord',
        'Boats liggen at the quay. leggen is putting something down.'), 'ongeveer tweeduizendvijfhonderd', FK(['woonboten', 'woonbooten', 'woonboots'], 0, 'meervoud',
        'de boot becomes boten: the syllable is open, so one o is enough.'), '.'] },

      // ---- builds: why the language left, and how it comes home
      { en: 'Every time I tried, the Dutch switched to English, so the language left.', parts: ['Elke keer', FK(['als ik het probeerde', 'als ik probeerde het'], 0, 'bijzin',
        'als sends the verb to the end of its clause: als ik het probeerde.'), ',', FK(['schakelden de Nederlanders', 'de Nederlanders schakelden'], 0, 'v2',
        'The time clause fills slot 1, so the main clause starts with its verb.'), 'over op Engels,', FK(['dus de taal vertrok', 'dus de taal vertrekte'], 0, 'imp',
        'vertrekken is irregular: vertrok. And dus keeps the verb in second place.'), '.'] },
      { en: 'The language said that nobody had let it speak for years.', parts: ['De taal zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement.'), 'niemand', FK(['hem', 'zich'], 0, 'obj',
        'de taal is a de-word, so it is hem. zich would point back at niemand.'), 'jarenlang', FK(['had laten praten', 'had gelaten praten'], 0, 'perf',
        'laten plus another verb keeps both infinitives in the perfect: had laten praten.'), '.'] },
      { en: 'At dawn the bells of the Westertoren ring over the whole canal ring.', parts: ['Bij', FK(['zonsopgang', 'zonopgang'], 0, 'samen',
        'zon + s + opgang: this compound is glued with an s, like zonsondergang.'), FK(['luiden de klokken', 'de klokken luiden'], 0, 'v2',
        'Bij zonsopgang fills slot 1, so the verb comes second: luiden de klokken.'), 'van de Westertoren over de', FK(['hele', 'heel'], 0, 'adj',
        'After de the adjective takes -e: de hele grachtengordel.'), 'grachtengordel.'] },
      { en: 'When the bells rang, the dead had already turned back into people.', parts: ['Toen de klokken', FK(['luidden', 'luiden', 'luidde'], 0, 'imp',
        'Past and plural: luidden. luiden is the present, luidde is for one bell.'), ',', FK(['waren de doden', 'hadden de doden', 'de doden waren'], 0, 'plusq',
        'worden takes zijn, so waren, and after the toen-clause the verb comes first.'), 'al weer mensen', FK(['geworden', 'gewordt', 'geword'], 0, 'perf',
        'worden has its own participle: geworden.'), '.'] },
      { en: 'Just ride on, the language is almost home.', parts: [FK(['Fiets maar door', 'Fiets door maar'], 0, 'soft',
        'maar sits after the verb, and the prefix door closes the command.'), ', de taal is bijna', FK(['thuis', 'naar huis'], 0, 'woord',
        'thuis is being at home. naar huis is on the way there, and it needs a verb of going.'), '.'] },

      // ---- builds: the last ride through the canals
      { en: 'From the Westertoren follow the Prinsengracht, cross the Leidsegracht and keep going to the Amstel.', parts: [FK(['Volg', 'Volgt'], 0, 'gebod',
        'A command is the bare stem: volg.'), 'vanaf de Westertoren de Prinsengracht,', FK(['steek de Leidsegracht over', 'oversteek de Leidsegracht'], 0, 'weg',
        'oversteken splits in a command: steek ... over.'), 'en loop door', FK(['tot aan de Amstel', 'tot de Amstel aan'], 0, 'weg',
        'tot aan means right up to, and both words come before the place.'), '.'] },
      { en: 'The canal house where Paola is waiting leans forward a little, like all the others.', parts: [FK(['Het', 'De'], 0, 'samen',
        'grachten + pand: pand is het, so het grachtenpand.'), 'grachtenpand', FK(['waar', 'dat'], 0, 'diedat',
        'A place where something happens takes waar. dat would need Paola to wait the house.'), 'Paola wacht, hangt een beetje voorover, net als alle andere.'] },
      { en: 'Paola waits at the Magere Brug to ride the last stretch with you.', parts: ['Paola wacht bij de Magere Brug om', FK(['het laatste stuk', 'de laatste stuk'], 0, 'dehet',
        'stuk is a het-word: het laatste stuk.'), 'met je', FK(['mee te fietsen', 'te meefietsen', 'meefietsen te'], 0, 'omte',
        'With a separable verb te goes between the prefix and the verb: mee te fietsen.'), '.'] },

      // ---- builds: the letter, the sayings, the bill
      { en: 'Dear residents of the canals, thank you for your patience. Yours faithfully, the language.', parts: [FK(['Geachte', 'Geacht'], 0, 'formeel',
        'bewoners is a plural, and before it the adjective takes -e: Geachte bewoners.'), 'bewoners van de grachten, hartelijk dank voor', FK(['uw', 'u'], 0, 'formeel',
        'The possessive of u is uw: uw geduld.'), 'geduld.', FK(['Hoogachtend', 'Geachte'], 0, 'formeel',
        'Hoogachtend closes a formal letter. Geachte opens one.'), ', de taal.'] },
      { en: "Amsterdam wasn't built in a day either, and neither was your Dutch.", parts: ['Amsterdam', FK(['is', 'heeft'], 0, 'passief',
        'A finished passive takes zijn: is gebouwd. A city does not build anything itself.'), 'ook niet in één dag', FK(['gebouwd', 'gebouwt'], 0, 'kof',
        'bouw ends in w, not a ketchup letter, so -d: gebouwd.'), ', en', FK(['jouw', 'jou'], 0, 'bezit',
        'Before a noun the possessive is jouw: jouw Nederlands.'), 'Nederlands ook niet.'] },
      { en: "All's well that ends well: the language is home again.", parts: ['Eind goed,', FK(['al goed', 'al beter'], 0, 'idioom',
        'The saying is eind goed, al goed: if it ends well, all is well.'), ': de taal is weer thuis.'] },
      { en: 'They still split the bill, but now they do it in Dutch.', parts: ['Ze delen de rekening nog steeds, maar nu', FK(['doen ze het', 'ze doen het'], 0, 'v2',
        'maar does not count, so nu fills slot 1 and the verb comes next: doen ze.'), FK(['in het Nederlands', 'in Nederlands', 'op het Nederlands'], 0, 'woord',
        'In a language takes the article: in het Nederlands, in het Engels.'), '.'] },

      // ---- builds: the last question, and the first word
      { en: 'You did not need the grammar book in the end.', parts: ['Je had', FK(['het', 'de'], 0, 'samen',
        'grammatica + boek: boek is het, so het grammaticaboek.'), 'grammaticaboek', FK(['uiteindelijk', 'eindelijk'], 0, 'woord',
        'uiteindelijk means in the end. eindelijk means at last, after waiting.'), 'niet nodig.'] },
      { en: 'Paola asks whether you still know what the first word was that you learned.', parts: ['Paola vraagt', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'je nog weet', FK(['wat het eerste woord was', 'wat was het eerste woord'], 0, 'bijzin',
        'A question inside a sentence becomes a sub-clause: the verb goes to the end.'), FK(['dat', 'die'], 0, 'diedat',
        'woord is a het-word, so the relative pronoun is dat.'), 'je leerde.'] },
      { en: 'Of course: the dog. The dogs had to go out.', parts: ['Natuurlijk: de hond. De honden', FK(['moesten', 'moeste', 'moetten'], 0, 'imp',
        'moeten is irregular: moest, moesten. The plural takes -en.'), FK(['uit', 'buiten'], 0, 'woord',
        'A dog that has to go out moet uit: de honden moeten uit was the first sentence of the whole ride. buiten needs naar in front of it.'), '.'] },

      // ---- words: the canals, the dawn, the end, four replayed from the first Amsterdam level
      { w: 'the canal ring', nl: 'de grachtengordel' }, { w: 'the widest of the canals', nl: 'de Keizersgracht' },
      { w: 'the canal under the Westertoren', nl: 'de Prinsengracht' }, { w: 'the canal of the merchants', nl: 'de Herengracht' },
      { w: 'the tower with the blue crown', nl: 'de Westertoren' }, { w: 'the imperial crown', nl: 'de keizerskroon' },
      { w: 'the white drawbridge over the Amstel', nl: 'de Magere Brug' }, { w: 'the world heritage', nl: 'het werelderfgoed', wrong: 'de werelderfgoed' },
      { w: 'the sunrise, the dawn', nl: 'de zonsopgang' }, { w: 'the bell (of a church)', nl: 'de klok' },
      { w: 'the carillon', nl: 'het klokkenspel', wrong: 'de klokkenspel' }, { w: 'the quay', nl: 'de kade' },
      { w: 'the language', nl: 'de taal' }, { w: 'the grammar book', nl: 'het grammaticaboek', wrong: 'de grammaticaboek' },
      { w: 'the hoist beam', nl: 'de hijsbalk' }, { w: 'the houseboat', nl: 'de woonboot' },
      { w: 'the canal house', nl: 'het grachtenpand', wrong: 'de grachtenpand' }, { w: 'the front of the house', nl: 'de gevel' },

      // ---- reads: four subtle pairs, two plain lines to end on
      { read: true, nl: 'De taal is eindelijk weer thuis.', o: ['The language is home again at last.', 'The language is actually home again.', 'The language is almost home again.'], a: 0, r: 'woord',
        w: 'eindelijk means at last, after a long wait. eigenlijk means actually, and almost would be bijna.' },
      { read: true, nl: 'Je hoeft niet meer op Engels over te schakelen.', o: ['You no longer have to switch to English.', 'You are no longer allowed to switch to English.', 'You have never switched to English.'], a: 0, r: 'mag',
        w: 'hoeft niet meer te means it is no longer necessary. Not allowed would be mag niet meer.' },
      { read: true, nl: 'Iedereen spreekt weer Nederlands, maar de rekening wordt nog steeds gedeeld.', o: ['Everyone speaks Dutch again, but the bill is still split.', 'Everyone speaks Dutch again, so the bill is no longer split.', 'Nobody speaks Dutch yet, but the bill is split.'], a: 0, r: 'woord',
        w: 'weer means again, and nog steeds means still: some things the mist did not change.' },
      { read: true, nl: 'Als de zon opkomt, worden de doden weer mensen.', o: ['When the sun rises, the dead become people again.', 'When the sun sets, the dead become people again.', 'When the sun rises, the people become dead again.'], a: 0, r: 'woord',
        w: 'opkomen is rising, for the sun; setting is ondergaan. The dead are the ones who change.' },
      { read: true, nl: 'Sinds 2010 staat de grachtengordel op de Werelderfgoedlijst van UNESCO.', en: 'Since 2010 the canal ring has been on the UNESCO World Heritage List.' },
      { read: true, nl: 'De taal is terug. Doe er wat mee.', en: 'The language is back. Do something with it.' },

      // ---- listens: the tower, the bells, a goodbye, a welcome
      { listen: true, nl: 'vijfentachtig meter', en: '85 metres' }, { listen: true, nl: 'de klokken', en: 'the bells' },
      { listen: true, nl: 'tot ziens', en: 'goodbye' }, { listen: true, nl: 'welkom thuis', en: 'welcome home' },

      // ---- looks: the dog, an elm by the canal, the last street lamp
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'grachtje', art: 'het', en: 'the little canal', w: 'Every -je word is het: het grachtje, even though de gracht is a de-word.' },
      { dehet: true, nl: 'woord', art: 'het', en: 'the word', w: 'het woord. The last one you deliver tonight. There was never a rule.' },
    ] }]);
})();
