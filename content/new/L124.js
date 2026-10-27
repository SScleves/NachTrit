// Nachtrit, Amsterdam (tier 13, B1 to B2): level 124 De winkels. The Albert Cuypmarkt in De Pijp, about 260 stalls under
// striped awnings along one long street since 1905, then across the canals to the Negen Straatjes between the Singel and the
// Prinsengracht, the flower market on the Singel, and back through the crowds of the Kalverstraat.
// New at tier 13 and drilled here: numbers and prices in words (een ons, een pond, drie euro vijftig, tachtig, veertien euro
// tachtig, twintig procent korting, tweehonderdzestig kramen), long builds with two and three forks, the market register
// (Zeg het maar, schat; drie halen, twee betalen) next to the polite register of the shop (Kan ik u helpen, Zou u het willen
// inpakken), directions in the city (de tweede straat rechts, op de hoek, liggen tussen), subtle reading pairs (uitverkocht
// against in de uitverkoop, a half pond), and het Singel, the Amsterdam de/het surprise.
// Review of every tier: V2, the passive with worden and zijn, die for a de-word, the plural kramen, om ... te, erbij krijgen,
// hoeft niet te, a sub-clause in an indirect question, a reported sentence with the plusquamperfectum, the comparative
// duurder with veel, zou with an infinitive, deze for a de-word, a modal particle in a command, a compound with -en-.
// Sources: dutch-lessons vault, _site/situations/supermarket (Kan ik pinnen, Wilt u een tasje erbij, Mag ik er nog een bij,
// Dat was het), butcher, polite-phrases (Kunt u mij helpen); 02 - Grammar/V2 word order, bijzin, scheidbare werkwoorden,
// trappen van vergelijking; MOC Getallen; level 116 for the replayed words (de etalage, de cadeaubon, de rij, het kleingeld)
// and 108 (de kassa); content/towns.js for Amsterdam (de Albert Cuypmarkt since 1905 with about 260 stalls, de toerist,
// de gracht, the bells and the bikes).
// New rules: weg (guarded, the same text in every Amsterdam file); samen keeps the Nijmegen text. omte, pronadv, passief,
// meervoud, vergelijk and zou are guarded copies of the existing definitions.
// New props: none. Only hond, fiets and nummer are used (not winkel: de kaaswinkel and de souvenirwinkel are in the word pool).
(() => {
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erbij, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.meervoud = window.RULES.meervoud || { name: 'Plurals: -en, -s', note: 'meervoud-plurals' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 124, act: 13, name: 'De winkels', town: 'amsterdam', place: 'winkels', theme: 'shops', ...P,
    intro: 'At the Albert Cuyp the traders have been calling out their prices since 1905. The mist has not managed to shut them up.',
    introNl: 'Op de Albert Cuyp roepen de marktkooplui al sinds 1905 hun prijzen om. De mist heeft ze niet stilgekregen.',
    mission: {
      where: 'The Albert Cuypmarkt in De Pijp, about two hundred and sixty stalls under striped awnings along one long street, then across the canals to the Negen Straatjes, small shops between the Singel and the Prinsengracht, past the flower market and back through the crowds of the Kalverstraat.',
      carry: "Paola's list in ounces and pounds, a bag of fresh syrup waffles split to the cent with the neighbours, two dogs who want everything on the fish stall, and the grammar book, still never opened. No helmet. Mind the bikes in the market street.",
      want: 'Since the mist the dead still run every stall, and they sell in the old units: een ons, een pond, drie halen twee betalen. They speak one way to tourists and another to the neighbourhood, they want the price in words and the change to the cent, and they will tell you exactly where the cheese shop is, second street on the right, on the corner. The women at the stalls are still taller than you. Nobody here switches to English any more.' },
    items: [
      // ---- builds: the market, units and prices
      { en: 'May I have two hundred grams of young cheese? Two ounces, then.', parts: ['Mag ik tweehonderd gram', FK(['jonge', 'jong'], 0, 'adj',
        'kaas is a de-word, so the adjective takes -e: jonge kaas.'), 'kaas?', FK(['Twee ons', 'Twee onsen', 'Twee onzen'], 0, 'getal',
        'A unit after a number stays singular: twee ons, twee kilo. One ons is a hundred grams.'), 'dus.'] },
      { en: 'A pound of cherries, that is five hundred grams, costs three euros fifty.', parts: ['Een pond kersen, dat is', FK(['vijfhonderd', 'vijftig', 'honderd'], 0, 'getal',
        'At a Dutch stall een pond is half a kilo: vijfhonderd gram.'), 'gram, kost', FK(['drie euro vijftig', 'drie vijftig euro'], 0, 'getal',
        'Euros first, then the cents: drie euro vijftig. In speech you may drop euro, but it never comes last.'), '.'] },
      { en: 'With twenty percent discount the jacket costs eighty euros instead of a hundred.', parts: ['Met twintig procent korting', FK(['kost de jas', 'de jas kost'], 0, 'v2',
        'The discount phrase fills slot 1, so the verb comes second: kost de jas.'), FK(['tachtig', 'achttig', 'tachttig'], 0, 'getal',
        'Eighty is tachtig, with a t in front: the one ten that does not sound like its number.'), 'euro', FK(['in plaats van', 'in plaats voor'], 0, 'woord',
        'in plaats van means instead of. The preposition is always van.'), 'honderd.'] },
      { en: 'That comes to fourteen euros eighty, please.', parts: ['Dat is dan', FK(['veertien', 'viertien'], 0, 'getal',
        'vier becomes veer- in veertien and veertig.'), 'euro', FK(['tachtig', 'achttig'], 0, 'getal',
        'Eighty is tachtig.'), ', alstublieft.'] },
      { en: 'If you take two kilos, you get a bag of onions free with it.', parts: ['Als je twee kilo neemt,', FK(['krijg je er', 'je krijgt er'], 0, 'v2',
        'The als-clause fills slot 1, so the main clause starts with its verb: krijg je.'), FK(['een zak uien gratis bij', 'een zak uien bij gratis'], 0, 'pronadv',
        'erbij krijgen splits: er comes early, bij goes to the very end.'), '.'] },
      { en: 'Can I pay by card? No, at this stall it is cash only.', parts: ['Kan ik pinnen? Nee, bij', FK(['deze', 'dit'], 0, 'dehet',
        'kraam is a de-word, so deze kraam. dit goes with het-words.'), 'kraam', FK(['kan alleen contant', 'kan contant alleen'], 0, 'woord',
        'alleen comes before what it limits: alleen contant, cash only.'), '.'] },
      { en: 'The fresh syrup waffles are sold out, just come back tomorrow.', parts: ['De verse stroopwafels', FK(['zijn uitverkocht', 'hebben uitverkocht'], 0, 'passief',
        'The waffles are the ones sold, so zijn plus the participle: zijn uitverkocht.'), ',', FK(['kom morgen maar terug', 'kom morgen terug maar'], 0, 'soft',
        'maar sits in the middle, and the prefix terug closes the command.'), '.'] },

      // ---- builds: the market as a place
      { en: 'At the Albert Cuyp the syrup waffles are baked fresh in front of you.', parts: ['Op de Albert Cuyp', FK(['worden de stroopwafels', 'de stroopwafels worden'], 0, 'v2',
        'Op de Albert Cuyp fills slot 1, so the verb comes second: worden de stroopwafels.'), 'vers voor je ogen', FK(['gebakken', 'gebakt'], 0, 'perf',
        'bakken is irregular: gebakken.'), '.'] },
      { en: 'The market, which has been there since 1905, has about two hundred and sixty stalls.', parts: ['De markt,', FK(['die', 'dat'], 0, 'diedat',
        'markt is a de-word, so the relative pronoun is die.'), 'er al sinds 1905 is, heeft ongeveer tweehonderdzestig', FK(['kramen', 'kraamen', 'kraams'], 0, 'meervoud',
        'de kraam becomes kramen: the syllable is open, so one a is enough.'), '.'] },
      { en: "Just have a look, you don't have to buy anything.", parts: ['Kijk maar rustig rond, je', FK(['hoeft niks te kopen', 'moet niks te kopen'], 0, 'mag',
        'Not necessary is hoeft ... te: je hoeft niks te kopen. moeten never takes te.'), '.'] },

      // ---- builds: registers, the tourist and the trader
      { en: 'Can I help you? This cheese is for tasting.', parts: ['Kan ik u helpen? Deze kaas is', FK(['om te proeven', 'voor te proeven'], 0, 'omte',
        'Purpose with a verb is om ... te: om te proeven. voor te is not standard Dutch.'), '.'] },
      { en: 'Excuse me, would you know where I can buy tulip bulbs?', parts: ['Pardon, weet u misschien', FK(['waar ik tulpenbollen kan kopen', 'waar kan ik tulpenbollen kopen'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verbs go to the end.'), '?'] },
      { en: 'At the flower market on the Singel, love, five minutes from here.', parts: ['Op de', FK(['bloemenmarkt', 'bloemmarkt'], 0, 'samen',
        'This compound is glued with -en-: de bloemenmarkt, like het bloemenstalletje.'), 'aan het Singel, schat, vijf minuten', FK(['hiervandaan', 'hierheen'], 0, 'weg',
        'hiervandaan means away from here, how far. hierheen means to here.'), '.'] },
      { en: 'Could you wrap it as a present? It is for my wife.', parts: ['Zou u het als cadeau', FK(['willen inpakken', 'willen in te pakken'], 0, 'zou',
        'zou and willen take a bare infinitive at the end: willen inpakken, no te.'), '? Het is voor mijn vrouw.'] },
      { en: 'Dear customer, from Monday our shop is open again.', parts: ['Beste klant, vanaf maandag', FK(['is onze winkel', 'onze winkel is'], 0, 'v2',
        'vanaf maandag fills slot 1, so the verb comes second.'), 'weer open.'] },

      // ---- builds: directions to the shops
      { en: 'The cheese shop? Walk straight on, take the second street on the right, and it is on the corner.', parts: ['De kaaswinkel? Loop rechtdoor, neem', FK(['de tweede straat rechts', 'de twee straat rechts', 'de tweede rechts straat'], 0, 'weg',
        'An order needs the ordinal, tweede, and the side comes after the street: de tweede straat rechts.'), ', en hij zit', FK(['op de hoek', 'in de hoek'], 0, 'weg',
        'A shop on a street corner is op de hoek. in de hoek is inside a room.'), '.'] },
      { en: 'The Nine Streets lie between the Singel and the Prinsengracht.', parts: ['De Negen Straatjes', FK(['liggen', 'leggen'], 0, 'woord',
        'liggen is where something is. leggen is putting something down.'), FK(['tussen', 'tegen'], 0, 'weg',
        'tussen is between two things. tegen is against.'), 'het Singel en de Prinsengracht.'] },

      // ---- builds: review of earlier tiers
      { en: 'The trader said that he had already sold all the tulips.', parts: ['De koopman zei dat hij alle tulpen', FK(['al had verkocht', 'had al verkocht'], 0, 'bijzin',
        'In a dat-clause al stays in front of the verbs, which stand together at the end.'), '.'] },
      { en: 'The Nine Streets are smaller, quieter and much more expensive than the Kalverstraat.', parts: ['De Negen Straatjes zijn kleiner, rustiger en', FK(['veel', 'erg'], 0, 'vergelijk',
        'A comparative is made stronger with veel: veel duurder. erg goes with the plain adjective, erg duur.'), FK(['duurder', 'durer', 'meer duur'], 0, 'vergelijk',
        'After an r the comparative takes -der: duurder.'), 'dan de Kalverstraat.'] },

      // ---- words: the market, the shops, units, five replayed from Nijmegen
      { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the market trader', nl: 'de koopman' },
      { w: 'a hundred grams, at the market', nl: 'een ons' }, { w: 'half a kilo, at the market', nl: 'een pond' },
      { w: 'the syrup waffle', nl: 'de stroopwafel' }, { w: 'the cheese shop', nl: 'de kaaswinkel' },
      { w: 'the flower market', nl: 'de bloemenmarkt' }, { w: 'the tulip bulb', nl: 'de tulpenbol' },
      { w: 'the wrapping paper', nl: 'het cadeaupapier', wrong: 'de cadeaupapier' }, { w: 'the awning over a stall', nl: 'de luifel' },
      { w: 'the souvenir shop', nl: 'de souvenirwinkel' }, { w: 'the customer', nl: 'de klant' },
      { w: 'the cash machine', nl: 'de pinautomaat' }, { w: 'the till', nl: 'de kassa' },
      { w: 'the shop window', nl: 'de etalage' }, { w: 'the gift voucher', nl: 'de cadeaubon' },
      { w: 'the queue', nl: 'de rij' }, { w: 'the small change', nl: 'het kleingeld', wrong: 'de kleingeld' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'Drie halen, twee betalen.', o: ['Take three, pay for two.', 'Take two, pay for three.', 'Pay for three, get one free.'], a: 0, r: 'getal',
        w: 'halen is what you take home, betalen is what you pay for: three for the price of two.' },
      { read: true, nl: 'Deze jas is uitverkocht.', o: ['This jacket is sold out.', 'This jacket is in the sale.', 'This jacket has been sold to you.'], a: 0, r: 'woord',
        w: 'uitverkocht means there are none left. In the sale would be in de uitverkoop.' },
      { read: true, nl: 'Mag ik een half pond gehakt?', o: ['May I have 250 grams of mince?', 'May I have 500 grams of mince?', 'May I have 50 grams of mince?'], a: 0, r: 'getal',
        w: 'In a Dutch shop een pond is 500 grams, so half a pond is 250.' },
      { read: true, nl: 'Zeg het maar, schat.', o: ['What can I get you, love?', 'Tell me the price, darling.', 'Say that again, love.'], a: 0, r: 'cult',
        w: 'Zeg het maar is how the market asks what you want, and schat is what the traders call everyone.' },
      { read: true, nl: 'In Amsterdam zeggen ze het Singel, niet de Singel.', en: 'In Amsterdam they say het Singel, not de Singel.' },
      { read: true, nl: 'De Albert Cuypmarkt bestaat sinds 1905.', en: 'The Albert Cuyp market has been there since 1905.' },

      // ---- listens: the market, the Nine Streets, a price, the busy street
      { listen: true, nl: 'de Albert Cuypmarkt', en: 'the street market in De Pijp' }, { listen: true, nl: 'de Negen Straatjes', en: 'the Nine Streets between the canals' },
      { listen: true, nl: 'veertien euro tachtig', en: '€ 14,80' }, { listen: true, nl: 'de Kalverstraat', en: 'the busiest shopping street' },

      // ---- looks: the dog, a bike in the market street, a stall number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'nummer', value: 9, nl: 'negen', en: '9' },

      // ---- de of het
      { dehet: true, nl: 'kraampje', art: 'het', en: 'the little stall', w: 'Every -je word is het, even when de kraam is a de-word: het kraampje.' },
      { dehet: true, nl: 'marktplein', art: 'het', en: 'the market square', w: 'The last part decides: het plein, so het marktplein.' },
    ] }]);
})();
