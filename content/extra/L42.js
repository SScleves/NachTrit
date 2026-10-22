// Alblasserdam, Eten en drinken (level 42, tier 1, A1 words): 36 more items for the café on the dyke, the restaurant,
// the snackbar, the market and the bill. Fence: single words and two-word phrases, 5 words max, one fork per build,
// de/het, zijn and hebben in the present, numbers to 20. Reads are fixed chunks with no conjugated verb, or zijn/hebben.
// Sources (vault): _site/situations restaurant (Voor mij hetzelfde, graag; de vis; twee soep), supermarket and takeaway;
//   _site/dialogues een-koffie-bestellen (Met melk en suiker?, Hier opeten of meenemen?, Dat is samen vijf euro vijftig),
//   op-het-terras (Pinnen jullie of contant?, We doen het samen), in-het-restaurant (de menukaart, de soep),
//   receptionist line Heeft u een reservering?; _site/sentences/eet-smakelijk; word notes het toetje, de fooi, het broodje;
//   01 - Vocabulary borrel and gezellig; 03 - Verbs/hebben; 02 - Grammar/de vs het; MOC Getallen.
// New rule: hebben, linked to the vault note 03 - Verbs/hebben. New props: none (winkel, molen, nummer).
// patat, not friet: Alblasserdam is Zuid-Holland, where the snackbar says patat.
// `wrong` on a word item is the same noun with the wrong article, so that fork also tests de/het.

(() => {
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(42, { deliveries: 20, items: [
    // the restaurant
    { w: 'the restaurant', nl: 'het restaurant', wrong: 'de restaurant' }, { w: 'the table', nl: 'de tafel' },
    { w: 'the plate', nl: 'het bord', wrong: 'de bord' }, { w: 'the cup', nl: 'het kopje' },
    { w: 'the soup', nl: 'de soep' }, { w: 'the fish', nl: 'de vis' }, { w: 'the dessert', nl: 'het toetje', wrong: 'de toetje' },
    { w: 'the wine', nl: 'de wijn' }, { w: 'the milk', nl: 'de melk' },
    // the snackbar and the market
    { w: 'the snack bar', nl: 'de snackbar' }, { w: 'the fries', nl: 'de patat' }, { w: 'the croquette', nl: 'de kroket' },
    { w: 'the bread roll', nl: 'het broodje' }, { w: 'the market', nl: 'de markt', wrong: 'het markt' },
    // the bill
    { w: 'the tip', nl: 'de fooi' }, { w: 'the money', nl: 'het geld', wrong: 'de geld' }, { w: 'to pay', nl: 'betalen' },
    { w: '€ 5', nl: 'vijf euro' },

    { read: true, nl: 'Met melk en suiker?', en: 'With milk and sugar?' },
    { read: true, nl: 'Voor mij hetzelfde, graag.', en: 'Same for me, please.' },
    { read: true, nl: 'Hier opeten of meenemen?', en: 'Eat in or take away?' },
    { read: true, nl: 'Pinnen of contant?', en: 'Card or cash?' },
    { read: true, nl: 'Samen of apart?', en: 'Together or separately?' },
    { read: true, nl: 'De soep is op.', en: 'The soup is all gone.',
      o: ['The soup is all gone.', 'The soup is on the table.', 'The soup is ready.'], a: 0, r: 'woord', w: 'op after zijn means used up: de soep is op, there is none left.' },
    { read: true, nl: 'Een koffie verkeerd, graag.', en: 'A milky coffee, please.',
      o: ['A milky coffee, please.', 'The wrong coffee, please.', 'A black coffee, please.'], a: 0, r: 'woord', w: 'verkeerd means wrong. Koffie verkeerd has more milk than coffee, the wrong way round.' },

    { listen: true, nl: 'eet smakelijk', en: 'enjoy your meal' }, { listen: true, nl: 'vijftien euro', en: '€ 15' },
    { listen: true, nl: 'gezellig', en: 'cosy, good company' },

    { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' }, { look: true, prop: 'molen', nl: 'de molen', en: 'the windmill' },
    { look: true, prop: 'nummer', value: 12, nl: 'twaalf', en: '12' },

    { en: 'The plate is empty.', parts: [FK(['Het', 'De'], 0, 'dehet', 'bord is a het-word: het bord.'), 'bord is leeg.'] },
    { en: 'The fries are cold.', parts: ['De patat', FK(['is', 'zijn'], 0, 'zijn', 'patat is singular in Dutch, so is. English counts the fries, Dutch does not.'), 'koud.'] },
    { en: "I'm hungry.", parts: ['Ik', FK(['heb', 'ben'], 0, 'hebben', 'Dutch has hunger, like Spanish: ik heb honger, tengo hambre.'), 'honger.'] },
    { en: 'We have a reservation.', parts: ['Wij', FK(['hebben', 'heeft'], 0, 'hebben', 'wij takes hebben. heeft is only for hij, zij and het.'), 'een reservering.'] },
    { en: "That's twelve euros altogether.", parts: ['Dat is samen', FK(['twaalf', 'twintig'], 0, 'getal', 'twaalf is 12. twintig is 20: -tig is the tens.'), 'euro.'] },
  ] });
})();
