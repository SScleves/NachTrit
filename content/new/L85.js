// Nachtrit, Urk (tier 8, B1): level 85 Eten en drinken. The harbour of Urk on a Saturday night: the fish auction, the snack
// bar and the kibbeling stall on the quay, a café with steamed windows, a restaurant with the dagschotel on the board, and
// everything closing early because on Urk the Sunday rest is serious. Ordering, the fish, the bill, paying cash, splitting it.
// New at tier 8 and drilled here: sub-clauses with the verb at the end after omdat, dat, als, toen, terwijl and voordat
// (no separable verbs inside the sub-clause builds: that is tier 10), the main clause after a sub-clause that starts
// with its verb (Voordat we betalen, bestel ik ...), toen for one moment in the past against als for now or every time,
// and want, maar, dus keeping the normal main-clause order.
// Review of earlier tiers: imperfectum (kwam, sliepen, bleven, bestelden, verveelden), 't kofschip (bestelden),
// perfectum (gegeten), zou plus infinitive (Zou u me kunnen zeggen), comparatives and superlatives (de lekkerste),
// reflexives (verveelden zich), adjective -e (een warme appeltaart), geen against niet, V2 after a fronted phrase.
// Still inside the fence: 14 words max; no relative clauses, no te plus infinitive, no passive.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde (omdat, als, dat, wanneer, terwijl, voordat,
// the bonus rule: bijzin first, then the verb), V2 word order, imperfectum, 't kofschip, perfectum, zachtmakers, niet vs geen;
// _site/situations/restaurant (Mag ik de kaart zien, Is alles naar wens, Kunnen we apart betalen, Mag ik de rekening),
// pub (Mogen we afrekenen), takeaway (Ik heb online al betaald); MOC Voegwoorden (want, dus, omdat, als, dat, toen, terwijl);
// content/towns.js for Urk (de visafslag, de kotter, de vissersvloot, de zondagsrust, de klederdracht, de kraplap, the
// Sunday joke: on Urk nothing moves on Sunday, not even the dead, they are in church); replay from level 77 (de rekening,
// de fooi, de haring).
// New rules: none (bijzin, v2, neg, imp, kof, perf, refl, adj are in data.js; zou and vergelijk are guarded below).
// New props: none. Only hond, kerk and deur are used (not winkel, water, lamp, huis or brug: the word pool has no
// de winkel, het water, de lamp, het huis or de brug, and the sentences mention none of them as an item).
(() => {
  window.RULES.zou = window.RULES.zou || { name: 'zou for polite requests', note: 'zachtmakers - wel even maar' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  const P = window.TIER_PRESET[8];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 85, act: 8, name: 'Eten en drinken', town: 'urk', place: 'eten', theme: 'dyke', ...P,
    intro: 'Urk has the freshest fish in the country and the longest Sundays. The dead order on time, and they still split the bill.',
    introNl: 'Urk heeft de verste vis van het land en de langste zondagen. De doden bestellen op tijd en delen de rekening nog steeds.',
    mission: {
      where: 'The harbour of Urk on a Saturday night: the fish auction, the kibbeling stall between the cutters, a café with steamed windows, a restaurant with the dish of the day chalked on a board. Everything closes early, because tomorrow is the Sunday rest and the Sunday rest is not a suggestion.',
      carry: 'A wallet with exact change, a paper bag of kibbeling going cold, two dogs who have found every fish crate on the quay, and the grammar book, never opened. No helmet. The wind off the IJsselmeer takes the napkins first and the opinions second.',
      want: 'Since the mist the dead of Urk eat out in strict order: they order, they wait, and then they explain why. Omdat, dat, als, toen, terwijl, voordat: the verb goes to the end of the clause and stays there. The women in their kraplap, still taller than you, check the end of every line. Then, as always, the bill is split.' },
    items: [
      // ---- builds: omdat, dat, toen, als, terwijl, voordat, and the verb that goes to the end
      { en: 'On the quay I eat a tub of kibbeling because I am hungry.', parts: ['Op de kade', FK(['eet ik', 'ik eet'], 0, 'v2',
        'Op de kade takes slot 1, so the verb comes second: eet ik.'), 'een bakje kibbeling', FK(['omdat ik honger heb', 'omdat ik heb honger', 'omdat heb ik honger'], 0, 'bijzin',
        'omdat opens a sub-clause and sends the verb to the end: honger heb.'), '.'] },
      { en: 'Paola eats no fish, because she does not like it.', parts: ['Paola eet', FK(['geen', 'niet'], 0, 'neg',
        'vis has no article here, so the negative is geen.'), 'vis,', FK(['want ze lust het niet', 'want lust ze het niet'], 0, 'v2',
        'want does not send the verb to the end. After want the clause keeps its normal order: ze lust.'), '.'] },
      { en: 'I want to order, but the waiter does not come.', parts: ['Ik wil bestellen,', FK(['maar de ober komt niet', 'maar de ober niet komt'], 0, 'v2',
        'maar is not a sub-clause word. The clause after it keeps its normal order: the verb komt stays right after the subject.'), '.'] },
      { en: 'When we arrived yesterday, the café was already full.', parts: [FK(['Toen', 'Als'], 0, 'bijzin',
        'toen is for one moment in the past, and gisteren is exactly that. als is for now, later or every time.'), 'wij gisteren', FK(['kwamen', 'komen', 'kwam'], 0, 'bijzin',
        'Past and plural: wij kwamen. In a sub-clause the verb stands at the end.'), ', was het café al vol.'] },
      { en: 'Before we pay, I order another coffee.', parts: [FK(['Voordat we betalen', 'Voordat betalen we'], 0, 'bijzin',
        'voordat sends the verb to the end: voordat we betalen.'), ',', FK(['bestel ik', 'ik bestel'], 0, 'bijzin',
        'When the sub-clause comes first, the main clause starts with its verb: bestel ik.'), 'nog een koffie.'] },
      { en: 'While I eat, Paola calls her mother.', parts: ['Terwijl ik eet,', FK(['belt Paola', 'Paola belt'], 0, 'bijzin',
        'The sub-clause with terwijl comes first, so the next clause starts with its verb: belt Paola.'), 'haar moeder.'] },
      { en: 'If the terrace is full, we sit inside.', parts: [FK(['Als het terras vol is', 'Als het terras is vol'], 0, 'bijzin',
        'als sends the verb to the end: vol is.'), ',', FK(['zitten we', 'we zitten'], 0, 'bijzin',
        'After a sub-clause the main clause starts with its verb: zitten we.'), 'binnen.'] },
      { en: 'When the bill came, the dogs were already asleep.', parts: ['Toen de rekening', FK(['kwam', 'komde'], 0, 'imp',
        'komen is irregular: kwam, not komde.'), ',', FK(['sliepen de honden', 'de honden sliepen', 'slaapten de honden'], 0, 'bijzin',
        'The sub-clause came first, so the verb of the main clause comes next: sliepen de honden. slapen is irregular: sliep, sliepen.'), 'al.'] },
      { en: 'We sat there a long time because the eel was so good.', parts: ['We', FK(['bleven', 'blijfden'], 0, 'imp',
        'blijven is irregular: bleef, and bleven for we.'), 'lang zitten', FK(['omdat de paling zo lekker was', 'omdat de paling zo was lekker'], 0, 'bijzin',
        'omdat sends the verb to the end: lekker was.'), '.'] },
      { en: 'I have eaten nothing since this morning, so I am hungry.', parts: ['Ik heb sinds vanochtend niks', FK(['gegeten', 'geëten', 'gegeet'], 0, 'perf',
        'eten is irregular: gegeten.'), ',', FK(['dus ik heb honger', 'dus ik honger heb'], 0, 'v2',
        'dus is not a sub-clause word. The clause keeps its normal order: ik heb honger.'), '.'] },
      { en: 'We pay cash because we cannot pay by card.', parts: ['Wij betalen contant', FK(['omdat we niet kunnen pinnen', 'omdat kunnen we niet pinnen', 'omdat we kunnen niet pinnen'], 0, 'bijzin',
        'omdat sends every verb to the end, kunnen and pinnen together, and niet stays in front of them.'), '.'] },
      { en: 'Could you tell me when the kitchen closes?', parts: ['Zou u me', FK(['kunnen zeggen', 'kan zeggen'], 0, 'zou',
        'zou makes it polite and the next verb is an infinitive: kunnen zeggen.'), FK(['wanneer de keuken sluit', 'wanneer sluit de keuken'], 0, 'bijzin',
        'Asked inside a sentence, wanneer opens a sub-clause: the verb goes to the end, de keuken sluit.'), '?'] },
      { en: 'I think this is the tastiest kibbeling of Urk.', parts: ['Ik denk', FK(['dat dit', 'dat is dit'], 0, 'bijzin',
        'dat opens a sub-clause, so the verb waits at the end and cannot sit behind dat.'), 'de', FK(['lekkerste', 'lekkerder', 'lekkerst'], 0, 'vergelijk',
        'The best of all is the adjective plus -ste after de: de lekkerste. lekkerder only compares two.'), 'kibbeling van Urk is.'] },
      { en: 'The dogs got bored while we waited for the bill.', parts: ['De honden verveelden', FK(['zich', 'zij'], 0, 'refl',
        'A third person (de honden) takes zich: zich vervelen.'), FK(['terwijl wij op de rekening wachtten', 'terwijl wachtten wij op de rekening'], 0, 'bijzin',
        'terwijl sends the verb to the end: wij op de rekening wachtten.'), '.'] },
      { en: 'On Sunday everything on Urk is closed because everybody is in church.', parts: ['Op zondag is alles op Urk dicht', FK(['omdat iedereen in de kerk zit', 'omdat iedereen zit in de kerk'], 0, 'bijzin',
        'omdat sends the verb to the end: in de kerk zit.'), '.'] },
      { en: 'The waiter says the eel is sold out.', parts: ['De ober zegt', FK(['dat de paling op is', 'dat de paling is op'], 0, 'bijzin',
        'dat opens a sub-clause, so is goes to the end: op is.'), '.'] },
      { en: 'We ordered the dish of the day before the kitchen closed.', parts: ['Wij', FK(['bestelden', 'bestelde'], 0, 'kof',
        'bestel ends in l, which is not a ketchup letter, so -de, and wij is plural: bestelden.'), 'de dagschotel', FK(['voordat de keuken sloot', 'voordat sloot de keuken'], 0, 'bijzin',
        'voordat sends the verb to the end: voordat de keuken sloot.'), '.'] },
      { en: 'I would like a warm apple pie with cream, because it is cold.', parts: ['Ik wil graag een', FK(['warm', 'warme'], 1, 'adj',
        'appeltaart is a de-word, so after een the adjective takes -e: een warme appeltaart.'), 'appeltaart met slagroom', FK(['omdat het is koud', 'omdat het koud is'], 1, 'bijzin',
        'omdat sends the verb to the end: koud is.'), '.'] },

      // ---- words: the menu, the table, the bill, the quay
      { w: 'the kibbeling (fried fish bites)', nl: 'de kibbeling' }, { w: 'the eel', nl: 'de paling' },
      { w: 'the beer', nl: 'het bier', wrong: 'de bier' }, { w: 'the dish of the day', nl: 'de dagschotel' },
      { w: 'the main course', nl: 'het hoofdgerecht', wrong: 'de hoofdgerecht' }, { w: 'the wine list', nl: 'de wijnkaart' },
      { w: 'the napkin', nl: 'het servet', wrong: 'de servet' }, { w: 'the glass', nl: 'het glas' },
      { w: 'the change', nl: 'het wisselgeld', wrong: 'de wisselgeld' }, { w: 'the receipt', nl: 'het bonnetje' },
      { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the tomato', nl: 'de tomaat' },
      { w: 'the thirst', nl: 'de dorst' }, { w: 'the bitterbal', nl: 'de bitterbal' },
      { w: 'the bill', nl: 'de rekening' }, { w: 'the tip', nl: 'de fooi' }, { w: 'the herring', nl: 'de haring' },

      // ---- reads: three traps with their own options, three lines from the table
      { read: true, nl: 'Ik betaal contant omdat de pinautomaat stuk is.', o: ['I pay cash because the card machine is broken.', 'I pay by card because the cash machine is broken.', 'I will pay cash if the card machine breaks.'], a: 0, r: 'bijzin',
        w: 'omdat gives the reason, and the verb is goes to the end after stuk: the machine is broken now. contant means cash.' },
      { read: true, nl: 'Ik neem nog een koffie voordat ik naar huis ga.', o: ['I am having another coffee before I go home.', 'I am having another coffee after I get home.', 'I have had coffee, so I am going home.'], a: 0, r: 'bijzin',
        w: 'voordat means before. The coffee comes first, going home second.' },
      { read: true, nl: 'Toen wij binnenkwamen, zat de hele kerk al aan tafel.', o: ['When we came in, the whole church was already at the table.', 'When we come in, the whole church will be at the table.', 'The whole church came in while we sat at the table.'], a: 0, r: 'bijzin',
        w: 'toen with an imperfectum is one moment in the past. zat is the past of zitten, and it opens the main clause.' },
      { read: true, nl: 'Terwijl wij aten, belde de buurman drie keer.', en: 'While we were eating, the neighbour called three times.' },
      { read: true, nl: 'Het eten was koud, dus we zijn niet lang gebleven.', en: 'The food was cold, so we did not stay long.' },
      { read: true, nl: 'Kunnen we apart betalen, of delen we de rekening?', en: 'Can we pay separately, or do we split the bill?' },

      // ---- listens: a connector and a price by ear, one Urk word
      { listen: true, nl: 'voordat', en: 'before' }, { listen: true, nl: 'achttien euro vijfentwintig', en: '€ 18,25' },
      { listen: true, nl: 'de visafslag', en: 'the fish auction' },

      // ---- looks: the dog under the table, the church bell, the door of the café
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'gerecht', art: 'het', en: 'the dish', w: 'het gerecht. Compounds take the article of the last word: het voorgerecht, het hoofdgerecht, het nagerecht.' },
      { dehet: true, nl: 'ober', art: 'de', en: 'the waiter', w: 'People are de: de ober, de buurman, de vrouw.' },
    ] }]);
})();
