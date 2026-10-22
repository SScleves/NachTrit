(() => {
  // Level 50, Gouda, Eten en drinken (tier 3, A1 to A2): 36 more items for the cafés on the Markt, the terrace,
  //   the restaurant table, the Saturday market stalls, ordering, allergies, the card machine and the bill split per head.
  // Fence: at most 8 words, present tense, questions with the verb first, V2 after a time word, niet/geen,
  //   modal + infinitive at the end (afrekenen stays glued after mogen), possessives. No er is, no object pronouns,
  //   no adjective -e, no perfectum: the vault's 'we hebben gereserveerd' becomes 'we hebben een reservering'.
  // Sources in the vault: _site/situations restaurant (Wat kunt u aanraden, Ik heb een allergie voor noten,
  //   complimenten aan de kok, We weten het nog niet), pub (Mogen we afrekenen), supermarket (Kan ik pinnen),
  //   visiting (Wat willen jullie drinken); 04 - Phrases & Scenarios/Borrel met vrienden (bitterballen, the bill split);
  //   _site/words (het restaurant, de taart, de vis, de wijn, de tafel, de markt, lekker); 02 - Grammar (presens,
  //   de vs het, modale werkwoorden, niet vs geen, mogen); MOC Lidwoorden & voornaamwoorden (onze); MOC Getallen.
  // New rules: none. presens, bezit and vraag come from town-gouda.js and district3.js and are set again only if missing.
  // New props: none (nummer, lamp, deur).
  // Word forks take their wrong signs from each other, so no two Dutch answers mean the same:
  //   no nagerecht next to het toetje, no menukaart next to de kaart.
  // `wrong` on a word item is the same noun with the wrong article, so that fork also tests de/het.
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.vraag = window.RULES.vraag || { name: 'Question words', note: 'MOC Vraagwoorden' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(50, { deliveries: 20, items: [
    // words: the table, the drinks, the food, the market
    { w: 'the restaurant', nl: 'het restaurant', wrong: 'de restaurant' }, { w: 'the glass', nl: 'het glas', wrong: 'de glas' },
    { w: 'the plate', nl: 'het bord' }, { w: 'the wine', nl: 'de wijn' }, { w: 'the fish', nl: 'de vis' },
    { w: 'the cake', nl: 'de taart' }, { w: 'the terrace', nl: 'het terras' }, { w: 'the market stall', nl: 'de kraam' },
    { w: 'the bitterballen (fried snacks)', nl: 'de bitterballen' }, { w: 'the dessert', nl: 'het toetje', wrong: 'de toetje' },

    // reads: two meaning traps, four plain lines
    { read: true, nl: 'Eet smakelijk.', en: 'Enjoy your meal.',
      o: ['Enjoy your meal.', 'Eat slowly.', 'It tastes good.'], a: 0, r: 'cult', w: 'Eet smakelijk is what you say before the first bite, like buen provecho.' },
    { read: true, nl: 'Pinnen of contant?', en: 'Card or cash?',
      o: ['Card or cash?', 'Here or to go?', 'Together or separately?'], a: 0, r: 'woord', w: 'pinnen is paying by card, with your pin code. contant is cash.' },
    { read: true, nl: 'Wat kunt u aanraden?', en: 'What do you recommend?' },
    { read: true, nl: 'Ik heb een allergie voor noten.', en: "I'm allergic to nuts." },
    { read: true, nl: 'Complimenten aan de kok.', en: 'Compliments to the chef.' },
    { read: true, nl: 'We weten het nog niet.', en: "We haven't decided yet." },

    // listen: ee and ij in heerlijk, ui in de ui, the price on the bill
    { listen: true, nl: 'heerlijk', en: 'delicious' }, { listen: true, nl: 'de ui', en: 'the onion' },
    { listen: true, nl: 'achtentwintig euro', en: '€ 28' },

    // look: the lamp over the café door, the door itself, the table number
    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' }, { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },
    { look: true, prop: 'nummer', value: 24, nl: 'vierentwintig', en: '24' },

    // builds: present tense, verb-first questions, V2, modals, niet/geen, onze, de/het and a number
    { en: 'We have a reservation for two.', parts: ['We', FK(['hebben', 'heeft', 'hebt'], 0, 'presens', 'we is plural, so the plural form: hebben.'), 'een reservering voor twee.'] },
    { en: 'Do you have a table for four?', parts: [FK(['Hebben', 'Heeft', 'Hebt'], 0, 'presens', 'jullie takes the plural: hebben. The verb first makes it a question.'), 'jullie een tafel voor vier?'] },
    { en: 'What would you like to drink?', parts: ['Wat', FK(['willen jullie', 'jullie willen', 'wil jullie'], 0, 'v2', 'Wat takes slot 1, the verb comes second, then jullie.'), 'drinken?'] },
    { en: 'My wife is having the fish.', parts: [FK(['Mijn', 'Mij'], 0, 'bezit', 'My before a noun is mijn. mij is me.'), 'vrouw',
      FK(['neemt', 'neem', 'nemen'], 0, 'presens', 'mijn vrouw is a zij: stem plus t, neemt.'), 'de vis.'] },
    { en: 'We want to sit on the terrace.', parts: ['We willen op', FK(['het', 'de'], 0, 'dehet', 'terras is a het-word: het terras.'), 'terras',
      FK(['zitten', 'zit', 'te zitten'], 0, 'modal', 'After willen the infinitive goes to the end, no te: zitten.'), '.'] },
    { en: 'On Saturday we go to the market.', parts: ['Zaterdag', FK(['gaan we', 'we gaan', 'gaat we'], 0, 'v2', 'Zaterdag takes slot 1, so the verb comes second, then we.'), 'naar de markt.'] },
    { en: "My colleague doesn't eat meat.", parts: ['Mijn collega eet', FK(['geen', 'niet'], 0, 'neg', 'vlees has no article in front, so geen.'), 'vlees.'] },
    { en: "The soup isn't warm.", parts: ['De soep is', FK(['niet', 'geen'], 0, 'neg', 'warm is an adjective, not a noun, so niet.'), 'warm.'] },
    { en: 'Can I pay by card?', parts: ['Kan ik', FK(['pinnen', 'pin', 'te pinnen'], 0, 'modal', 'After kan the infinitive closes the question: pinnen.'), '?'] },
    { en: "You don't have to give a tip.", parts: ['Je', FK(['hoeft', 'moet', 'mag'], 0, 'mag', 'Not necessary is hoeven, and hoeven takes te: je hoeft geen fooi te geven.'), 'geen fooi te geven.'] },
    { en: "Our bill doesn't add up.", parts: [FK(['Onze', 'Ons'], 0, 'bezit', 'rekening is a de-word: onze rekening. ons is for het-words.'), 'rekening klopt niet.'] },
    { en: 'We each pay €18.', parts: ['We betalen ieder', FK(['achttien', 'tachtig'], 0, 'getal', '18 is achttien. tachtig is 80.'), 'euro.'] },
    { en: 'Can we settle up?', parts: ['Mogen we', FK(['afrekenen', 'rekenen af', 'afrekent'], 0, 'modal', 'After mogen the whole verb goes to the end, prefix glued on: afrekenen.'), '?'] },
    { en: 'Where is the toilet?', parts: [FK(['Waar', 'Wanneer', 'Wie'], 0, 'vraag', 'waar asks for a place.'), 'is het toilet?'] },
  ] });
})();
