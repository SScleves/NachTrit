// Nachtrit, level 5 Nachtwinkel (Alblasserdam, tier 1, place winkels): 36 more items.
// Shops and shopping at A1: the supermarket, the baker, the butcher, the pharmacy, paying, prices, sizes, returns.
// Tier 1 fence: single words and two-word phrases, 5 words max per Dutch line, articles, zijn and hebben in the
// present, numbers 0 to 20. Reads use zijn, hebben or no verb at all. Builds have one fork each.
// Sources: dutch-lessons vault. _site/situations/supermarket (pinnen, het tasje, het gangpad, de aanbieding),
// _site/situations/butcher (de slager), _site/situations/takeaway (Mag het zonder ui?), _site/dialogues (Bij de bakker,
// Afrekenen bij de Albert Heijn, Kleding passen in de winkel, Boodschappen voor het feestje), _site/sentences
// (Heb je het bonnetje nog?, Ik wil deze graag ruilen, hij is toch te klein., Het is twee halen, één betalen.,
// Pinnen of contactloos?, Sorry, blauw is uitverkocht.), _site/words (de apotheek, de broek), 03 - Verbs/hebben,
// 02 - Grammar/de vs het, 00 - Sounds/klank ui, MOC Getallen.
//
// New rules: hebben, linked to the vault note 'hebben' (03 - Verbs), the twin of the zijn rule in levels.js.
// New props: none. Only fiets and nummer are used (deur is drawn as a whole house, so it is left out here).
// `wrong` on six word items is the same noun with the wrong article, so those forks test de/het as well.
// Prices use 12 and 19 only with euro, so no bare number in the pool is also a right answer for a price.
// The two trap reads carry their own o/a/r/w. The mission card shows w as their gloss, so w starts with the meaning.

(() => {
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(5, { deliveries: 20, items: [
    // ---- words: the shops
    { w: 'the supermarket', nl: 'de supermarkt' }, { w: 'the baker', nl: 'de bakker' }, { w: 'the butcher', nl: 'de slager' },
    { w: 'the pharmacy', nl: 'de apotheek', wrong: 'het apotheek' },
    // ---- words: inside the supermarket
    { w: 'the checkout', nl: 'de kassa' }, { w: 'the aisle', nl: 'het gangpad', wrong: 'de gangpad' }, { w: 'the plastic bag', nl: 'het tasje' },
    { w: 'the groceries', nl: 'de boodschappen' }, { w: 'the bottle deposit', nl: 'het statiegeld', wrong: 'de statiegeld' },
    // ---- words: on the shelves and behind the counter
    { w: 'the meat', nl: 'het vlees', wrong: 'de vlees' }, { w: 'the bread roll', nl: 'het broodje' }, { w: 'the medicine', nl: 'het medicijn' },
    // ---- words: prices and paying
    { w: 'the price', nl: 'de prijs' }, { w: 'the special offer', nl: 'de aanbieding' }, { w: 'expensive', nl: 'duur' }, { w: 'cheap', nl: 'goedkoop' },
    { w: 'the money', nl: 'het geld', wrong: 'de geld' }, { w: 'to pay by card', nl: 'pinnen' }, { w: 'the receipt', nl: 'het bonnetje', wrong: 'de bonnetje' },
    // ---- words: sizes and returns
    { w: 'the size', nl: 'de maat' }, { w: 'too small', nl: 'te klein' }, { w: 'too big', nl: 'te groot' }, { w: 'to exchange', nl: 'ruilen' },

    // ---- reads: two traps with their own options, three signs and lines from the till
    { read: true, nl: 'Het brood is op.', o: ['The bread is all gone.', 'The bread is on top.', 'The bread is open.'], a: 0, r: 'woord',
      w: 'The bread is all gone. After zijn, op means used up, not on.' },
    { read: true, nl: 'De winkel is dicht.', o: ['The shop is closed.', 'The shop is nearby.', 'The shop is open.'], a: 0, r: 'woord',
      w: 'The shop is closed. dicht is closed, nearby is dichtbij.' },
    { read: true, nl: 'Pinnen of contant?', en: 'Card or cash?' },
    { read: true, nl: 'Twee halen, één betalen.', en: 'Take two, pay for one.' },
    { read: true, nl: 'Dat is alles.', en: "That's all." },

    // ---- listens: a price by ear, and the ui sound that has no twin in Spanish or English
    { listen: true, nl: 'twaalf euro', en: '€ 12' }, { listen: true, nl: 'de ui', en: 'the onion' }, { listen: true, nl: 'uitverkocht', en: 'sold out' },

    // ---- looks: the bike left unlocked outside, a price tag on a pole
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'nummer', value: 13, nl: 'dertien', en: '13' },

    // ---- builds: one fork each
    { en: 'The trousers are too small.', parts: ['De broek', FK(['is', 'zijn'], 0, 'zijn', 'Dutch counts one broek, so is. English says the trousers are.'), 'te klein.'] },
    { en: "That's €19.", parts: ['Dat is negentien', FK(['euro', "euro's"], 0, 'getal', 'In a price euro stays singular: negentien euro.'), '.'] },
    { en: 'I still have the receipt.', parts: ['Ik', FK(['heb', 'heeft', 'hebt'], 0, 'hebben', 'ik heb. hebben is irregular: ik heb, jij hebt, hij heeft.'), 'het bonnetje nog.'] },
  ] });
})();
