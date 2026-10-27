// Nachtrit, Amsterdam (tier 13, B1 to B2): level 123 Thuis. A narrow canal house in the Jordaan, four floors and a staircase
// as steep as a ladder, a hoist beam under the gable for anything bigger than a chair, a houseboat moored outside, bikes on
// every railing and the Westertoren over the roofs. Renting, moving in, the neighbours, tourists at the door, the dogs.
// New at tier 13 and drilled here: long builds with two and three forks (up to 18 words), the hardest reading pairs (huren
// against verhuren, al with the present, het druk hebben against zich druk maken, hoeft niet te against mag niet, pas against al),
// the local register next to the standard one (Mokum and gabber, marked as Amsterdam slang, and the informal jatten), prices in words
// (tweeduizendhonderd euro, tot op de cent) and directions in the city (bij de Westertoren linksaf, tegenover, tot aan).
// Review of every tier: the passive with worden and with a modal, the irregular participle gehesen, 't kofschip with the v of
// verven (geverfd), indirect speech, the sub-clause, V2 after a fronted phrase and after a sub-clause, a reflexive verb, ons
// against onze, zonder ... te with a separable verb, the superlative, a modal particle behind a pronoun, a separable verb in a
// command, het hek.
// Sources: dutch-lessons vault, 02 - Grammar/bijzin - werkwoord naar het einde, V2 word order, 't kofschip, perfectum,
// scheidbare werkwoorden, reflexieve werkwoorden, zachtmakers - wel even maar, de vs het; _site/situations/directions (de weg
// wijzen, oversteken, links, rechts, rechtdoor), polite-phrases (Pardon, mag ik er even langs); MOC Getallen; level 115 for the
// replayed words (de zolder, de huisbaas, de vuilniszak, het dakraam); content/towns.js for Amsterdam (de gracht, het
// grachtenpand, de hijsbalk, de woonboot, de fietsbel, de toerist, Mokum, Mag ik er even langs?, de Westertoren, the rumour
// about the drunk German). Canal houses lean forward on purpose (op vlucht) so loads on the hoist do not hit the front.
// New rules: weg (directions), defined and guarded below with the same text in every Amsterdam file; idioom, samen, formeel and
// datum keep the Nijmegen text. passief, indirect, bezit, omte and vergelijk are guarded copies of the existing definitions.
// New props: none. Only hond, boom and lamp are used (not water or brug: de gracht and the bridge in the builds would read as
// right answers; not fiets: de fietsbel is in the word pool).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.bezit = window.RULES.bezit || { name: 'Possessives: mijn, jouw, zijn, haar, ons', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 123, act: 13, name: 'Thuis', town: 'amsterdam', place: 'thuis', theme: 'street', ...P,
    intro: 'In Amsterdam the stairs are so steep that the furniture comes in through the window. So do the tourists, if you leave it open.',
    introNl: 'In Amsterdam is de trap zo steil dat de meubels door het raam naar binnen komen. De toeristen ook, als je het open laat staan.',
    mission: {
      where: 'A narrow canal house in the Jordaan, four floors and a staircase as steep as a ladder, with a hoist beam under the gable for anything bigger than a chair. A houseboat is moored outside, bikes are chained to every railing and the Westertoren stands over the roofs. The last town. Everything you learned on the way is needed here.',
      carry: 'Two dogs on leads, who take the stairs better than you do, a sofa on a rope, a rent split to the cent with Paola, and the grammar book, still never opened. No helmet. In Amsterdam nobody wears one, not even the dead.',
      want: 'Since the mist everyone who spoke Dutch has changed, and in Amsterdam they finally stopped switching to English. The dead here want everything at once: long sentences with two or three choices, the polite form for the landlord and the slang for the neighbours, the rent in words and the exact way to your own front door. Paola, still taller than you, carries the heavy end of the sofa. The rumour in this town: the millionth tourist said Dutch sounds like a drunk German.' },
    items: [
      // ---- builds: moving in, long sentences with two or three forks
      { en: 'Because the stairs are too narrow, the sofa is hoisted up with the hoist beam.', parts: ['Omdat de trap', FK(['te smal is', 'is te smal'], 0, 'bijzin',
        'omdat sends the verb to the end of its clause: te smal is.'), ',', FK(['wordt de bank', 'de bank wordt'], 0, 'v2',
        'The omdat-clause fills slot 1, so the main clause starts with its verb: wordt de bank.'), 'met de hijsbalk naar boven', FK(['gehesen', 'gehijsd', 'gehijsen'], 0, 'perf',
        'hijsen is irregular: hees, gehesen. The passive is wordt plus this participle at the end.'), '.'] },
      { en: "Could you hold the rope for a moment? Then I'll pull the sofa in through the window.", parts: ['Kun je', FK(['het touw even vasthouden', 'het touw vasthouden even'], 0, 'soft',
        'even stands in the middle, before the verb at the end. Nothing comes after vasthouden.'), '?', FK(['Dan trek ik', 'Dan ik trek'], 0, 'v2',
        'dan takes slot 1, so the verb comes right after it: dan trek ik.'), 'de bank door het raam naar binnen.'] },
      { en: 'The canal houses lean forward a little on purpose, so the furniture does not hit the front.', parts: ['De grachtenpanden hangen', FK(['expres', 'per ongeluk'], 0, 'woord',
        'expres means on purpose. per ongeluk means by accident, and the builders meant it.'), 'een beetje voorover, zodat de meubels', FK(['niet tegen de gevel slaan', 'slaan niet tegen de gevel'], 0, 'bijzin',
        'zodat opens a sub-clause, so the verb goes to the very end: niet tegen de gevel slaan.'), '.'] },
      { en: 'Our moving boxes have to be taken up to the fourth floor tomorrow.', parts: ['Onze verhuisdozen moeten morgen naar de vierde verdieping', FK(['gebracht worden', 'gebracht wordt', 'brengen worden'], 0, 'passief',
        'After moeten the passive ends in participle plus worden, both at the end, and worden stays an infinitive.'), '.'] },

      // ---- builds: renting, the rent in words, the neighbours
      { en: 'We rent the top floor, and the landlord lets the rest to tourists.', parts: ['Wij', FK(['huren', 'verhuren'], 0, 'woord',
        'huren is to rent from someone. verhuren is to let it out to others, and that is the landlord.'), 'de bovenste verdieping, en de huisbaas', FK(['verhuurt', 'huurt'], 0, 'woord',
        'The landlord lets it out: verhuurt aan toeristen. huren aan is not Dutch.'), 'de rest aan toeristen.'] },
      { en: 'The rent is two thousand one hundred euros a month, so we split it to the cent.', parts: ['De huur is', FK(['tweeduizendhonderd', 'tweeduizendeenhonderd', 'twaalfhonderd'], 0, 'getal',
        '2.100 is tweeduizendhonderd, one word and no een before honderd. twaalfhonderd is 1.200.'), 'euro per maand, dus we delen hem', FK(['tot op de cent', 'tot de cent', 'op de cent na'], 0, 'idioom',
        'tot op de cent means exactly, to the last cent. op de cent na means almost exactly, and tot de cent is not said.'), '.'] },
      { en: 'The neighbours on the houseboat have been living on the water for twenty years.', parts: ['De buren op de woonboot', FK(['wonen al', 'woonden al'], 0, 'al',
        'Something that started long ago and still goes on takes the present with al: ze wonen al twintig jaar. woonden would mean they no longer do.'), 'twintig jaar', FK(['op het water', 'in het water'], 0, 'woord',
        'You live op het water, on a boat. In het water is where the fish live.'), '.'] },
      { en: 'My neighbour calls Amsterdam Mokum and every friend a gabber (Amsterdam slang).', parts: ['Mijn buurman noemt', FK(['Amsterdam Mokum', 'Mokum Amsterdam'], 0, 'cult',
        'noemen puts the thing first and the name second: hij noemt Amsterdam Mokum.'), 'en', FK(['elke', 'elk'], 0, 'adj',
        'vriend is a de-word, so elke. elk goes with het-words.'), 'vriend een gabber.'] },
      { en: 'A tourist rings the bell: is this the Airbnb? No, sir, this is our home.', parts: ['Een toerist', FK(['belt aan', 'aanbelt'], 0, 'sep',
        'In a main clause the separable verb splits: belt ... aan.'), ': is dit de Airbnb? Nee meneer, dit is', FK(['ons', 'onze'], 0, 'bezit',
        'huis is a het-word, so ons huis. onze goes with de-words and plurals.'), 'huis.'] },

      // ---- builds: bikes, the street, local words
      { en: "I can't find my bike. It has been nicked again.", parts: ['Ik kan mijn fiets niet vinden.', FK(['Hij is', 'Hij heeft'], 0, 'passief',
        'The bike is the one that was taken, so zijn plus the participle: hij is gejat. heeft would make the bike the thief.'), 'alweer', FK(['gejat', 'gejaat', 'gejatte'], 0, 'kof',
        'jatten is informal Dutch for to steal, a word that came from Amsterdam Yiddish. jat ends in t, so the participle gejat gets nothing extra.'), '.'] },
      { en: "Just put the bikes against the railing, they'll be fine there.", parts: ['Zet de fietsen maar tegen', FK(['het', 'de'], 0, 'dehet',
        'hek is a het-word: het hek.'), 'hek,', FK(['daar staan ze wel goed', 'daar staan wel ze goed'], 0, 'soft',
        'The small pronoun ze comes before wel: daar staan ze wel goed.'), '.'] },
      { en: 'Excuse me, may I get past? I live here.', parts: ['Sorry,', FK(['mag ik er even langs', 'mag ik even langs er', 'mag er ik even langs'], 0, 'soft',
        'er comes right after ik, then even, and langs closes the question: mag ik er even langs.'), '? Ik woon', FK(['hier', 'hierheen'], 0, 'woord',
        'hier is where you live. hierheen means to here, a direction.'), '.'] },

      // ---- builds: review of earlier tiers, long and dense
      { en: 'The landlord said that the previous tenants had painted the walls themselves.', parts: ['De huisbaas zei', FK(['dat', 'of'], 0, 'indirect',
        'zei dat reports a statement. of belongs to a reported question.'), 'de vorige huurders de muren', FK(['zelf hadden geverfd', 'hadden zelf geverfd'], 0, 'bijzin',
        'zelf stays in front of the verbs, and both verbs stand together at the end.'), '.'] },
      { en: 'The previous tenants painted the walls pink, says the landlord.', parts: ['De vorige huurders hebben de muren roze', FK(['geverfd', 'geverft', 'verfde'], 0, 'kof',
        'The infinitive is verven, with a v, so the ending is -d: geverfd, even though you hear an f.'), ', zegt de huisbaas.'] },
      { en: 'Paola is only home at ten, so I walk the dogs.', parts: ['Paola is', FK(['pas', 'al'], 0, 'woord',
        'pas om tien uur means not until ten, late. al om tien uur would mean as early as ten.'), 'om tien uur thuis, dus ik', FK(['laat de honden uit', 'de honden uitlaat'], 0, 'bijzin',
        'dus does not send the verb to the end: ik laat de honden uit.'), '.'] },
      { en: 'You cannot get up these stairs without holding the rope.', parts: ['Je komt deze trap niet op zonder het touw', FK(['vast te houden', 'te vasthouden', 'vasthouden te'], 0, 'omte',
        'With a separable verb te goes between the prefix and the verb: vast te houden.'), '.'] },
      { en: "I don't remember where I chained up my bike.", parts: ['Ik herinner', FK(['me', 'zich'], 0, 'refl',
        'With ik the reflexive pronoun is me. zich is for hij, zij and u.'), 'niet meer', FK(['waar ik mijn fiets heb vastgezet', 'waar heb ik mijn fiets vastgezet'], 0, 'bijzin',
        'A question inside a sentence becomes a sub-clause, so the verbs go to the end.'), '.'] },
      { en: 'This is the narrowest staircase in the whole Jordaan.', parts: ['Dit is de', FK(['smalste', 'smalst', 'smallere'], 0, 'vergelijk',
        'After de the superlative takes -e: de smalste trap. smallere is the comparative.'), 'trap van de hele Jordaan.'] },
      { en: "If we had a lift, we wouldn't need the hoist beam.", parts: ['Als we een lift hadden,', FK(['zouden we', 'we zouden'], 0, 'v2',
        'The als-clause fills slot 1, so the main clause starts with its verb: zouden we.'), 'de hijsbalk', FK(['niet', 'geen'], 0, 'neg',
        'de hijsbalk has an article, so niet. geen only goes with a noun without one.'), 'nodig hebben.'] },

      // ---- builds: the way to your own front door
      { en: 'Turn left at the Westertoren, cross the bridge and walk along the canal up to our door.', parts: ['Ga bij de Westertoren linksaf,', FK(['steek de brug over', 'oversteek de brug'], 0, 'weg',
        'oversteken splits in a command: steek de brug over, with over at the end.'), 'en loop langs de gracht', FK(['tot aan', 'naar aan'], 0, 'weg',
        'tot aan means right up to: tot aan onze deur.'), 'onze deur.'] },
      { en: 'Our house is the third one after the bridge, opposite the houseboat.', parts: ['Ons huis is', FK(['het derde', 'de derde'], 0, 'weg',
        'huis is a het-word, so the third one is het derde.'), 'na de brug,', FK(['tegenover', 'tegen'], 0, 'weg',
        'tegenover means opposite, across from. tegen means against.'), 'de woonboot.'] },

      // ---- words: the canal house, the move, four replayed from Nijmegen
      { w: 'the canal', nl: 'de gracht' }, { w: 'the canal house', nl: 'het grachtenpand', wrong: 'de grachtenpand' },
      { w: 'the hoist beam', nl: 'de hijsbalk' }, { w: 'the houseboat', nl: 'de woonboot' },
      { w: 'the bike bell', nl: 'de fietsbel' }, { w: 'the tourist', nl: 'de toerist' },
      { w: 'Amsterdam, the nickname (from Yiddish)', nl: 'Mokum' }, { w: 'the front of the house', nl: 'de gevel' },
      { w: 'the rope', nl: 'het touw', wrong: 'de touw' }, { w: 'the moving box', nl: 'de verhuisdoos' },
      { w: 'the railing', nl: 'het hek', wrong: 'de hek' }, { w: 'the tenant', nl: 'de huurder' },
      { w: 'the floor, the storey', nl: 'de verdieping' }, { w: 'the basement flat', nl: 'het souterrain', wrong: 'de souterrain' },
      { w: 'the attic', nl: 'de zolder' }, { w: 'the landlord', nl: 'de huisbaas' },
      { w: 'the rubbish bag', nl: 'de vuilniszak' }, { w: 'the skylight', nl: 'het dakraam', wrong: 'de dakraam' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'We huren een flat in de Jordaan.', o: ['We rent a flat in the Jordaan.', 'We let out a flat in the Jordaan.', 'We are buying a flat in the Jordaan.'], a: 0, r: 'woord',
        w: 'huren is to rent from someone. Letting it out to others would be verhuren.' },
      { read: true, nl: 'Ze wonen hier al twintig jaar.', o: ['They have been living here for twenty years.', 'They lived here twenty years ago.', 'They will have lived here for twenty years.'], a: 0, r: 'al',
        w: 'The present tense with al: it started twenty years ago and still goes on.' },
      { read: true, nl: 'Hij heeft het druk met de verhuizing.', o: ['He is busy with the move.', 'He is worried about the move.', 'He is pushing for the move.'], a: 0, r: 'woord',
        w: 'het druk hebben means to be busy. Worried would be zich druk maken.' },
      { read: true, nl: 'Je hoeft je schoenen niet uit te doen.', o: ['You do not have to take your shoes off.', 'You must not take your shoes off.', 'You did not take your shoes off.'], a: 0, r: 'mag',
        w: 'hoeft niet te means it is not necessary. Not allowed would be mag niet.' },
      { read: true, nl: 'Door de hijsbalk hoeft de bank niet over de smalle trap.', en: 'Thanks to the hoist beam the sofa does not have to go up the narrow stairs.' },
      { read: true, nl: 'De miljoenste toerist zei dat het klinkt als een dronken Duitser.', en: 'The millionth tourist said it sounds like a drunk German.' },

      // ---- listens: the neighbourhood, the tower, the rent, the move
      { listen: true, nl: 'de Jordaan', en: 'the old neighbourhood west of the canal ring' }, { listen: true, nl: 'de Westertoren', en: 'the church tower on the Prinsengracht' },
      { listen: true, nl: 'tweeduizendhonderd euro', en: '€ 2.100' }, { listen: true, nl: 'de verhuizing', en: 'the move' },

      // ---- looks: the dog, an elm by the canal, the street lamp
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'boom', nl: 'de boom', en: 'the tree' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'balkon', art: 'het', en: 'the balcony', w: 'het balkon. Learn it with its article: there is no rule.' },
      { dehet: true, nl: 'raamkozijn', art: 'het', en: 'the window frame', w: 'The last part decides: het kozijn, so het raamkozijn.' },
    ] }]);
})();
