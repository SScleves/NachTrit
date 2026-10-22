(() => {
  // Level 41 De of het, longer: 48 new nouns from every place in Alblasserdam, 28 de and 20 het.
  // Articles checked against the vault: 02 - Grammar/de vs het (rules of thumb and Your words), _site/grammar
  // meervoud-plurals and de-of-het-articles, 01 - Vocabulary (borrel, buur, golfbaan, storing, tuin, vergadering),
  // _site/words (het kind, het ei, het schip, de meisjes, de boodschappen, de verwarming, het bezoek, het verkeer),
  // _site/situations (supermarket, pub, restaurant, office, neighbours) and content/towns.js (de dijk, de werf,
  // de riem, de buurvrouw). English glosses follow levels 42 to 45 where the same noun appears.
  // w is the rule of thumb shown after the fork. Plain memory words have none, so the game shows the article and noun.
  window.extendLevel(41, { deliveries: 24, items: [
    // thuis
    { dehet: true, nl: 'keuken', art: 'de', en: 'the kitchen' },
    { dehet: true, nl: 'sleutel', art: 'de', en: 'the key' },
    { dehet: true, nl: 'verwarming', art: 'de', en: 'the heating', w: 'ver- in front, but the -ing at the end wins: de verwarming.' },
    { dehet: true, nl: 'licht', art: 'het', en: 'the light' },
    // de straat en de dijk
    { dehet: true, nl: 'dijk', art: 'de', en: 'the dyke' },
    { dehet: true, nl: 'werf', art: 'de', en: 'the shipyard' },
    { dehet: true, nl: 'schip', art: 'het', en: 'the ship' },
    { dehet: true, nl: 'schepen', art: 'de', en: 'the ships', w: 'Every plural is de: het schip, de schepen.' },
    { dehet: true, nl: 'verkeer', art: 'het', en: 'the traffic', w: 'ver- in front and two syllables, so het: het verkeer.' },
    // eten en drinken
    { dehet: true, nl: 'eten', art: 'het', en: 'the food', w: 'A verb used as a noun is het: eten, het eten.' },
    { dehet: true, nl: 'ontbijt', art: 'het', en: 'the breakfast', w: 'ont- in front and two syllables, so het: het ontbijt.' },
    { dehet: true, nl: 'broodje', art: 'het', en: 'the sandwich', w: 'Every -je word is het: het broodje.' },
    { dehet: true, nl: 'eieren', art: 'de', en: 'the eggs', w: 'Plural, so de. Only one egg is het: het ei.' },
    { dehet: true, nl: 'rekening', art: 'de', en: 'the bill', w: 'Words ending in -ing are de: de rekening.' },
    { dehet: true, nl: 'borrel', art: 'de', en: 'the drinks after work' },
    // de winkels
    { dehet: true, nl: 'supermarkt', art: 'de', en: 'the supermarket' },
    { dehet: true, nl: 'aanbieding', art: 'de', en: 'the special offer', w: '-ing at the end, so de: de aanbieding.' },
    { dehet: true, nl: 'boodschappen', art: 'de', en: 'the groceries', w: 'Plural, so de: de boodschappen. One errand is de boodschap, also de.' },
    { dehet: true, nl: 'tasje', art: 'het', en: 'the plastic bag', w: 'de tas, but het tasje. The -je makes it het.' },
    { dehet: true, nl: 'geld', art: 'het', en: 'the money' },
    // het station
    { dehet: true, nl: 'station', art: 'het', en: 'the station' },
    { dehet: true, nl: 'kaartje', art: 'het', en: 'the ticket', w: 'de kaart, but het kaartje. The -je makes it het.' },
    { dehet: true, nl: 'trein', art: 'de', en: 'the train' },
    { dehet: true, nl: 'pont', art: 'de', en: 'the ferry' },
    { dehet: true, nl: 'bus', art: 'de', en: 'the bus' },
    // het werk
    { dehet: true, nl: 'kantoor', art: 'het', en: 'the office' },
    { dehet: true, nl: 'laptop', art: 'de', en: 'the laptop' },
    { dehet: true, nl: 'collega', art: 'de', en: 'the colleague', w: 'People are de, at work too: de collega.' },
    { dehet: true, nl: 'storing', art: 'de', en: 'the outage', w: '-ing at the end, so de: de storing.' },
    { dehet: true, nl: 'melding', art: 'de', en: 'the alert', w: '-ing at the end, so de: de melding.' },
    { dehet: true, nl: 'bericht', art: 'het', en: 'the message', w: 'be- in front and two syllables, so het: het bericht.' },
    { dehet: true, nl: 'gesprek', art: 'het', en: 'the conversation', w: 'Two syllables starting with ge-, be-, ver- or ont- are usually het: het gesprek.' },
    // de sport
    { dehet: true, nl: 'sportschool', art: 'de', en: 'the gym', w: 'The last part decides: de school, so de sportschool.' },
    { dehet: true, nl: 'clubhuis', art: 'het', en: 'the clubhouse', w: 'The last part decides: het huis, so het clubhuis.' },
    { dehet: true, nl: 'balletje', art: 'het', en: 'the little ball', w: 'de bal, but het balletje. The -je makes it het.' },
    { dehet: true, nl: 'riem', art: 'de', en: 'the dog lead' },
    { dehet: true, nl: 'wandeling', art: 'de', en: 'the walk', w: '-ing at the end, so de: de wandeling.' },
    // de mensen
    { dehet: true, nl: 'man', art: 'de', en: 'the man', w: 'People are de: de man, de vrouw.' },
    { dehet: true, nl: 'buurvrouw', art: 'de', en: 'the neighbour (woman)', w: 'People are de: de buurman, de buurvrouw.' },
    { dehet: true, nl: 'buren', art: 'de', en: 'the neighbours', w: 'Plural, so de. One neighbour or many, always de.' },
    { dehet: true, nl: 'kind', art: 'het', en: 'the child', w: 'People are usually de, but not this one: het kind.' },
    { dehet: true, nl: 'kinderen', art: 'de', en: 'the children', w: 'Every plural is de: het kind, de kinderen.' },
    { dehet: true, nl: 'meisje', art: 'het', en: 'the girl', w: 'A girl is a person, but the -je wins: het meisje.' },
    { dehet: true, nl: 'meisjes', art: 'de', en: 'the girls', w: 'Plural beats -je: het meisje, but de meisjes.' },
    { dehet: true, nl: 'dierenarts', art: 'de', en: 'the vet', w: 'Jobs are de: de dierenarts.' },
    { dehet: true, nl: 'bezoek', art: 'het', en: 'the visit', w: 'be- in front and two syllables, so het: het bezoek.' },
    { dehet: true, nl: 'Engels', art: 'het', en: 'the English language', w: 'Languages are het: het Engels, het Nederlands.' },
    { dehet: true, nl: 'Spaans', art: 'het', en: 'the Spanish language', w: 'Languages are het, your own one too: het Spaans.' },
  ] });
})();
