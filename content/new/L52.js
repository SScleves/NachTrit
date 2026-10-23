// Nachtrit, Zeeland (tier 4, A2 entry): level 52, De winkels. Bakery, butcher, fishmonger, pharmacy, clothes shop.
// Fence: tier 3 plus object pronouns, er is / er zijn, comparatives and superlatives, adjective -e. 8 words max,
// present tense only, no split separable verbs, no sub-clauses.
// Sources: dutch-lessons vault, _site/situations/supermarket and butcher (Anders nog iets?, Mag het ietsje meer zijn?,
// gehakt, kipfilet, plakjes, aanbieding), _site/words (de apotheek, de trui, ruilen, kopen), 03 - Verbs/kopen,
// 02 - Grammar/de vs het (adjective -e: de mooie slag, een mooi huis), 01 - Vocabulary/hond (Mag ik hem aaien?),
// 03 - Verbs/vinden (beter dan), and content/towns.js for Zeeland (de mossel, de Dikke Toren, Zierikzee, 62 doors).
//
// New rules: obj (object pronouns) -> 'MOC Lidwoorden & voornaamwoorden' (lists hem / haar);
// eris (er is / er zijn) -> 'MOC Veelgebruikte bijwoorden' (lists er); vergr (comparatives and superlatives) ->
// 'vinden' (the vault has no comparatives note; vinden carries "beter dan"). Each is declared only if missing.
// New props: none. Only winkel, nummer and deur are used.
(() => {
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'Trappen van vergelijking · comparison' };
  window.RULES.obj = window.RULES.obj || { name: 'Object pronouns: me, je, hem, haar, ons', note: 'hem-haar' };
  window.RULES.eris = window.RULES.eris || { name: 'er is, er zijn', note: 'er' };
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };

  const P = window.TIER_PRESET[4];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 52, act: 4, name: 'De winkels', town: 'zeeland', place: 'winkels', theme: 'shops', ...P,
    intro: 'The shops in Zierikzee are still open after the mist. The dead still compare prices, and the women at the fitting room are still taller than you.',
    introNl: 'De winkels in Zierikzee zijn na de mist gewoon nog open. De doden vergelijken nog steeds prijzen, en de vrouwen bij de paskamer zijn nog steeds langer dan jij.',
    mission: { where: 'The shopping street under the Dikke Toren in Zierikzee: the bakery, the butcher, the fishmonger, the pharmacy, and a clothes shop with one fitting room.',
      carry: 'A sweater that does not fit, the receipt, and two dogs who need a walk. The dogs always need a walk.',
      want: 'Bigger, cheaper, the cheapest. Give it to him, buy it for her, help me. The grammar book explains all of it, on a page nobody opened. After closing time someone still knocks on the door.' },
    items: [
      // ---- builds: object pronouns, er is / er zijn, comparatives, adjective -e
      { en: 'Do you have this sweater in a bigger size?', parts: ['Heeft u', FK(['deze', 'dit'], 0, 'dehet', 'trui is a de-word, so deze. dit is only for het-words.'), 'trui in een',
        FK(['grotere', 'groter'], 0, 'adj', 'maat is a de-word, so the adjective takes -e, even after een: een grotere maat.'), 'maat?'] },
      { en: "The sweater doesn't fit me.", parts: ['De trui past', FK(['me', 'ik', 'mijn'], 0, 'obj', 'The sweater does the fitting, you are the object: me. ik is only the one doing it.'), 'niet.'] },
      { en: 'Can I exchange it? (the sweater)', parts: ['Kan ik', FK(['hem', 'hij', 'zijn'], 0, 'obj', 'de trui is a de-word, so it becomes hem as the object. hij is the subject form.'),
        FK(['ruilen', 'ruilt', 'te ruilen'], 0, 'modal', 'After kan the infinitive closes the sentence, no te.'), '?'] },
      { en: "I'm buying it for her. (the sweater)", parts: ['Ik koop', FK(['hem', 'hij'], 0, 'obj', 'The sweater is de trui, so the object is hem.'), 'voor',
        FK(['haar', 'zij'], 0, 'obj', 'After voor you need the object form: haar. zij is she, the one doing it.'), '.'] },
      { en: 'The butcher gives us a slice of sausage.', parts: ['De slager geeft', FK(['ons', 'wij', 'onze'], 0, 'obj', 'We get the slice, so the object form: ons. wij is only the subject.'), 'een plakje worst.'] },
      { en: 'Can you help me? (polite)', parts: ['Kunt u', FK(['mij', 'ik', 'mijn'], 0, 'obj', 'You help me, I am the object: mij. mijn is my, before a noun.'),
        FK(['helpen', 'helpt', 'te helpen'], 0, 'modal', 'Modal first, the infinitive at the end: helpen.'), '?'] },
      { en: 'There are mussels at the fishmonger.', parts: ['Er', FK(['zijn', 'is'], 0, 'eris', 'mosselen is plural, so er zijn. er is is for one thing.'), 'mosselen bij de visboer.'] },
      { en: 'Is there a pharmacy here?', parts: [FK(['Is er', 'Zijn er', 'Er zijn'], 0, 'eris', 'A question starts with the verb, and one pharmacy means is: Is er.'), 'hier een apotheek?'] },
      { en: "The bread is cheaper than at the baker's.", parts: ['Het brood is', FK(['goedkoper', 'goedkoop', 'meer goedkoop'], 0, 'vergelijk', 'Cheaper is the word plus -er: goedkoper. Dutch never says meer goedkoop.'), 'dan bij de bakker.'] },
      { en: 'This shop is the cheapest.', parts: [FK(['Deze', 'Dit'], 0, 'dehet', 'winkel is a de-word, so deze winkel.'), 'winkel is',
        FK(['het goedkoopst', 'het goedkoper', 'het goedkoop'], 0, 'vergelijk', 'After is the superlative takes het: het goedkoopst.'), '.'] },
      { en: 'Zeeland mussels are the tastiest.', parts: ['Zeeuwse mosselen', FK(['zijn', 'is'], 0, 'presens', 'mosselen is plural: zijn.'),
        FK(['het lekkerst', 'het lekkerder', 'het lekker'], 0, 'vergelijk', 'The most is -st, with het in front after zijn: het lekkerst.'), '.'] },
      { en: 'The women are still taller than me.', parts: ['De vrouwen zijn nog steeds', FK(['langer', 'langst', 'meer lang'], 0, 'vergelijk', 'Comparing two things: the word plus -er, then dan. Tall for people is lang.'), 'dan ik.'] },
      { en: "I'd like a white bread.", parts: ['Ik wil graag een', FK(['wit', 'witte'], 0, 'adj', 'brood is a het-word, and after een a het-word drops the -e: een wit brood.'), 'brood.'] },
      { en: 'Can I have the fresh minced meat?', parts: ['Mag ik', FK(['het', 'de'], 0, 'dehet', 'gehakt is a het-word: het gehakt.'),
        FK(['verse', 'vers'], 0, 'adj', 'After het or de the adjective always takes -e: het verse gehakt.'), 'gehakt?'] },
      { en: 'How much are the fresh mussels?', parts: ['Wat', FK(['kosten', 'kost'], 0, 'presens', 'mosselen is plural, so kosten.'), 'de',
        FK(['verse', 'vers'], 0, 'adj', 'After de the adjective takes -e: de verse mosselen.'), 'mosselen?'] },

      // ---- words
      { w: 'the bakery', nl: 'de bakkerij' }, { w: 'the butcher', nl: 'de slager' }, { w: 'the pharmacy', nl: 'de apotheek' },
      { w: 'the fishmonger', nl: 'de visboer' }, { w: 'the mussels', nl: 'de mosselen', wrong: 'het mosselen' },
      { w: 'the receipt', nl: 'de kassabon', wrong: 'het kassabon' }, { w: 'the price', nl: 'de prijs' },
      { w: 'the size', nl: 'de maat', wrong: 'het maat' }, { w: 'the sweater', nl: 'de trui' },
      { w: 'the money', nl: 'het geld', wrong: 'de geld' }, { w: 'the minced meat', nl: 'het gehakt', wrong: 'de gehakt' },
      { w: 'the bread roll', nl: 'het broodje' }, { w: 'the medicine', nl: 'het medicijn', wrong: 'de medicijn' },
      { w: 'the headache', nl: 'de hoofdpijn' }, { w: 'the Zeeland sticky bun', nl: 'de Zeeuwse bolus' },
      { w: 'the offer', nl: 'de aanbieding' }, { w: 'the debit card', nl: 'de pinpas' },
      { w: 'to exchange', nl: 'ruilen' }, { w: 'cheaper', nl: 'goedkoper' }, { w: 'more expensive', nl: 'duurder' },

      // ---- read
      { read: true, nl: 'Er zijn geen broodjes meer.', o: ['There are no rolls left.', 'There are more rolls.', 'The rolls are not ready yet.'], a: 0, r: 'eris',
        w: 'geen ... meer means none left. meer on its own would be more.' },
      { read: true, nl: 'Deze trui is te klein.', o: ['This sweater is too small.', 'This sweater is smaller.', 'This sweater is the smallest.'], a: 0, r: 'vergelijk',
        w: 'te klein is too small. Smaller would be kleiner, the smallest het kleinst.' },
      { read: true, nl: 'Mag ik hem even passen?', o: ['Can I try it on?', 'Can I pass him?', 'Can I pay for it?'], a: 0, r: 'obj',
        w: 'passen is to try on, and hem is the sweater, a de-word.' },
      { read: true, nl: 'Dat is duurder dan bij de Jumbo.', en: "That's more expensive than at Jumbo." },
      { read: true, nl: 'Mag het ietsje meer zijn?', en: 'Is a little over okay?' },
      { read: true, nl: 'Anders nog iets?', en: 'Anything else?' },

      // ---- listen
      { listen: true, nl: 'drie euro vijftig', en: '€ 3,50' }, { listen: true, nl: 'twaalf euro negentig', en: '€ 12,90' },
      { listen: true, nl: 'het wisselgeld', en: 'the change' }, { listen: true, nl: 'de kipfilet', en: 'the chicken breast' },

      // ---- look
      { look: true, prop: 'winkel', nl: 'de winkel', en: 'the shop' },
      { look: true, prop: 'nummer', value: 62, nl: 'tweeënzestig', en: '62' },
      { look: true, prop: 'deur', nl: 'de deur', en: 'the door' },

      // ---- de of het
      { dehet: true, nl: 'recept', art: 'het', en: 'the prescription' },
      { dehet: true, nl: 'stokbrood', art: 'het', en: 'the baguette', w: 'brood is het, and so is every bread built on it: het stokbrood.' },
    ] }]);
})();
