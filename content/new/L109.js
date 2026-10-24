// Nachtrit, Maastricht (tier 11, B1 to B2): level 109 Eten en drinken. The Vrijthof at night, café terraces under the
// Sint-Servaasbasiliek and the red tower of the Sint-Janskerk, a bakery with the vlaai in the window, a market stall
// packing up, a restaurant by the Maas and the way home over the Sint-Servaasbrug. Ordering, the bill, splitting it.
// New at tier 11 and drilled here: the passive with worden (de tafel wordt gedekt, werd gebakken, moet betaald worden,
// door for the doer) and with zijn (het café is verbouwd), the plusquamperfectum with hadden and waren (we hadden al
// gegeten, was dichtgegaan, als we eerder waren gekomen, hadden we ...), indirect speech with zei dat and vroeg of
// (the verb goes to the end), and Maastricht words with their dialect colour marked as such (de bomma, Noondezju).
// Review of earlier tiers: superlative (de lekkerste), zou plus infinitive for a polite request, die against dat in a
// relative clause, hoewel with the main clause starting on its verb, the adjective -e (rode wijn, een koud biertje),
// the perfectum with 't kofschip and V2 after a fronted time word.
// Still inside the fence: 16 words max; nothing from tier 12 (no modal particles, no u/geachte register).
// Sources: dutch-lessons vault, 02 - Grammar/perfectum, imperfectum, bijzin - werkwoord naar het einde, V2 word order,
// 't kofschip, scheidbare werkwoorden, de vs het; _site/situations/restaurant (Mag ik de rekening, Kunnen we apart
// betalen, Is alles naar wens, Wat kunt u aanraden), pub (Nog een rondje, Mogen we afrekenen, Proost), takeaway (Bestelling
// voor Santi); _site/words (afrekenen, inschenken); content/towns.js for Maastricht (de vlaai, Doe mij maar een stuk
// kersenvlaai, Zonder dat verdrag hadden we de euro niet gehad, de bomma, Noondezju, het Vrijthof, de Sint-Servaasbrug,
// the carnaval joke, the patat against friet rumour).
// New rules: passief, plusq, indirect (defined below; the vault has no separate note, so they point at the nearest ones).
// New props: none. Only kerk, brug and deur are used (no word item is de kerk, de brug or de deur).
(() => {
  window.RULES.passief = window.RULES.passief || { name: 'Passive: worden or zijn plus participle', note: 'perfectum' };
  window.RULES.plusq = window.RULES.plusq || { name: 'Plusquamperfectum: had / was plus participle', note: 'perfectum' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zou = window.RULES.zou || { name: 'zou plus infinitive: polite requests', note: 'zullen' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  const P = window.TIER_PRESET[11];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 109, act: 11, name: 'Eten en drinken', town: 'maastricht', place: 'eten', theme: 'square', ...P,
    intro: 'In Maastricht the dead are in costume all year, so nobody notices the waiter is one of them. The bill gets split anyway.',
    introNl: 'In Maastricht zijn de doden het hele jaar verkleed, dus niemand merkt dat de ober er ook een is. De rekening wordt toch gesplitst.',
    mission: {
      where: 'The Vrijthof at night, café terraces under the Sint-Servaas basilica and the red tower of the Sint-Janskerk, then the narrow streets of pale yellow marl to a bakery with the vlaai still in the window, a market stall packing up, a restaurant on the Maas, and home over the Sint-Servaasbrug, the oldest bridge in the country, mostly rebuilt. Order patat here and the whole terrace goes quiet. It is friet.',
      carry: 'Two leads, exact change, a cardboard box with one piece of kersenvlaai that is not yours yet, and the grammar book, never opened. No helmet. The hills are small, the cobbles are not, and the bomma is always right.',
      want: 'Since the mist the dead tell you what is being done to your dinner. De vlaai wordt gebakken, de wijn werd ingeschonken, they had already eaten when you arrived, and the waiter says that the kitchen is closed. Worden plus a participle at the end, had or was plus a participle, and zei dat sends the verb all the way back. A treaty was signed in this city and the table still cannot agree on the total. Paola is still taller than you, everyone still splits the bill to the cent, and the dogs always need a walk afterwards.' },
    items: [
      // ---- builds: the passive with worden and zijn
      { en: 'The table is being set on the Vrijthof.', parts: ['De tafel', FK(['wordt', 'word'], 0, 'passief',
        'De tafel is one thing, so wordt. word is only for ik, and for jij in a question.'), 'op het Vrijthof', FK(['gedekt', 'gedekd', 'gedekken'], 0, 'kof',
        'dek ends in k, a ketchup letter: gedekt with a t. The passive is wordt plus the participle at the end.'), '.'] },
      { en: 'The bill is paid by the neighbours.', parts: ['De rekening wordt', FK(['door', 'op'], 0, 'passief',
        'The one who does it in a passive sentence comes after door: door de buren.'), 'de buren', FK(['betaald', 'gebetaald', 'betaalt'], 0, 'perf',
        'be- verbs take no ge, and betaal ends in l, so -d: betaald.'), '.'] },
      { en: 'The wine is poured by the waiter.', parts: ['De wijn wordt door de ober', FK(['ingeschonken', 'ingeschonkt', 'geïnschonken'], 0, 'sep',
        'inschenken is separable and strong: in + geschonken, written as one word at the end.'), '.'] },
      { en: 'Yesterday the tart was baked fresh.', parts: ['Gisteren', FK(['werd de vlaai', 'de vlaai werd'], 0, 'v2',
        'Gisteren fills slot 1, so the verb comes second: werd de vlaai.'), 'vers', FK(['gebakken', 'gebakt', 'gebacken'], 0, 'passief',
        'The past passive is werd plus the participle. bakken is irregular: gebakken.'), '.'] },
      { en: 'The café was completely rebuilt last year.', parts: ['Het café', FK(['is', 'wordt'], 0, 'passief',
        'Last year is finished, so zijn plus participle: is verbouwd. wordt would say it is happening now.'), 'vorig jaar helemaal', FK(['verbouwd', 'geverbouwd', 'verbouwt'], 0, 'perf',
        'ver- verbs take no ge, and the stem ends in w, so -d: verbouwd.'), '.'] },
      { en: 'The bill still has to be paid.', parts: ['De rekening moet nog', FK(['betaald worden', 'betaald wordt', 'betalen worden'], 0, 'passief',
        'After moet the passive goes to the end as an infinitive: betaald worden, not wordt.'), '.'] },

      // ---- builds: the plusquamperfectum
      { en: 'We had already eaten when the pizza came.', parts: ['We', FK(['hadden', 'waren'], 0, 'plusq',
        'eten takes hebben, so the pluperfect is hadden plus gegeten.'), 'al', FK(['gegeten', 'geëten', 'gegeet'], 0, 'perf',
        'eten is irregular: gegeten.'), 'toen de pizza kwam.'] },
      { en: 'When we arrived, the café had already closed.', parts: ['Toen we aankwamen,', FK(['was het café', 'had het café'], 0, 'plusq',
        'dichtgaan takes zijn, like gaan, so the pluperfect is was dichtgegaan. And the verb comes right after the sub-clause.'), 'al', FK(['dichtgegaan', 'gedichtgaan', 'dichtgegaat'], 0, 'sep',
        'dicht + gegaan, written as one word at the end.'), '.'] },
      { en: 'If we had come earlier, we would have had a table.', parts: ['Als we eerder', FK(['waren gekomen', 'hadden gekomen', 'waren komen'], 0, 'plusq',
        'komen takes zijn, so the pluperfect is waren gekomen.'), ',', FK(['hadden we', 'we hadden'], 0, 'bijzin',
        'After a sub-clause the main clause starts with its verb: hadden we.'), 'een tafel gehad.'] },
      { en: 'Paola had already ordered the tart before I arrived.', parts: ['Paola', FK(['had', 'was'], 0, 'plusq',
        'bestellen takes hebben, so had plus the participle.'), 'de vlaai al', FK(['besteld', 'gebesteld'], 0, 'perf',
        'be- verbs take no ge: besteld.'), 'voordat ik aankwam.'] },

      // ---- builds: indirect speech
      { en: 'The waiter said that the kitchen was already closed.', parts: ['De ober zei', FK(['dat de keuken al dicht was', 'dat de keuken was al dicht'], 0, 'indirect',
        'zei dat opens a sub-clause, so was goes to the very end.'), '.'] },
      { en: 'Paola said that she had already paid the bill.', parts: ['Paola zei dat ze de rekening al', FK(['had', 'was'], 0, 'plusq',
        'betalen takes hebben: had betaald.'), FK(['betaald', 'gebetaald'], 0, 'perf',
        'be- verbs take no ge: betaald.'), '.'] },
      { en: 'The waiter asked whether we wanted to pay separately.', parts: ['De ober vroeg', FK(['of', 'dat'], 0, 'indirect',
        'A yes-or-no question becomes of in indirect speech. dat is for statements.'), 'we apart', FK(['wilden betalen', 'wilden te betalen', 'wilden betaald'], 0, 'indirect',
        'After of the verbs go to the end: wilden betalen, the finite verb first.'), '.'] },

      // ---- builds: review of earlier tiers
      { en: 'In my opinion the cherry tart is the tastiest on the Vrijthof.', parts: ['Volgens mij is de kersenvlaai de', FK(['lekkerste', 'lekkerder', 'lekkerst'], 0, 'vergelijk',
        'After de the superlative takes -e: de lekkerste. lekkerder needs dan.'), 'van het Vrijthof.'] },
      { en: 'Could you pack a piece of tart for me?', parts: ['Zou je een stuk vlaai voor mij', FK(['kunnen inpakken', 'kan inpakken', 'te kunnen inpakken'], 0, 'zou',
        'zou makes the request polite and takes an infinitive, not a finite verb: kunnen inpakken.'), '?'] },
      { en: 'The piece of tart that Paola ordered was enormous.', parts: ['Het stuk vlaai', FK(['dat', 'die'], 0, 'diedat',
        'stuk is a het-word, so the relative pronoun is dat.'), 'Paola', FK(['bestelde', 'besteldde', 'bestelte'], 0, 'kof',
        'bestel ends in l, not a ketchup letter: bestelde with -de.'), ', was enorm.'] },
      { en: 'Although the terrace is full, we still find a table.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel',
        'hoewel opens a whole clause with its own verb. ondanks needs a noun.'), 'het terras vol is,', FK(['vinden we', 'we vinden'], 0, 'bijzin',
        'After a sub-clause the main clause starts with its verb: vinden we.'), 'nog een tafel.'] },
      { en: 'I will have a glass of red wine and a cold beer.', parts: ['Doe mij maar een glas', FK(['rode', 'rood'], 0, 'adj',
        'wijn is a de-word, so the adjective takes -e: rode wijn.'), 'wijn en een', FK(['koud', 'koude'], 0, 'adj',
        'biertje is a het-word and een comes before it, so no -e: een koud biertje.'), 'biertje.'] },
      { en: 'On Saturday we ate on the Vrijthof and split the bill.', parts: ['Zaterdag', FK(['hebben we', 'we hebben'], 0, 'v2',
        'Zaterdag fills slot 1, so the verb comes second: hebben we.'), 'op het Vrijthof gegeten en de rekening', FK(['gesplitst', 'gesplitsd'], 0, 'kof',
        'splits ends in s, a ketchup letter: gesplitst with a t.'), '.'] },

      // ---- words: the menu, the market, the bill, the dialect
      { w: 'the Limburg fruit tart', nl: 'de vlaai' }, { w: 'the slice of tart', nl: 'het stuk vlaai', wrong: 'de stuk vlaai' },
      { w: 'the sour beef stew (Maastricht speciality)', nl: 'het zuurvlees', wrong: 'de zuurvlees' },
      { w: 'the fries (the Limburg word, not patat)', nl: 'de friet' }, { w: 'the mayonnaise', nl: 'de mayonaise' },
      { w: 'the terrace', nl: 'het terras', wrong: 'de terras' }, { w: 'the waiter', nl: 'de ober' },
      { w: 'the menu card', nl: 'de menukaart' }, { w: 'the reservation', nl: 'de reservering' }, { w: 'the service', nl: 'de bediening' },
      { w: 'the market stall', nl: 'de marktkraam' }, { w: 'the bakery', nl: 'de bakkerij' },
      { w: 'the dinner', nl: 'het avondeten', wrong: 'de avondeten' }, { w: 'the napkin', nl: 'het servet', wrong: 'de servet' },
      { w: 'the grandma (Maastricht dialect, in Dutch oma)', nl: 'de bomma' },
      { w: 'the bill', nl: 'de rekening' }, { w: 'the tip', nl: 'de fooi' },
      { w: 'the dessert', nl: 'het nagerecht', wrong: 'de nagerecht' },

      // ---- reads: three traps with their own options, three plain lines
      { read: true, nl: 'De vlaai wordt nog gebakken.', o: ['The tart is still being baked.', 'The tart has already been baked.', 'The tart will be baked tomorrow.'], a: 0, r: 'passief',
        w: 'wordt plus gebakken is the passive in progress: it is being baked now. Finished would be is gebakken.' },
      { read: true, nl: 'We hadden al betaald toen de band begon te spelen.', o: ['We had already paid when the band started to play.', 'We paid after the band started to play.', 'We will have paid when the band plays.'], a: 0, r: 'plusq',
        w: 'hadden plus betaald is the pluperfect: paying came before the band. Both things lie in the past.' },
      { read: true, nl: 'Hij zei dat de kok ziek was.', o: ['He said that the cook was ill.', 'He asked whether the cook was ill.', 'He told the cook he was ill.'], a: 0, r: 'indirect',
        w: 'zei dat reports a statement. Asking would be vroeg of, and the cook is the one who is ill.' },
      { read: true, nl: 'Noondezju, de vlaai is op.', en: 'Damn it, the tart is sold out (Noondezju is Maastricht dialect).' },
      { read: true, nl: 'Kunnen we apart betalen? Ik had alleen de soep.', en: 'Can we pay separately? I only had the soup.' },
      { read: true, nl: 'Zonder dat verdrag hadden we de euro niet gehad.', en: 'Without that treaty we would not have had the euro.' },

      // ---- listens: a slice, a price, the square, the bill
      { listen: true, nl: 'de kersenvlaai', en: 'the cherry tart' }, { listen: true, nl: 'drieënveertig euro vijftig', en: '€ 43,50' },
      { listen: true, nl: 'het Vrijthof', en: 'the Vrijthof square' }, { listen: true, nl: 'afrekenen', en: 'to settle the bill' },

      // ---- looks: the basilica, the bridge, the café door
      { look: true, prop: 'kerk', nl: 'de kerk', en: 'the church' }, { look: true, prop: 'brug', nl: 'de brug', en: 'the bridge' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'bestek', art: 'het', en: 'the cutlery', w: 'het bestek. The knives, forks and spoons together count as one het-word, like het servies.' },
      { dehet: true, nl: 'menu', art: 'het', en: 'the menu', w: 'het menu. It is a borrowed word and a het-word, and the plural is de menu\'s.' },
    ] }]);
})();
