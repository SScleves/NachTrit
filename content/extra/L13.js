(() => {
  // Level 13 Nieuwe mensen, Gouda (tier 3, A1 to A2), place mensen: 36 more items.
  // Meeting people after the mist: names, wives and sisters, where you are from, the language you speak, the neighbours'
  // party, the Friday borrel with colleagues, how you feel and what you think of the place (vinden).
  // Fence: 8 words a line at most, present tense of all persons, verb-first questions, V2 after a time word, niet/geen,
  // modal plus infinitive at the end (separable verbs only glued after a modal), possessives mijn, jouw.
  // No object pronouns, no er is, no perfectum, no imperative, no sub-clauses.
  // Sources: vault _site/situations/meeting-people (Hoe gaat het met je? Hoe heet je vrouw / man? Hoe lang woon je al
  // in Nederland? Ben je getrouwd?), _site/situations/friends (We moeten snel weer afspreken. Het was gezellig),
  // _site/situations/opinions (Wat vind je van ...?), _site/situations/pub (proost), _site/words (de vriend, de vriendin,
  // de collega, het feest, de verjaardag, het land, de zus, de mening, gezellig, voorstellen, afspreken, spreken,
  // Ik heb een broer en een zus, Mijn naam is Santi, Mijn vrouw heet ...), 02 - Grammar (presens, V2 word order,
  // niet vs geen, modale werkwoorden, de vs het), MOC Lidwoorden & voornaamwoorden (mijn, jouw).
  // Left out on purpose: de voornaam and de achternaam next to de naam, de mens next to de overlevende, blij next to
  // gezellig as a feeling, Lang niet gezien (a perfectum), Doe de groeten (an imperative).
  // New props: none. Only huis and tuin. New rules: none (zijn, v2, neg, modal, woord come from data.js and levels.js,
  // presens from district3.js, bezit from town-gouda.js; the last two are set again only if missing).
  window.RULES.presens = window.RULES.presens || { name: 'Present tense endings', note: 'presens' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.extendLevel(13, { deliveries: 20, items: [
    // ---- words: the people you meet
    { w: 'the friend (man)', nl: 'de vriend' }, { w: 'the friend (woman)', nl: 'de vriendin' },
    { w: 'the colleague', nl: 'de collega' }, { w: 'the sister', nl: 'de zus' }, { w: 'the brother', nl: 'de broer' },
    // ---- words: what you do with them
    { w: 'the party', nl: 'het feest', wrong: 'de feest' }, { w: 'the birthday', nl: 'de verjaardag' },
    { w: 'the conversation', nl: 'het gesprek', wrong: 'de gesprek' }, { w: 'the opinion', nl: 'de mening' },
    { w: 'the country', nl: 'het land', wrong: 'de land' },
    // ---- words: how it feels
    { w: 'tired', nl: 'moe' }, { w: 'cosy, nice company', nl: 'gezellig' },

    // ---- reads: two traps with their own options
    { read: true, nl: 'Hoe gaat het met je?', en: 'How are you?' },
    { read: true, nl: 'Hoe heet je vrouw?', en: "What's your wife's name?" },
    { read: true, nl: 'Wat vind je van Gouda?', en: 'What do you think of Gouda?' },
    { read: true, nl: 'Ik vind het hier gezellig.', en: "I think it's cosy here.",
      o: ["I think it's cosy here.", 'I found it here.', "It's quiet here."], a: 0, r: 'woord',
      w: "I think it's cosy here. vinden is to find, but ik vind het gezellig gives an opinion: I think it is cosy." },
    { read: true, nl: 'Ik heb het druk.', en: "I'm busy.",
      o: ["I'm busy.", "I'm bored.", "It's crowded here."], a: 0, r: 'woord',
      w: "I'm busy. Dutch says I have it busy: ik heb het druk." },

    // ---- listens: the toast, the neighbours, an age
    { listen: true, nl: 'proost', en: 'cheers' }, { listen: true, nl: 'de buren', en: 'the neighbours' },
    { listen: true, nl: 'achtendertig', en: '38' },

    // ---- looks: the neighbours' house and garden
    { look: true, prop: 'huis', nl: 'het huis', en: 'the house' }, { look: true, prop: 'tuin', nl: 'de tuin', en: 'the garden' },

    // ---- builds: one fork each
    { en: 'My name is Santi.', parts: [FK(['Mijn', 'Mij', 'Ik'], 0, 'bezit', 'My before a noun is mijn. mij is me, ik is I.'), 'naam is Santi.'] },
    { en: "My wife's name is Paola.", parts: ['Mijn vrouw', FK(['heet', 'heten'], 0, 'presens', 'One wife is a zij: heet. The stem already ends in t.'), 'Paola.'] },
    { en: 'This is my colleague Mark.', parts: ['Dit', FK(['is', 'zijn', 'ben'], 0, 'zijn', 'One colleague, so dit is. dit zijn is for more than one.'), 'mijn collega Mark.'] },
    { en: 'My sister lives in Spain.', parts: ['Mijn zus', FK(['woont', 'woon', 'wonen'], 0, 'presens', 'mijn zus is a zij: stem plus t, woont.'), 'in Spanje.'] },
    { en: 'I speak a little Dutch.', parts: ['Ik', FK(['spreek', 'spreekt', 'spreken'], 0, 'presens', 'ik takes the bare stem: spreek.'), 'een beetje Nederlands.'] },
    { en: 'I think the people here are very nice.', parts: ['Ik', FK(['vind', 'vindt', 'vinden'], 0, 'presens', 'ik takes the bare stem, and vind already ends in d.'), 'de mensen hier heel aardig.'] },
    { en: 'Paola thinks Gouda is cosy.', parts: ['Paola', FK(['vindt', 'vind', 'vinden'], 0, 'presens', 'Paola is a zij: stem plus t, vindt. Vind and vindt sound the same, but with Paola you write the t.'), 'Gouda gezellig.'] },
    { en: 'Are you tired?', parts: [FK(['Ben jij', 'Bent jij', 'Is jij'], 0, 'v2', 'A yes or no question starts with the verb, and jij drops the t.'), 'moe?'] },
    { en: "I don't have any brothers.", parts: ['Ik heb', FK(['geen', 'niet'], 0, 'neg', 'A plural without an article takes geen.'), 'broers.'] },
    { en: 'On Friday I drink a beer with colleagues.', parts: ['Vrijdag', FK(['drink ik', 'ik drink', 'drinkt ik'], 0, 'v2', 'Vrijdag takes slot 1, so the verb comes next, then ik.'), "een biertje met collega's."] },
    { en: 'On Sunday the neighbours are having a party.', parts: ['Zondag', FK(['geven de buren', 'de buren geven', 'geeft de buren'], 0, 'v2', 'Zondag in slot 1 pushes de buren behind the verb, and buren is plural: geven.'), 'een feest.'] },
    { en: 'How long have you lived in the Netherlands?', parts: ['Hoe lang', FK(['woon je', 'woont je', 'je woont'], 0, 'v2', 'Question word, then the verb, then je. Still living there, so the present with al.'), 'al in Nederland?'] },
    { en: 'May I introduce my wife?', parts: ['Mag ik mijn vrouw even', FK(['voorstellen', 'stel voor', 'voorstelt'], 0, 'modal', 'After a modal the verb goes whole to the end: voorstellen.'), '?'] },
    { en: 'We should meet up again soon.', parts: ['We moeten snel weer', FK(['afspreken', 'spreken af', 'afspreekt'], 0, 'modal', 'After moeten the verb goes whole to the end, prefix and all: afspreken.'), '.'] },
  ] });
})();
