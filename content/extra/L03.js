(() => {
  // Level 3 De brievenbus, longer: 36 new items for Alblasserdam, Thuis, tier 1 (A1 words, 5 words a sentence at most).
  // The post at the front door, the rooms of the house, the wife and the dogs, breakfast and bedtime.
  // Sources: vault 04 - Phrases & Scenarios/Thuis met je vrouw (Schat, ik ben thuis. Je hebt gelijk. Welterusten),
  // 01 - Vocabulary/huis (thuis vs naar huis), vrouw (schat), hond (Ik heb twee honden), _site/words H01 (het adres),
  // _site/sentences (de bank in de woonkamer, het bed onder het raam in de slaapkamer, het ontbijt, de sleutel,
  // het pakketje, de douche), _site/grammar/meervoud-plurals (de brief, de brieven), 02 - Grammar/de vs het and presens.
  // Fence: articles, zijn and hebben in the present, greetings, numbers to 12 as in the rest of the level.
  // No niet or geen, no possessives, no question order, no imperatives.
  // Look props: hond, tuin, lamp and nummer only. The deur and huis props both draw a whole house, so de deur and
  // het raam in this pool could name them too. For the same reason het huisnummer and het hondje are not word items:
  // they would name the nummer and hond props. het huisnummer lives in a build, where it never becomes a distractor.
  // Builds carry nl so the finished sentence can be shown and spoken.
  const FK = (o, a, r, w) => ({ o, a, r, w });
  window.extendLevel(3, { deliveries: 20, items: [
    // de post
    { w: 'the letterbox', nl: 'de brievenbus' }, { w: 'the letter', nl: 'de brief' }, { w: 'the mail', nl: 'de post' },
    { w: 'the parcel', nl: 'het pakketje', wrong: 'de pakketje' }, { w: 'the address', nl: 'het adres', wrong: 'de adres' },
    { w: 'the key', nl: 'de sleutel' }, { w: 'the door', nl: 'de deur' }, { w: 'the house', nl: 'het huis' }, { w: 'at home', nl: 'thuis' },
    // binnen
    { w: 'the kitchen', nl: 'de keuken' }, { w: 'the living room', nl: 'de woonkamer' }, { w: 'the bedroom', nl: 'de slaapkamer' },
    { w: 'the bathroom', nl: 'de badkamer' }, { w: 'the couch', nl: 'de bank' }, { w: 'the table', nl: 'de tafel' },
    { w: 'the bed', nl: 'het bed', wrong: 'de bed' }, { w: 'the window', nl: 'het raam', wrong: 'de raam' },
    // de vrouw, de honden, de dag
    { w: 'the wife', nl: 'de vrouw' }, { w: 'the dogs', nl: 'de honden' },
    { w: 'the breakfast', nl: 'het ontbijt', wrong: 'de ontbijt' }, { w: 'the shower', nl: 'de douche' },

    { read: true, nl: 'Schat, ik ben thuis.', o: ["Honey, I'm home.", "Honey, I'm going home."], a: 0, r: 'woord',
      w: 'thuis is where you are. Going home is naar huis.' },
    { read: true, nl: 'Je hebt gelijk.', o: ["You're right.", 'You have the same.'], a: 0, r: 'woord',
      w: 'gelijk hebben is to be right. Like tener razón, Dutch says it with hebben.' },

    { listen: true, nl: 'de brievenbus', en: 'the letterbox' }, { listen: true, nl: 'de keuken', en: 'the kitchen' },
    { listen: true, nl: 'het ontbijt', en: 'the breakfast' }, { listen: true, nl: 'twaalf', en: '12' },

    { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },
    { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },
    { look: true, prop: 'nummer', value: 2, nl: 'twee', en: '2' }, { look: true, prop: 'nummer', value: 10, nl: 'tien', en: '10' },

    { en: 'The house number is twelve.', nl: 'Het huisnummer is twaalf.',
      parts: [FK(['Het', 'De'], 0, 'dehet', 'The last part decides: het nummer, so het huisnummer.'), 'huisnummer is twaalf.'] },
    { en: 'The letters are for Paola.', nl: 'De brieven zijn voor Paola.',
      parts: ['De brieven', FK(['zijn', 'is'], 0, 'zijn', 'de brieven is more than one letter, so zijn.'), 'voor Paola.'] },
    { en: 'We have two dogs.', nl: 'We hebben twee honden.',
      parts: ['We', FK(['hebben', 'heeft', 'hebt'], 0, 'presens', 'we hebben. Every plural takes the infinitive.'), 'twee honden.'] },
    { en: 'Good night, honey.', nl: 'Welterusten, schat.',
      parts: [FK(['Welterusten', 'Goedemorgen'], 0, 'groet', 'welterusten is for bedtime. goedemorgen is for the morning.'), ', schat.'] },
  ] });
})();
