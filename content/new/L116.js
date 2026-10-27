// Nachtrit, Nijmegen (tier 12, B1 to B2): level 116 De winkels. The Lange Hezelstraat, called the oldest shopping street in the
// country, then up the hill to the Grote Markt and the Waag of 1612: a shoe shop full of walking shoes before the Vierdaagse,
// the chemist with the blister plasters, the bakery, the bike repairer, the bookshop. Paying, sizes, receipts, a complaint by
// letter, and the shop assistants who still say u.
// New at tier 12 and drilled here: modal particles in the shop (Zegt u het maar, Kijkt u maar even rond, ik kijk alleen even rond,
// U verkoopt toch ook ..., de drogist is wel open), with the fixed order maar even and the small pronoun before maar; idioms about
// money (voor een appel en een ei, een rib uit je lijf, een kat in de zak kopen, als een trein lopen and de deur uit vliegen in the
// reads); compound nouns (het stadscentrum with its linking s, de sportwinkel, het winkelcentrum); the formal register (zegt u, kijkt
// u, volgt u, Geachte heer, mevrouw, In afwachting van uw antwoord, met vriendelijke groet); the Vierdaagse date (the third
// Tuesday of July) and breaking in new shoes before it.
// Review: the passive with worden, indirect speech with zei dat and zou, the plusquamperfectum with V2 after a toen-clause, die and
// dat, the comparative, er zijn, niet against geen, the adjective -e, a modal with an infinitive and a separable verb (inlopen),
// 't kofschip, het bonnetje as a diminutive, erbij.
// Still inside the fence: 16 words max, nothing from tier 13 (no builds with three forks, no tourist register).
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, modale werkwoorden, scheidbare werkwoorden, die vs dat,
// 't kofschip, de vs het; _site/situations/supermarket (Wilt u een tasje erbij, Spaart u zegels), polite-phrases (Kunt u mij helpen,
// Mag ik u iets vragen); level 108 for the replayed words (de kassabon, de korting, het pashokje, de garantie) and 114 (de
// boekhandel); content/towns.js for Nijmegen (de Waag, de Grote Markt, de Vierdaagse, de wandelaar, the rivalry with Maastricht).
// New rules: idioom, samen, formeel, datum (guarded, same text in every Nijmegen and Amsterdam file). passief, indirect,
// vergelijk, verklein, pronadv and er are guarded copies of the existing definitions; the rest are in data.js.
// New props: none. Only hond, fiets and nummer are used (not winkel: de sportwinkel, de winkelstraat and de boekhandel would read
// as right answers for a shop front).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.verklein = window.RULES.verklein || { name: 'Diminutives: -je, -tje, -etje, always het', note: 'de-of-het-articles' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erbij, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.er = window.RULES.er || { name: 'er is, er zijn', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 116, act: 12, name: 'De winkels', town: 'nijmegen', place: 'winkels', theme: 'shops', ...P,
    intro: 'The Lange Hezelstraat is called the oldest shopping street in the country. Maastricht disagrees, and has not bought anything here since.',
    introNl: 'De Lange Hezelstraat heet de oudste winkelstraat van het land. Maastricht is het daar niet mee eens en koopt hier sindsdien niks meer.',
    mission: {
      where: 'The Lange Hezelstraat, the oldest shopping street in the country, then up the hill to the Grote Markt and the Waag of 1612, past the shoe shop, the chemist, the bike repairer and the bookshop. In June every shop window is full of walking shoes and blister plasters, because in July the whole town walks.',
      carry: "Paola's list, two dogs on leads, a gift voucher for a shop that closed in the mist, a receipt split to the cent with the neighbours, and the grammar book, still never opened. No helmet. The cobbles of the Benedenstad were here long before helmets.",
      want: 'Since the mist the dead stand behind every counter, and they are as polite as ever. Zegt u het maar. Kijkt u maar even rond. Mag het iets meer zijn? They speak to you with u, they sell compound words by the metre, de wandelschoen, de blarenpleister, de cadeaubon, and they still know a bargain when they see one: voor een appel en een ei. The women in the queue are still taller than you, and here, south of the Waal, it is friet.' },
    items: [
      // ---- builds: particles and the polite shop assistant
      { en: 'What can I get you?', parts: [FK(['Zegt u het maar', 'Zeg u het maar', 'Zegt u maar het'], 0, 'formeel',
        'With u the verb keeps its -t, even when it comes first: zegt u. And the small pronoun het comes before maar.'), '.'] },
      { en: "No thanks, I'm just looking.", parts: ['Nee hoor, ik kijk alleen', FK(['even rond', 'rond even'], 0, 'soft',
        'even sits in the middle, and the prefix of rondkijken goes to the very end: ik kijk even rond.'), '.'] },
      { en: 'Just have a look around, sir.', parts: [FK(['Kijkt u', 'Kijk u'], 0, 'formeel',
        'With u the verb takes -t, also in a polite request: kijkt u.'), FK(['maar even', 'even maar'], 0, 'soft',
        'Two small words keep a fixed order: maar before even. The other order is not Dutch.'), 'rond, meneer.'] },
      { en: 'It is a little over. Is that all right?', parts: ['Het is iets meer geworden. Mag het', FK(['iets meer zijn', 'meer iets zijn', 'iets meer is'], 0, 'modal',
        'After mag the verb zijn stays an infinitive at the end, and iets meer comes before it. The shop assistant asks this when the slice came out big.'), '?'] },
      { en: 'Just follow me, the fitting rooms are at the back.', parts: [FK(['Volgt u mij maar', 'Volg u mij maar'], 0, 'formeel',
        'With u the verb keeps its -t: volgt u. Without the -t it is not Dutch.'), ', de paskamers zijn achterin.'] },
      { en: "You also sell blister plasters, don't you?", parts: ['U verkoopt', FK(['toch', 'hoor'], 0, 'soft',
        'toch in the middle of a question expects a yes: surely you sell them. hoor only comes at the end of a statement.'), 'ook blarenpleisters?'] },
      { en: 'The bakery is closed, but the chemist is open.', parts: ['De bakker is dicht, maar de drogist is', FK(['wel', 'geen'], 0, 'soft',
        'wel stresses the contrast: this one is open. geen needs a noun after it.'), 'open.'] },

      // ---- builds: idioms about money
      { en: 'I bought these walking socks for next to nothing.', parts: ['Ik heb deze wandelsokken voor', FK(['een appel en een ei', 'een peer en een ei', 'een appel en een peer'], 0, 'idioom',
        'voor een appel en een ei means very cheap. The words of the saying never change.'), FK(['gekocht', 'gekoopt'], 0, 'perf',
        'kopen is irregular: gekocht.'), '.'] },
      { en: 'Those new walking shoes cost an arm and a leg.', parts: ['Die nieuwe wandelschoenen kosten', FK(['een rib uit je lijf', 'een arm en een been', 'een rib uit je been'], 0, 'idioom',
        'In Dutch something very expensive costs a rib out of your body: een rib uit je lijf. An arm and a leg is English.'), '.'] },
      { en: "Don't buy a pig in a poke: try the shoes on first.", parts: ['Koop', FK(['geen', 'niet'], 0, 'neg',
        'kat is a noun without an article here, so geen.'), FK(['kat in de zak', 'hond in de zak', 'kat in de tas'], 0, 'idioom',
        'een kat in de zak kopen is a fixed phrase: to buy something without checking it. Only a cat, only a zak.'), ', pas de schoenen eerst even.'] },

      // ---- builds: compound nouns and a diminutive
      { en: 'The sports shop is in the city centre, next to the bookshop.', parts: [FK(['De', 'Het'], 0, 'samen',
        'sport + winkel: winkel is de, so de sportwinkel.'), 'sportwinkel zit in', FK(['het stadscentrum', 'de stadscentrum', 'het stadcentrum'], 0, 'samen',
        'stad + s + centrum, glued with an s, and centrum is het, so het stadscentrum.'), ', naast de boekhandel.'] },
      { en: 'Would you like the receipt with it?', parts: ['Wilt u', FK(['het', 'de'], 0, 'verklein',
        'Every -je word is het: het bonnetje, even though de bon is a de-word.'), 'bonnetje', FK(['erbij', 'ermee'], 0, 'pronadv',
        'iets erbij willen means to want it along with your shopping. ermee does not fit here.'), '?'] },

      // ---- builds: a complaint by letter
      { en: 'Dear Sir or Madam, the shoes I ordered were too small.', parts: ['Geachte heer, mevrouw, de schoenen', FK(['die', 'dat'], 0, 'diedat',
        'schoenen is a plural, and every plural takes die.'), 'ik', FK(['bestelde', 'besteldde', 'bestelte'], 0, 'kof',
        'bestel ends in l, not a ketchup letter: bestelde with one d.'), 'waren te klein.'] },
      { en: 'Awaiting your reply, kind regards, Santi Sanchez.', parts: [FK(['In afwachting van', 'In wachting van', 'In verwachting van'], 0, 'formeel',
        'In afwachting van uw antwoord is the fixed line for awaiting your reply. In verwachting means pregnant.'), 'uw antwoord, met', FK(['vriendelijke', 'vriendelijk'], 0, 'adj',
        'groet is a de-word, so the adjective takes -e: met vriendelijke groet.'), 'groet, Santi Sanchez.'] },

      // ---- builds: the Vierdaagse
      { en: 'You have to break in new walking shoes before the Vierdaagse.', parts: [FK(['Nieuwe', 'Nieuw'], 0, 'adj',
        'wandelschoenen is a plural, and before a plural the adjective takes -e.'), 'wandelschoenen moet je voor de Vierdaagse eerst', FK(['inlopen', 'in te lopen', 'lopen in'], 0, 'modal',
        'After moet the infinitive goes to the end in one piece: inlopen. No te after a modal.'), '.'] },
      { en: 'The Vierdaagse always starts on the third Tuesday of July.', parts: ['De Vierdaagse begint altijd', FK(['op de derde dinsdag', 'in de derde dinsdag', 'op de drie dinsdag'], 0, 'datum',
        'Days take op, and the third is derde: op de derde dinsdag.'), 'van juli.'] },

      // ---- builds: review of earlier tiers
      { en: 'The new walking shoes are delivered tomorrow.', parts: ['De nieuwe wandelschoenen', FK(['worden', 'wordt'], 0, 'passief',
        'Shoes are plural, so worden: worden geleverd.'), 'morgen', FK(['geleverd', 'gelevert', 'geleverdt'], 0, 'kof',
        'lever ends in r, not a ketchup letter, so -d: geleverd.'), '.'] },
      { en: 'The salesman said that the shoes would still stretch.', parts: ['De verkoper zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement. of belongs to a reported question.'), 'de schoenen', FK(['nog wel zouden uitrekken', 'zouden nog wel uitrekken'], 0, 'bijzin',
        'In a sub-clause the verbs stand together at the end, and nog wel comes before them.'), '.'] },
      { en: 'The shoes I bought here are cheaper than in Maastricht.', parts: ['De schoenen', FK(['die', 'dat'], 0, 'diedat',
        'A plural takes die.'), 'ik hier kocht, zijn', FK(['goedkoper', 'goedkoopste', 'meer goedkoop'], 0, 'vergelijk',
        'With dan you need the comparative: goedkoper dan.'), 'dan in Maastricht.'] },
      { en: 'When I got to the baker, the walkers had already bought up all the rolls.', parts: ['Toen ik bij de bakker kwam,', FK(['hadden de wandelaars', 'de wandelaars hadden'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: hadden de wandelaars.'), 'alle broodjes al', FK(['opgekocht', 'geopkocht', 'opgekoopt'], 0, 'sep',
        'The ge goes in the middle of a separable verb: op + gekocht.'), '.'] },
      { en: 'There are no walking socks left in my size.', parts: [FK(['Er zijn', 'Er is'], 0, 'er',
        'wandelsokken is plural, so er zijn.'), FK(['geen', 'niet'], 0, 'neg',
        'A noun without an article takes geen.'), 'wandelsokken meer in mijn maat.'] },

      // ---- words: shops, paying, sizes, the walk ahead, five replayed from Maastricht
      { w: 'the walking shoe', nl: 'de wandelschoen' }, { w: 'the walking sock', nl: 'de wandelsok' },
      { w: 'the blister plaster', nl: 'de blarenpleister' }, { w: 'the gift voucher', nl: 'de cadeaubon' },
      { w: 'the loyalty card', nl: 'de klantenkaart' }, { w: 'the shop window', nl: 'de etalage' },
      { w: 'the shopping street', nl: 'de winkelstraat' }, { w: 'the city centre', nl: 'het stadscentrum', wrong: 'de stadscentrum' },
      { w: 'the chemist (for plasters and shampoo)', nl: 'de drogist' }, { w: 'the bike repairer', nl: 'de fietsenmaker' },
      { w: 'the small change', nl: 'het kleingeld', wrong: 'de kleingeld' }, { w: 'the shoe size', nl: 'de schoenmaat' },
      { w: 'the queue', nl: 'de rij' }, { w: 'the weigh house on the Grote Markt', nl: 'de Waag' },
      { w: 'the bookshop', nl: 'de boekhandel' }, { w: 'the receipt', nl: 'de kassabon' },
      { w: 'the discount', nl: 'de korting' }, { w: 'the fitting room', nl: 'het pashokje', wrong: 'de pashokje' },
      { w: 'the warranty', nl: 'de garantie' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Dat is wel duur, hè?', o: ["That is quite expensive, isn't it?", 'That is not expensive at all.', "That is cheap, isn't it?"], a: 0, r: 'soft',
        w: 'wel here makes duur a little stronger, and hè asks you to agree. Nothing in it says cheap.' },
      { read: true, nl: 'Kunt u mij vertellen waar de paskamers zijn?', o: ['Could you tell me where the fitting rooms are?', 'Could you take me to the fitting rooms?', 'Can I tell you where the fitting rooms are?'], a: 0, r: 'formeel',
        w: 'u is the one you ask and mij is you: can you tell me. vertellen is tell, not take.' },
      { read: true, nl: 'De verkoop van wandelschoenen loopt als een trein.', o: ['Walking shoes are selling extremely well.', 'Walking shoes are sold at the station.', 'Walking shoes sell as slowly as a train.'], a: 0, r: 'idioom',
        w: 'als een trein lopen is a fixed phrase: it goes smoothly and fast. Nobody takes a train.' },
      { read: true, nl: 'In de uitverkoop vlogen de schoenen de deur uit.', o: ['In the sale the shoes sold very fast.', 'In the sale the shoes were thrown out of the shop.', 'In the sale the door was left open.'], a: 0, r: 'idioom',
        w: 'de deur uit vliegen means selling very fast. Nothing actually flies.' },
      { read: true, nl: 'De Lange Hezelstraat heet de oudste winkelstraat van Nederland.', en: 'The Lange Hezelstraat is called the oldest shopping street in the Netherlands.' },
      { read: true, nl: 'In juni liggen er in elke etalage wandelschoenen.', en: 'In June there are walking shoes in every shop window.' },

      // ---- listens: a street, a square, a price and a sale, by ear
      { listen: true, nl: 'de Lange Hezelstraat', en: 'the old shopping street' }, { listen: true, nl: 'de Grote Markt', en: 'the main square' },
      { listen: true, nl: 'vijftien euro vijfennegentig', en: '€ 15,95' }, { listen: true, nl: 'de uitverkoop', en: 'the clearance sale' },

      // ---- looks: the dog, a bike at the repairer, a house number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'nummer', value: 12, nl: 'twaalf', en: '12' },

      // ---- de of het
      { dehet: true, nl: 'winkelcentrum', art: 'het', en: 'the shopping centre', w: 'The last part decides: het centrum, so het winkelcentrum.' },
      { dehet: true, nl: 'prijskaartje', art: 'het', en: 'the price tag', w: 'Every -je word is het: het prijskaartje.' },
    ] }]);
})();
