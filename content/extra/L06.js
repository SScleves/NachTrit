// Nachtrit, level 6 De supermarkt (Kinderdijk en Dordrecht, tier 2, place winkels): 36 more items.
// The supermarket, the baker, the pharmacy, paying, prices, sizes and returns, at A1 phrase level.
// Tier 2 fence: 5 words max per Dutch line, present tense, subject verb object, numbers to 100, polite u,
// de/het, niet only in reads. Builds have one fork each. Mag ik + noun and the verb-first u questions follow the
// lines already in this level (Mag ik twee broden, alstublieft?, Spaart u zegels?).
// Sources: dutch-lessons vault. _site/dialogues (Afrekenen bij de Albert Heijn: bonuskaart, pindakaas, contactloos;
// Bij de bakker: Gesneden of heel?, appeltaartje, vier euro twintig; Kleding passen in de winkel: paskamer, passen;
// Boodschappen voor het feestje: pinpas), _site/sentences (Natuurlijk. Pinnen jullie of contant?, Dat is samen
// achttien euro vijftig., Wat kost dit en hoeveel kost dat?, Geldt de korting ook voor mij?, Maak een
// boodschappenlijstje voordat je naar de winkel gaat., Bij de apotheek kunt u een paar pijnstillers halen.,
// Heeft u ook hoofdpijn of hoest u?, Mag ik vier van die broodjes?, Ik wil deze graag ruilen, hij is toch te klein.),
// _site/words (de apotheek, de trui, kopen, ruilen), 03 - Verbs/kopen, 02 - Grammar (presens, de vs het),
// _site/grammar/meervoud-plurals, MOC Getallen.
//
// New rule: meervoud (plurals), linked to the vault note 'meervoud-plurals', which has the -s after every -je.
// New props: none. Only fiets, hond and nummer are used.
// `wrong` on four of the seventeen word items is the same noun with the wrong article, so those forks test de/het too.
// de bakker and de apotheek come back from level 5 as replay. Everything else is new to the winkels road.
// Two reads carry their own o/a/r/w traps. The mission card shows w as their gloss, so w starts with the meaning.
// Pool checks: no two items in the word/listen/look pool share a meaning (one receipt, one card per job, one
// pharmacy word, no bare number that is also a price), and every read gloss fits only its own line.
// het recept is the prescription, not the receipt: the receipt is het bonnetje, already in this level.

(() => {
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(6, { deliveries: 20, items: [
    // ---- words: in the supermarket
    { w: 'the shopping trolley', nl: 'de winkelwagen' }, { w: 'the shopping list', nl: 'het boodschappenlijstje', wrong: 'de boodschappenlijstje' },
    { w: 'the loyalty card', nl: 'de bonuskaart' }, { w: 'the peanut butter', nl: 'de pindakaas' }, { w: 'the fruit', nl: 'het fruit', wrong: 'de fruit' },
    // ---- words: the baker and the pharmacy
    { w: 'the baker', nl: 'de bakker' }, { w: 'the apple pie', nl: 'de appeltaart' },
    { w: 'the pharmacy', nl: 'de apotheek', wrong: 'het apotheek' }, { w: 'the prescription', nl: 'het recept' },
    // ---- words: paying and prices
    { w: 'to buy', nl: 'kopen' }, { w: 'the debit card', nl: 'de pinpas' }, { w: 'in cash', nl: 'contant' },
    { w: 'the change (money back)', nl: 'het wisselgeld', wrong: 'de wisselgeld' }, { w: 'the discount', nl: 'de korting' },
    { w: '€ 4,20', nl: 'vier euro twintig' }, { w: '€ 0,85', nl: 'vijfentachtig cent' },
    // ---- words: sizes
    { w: 'the fitting room', nl: 'de paskamer' },

    // ---- reads: lines from the till, the bakery counter and the pharmacy, two signs, and two traps
    { read: true, nl: 'Heeft u een bonuskaart?', en: 'Do you have a loyalty card?' },
    { read: true, nl: 'Gesneden of heel?', en: 'Sliced or whole?' },
    { read: true, nl: 'Wat kost dat?', en: 'How much is that?' },
    { read: true, nl: 'Het past niet.', en: "It doesn't fit." },
    { read: true, nl: 'Ruilen binnen dertig dagen.', en: 'Exchanges within thirty days.' },
    { read: true, nl: 'Alleen pinnen.', en: 'Card only.',
      o: ['Card only.', 'Cash only.', 'Only one per customer.'], a: 0, r: 'woord', w: 'Card only. pinnen is paying by card, contant is paying cash.' },
    { read: true, nl: 'Heeft u iets tegen hoofdpijn?', en: 'Do you have something for a headache?',
      o: ['Do you have something for a headache?', 'Do you have a headache?', 'Do you have something for a cold?'], a: 0, r: 'woord',
      w: 'Do you have something for a headache? Dutch says iets tegen, something against it. hoofdpijn is head pain.' },

    // ---- listens: a price by ear, the tap at the till, the pharmacy, the word for you at the counter
    { listen: true, nl: 'achttien euro vijftig', en: '€ 18,50' }, { listen: true, nl: 'contactloos', en: 'contactless' },
    { listen: true, nl: 'de pijnstiller', en: 'the painkiller' }, { listen: true, nl: 'de klant', en: 'the customer' },

    // ---- looks: the bikes parked out front, the dog tied up by the door, a price on a pole
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' },
    { look: true, prop: 'nummer', value: 64, nl: 'vierenzestig', en: '64' },

    // ---- builds: one fork each
    { en: 'You pay at the checkout.', parts: ['U', FK(['betaalt', 'betaal', 'betalen'], 0, 'pres', 'u takes stem plus t, just like jij: u betaalt.'), 'bij de kassa.'] },
    { en: 'The peanut butter costs € 3.', parts: ['De pindakaas', FK(['kost', 'kosten', 'kostt'], 0, 'pres', 'pindakaas is one thing, a hij: stem plus t. kost already ends in t, so it stays kost.'), 'drie euro.'] },
    { en: 'This jumper is too small.', parts: [FK(['Deze', 'Dit'], 0, 'dehet', 'trui is a de-word, so deze trui. dit only goes with het-words: dit brood.'), 'trui is te klein.'] },
    { en: 'Can I have four rolls?', parts: ['Mag ik vier', FK(['broodjes', 'broodjen', "broodje's"], 0, 'meervoud', 'Every -je word takes -s in the plural: het broodje, de broodjes.'), '?'] },
    { en: 'It costs € 1,99.', parts: ['Het kost een euro', FK(['negenennegentig', 'negennegentig', 'negentignegen'], 0, 'getal', 'Units first, then en, then the tens: negen-en-negentig.'), '.'] },
  ] });
})();
