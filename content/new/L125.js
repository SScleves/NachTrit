// Nachtrit, Amsterdam (tier 13, B1 to B2): level 125 Eten en drinken. A herring cart on a bridge, a brown café in the Jordaan
// with dark wood and a cat on the bar, a tasting room where the first sip of jenever is taken without hands, a wall of hot
// snacks behind little glass doors, and a long Indonesian rijsttafel to end with. In Amsterdam it is patat, not friet.
// New at tier 13 and drilled here: long builds with two and three forks, prices of a round in words (elf euro vijfenzeventig,
// acht euro veertig), the café register next to the polite one (Zullen we een biertje pakken, gabber; Hebt u gereserveerd),
// food idioms (op zijn Amsterdams, koffiedik kijken, de kat op het spek binden), subtle reading pairs (geen trek meer, samsam
// doen, ik trakteer, tot tien uur open), directions to the snack wall, and patat against friet as a fact about the country.
// Review of every tier: V2 after a fronted phrase and after a sub-clause, the plural biertjes, jouw before a noun, an
// of-clause with a separable verb, the passive with worden, the plusquamperfectum with a separable participle, the
// comparative zuidelijker, indirect speech with of, die with three forks, om ... te, er is against er zijn, particles, a
// modal with a bare infinitive.
// Sources: dutch-lessons vault, _site/situations/pub (Doe mij maar een biertje van de tap, Nog een rondje, Proost), restaurant
// (Is alles naar wens, Kunnen we apart betalen, Zitten daar noten in), takeaway; 02 - Grammar/zachtmakers - wel even maar,
// bijzin, V2 word order, scheidbare werkwoorden; MOC Getallen; level 117 for the replayed words (de bitterbal, het bierviltje,
// de stamgast, het bruine café); content/towns.js for Amsterdam (de gracht, de toerist, Mokum) and Alblasserdam (the one-cent
// Tikkie). Amsterdam eats herring cut in pieces with onions and pickles; elsewhere it is held by the tail.
// New rules: weg (guarded, the same text in every Amsterdam file); idioom and formeel keep the Nijmegen text. meervoud, bezit,
// passief, vergelijk, indirect, omte and er are guarded copies of the existing definitions.
// New props: none. Only hond, brug and lamp are used (no word, listen or look answer here is a bridge or a lamp).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 125, act: 13, name: 'Eten en drinken', town: 'amsterdam', place: 'eten', theme: 'square', ...P,
    intro: 'Amsterdam eats its herring in pieces with onions. The rest of the country holds it by the tail. Both think the other is mad. The herring has no opinion.',
    introNl: 'Amsterdam eet haring in stukjes met uitjes. De rest van het land houdt hem bij de staart vast. Allebei vinden ze de ander gek. De haring heeft geen mening.',
    mission: {
      where: 'A herring cart on a bridge, a brown café in the Jordaan with dark wood and a cat on the bar, a tasting room where the first sip of jenever is taken without hands, a wall of hot snacks behind little glass doors, and a long Indonesian rijsttafel to end with. In Amsterdam it is patat, not friet.',
      carry: 'A Tikkie for every round, sent to the cent and still open, two dogs who want the herring, a stack of beer mats, and the grammar book, still never opened. No helmet. After the jenever you walk the bike home anyway.',
      want: 'Since the mist the dead of Amsterdam still go out, and they still split everything. They order in long sentences, they want the price of a round in words, they say proost at the bar and eet smakelijk at the table, and they know which sayings go with food. The barman answers in Dutch now, which surprises everyone. The women at the bar are still taller than you, and the one-cent Tikkie is still open.' },
    items: [
      // ---- builds: ordering, the Amsterdam way
      { en: "I'll have a herring with onions, cut in pieces, the Amsterdam way.", parts: [FK(['Doe mij maar', 'Doe maar mij'], 0, 'soft',
        'The fixed way to order: doe mij maar, the pronoun first.'), 'een haring met uitjes, in stukjes,', FK(['op zijn Amsterdams', 'op het Amsterdams', 'in zijn Amsterdams'], 0, 'idioom',
        'op zijn plus an adjective ending in -s means in that style: op zijn Amsterdams, op zijn Hollands.'), '.'] },
      { en: 'In a tasting room you take the first sip without hands, bent over the bar.', parts: ['In een proeflokaal', FK(['neem je', 'je neemt'], 0, 'v2',
        'In een proeflokaal fills slot 1, so the verb comes second: neem je.'), FK(['het eerste slokje', 'de eerste slokje'], 0, 'dehet',
        'Every -je word is het: het slokje, so het eerste slokje.'), 'zonder handen, voorovergebogen over de bar.'] },
      { en: 'Two beers and a jenever: that comes to eleven euros seventy-five.', parts: ['Twee', FK(['biertjes', 'biertjen', 'biers'], 0, 'meervoud',
        'A -je word takes -s in the plural: biertjes.'), 'en een jenever: dat wordt elf euro', FK(['vijfenzeventig', 'zevenenvijftig', 'vijfzeventig'], 0, 'getal',
        'Dutch says the units first, then en, then the tens: vijfenzeventig is 75. zevenenvijftig is 57.'), '.'] },
      { en: "I'll send you a Tikkie for your half, that is eight euros forty.", parts: ['Ik stuur je een Tikkie voor', FK(['jouw', 'jou'], 0, 'bezit',
        'Before a noun the possessive is jouw: jouw helft. jou is the object, you.'), 'helft, dat is acht euro', FK(['veertig', 'viertig'], 0, 'getal',
        'vier becomes veer- in veertig and veertien.'), '.'] },
      { en: "Shall we grab a beer, mate? It's on me.", parts: ['Zullen we', FK(['een biertje pakken', 'een biertje te pakken'], 0, 'modal',
        'After zullen the infinitive comes without te: een biertje pakken.'), ', gabber? Ik trakteer.'] },
      { en: "Have you booked? Then I'll take you to your table.", parts: ['Hebt u gereserveerd?', FK(['Dan breng ik u', 'Dan ik breng u'], 0, 'v2',
        'dan takes slot 1, so the verb comes right after it: dan breng ik.'), 'naar', FK(['uw', 'u'], 0, 'formeel',
        'The possessive of u is uw: uw tafel.'), 'tafel.'] },
      { en: "Just order something, I'll pay.", parts: [FK(['Bestel maar wat', 'Bestel wat maar'], 0, 'soft',
        'maar comes straight after the verb in a friendly command: bestel maar wat.'), ',', FK(['ik betaal wel', 'ik wel betaal'], 0, 'soft',
        'In a main clause the verb comes second, and wel follows it: ik betaal wel.'), '.'] },

      // ---- builds: food idioms
      { en: "Whether the café opens tomorrow is anyone's guess.", parts: [FK(['Of het café morgen opengaat', 'Of het café gaat morgen open'], 0, 'bijzin',
        'of opens a sub-clause, so the verb goes to the end and the separable verb joins up: opengaat.'), ', is', FK(['koffiedik kijken', 'theebladeren kijken', 'koffie kijken'], 0, 'idioom',
        'koffiedik kijken, reading the coffee grounds, means pure guesswork. The tea leaves are English.'), '.'] },
      { en: 'Putting the bitterballen next to the dogs is asking for trouble.', parts: ['De bitterballen naast de honden zetten is', FK(['de kat op het spek binden', 'de hond op het spek binden', 'de kat bij het spek binden'], 0, 'idioom',
        'de kat op het spek binden: tie the cat to the bacon, and see what happens. Even with dogs it stays a cat.'), '.'] },
      { en: "I'm full, I really can't eat another thing.", parts: [FK(['Ik zit vol', 'Ik ben vol'], 0, 'woord',
        'Full after a meal is ik zit vol. ik ben vol is English.'), ',', FK(['ik kan echt niks meer op', 'ik kan echt niks op meer'], 0, 'sep',
        'opkunnen keeps its op at the very end: ik kan niks meer op.'), '.'] },

      // ---- builds: the snack wall, the rijsttafel, patat
      { en: 'The snack wall? Cross the square, it is next to the cinema.', parts: ['De automatiek?', FK(['Steek het plein over', 'Oversteek het plein'], 0, 'weg',
        'oversteken splits in a command: steek het plein over.'), ', hij zit naast', FK(['de', 'het'], 0, 'dehet',
        'bioscoop is a de-word: de bioscoop.'), 'bioscoop.'] },
      { en: 'At an Indonesian rijsttafel more than ten little dishes are put on the table.', parts: ['Bij een Indische rijsttafel', FK(['worden', 'wordt'], 0, 'passief',
        'More than ten dishes is a plural, so worden.'), 'meer dan tien schaaltjes op tafel', FK(['gezet', 'gezett'], 0, 'kof',
        'zet already ends in t, so the participle gezet gets nothing extra.'), '.'] },
      { en: 'When the rijsttafel came, we had already eaten all the krupuk.', parts: ['Toen de rijsttafel kwam,', FK(['hadden we', 'we hadden'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: hadden we.'), 'alle kroepoek al', FK(['opgegeten', 'opgeëten', 'geopgeten'], 0, 'sep',
        'opeten is separable: op + gegeten, with the ge in the middle.'), '.'] },
      { en: 'In Amsterdam they say patat; two hundred kilometres further south it is called friet.', parts: ['In Amsterdam zeggen ze patat, tweehonderd kilometer', FK(['zuidelijker', 'meer zuidelijk', 'zuidelijkst'], 0, 'vergelijk',
        'Further south is the comparative: zuidelijker.'), FK(['heet het', 'het heet'], 0, 'v2',
        'The distance fills slot 1, so the verb comes second: heet het friet.'), 'friet.'] },

      // ---- builds: review of earlier tiers
      { en: 'The barman asked whether we wanted another round.', parts: ['De barman vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A reported yes-or-no question starts with of.'), 'we', FK(['nog een rondje wilden', 'wilden nog een rondje'], 0, 'bijzin',
        'of sends the verb to the end: nog een rondje wilden.'), '.'] },
      { en: 'The cat that has lived in the old café for years always sleeps on the bar.', parts: ['De kat', FK(['die', 'dat'], 0, 'diedat',
        'kat is a de-word, so die.'), 'al jaren in het', FK(['oude', 'oud'], 0, 'adj',
        'After het the adjective takes -e: het oude café.'), 'café woont,', FK(['slaapt altijd', 'altijd slaapt'], 0, 'v2',
        'The whole subject, the cat with its clause, fills slot 1, so the verb comes next: slaapt altijd.'), 'op de bar.'] },
      { en: 'We came to the café to watch the match, not to talk.', parts: ['We kwamen naar het café', FK(['om naar de wedstrijd te kijken', 'om naar de wedstrijd kijken'], 0, 'omte',
        'om ... te always comes as a pair: om naar de wedstrijd te kijken. Without te it is not Dutch.'), ', niet om te praten.'] },
      { en: 'There are no bitterballen left, but there is still some cheese.', parts: [FK(['Er zijn', 'Er is'], 0, 'er',
        'bitterballen is plural, so er zijn.'), 'geen bitterballen meer, maar', FK(['er is nog wel', 'er zijn nog wel'], 0, 'er',
        'wat kaas is singular, so er is.'), 'wat kaas.'] },
      { en: 'The kitchen closes at ten, so we have to order now.', parts: ['De keuken gaat om tien uur dicht, dus we moeten nu', FK(['bestellen', 'te bestellen', 'besteld'], 0, 'modal',
        'After moeten the infinitive comes without te: bestellen.'), '.'] },

      // ---- words: the café, the snacks, the bill, five replayed from Nijmegen
      { w: 'the herring', nl: 'de haring' }, { w: 'the small onions on a herring', nl: 'de uitjes' },
      { w: 'the jenever tasting room', nl: 'het proeflokaal', wrong: 'de proeflokaal' }, { w: 'the jenever (Dutch gin)', nl: 'de jenever' },
      { w: 'the beer with a jenever on the side', nl: 'het kopstootje', wrong: 'de kopstootje' }, { w: 'the snack wall with little doors', nl: 'de automatiek' },
      { w: 'the croquette', nl: 'de kroket' }, { w: 'the chips with mayonnaise, peanut sauce and onions', nl: 'het patatje oorlog', wrong: 'de patatje oorlog' },
      { w: 'the rice table', nl: 'de rijsttafel' }, { w: 'the prawn crackers', nl: 'de kroepoek' },
      { w: 'the barman', nl: 'de barman' }, { w: 'the round of drinks', nl: 'het rondje', wrong: 'de rondje' },
      { w: 'the payment request in the app', nl: 'het Tikkie', wrong: 'de Tikkie' }, { w: 'the snack bar', nl: 'de snackbar' },
      { w: 'the bitterbal', nl: 'de bitterbal' }, { w: 'the beer mat', nl: 'het bierviltje', wrong: 'de bierviltje' },
      { w: 'the regular customer', nl: 'de stamgast' }, { w: 'the brown café', nl: 'het bruine café', wrong: 'de bruine café' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'Ik heb geen trek meer.', o: ['I am not hungry any more.', 'I am not hungry yet.', 'I have no more money left.'], a: 0, r: 'woord',
        w: 'geen ... meer means no longer. Not yet would be nog geen trek, and trek is appetite, not money.' },
      { read: true, nl: 'Zullen we samsam doen?', o: ['Shall we split it fifty-fifty?', 'Shall we do it again?', 'Shall we pay together later?'], a: 0, r: 'cult',
        w: 'samsam doen means sharing the cost equally. It is the oldest Dutch habit there is.' },
      { read: true, nl: 'Laat maar, ik trakteer.', o: ['Leave it, it is on me.', 'Leave it, I will pay for myself.', 'Leave it, I am being treated.'], a: 0, r: 'woord',
        w: 'trakteren is paying for the others. Paying only for yourself is zelf betalen.' },
      { read: true, nl: 'De keuken is tot tien uur open.', o: ['The kitchen is open until ten.', 'The kitchen opens at ten.', 'The kitchen closes before ten.'], a: 0, r: 'woord',
        w: 'tot means until: after ten it is closed. Opening at ten would be vanaf tien uur.' },
      { read: true, nl: 'In Amsterdam eet je haring in stukjes, met uitjes en zuur.', en: 'In Amsterdam you eat herring in pieces, with onions and pickles.' },
      { read: true, nl: 'Het Tikkie van één cent staat nog steeds open.', en: 'The one-cent Tikkie is still open.' },

      // ---- listens: a price, a habit, a snack, a coffee
      { listen: true, nl: 'elf euro vijfenzeventig', en: '€ 11,75' }, { listen: true, nl: 'samsam', en: 'fifty-fifty, each pays half' },
      { listen: true, nl: 'de bitterballen', en: 'the bitterballen' }, { listen: true, nl: 'een kopje koffie', en: 'a cup of coffee' },

      // ---- looks: the dog, the bridge with the herring cart, a lamp on the square
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'slokje', art: 'het', en: 'the sip', w: 'Every -je word is het: het slokje.' },
      { dehet: true, nl: 'bord', art: 'het', en: 'the plate', w: 'het bord. Learn it with its article: there is no rule.' },
    ] }]);
})();
