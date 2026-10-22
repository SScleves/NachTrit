(() => {
  // L43 Alblasserdam, Het station (tier 1): 36 more items. Sources: vault _site/dialogues (Een treinkaartje kopen,
  // De weg vragen), _site/sentences (De trein heeft weer vertraging, Ik ben onderweg, Ik ben de weg kwijt, Van spoor vijf,
  // Nog tien minuten, Goede reis), _site/situations/directions, _site/words, 03 - Verbs/hebben and zijn.
  // New rule: hebben, for the hebben forks, linked to the vault note 03 - Verbs/hebben. New props: none.
  window.RULES.hebben = window.RULES.hebben || { name: 'hebben (to have)', note: 'hebben' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(43, { deliveries: 20, items: [
    // words: the train, the ticket, the way out, the time
    { w: 'the train', nl: 'de trein', wrong: 'het trein' }, { w: 'the platform', nl: 'het perron', wrong: 'de perron' },
    { w: 'the delay', nl: 'de vertraging', wrong: 'het vertraging' }, { w: 'the return ticket', nl: 'het retourtje' },
    { w: 'the trip', nl: 'de reis' }, { w: 'the suitcase', nl: 'de koffer', wrong: 'het koffer' },
    { w: 'the conductor', nl: 'de conducteur' }, { w: 'the minute', nl: 'de minuut' },
    { w: 'the entrance', nl: 'de ingang' }, { w: 'the exit', nl: 'de uitgang' }, { w: 'the toilet', nl: 'het toilet' },
    { w: 'the square', nl: 'het plein', wrong: 'de plein' }, { w: 'the town centre', nl: 'het centrum' },
    { w: 'the traffic light', nl: 'het stoplicht' },
    { w: 'early', nl: 'vroeg' }, { w: 'on time', nl: 'op tijd' }, { w: 'far', nl: 'ver' },
    { w: 'excuse me', nl: 'pardon' }, { w: 'have a good trip', nl: 'goede reis' },

    // reading
    { read: true, nl: 'De trein heeft weer vertraging.', o: ['The train is delayed again.', 'The weather is delaying the train.', 'The train is cancelled again.'], a: 0, r: 'woord',
      w: 'weer here means again, not the weather. vertraging is a delay: the train still comes.' },
    { read: true, nl: 'Ik ben onderweg.', o: ["I'm on my way.", "I'm under the road.", "I'm lost."], a: 0, r: 'woord',
      w: 'onderweg is one word: on the way. Under the road would be onder de weg.' },
    { read: true, nl: 'Nog tien minuten.', en: 'Ten more minutes.' },
    { read: true, nl: 'Ik ben de weg kwijt.', en: "I'm lost." },
    { read: true, nl: 'De trein is weg.', en: 'The train has gone.' },
    { read: true, nl: 'Van spoor vijf.', en: 'From track five.' },

    // listening
    { listen: true, nl: 'de trein', en: 'the train' }, { listen: true, nl: 'de uitgang', en: 'the exit' },
    { listen: true, nl: 'het perron', en: 'the platform' },

    // look
    { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' }, { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
    { look: true, prop: 'nummer', value: 5, nl: 'vijf', en: '5' },

    // builds, one fork each
    { en: "I'm late.", parts: ['Ik', FK(['ben', 'bent', 'is'], 0, 'zijn', 'ik ben. bent is for jij, is for hij and zij.'), 'te laat.'] },
    { en: 'The platform is empty.', parts: [FK(['Het', 'De'], 0, 'dehet', 'perron is a het-word: het perron.'), 'perron is leeg.'] },
    { en: 'The stations are closed.', parts: [FK(['De', 'Het'], 0, 'dehet', 'station is het, but every plural is de: de stations.'), 'stations zijn dicht.'] },
    { en: 'I have a return ticket.', parts: ['Ik', FK(['heb', 'heeft', 'hebt'], 0, 'hebben', 'ik heb. hebt is for jij, heeft for hij and zij.'), 'een retourtje.'] },
    { en: "We're in a hurry.", parts: ['Wij', FK(['hebben', 'zijn'], 0, 'hebben', 'Dutch has haste, like Spanish tener prisa: wij hebben haast.'), 'haast.'] },
  ] });
})();
