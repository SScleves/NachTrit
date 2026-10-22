// Nachtrit, Den Haag (tier 6, A2+): level 69, Eten en drinken. The Haagse Markt, a herring cart in Scheveningen,
// the Kurhaus terrace, a toko behind the Binnenhof, ordering, the bill and splitting it.
// New at tier 6 and drilled here: the perfectum with hebben and zijn, regular participles with 't kofschip
// (gekookt, gedeeld, geproefd, gereserveerd), be- verbs without ge- (besteld), irregular participles
// (gegeten, gedronken, gegaan, geweest) and separable participles (afgerekend, opgehaald, opgegeten). 10 words max.
// Sources: dutch-lessons vault, 02 - Grammar (perfectum, zijn of hebben, 't kofschip, V2 word order),
// _site/situations/restaurant (we hebben gereserveerd op naam van Santiago, Is alles naar wens, Mag ik de rekening),
// takeaway (Ik heb online al betaald, Bestelling voor Santi), pub (Mogen we afrekenen), _site/words (eten heeft gegeten,
// afrekenen, opeten, het café, het restaurant, Ik ben vanmorgen naar de markt geweest),
// and content/towns.js for Den Haag (de marktkraam, Wat kost een bakje aardbeien, the Binnenhof in scaffolding,
// the debates, Scheveningen, het Kurhaus).
// New rules: none. aux, perf, kof, v2, mag reused from data.js.
// New props: none. Only water, winkel and nummer are used.
(() => {
  const P = window.TIER_PRESET[6];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 69, act: 6, name: 'Eten en drinken', town: 'denhaag', place: 'eten', theme: 'square', ...P,
    intro: 'Since the mist, the dead of Den Haag eat the way they govern. Three hours of debate over the menu, no decision, and the bill still split to the cent.',
    introNl: 'Sinds de mist eten de doden van Den Haag zoals ze regeren. Drie uur debat over het menu, geen besluit, en ze delen de rekening nog steeds tot op de cent.',
    mission: { where: 'The Haagse Markt, a herring cart in Scheveningen, the Kurhaus terrace and a toko behind the Binnenhof, which is still wrapped in scaffolding.',
      carry: 'Two dogs who need a walk, no helmet, and a receipt from last night that nobody wants. The grammar book is in the bike bag, still unopened.',
      want: 'Every ghost wants to know what you ate, who paid and where you have been. Heb or ben in slot 2, the participle at the end. The waitress is taller than you and checks every ge. At the herring cart you say Scheveningen correctly, or the herring stays on the cart.' },
    items: [
      // ---- builds: the perfectum, hebben or zijn, 't kofschip, irregular and separable participles
      { en: 'We ate herring in Scheveningen.', parts: ['We', FK(['hebben', 'zijn'], 0, 'aux', 'Eating goes nowhere: team hebben.'), 'in Scheveningen haring',
        FK(['gegeten', 'geëet', 'gegeet'], 0, 'perf', 'eten is irregular: ge plus the whole infinitive, gegeten.'), '.'] },
      { en: 'Who ordered the bitterballen?', parts: ['Wie', FK(['heeft', 'is'], 0, 'aux', 'Ordering is not movement: team hebben, and wie takes heeft.'), 'de bitterballen',
        FK(['besteld', 'gebesteld', 'bestelt'], 0, 'kof', 'Verbs that start with be- get no ge-. Stem bestel ends in l, so -d.'), '?'] },
      { en: 'We went to the Haagse Markt.', parts: ['We', FK(['zijn', 'hebben'], 0, 'aux', 'Going to a place is movement: team zijn.'), 'naar de Haagse Markt',
        FK(['gegaan', 'gegaat', 'gegaand'], 0, 'perf', 'gaan is irregular: gegaan.'), '.'] },
      { en: 'We already settled up.', parts: ['We hebben al', FK(['afgerekend', 'geafrekend', 'afgerekent'], 0, 'perf', 'afrekenen tucks ge in the middle: af-ge-rekend. Stem reken ends in n, so -d.'), '.'] },
      { en: 'I picked up the order at the toko.', parts: ['Ik heb de bestelling bij de toko',
        FK(['opgehaald', 'geophaald', 'opgehaalt'], 0, 'perf', 'ophalen tucks ge in the middle: op-ge-haald. Stem haal ends in l, so -d.'), '.'] },
      { en: 'The dogs ate all the bitterballen.', parts: ['De honden', FK(['hebben', 'heeft'], 0, 'perf', 'Two dogs, plural: hebben.'), 'alle bitterballen',
        FK(['opgegeten', 'geopgeten', 'opgeëten'], 0, 'perf', 'opeten: the prefix op first, then ge, then eten.'), '.'] },
      { en: 'Have you ever eaten Indonesian food?', parts: [FK(['Heb jij', 'Ben jij', 'Hebben jij'], 0, 'aux', 'Eating takes hebben, and a question opens with the verb. jij after it takes the bare stem: heb jij.'), 'al eens Indonesisch',
        FK(['gegeten', 'geëten', 'gegeet'], 0, 'perf', 'ge plus the whole infinitive eten: gegeten.'), '?'] },
      { en: 'We booked under the name Santiago.', parts: ['We hebben', FK(['gereserveerd', 'gereserveert', 'reserveerd'], 0, 'kof', 'Stem reserveer ends in r, not in t kofschip, so -d. And the ge stays.'), 'op naam van Santiago.'] },
      { en: 'The chef cooked all evening.', parts: ['De kok heeft de hele avond', FK(['gekookt', 'gekookd', 'gekoken'], 0, 'kof', 'Stem kook ends in k, and k is in t kofschip: -t.'), '.'] },
      { en: 'Paola has already tasted the herring.', parts: ['Paola heeft de haring al', FK(['geproefd', 'geproeft'], 0, 'kof', 'Check the infinitive: proeven has a v, and v is not in t kofschip, so -d. The f in the stem fools everyone.'), '.'] },
      { en: 'This morning I went to the market.', parts: ['Vanmorgen', FK(['ben ik', 'ik ben', 'heb ik'], 0, 'v2', 'Vanmorgen takes slot 1, so ben comes next and ik after it. Having been somewhere runs on zijn.'), 'naar de markt',
        FK(['geweest', 'gezijn', 'gebent'], 0, 'perf', 'zijn has its own participle: geweest.'), '.'] },
      { en: 'Of course we split the bill.', parts: ['Natuurlijk', FK(['hebben we', 'we hebben'], 0, 'v2', 'Natuurlijk takes slot 1, so the verb comes second and we after it.'), 'de rekening',
        FK(['gedeeld', 'gedeelt', 'gedelen'], 0, 'kof', 'Stem deel ends in l, not in t kofschip: -d. It still sounds like a t.'), '.'] },
      { en: 'Paola sent everyone a Tikkie for € 4,37.', parts: ['Paola heeft iedereen een Tikkie van vier euro zevenendertig',
        FK(['gestuurd', 'gestuurt', 'gestuurde'], 0, 'kof', 'Stem stuur ends in r, not in t kofschip: -d.'), '.'] },
      { en: 'The minister paid nothing again.', parts: ['De minister', FK(['heeft', 'hebben', 'hebt'], 0, 'perf', 'One minister, so heeft. hebben is for plurals, hebt only for jij and u.'), 'weer niets betaald.'] },
      { en: 'Did you all drink a lot?', parts: ['Hebben jullie veel', FK(['gedronken', 'gedrinkt', 'gedronkt'], 0, 'perf', 'drinken is irregular: gedronken.'), '?'] },

      // ---- words
      { w: 'the herring', nl: 'de haring', wrong: 'het haring' }, { w: 'the battered fish bites', nl: 'de kibbeling' },
      { w: 'the market stall', nl: 'de marktkraam', wrong: 'het marktkraam' }, { w: 'the punnet', nl: 'het bakje', wrong: 'de bakje' },
      { w: 'the strawberries', nl: 'de aardbeien' }, { w: 'the terrace', nl: 'het terras' },
      { w: 'the bill', nl: 'de rekening' }, { w: 'the receipt', nl: 'het bonnetje', wrong: 'de bonnetje' },
      { w: 'the tip', nl: 'de fooi' }, { w: 'the waitress', nl: 'de serveerster' },
      { w: 'the main course', nl: 'het hoofdgerecht', wrong: 'de hoofdgerecht' }, { w: 'the dessert', nl: 'het toetje' },
      { w: 'the Indonesian rice table', nl: 'de rijsttafel' }, { w: 'the satay', nl: 'de saté' },
      { w: 'the spring roll', nl: 'de loempia' }, { w: 'the croquette', nl: 'de kroket' },
      { w: 'eaten', nl: 'gegeten' }, { w: 'paid', nl: 'betaald' }, { w: 'ordered', nl: 'besteld' },
      { w: 'to settle up', nl: 'afrekenen' },

      // ---- read
      { read: true, nl: 'Heeft het gesmaakt?', o: ['Did you enjoy the food?', 'Is the food ready?', 'Do you want to taste it?'], a: 0, r: 'perf',
        w: 'gesmaakt is the participle of smaken: the waiter asks how it was, after the plate is empty.' },
      { read: true, nl: 'We hebben al besteld.', o: ['We have already ordered.', 'We want to order now.', 'We are going to order.'], a: 0, r: 'perf',
        w: 'hebben plus a participle is something done: besteld, already ordered.' },
      { read: true, nl: 'Je hoeft geen fooi te geven.', o: ["You don't have to tip.", "You're not allowed to tip.", "You shouldn't tip."], a: 0, r: 'mag',
        w: 'hoeven ... te is not necessary. mag niet is not allowed, moet niet is should not.' },
      { read: true, nl: 'Ben je naar de markt geweest?', o: ['Have you been to the market?', 'Are you going to the market?', 'Are you at the market?'], a: 0, r: 'perf',
        w: 'ben plus geweest looks back: you have been. Going would be ga je.' },
      { read: true, nl: 'Wat kost een bakje aardbeien?', en: 'How much is a punnet of strawberries?' },
      { read: true, nl: 'Mogen we afrekenen?', en: 'Can we settle up?' },

      // ---- listen
      { listen: true, nl: 'vierentwintig euro vijftig', en: '€ 24,50' }, { listen: true, nl: 'opgehaald', en: 'picked up' },
      { listen: true, nl: 'gedronken', en: 'drunk (have drunk)' }, { listen: true, nl: 'Scheveningen', en: 'Scheveningen' },

      // ---- look
      { look: true, prop: 'water', nl: 'het water', en: 'the water' },
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },
      { look: true, prop: 'nummer', value: 50, nl: 'vijftig', en: '50' },

      // ---- de of het
      { dehet: true, nl: 'menu', art: 'het', en: 'the menu', w: 'het menu, but de menukaart: a compound takes the article of its last word.' },
      { dehet: true, nl: 'kraam', art: 'de', en: 'the stall' },
    ] }]);
})();
