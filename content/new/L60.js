// Nachtrit, Utrecht (tier 5, A2): level 60 De winkels. The Oudegracht from the Dom to the Neude: the baker, the pharmacy,
// the supermarket, a clothes shop in a wharf cellar and a bike shop.
// New at tier 5 and drilled here: separable verbs split in the present (Ik breng de schoenen terug, De bakker gaat om half acht open),
// zijn + aan het + infinitive, gaan + infinitive, the imperative (Neem maar een tasje mee, Betaalt u maar) and telling the time.
// Tier 4 kept alive: object pronouns (Ik neem hem), comparatives (goedkoper dan), adjective -e (de lege flessen).
// Sources: dutch-lessons vault, _site/situations (supermarket, butcher), _site/dialogues/afrekenen-bij-de-albert-heijn
// (statiegeld, de bon, Pinnen of contactloos), _site/sentences/het-is-twee-halen-een-betalen,
// 02 - Grammar (scheidbare werkwoorden, aan het + infinitief, futurum - gaan + infinitief, V2 word order),
// _site/grammar/de-imperatief-commands, _site/words (de apotheek, de broek, de trui, de sjaal, kopen), MOC Tijd, dagen & maanden,
// and content/towns.js for Utrecht (de kelder, de werf, de student, de fietsenstalling,
// Ik kan mijn fiets niet vinden).
// New rules: none new to the game. gebod, klok, objpron and vergelijk are declared with || in case this file loads first.
// New props: none.
(() => {
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.gebod = window.RULES.gebod || { name: 'The imperative: the bare stem', note: 'de-imperatief-commands' };
  window.RULES.klok = window.RULES.klok || { name: 'Telling the time: half negen, kwart voor zeven', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.objpron = window.RULES.objpron || { name: 'Object pronouns: me, je, hem, haar, ons, ze', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[5];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([
    { id: 60, act: 5, name: 'De winkels', town: 'utrecht', place: 'winkels', theme: 'shops', ...P,
      intro: 'The shops on the Oudegracht are still open, down in the wharf cellars. The dead still split the bill, each with their own card.',
      introNl: 'De winkels aan de Oudegracht zijn nog open, beneden in de werfkelders. De doden delen de rekening nog steeds, ieder met zijn eigen pasje.',
      mission: { where: 'The Oudegracht, from the Dom to the Neude: the baker, the pharmacy, the supermarket, a clothes shop in a cellar and a bike shop.',
        carry: 'A bag of empty bottles for the deposit, and trousers that were too long for you, like everything here. Still no helmet.',
        want: 'They tell you when the shop opens and ask what you are doing. Split the verb, send the half to the end, read the clock the Dutch way. The grammar book had a chapter on this. It is still in the plastic.' },
      items: [
        // ---- separable verbs: the stem in slot 2, the prefix at the end
        { en: 'I am taking these shoes back.', parts: ['Ik', FK(['breng', 'terugbreng', 'brengt'], 0, 'sep', 'terugbrengen splits in the present: breng in slot 2, terug waits at the end.'), 'deze schoenen terug.'] },
        { en: 'What time does the pharmacy close?', parts: ['Hoe laat', FK(['gaat de apotheek', 'de apotheek gaat'], 0, 'v2', 'Question word first, then the verb, then the subject.'),
          FK(['dicht', 'dichtgaat'], 0, 'sep', 'dichtgaan splits: gaat sits in slot 2, dicht closes the sentence.'), '?'] },
        { en: 'I am handing in the empty bottles.', parts: ['Ik', FK(['lever', 'inlever'], 0, 'sep', 'inleveren splits: lever in slot 2, in at the end.'), 'de',
          FK(['lege', 'leeg'], 0, 'adj', 'Before a plural noun the adjective takes -e: de lege flessen.'), 'flessen in.'] },
        { en: 'Students spend little money.', parts: ['Studenten', FK(['geven', 'uitgeven', 'geeft'], 0, 'sep', 'uitgeven splits: geven in slot 2, uit at the end. Plural, so geven.'), 'weinig geld uit.'] },
        { en: 'I still have to pick up my medicines.', parts: ['Ik moet mijn medicijnen nog', FK(['ophalen', 'haal op', 'halen op'], 0, 'modal', 'After moet the separable verb comes back together at the end: ophalen.'), '.'] },
        { en: 'The baker opens at half past seven.', parts: ['De bakker gaat om', FK(['half acht', 'half zeven'], 0, 'klok', 'Dutch counts the half towards the next hour: 7:30 is half acht.'),
          FK(['open', 'opengaat'], 0, 'sep', 'opengaan splits: gaat in slot 2, open at the very end.'), '.'] },
        // ---- telling the time
        { en: "It's a quarter to six, the butcher is closing.", parts: ['Het is', FK(['kwart voor zes', 'kwart over zes', 'kwart voor vijf'], 0, 'klok', 'kwart voor zes is a quarter before six: 5:45.'), ', de slager gaat dicht.'] },
        // ---- zijn + aan het + infinitive
        { en: 'The baker is baking bread.', parts: ['De bakker', FK(['is', 'heeft'], 0, 'aanhet', 'aan het always rides on zijn: hij is aan het bakken.'), 'brood aan het',
          FK(['bakken', 'bakt'], 0, 'aanhet', 'After aan het comes the infinitive: bakken.'), '.'] },
        { en: 'We are doing the shopping.', parts: ['We zijn boodschappen', FK(['aan het doen', 'aan het doet', 'doen aan het'], 0, 'aanhet', 'zijn, then aan het, then the infinitive last.'), '.'] },
        // ---- gaan + infinitive
        { en: "Tomorrow I'm going to buy a new bike.", parts: ['Morgen', FK(['ga ik', 'ik ga'], 0, 'v2', 'Morgen takes slot 1, so the verb comes next, then ik.'), 'een nieuwe fiets',
          FK(['kopen', 'koop', 'te kopen'], 0, 'fut', 'gaan in slot 2, the infinitive at the end, no te.'), '.'] },
        { en: "We're going to split the bill.", parts: ['We', FK(['gaan', 'gaat'], 0, 'presens', 'we is plural: gaan.'), 'de rekening',
          FK(['delen', 'deel', 'te delen'], 0, 'fut', 'gaan plus the bare infinitive at the end: delen.'), '.'] },
        // ---- the imperative
        { en: 'Go on, take a bag with you.', parts: [FK(['Neem', 'Neemt', 'Meeneem'], 0, 'gebod', 'A command is the bare stem: neem. meenemen splits, so mee goes to the end. Neemt only goes with u.'), 'maar een tasje mee.'] },
        { en: 'Just pay at the checkout. (polite)', parts: [FK(['Betaalt u', 'Betaal u', 'Betalen u'], 0, 'gebod', 'With u the command keeps its t: Betaalt u maar.'), 'maar bij de kassa.'] },
        { en: 'Go ahead and put the trousers on.', parts: [FK(['Trek', 'Trekt', 'Aantrek'], 0, 'gebod', 'A command is the bare stem: trek. aan from aantrekken waits at the end.'), 'de broek maar even aan.'] },
        // ---- tier 4 kept alive
        { en: "The jumper is nice. I'll take it.", parts: ['De trui is mooi. Ik neem', FK(['hem', 'hij'], 0, 'objpron', 'trui is a de-word, and as the object it is hem. hij only does the doing.'), '.'] },
        { en: 'The market is cheaper than the Albert Heijn.', parts: ['De markt is', FK(['goedkoper', 'goedkoop', 'meer goedkoop'], 0, 'vergelijk', 'Comparing: add -er, then dan. goedkoop becomes goedkoper.'), 'dan de Albert Heijn.'] },

        // ---- words, all with their article
        { w: 'the price', nl: 'de prijs' }, { w: 'the size', nl: 'de maat' }, { w: 'the receipt', nl: 'het bonnetje', wrong: 'de bonnetje' },
        { w: 'the money', nl: 'het geld', wrong: 'de geld' }, { w: 'the bottle deposit', nl: 'het statiegeld', wrong: 'de statiegeld' }, { w: 'the bottle', nl: 'de fles' },
        { w: 'the bread roll', nl: 'het broodje', wrong: 'de broodje' }, { w: 'the baker', nl: 'de bakker' }, { w: 'the pharmacy', nl: 'de apotheek' },
        { w: 'the medicines', nl: 'de medicijnen' }, { w: 'the sale', nl: 'de uitverkoop' }, { w: 'the trousers', nl: 'de broek' },
        { w: 'the jumper', nl: 'de trui' }, { w: 'the scarf', nl: 'de sjaal' }, { w: 'the shop assistant', nl: 'de verkoper' },
        { w: 'the opening hours', nl: 'de openingstijden' }, { w: 'the bike shop', nl: 'de fietsenwinkel' }, { w: 'the bike lock', nl: 'het fietsslot', wrong: 'de fietsslot' },
        { w: 'the carton of milk', nl: 'het pak melk' }, { w: 'the cellar', nl: 'de kelder' },

        // ---- reading
        { read: true, nl: 'Ruilen alleen met bonnetje.', en: 'Exchanges only with a receipt.' },
        { read: true, nl: 'Twee halen, één betalen.', o: ['Buy two, pay for one.', 'Pay for two, get one.', 'Two halves, one payment.'], a: 0, r: 'woord',
          w: 'halen is to fetch: you take two home and pay for one.' },
        { read: true, nl: 'De winkel gaat om zes uur dicht.', o: ['The shop closes at six.', 'The shop opens at six.', 'The shop is closed until six.'], a: 0, r: 'sep',
          w: 'dichtgaan is to close. The dicht at the end is the other half of the verb.' },
        { read: true, nl: 'Het is half zeven.', o: ['It is half past six.', 'It is half past seven.'], a: 0, r: 'klok', w: 'half zeven is half way to seven: 6:30.' },
        { read: true, nl: 'Heeft u deze ook in een andere maat?', en: 'Do you also have this in another size?' },
        { read: true, nl: 'Ik kan mijn fiets niet vinden.', en: "I can't find my bike." },

        // ---- listening
        { listen: true, nl: 'half negen', en: '8:30' }, { listen: true, nl: 'kwart over vijf', en: '5:15' },
        { listen: true, nl: 'vierentwintig euro vijfennegentig', en: '€ 24,95' },

        // ---- looking
        { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
        { look: true, prop: 'nummer', value: 44, nl: 'vierenveertig', en: '44' },

        // ---- de or het
        { dehet: true, nl: 'korting', art: 'de', en: 'the discount', w: 'Words ending in -ing are de.' },
        { dehet: true, nl: 'pasje', art: 'het', en: 'the bank card', w: 'Every -je word is het: het pasje, het tasje, het bonnetje.' },
      ] },
  ]);
})();
