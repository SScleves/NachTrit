// Nachtrit, Nijmegen (tier 12, B1 to B2): level 115 Thuis. A narrow brick house on a steep street in the Benedenstad, the
// Valkhof above it, the Waal at the bottom of the road and the dark green arch of the Waalbrug over the roofs. A student
// house next door, a letter from the council about the Vierdaagse, a Roman coin under the floor, and the dogs.
// New at tier 12 and drilled here: modal particles with their fixed places (doe je even de deur open, ik doe het wel,
// ik pak wel even, je bent toch niet ziek, toch? as a tag, zo zijn ze nou eenmaal, dat zullen ... wel zijn): after the verb,
// behind a small pronoun, before niet, never after the last verb or prefix; idioms (op zijn kop zetten, twee linkerhanden,
// het regent pijpenstelen, Doe maar gewoon, dan doe je al gek genoeg, de kat uit de boom kijken in a read); compound nouns
// (the last part decides the article, the -en- in hondenmand); the formal register (Geachte bewoner, uw, Hoogachtend,
// Komt u binnen en gaat u zitten); the Vierdaagse in July.
// Review: V2 after a fronted phrase and after a toen-clause, dus without a verb at the end, the passive with zijn
// (is afgesloten), indirect speech with of, die and dat, the comparative, 't kofschip, a separable verb in a main clause,
// niet against geen, the adjective -e after het.
// Still inside the fence: 16 words max, nothing from tier 13 (no builds with three forks, no prices, no tourist register).
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar (Doe je even de deur open, Ik pak wel even een
// biertje voor je, Kom maar even langs hoor, Mooi weertje toch), de vs het, V2 word order, bijzin - werkwoord naar het
// einde, die vs dat, 't kofschip, scheidbare werkwoorden; MOC Gevoel & uitdrukkingen (op zijn kop); _site/situations/
// neighbours and polite-phrases; levels 107 and 113 for the replayed words (de koelkast, het plafond, de afwas, de buurvrouw);
// content/towns.js for Nijmegen (de Waal, de Waalbrug, het Valkhof, de heuvel, de Romeinen, de student, de Vierdaagse,
// de wandelaar, the oldest-city rumour).
// New rules: idioom, samen, formeel, datum (defined and guarded below, with the same text in every Nijmegen and Amsterdam
// file). soft, v2, neg, adj, sep, kof, diedat and bijzin are in data.js; passief, indirect, vergelijk and zullen are guarded
// copies of the existing definitions.
// New props: none. Only hond, fiets and lamp are used (not huis or deur: het studentenhuis, de voordeur and de deurbel are in
// the word pool and could be taken for those props; not brug: de Waalbrug is a listen item).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 115, act: 12, name: 'Thuis', town: 'nijmegen', place: 'thuis', theme: 'street', ...P,
    intro: 'Nijmegen has a hill, two thousand years of history and a student house next door. Only the student house keeps you awake.',
    introNl: 'Nijmegen heeft een heuvel, tweeduizend jaar geschiedenis en hiernaast een studentenhuis. Alleen het studentenhuis houdt je wakker.',
    mission: {
      where: 'A narrow brick house on a steep street in the Benedenstad, the Valkhof above it, the Waal at the bottom of the road and the dark green arch of the Waalbrug over the roofs. Next door a student house that has not slept since someone said Maastricht is older. From the attic down to the front door, then out to the Waalkade, because the dogs need a walk. The dogs always need a walk.',
      carry: 'Two leads, the key of the front door, a letter from the council that starts with Geachte bewoner, the energy bill split to the cent with the students next door, and the grammar book, still never opened. No helmet. Nijmegen has a hill, and you are going down it.',
      want: 'Since the mist everyone who spoke Dutch has changed, but in Nijmegen they kept the small words. The dead in this house say little, and they say it softly: even, wel, maar, toch, nou eenmaal. Doe je even de deur open? Ik doe het wel. The council writes to you with u and uw, the house is held together by compound words, de voordeur, het dakraam, de hondenmand, and in July the walkers come past at six in the morning and ask where the party is. Paola, still taller than you, says that is just how it is here. Het is nou eenmaal zo.' },
    items: [
      // ---- builds: modal particles and where they go
      { en: 'Could you just open the door?', parts: ['Doe je', FK(['even de deur open', 'de deur open even', 'even open de deur'], 0, 'soft',
        'even sits in the middle and makes the request light. The prefix open stays at the very end, and nothing comes after it.'), '?'] },
      { en: "Leave it, I'll do it.", parts: ['Laat maar, ik', FK(['doe het wel', 'doe wel het'], 0, 'soft',
        'A small pronoun like het comes before wel: ik doe het wel. Here wel means do not worry, I will.'), '.'] },
      { en: "Come on in, the dogs don't bite.", parts: [FK(['Kom maar binnen', 'Kom binnen maar'], 0, 'soft',
        'maar makes the command friendly and comes straight after the verb, before binnen.'), ', de honden bijten', FK(['niet', 'geen'], 0, 'neg',
        'No noun follows bijten, so niet. geen always needs a noun after it.'), '.'] },
      { en: "You've already walked the dogs, haven't you?", parts: ['Je hebt de honden al uitgelaten,', FK(['toch', 'hoor', 'maar'], 0, 'soft',
        'toch at the end asks for a yes, like right? hoor reassures and maar softens a command, so neither of them asks anything.'), '?'] },
      { en: 'The dogs need to go out again. That is just how they are.', parts: ['De honden moeten alweer uit. Zo zijn ze', FK(['nou eenmaal', 'nou eenmalig', 'nu eenmaals'], 0, 'soft',
        'nou eenmaal means that is how it is and nothing can be done about it. eenmalig means one-off, and eenmaals is not a word.'), '.'] },
      { en: "I'll just get you a beer.", parts: ['Ik pak', FK(['wel even', 'even wel'], 0, 'soft',
        'Two small words in a row keep a fixed order: wel before even. Together they say I will gladly do it, quickly.'), 'een biertje voor je.'] },
      { en: 'Just act normal, that is crazy enough already.', parts: ['Doe maar gewoon,', FK(['dan doe je', 'dan je doet'], 0, 'v2',
        'dan takes slot 1 of the second half, so the verb comes right after it: dan doe je.'), 'al', FK(['gek genoeg', 'genoeg gek'], 0, 'idioom',
        'A saying every Dutch person knows. genoeg comes after an adjective: gek genoeg, groot genoeg.'), '.'] },
      { en: "You look so pale. You're not ill, are you?", parts: ['Je ziet zo bleek. Je bent', FK(['toch niet', 'niet toch'], 0, 'soft',
        'toch comes before niet. In a question toch niet hopes for a no: surely you are not ill.'), 'ziek?'] },
      { en: 'That will be the students again, no doubt.', parts: ['Dat', FK(['zullen', 'zal'], 0, 'zullen',
        'In dat zijn followed by a plural the verb agrees with the plural: dat zijn de studenten, so dat zullen de studenten wel zijn. wel makes it probably.'), 'de studenten wel weer zijn.'] },

      // ---- builds: compound nouns, the last part decides
      { en: 'The front door and the skylight are open.', parts: [FK(['De', 'Het'], 0, 'samen',
        'A compound takes the article of its last part: voor + deur, and deur is de, so de voordeur.'), 'voordeur en', FK(['het', 'de'], 0, 'samen',
        'dak + raam: raam is het, so het dakraam.'), 'dakraam staan open.'] },
      { en: 'The dog basket is next to the washing machine.', parts: [FK(['De', 'Het'], 0, 'samen',
        'honden + mand: mand is de, so de hondenmand. The first part never decides.'), FK(['hondenmand', 'hondmand', 'hondsmand'], 0, 'samen',
        'This compound is glued with -en-: de hondenmand, like de hondenriem and het hondenvoer.'), 'staat naast de wasmachine.'] },
      { en: 'Six students live in the student house next door.', parts: ['In', FK(['het', 'de'], 0, 'samen',
        'studenten + huis: huis is het, so het studentenhuis.'), 'studentenhuis hiernaast', FK(['wonen zes studenten', 'zes studenten wonen'], 0, 'v2',
        'In het studentenhuis hiernaast fills slot 1, so the verb comes second, before the subject.'), '.'] },

      // ---- builds: the formal register
      { en: 'Dear resident, during the Vierdaagse your street is closed in the mornings.', parts: [FK(['Geachte', 'Geacht'], 0, 'formeel',
        'bewoner is a de-word, so the adjective takes -e: Geachte bewoner. It is the standard way to open a formal letter.'), 'bewoner, tijdens de Vierdaagse is', FK(['uw', 'u'], 0, 'formeel',
        'u is the person, uw is what belongs to u: uw straat.'), "straat 's ochtends afgesloten."] },
      { en: 'We thank you for your understanding. Yours faithfully, the municipality of Nijmegen.', parts: ['Wij danken u voor', FK(['uw', 'u'], 0, 'formeel',
        'The possessive of u is uw: uw begrip. u alone is never a possessive.'), 'begrip.', FK(['Hoogachtend', 'Geachte'], 0, 'formeel',
        'Hoogachtend closes a formal letter. Geachte is how one opens.'), ', de gemeente Nijmegen.'] },
      { en: 'Please come in and sit down.', parts: [FK(['Komt u', 'Kom u'], 0, 'formeel',
        'With u the verb takes -t, even when u comes after it: komt u. Only jij loses the -t there.'), 'binnen en', FK(['gaat u', 'ga u'], 0, 'formeel',
        'Same rule: gaat u zitten is the polite way to say sit down.'), 'zitten.'] },

      // ---- builds: idioms
      { en: 'The dogs have turned the whole house upside down.', parts: ['De honden hebben het', FK(['hele', 'heel'], 0, 'adj',
        'huis is a het-word, but after the article het the adjective still takes -e: het hele huis.'), 'huis', FK(['op zijn kop', 'op zijn hoofd'], 0, 'idioom',
        'Fixed phrase: iets op zijn kop zetten, to turn it upside down. In this phrase it is always kop.'), 'gezet.'] },
      { en: 'My neighbour is hopeless at DIY, so I hang the lamp up myself.', parts: ['Mijn buurman heeft', FK(['twee linkerhanden', 'twee rechterhanden'], 0, 'idioom',
        'Someone who is clumsy with tools has twee linkerhanden, two left hands. Two right hands is not a Dutch saying.'), ', dus', FK(['ik hang de lamp zelf op', 'ik de lamp zelf ophang'], 0, 'bijzin',
        'dus does not send the verb to the end. The sentence goes on as a main clause: ik hang ... op.'), '.'] },
      { en: "It is raining cats and dogs, so the dogs don't want to go out.", parts: ['Het regent', FK(['pijpenstelen', 'katten en honden', 'pijpen'], 0, 'idioom',
        'In Dutch it rains pipe stems: het regent pijpenstelen. Cats and dogs is the English saying.'), ', dus de honden', FK(['willen niet', 'niet willen'], 0, 'v2',
        'dus never sends the verb to the end. You say dus de honden willen niet, or dus willen de honden niet.'), 'naar buiten.'] },

      // ---- builds: the Vierdaagse in July
      { en: 'In July the walkers pass our door at six in the morning.', parts: [FK(['In juli', 'Op juli', 'In de juli'], 0, 'datum',
        'Months take in and no article: in juli. Days take op: op dinsdag.'), FK(['lopen de wandelaars', 'de wandelaars lopen'], 0, 'v2',
        'In juli fills slot 1, so the verb comes second, then the subject.'), "om zes uur 's ochtends langs onze deur."] },

      // ---- builds: review of earlier tiers
      { en: 'Our street has been closed since yesterday because of the Vierdaagse.', parts: ['Onze straat', FK(['is', 'heeft'], 0, 'passief',
        'A state that results from being closed takes zijn plus the participle: is afgesloten. A street does not close anything itself.'), 'sinds gisteren', FK(['afgesloten', 'afgesluit', 'geafsloten'], 0, 'sep',
        'afsluiten is separable and irregular: af + gesloten, one word, with the ge in the middle.'), 'vanwege de Vierdaagse.'] },
      { en: 'The neighbour asked whether the students could be a bit quieter.', parts: ['De buurvrouw vroeg', FK(['of', 'om'], 0, 'indirect',
        'A reported yes-or-no question starts with of. om goes with a noun, as in vragen om rust, and cannot open a clause.'), 'de studenten wat', FK(['zachter konden doen', 'konden zachter doen'], 0, 'bijzin',
        'of sends the verbs to the end of the clause, after zachter: zachter konden doen.'), '.'] },
      { en: 'The house we rent is older than it looks.', parts: ['Het huis', FK(['dat', 'die'], 0, 'diedat',
        'huis is a het-word, so the relative pronoun is dat.'), 'we huren is', FK(['ouder', 'oudste', 'meer oud'], 0, 'vergelijk',
        'Comparing two things with dan takes the comparative: ouder dan. meer oud is not Dutch.'), 'dan het lijkt.'] },
      { en: 'When we came to live in Nijmegen, nobody had warned us about the hill.', parts: ['Toen we in Nijmegen kwamen wonen,', FK(['had niemand ons', 'niemand had ons'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: had niemand.'), 'voor de heuvel', FK(['gewaarschuwd', 'gewaarschuwt', 'gewaarschuwen'], 0, 'kof',
        'waarschuw ends in w, not a ketchup letter, so -d: gewaarschuwd.'), '.'] },

      // ---- words: the house, the street, the council, with Nijmegen colour and four replayed words
      { w: 'the front door', nl: 'de voordeur' }, { w: 'the skylight', nl: 'het dakraam', wrong: 'de dakraam' },
      { w: 'the attic', nl: 'de zolder' }, { w: 'the doorbell', nl: 'de deurbel' },
      { w: 'the washing machine', nl: 'de wasmachine' }, { w: 'the dog basket', nl: 'de hondenmand' },
      { w: 'the student house', nl: 'het studentenhuis', wrong: 'de studentenhuis' }, { w: 'the landlord', nl: 'de huisbaas' },
      { w: 'the rent', nl: 'de huur' }, { w: 'the resident', nl: 'de bewoner' },
      { w: 'the council, the municipality', nl: 'de gemeente' }, { w: 'the bunch of keys', nl: 'de sleutelbos' },
      { w: 'the rubbish bag', nl: 'de vuilniszak' }, { w: 'the coin', nl: 'de munt' },
      { w: 'the fridge', nl: 'de koelkast' }, { w: 'the ceiling', nl: 'het plafond', wrong: 'de plafond' },
      { w: 'the washing-up', nl: 'de afwas' }, { w: 'the neighbour (woman)', nl: 'de buurvrouw' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Ik doe de afwas wel.', o: ['I will do the washing-up, do not worry.', 'I am doing the washing-up well.', 'I have already done the washing-up.'], a: 0, r: 'soft',
        w: 'wel here means leave it to me. Doing it well would be goed, and already done would be al gedaan.' },
      { read: true, nl: 'De huisbaas kijkt de kat uit de boom.', o: ['The landlord is waiting to see what happens.', 'The landlord is looking at a cat in a tree.', 'The landlord is getting the cat out of the tree.'], a: 0, r: 'idioom',
        w: 'de kat uit de boom kijken is a fixed phrase: wait and see before you act. There is no cat.' },
      { read: true, nl: 'Wij verzoeken u de vuilniszak pas op dinsdag buiten te zetten.', o: ['We ask you not to put the rubbish bag out before Tuesday.', 'We ask you to put the rubbish bag out before Tuesday.', 'We will pick up your rubbish bag on Tuesday.'], a: 0, r: 'formeel',
        w: 'pas op dinsdag means not until Tuesday. verzoeken is the formal word for asking, and u is the reader.' },
      { read: true, nl: 'Kom maar eens langs, hoor.', o: ['Do drop by some time.', 'Come by right now.', 'Do not drop by again.'], a: 0, r: 'soft',
        w: 'maar and eens make it an open invitation for some time, and hoor makes it warm. Right now would be nu meteen.' },
      { read: true, nl: 'Oost west, thuis best.', en: 'East, west, home is best.' },
      { read: true, nl: 'Bij de verbouwing vonden we een Romeinse munt onder de vloer.', en: 'During the renovation we found a Roman coin under the floor.' },

      // ---- listens: the lower town, the bridge, a letter ending, a windowsill
      { listen: true, nl: 'de Benedenstad', en: 'the old lower town by the Waal' }, { listen: true, nl: 'de Waalbrug', en: 'the bridge over the Waal' },
      { listen: true, nl: 'hoogachtend', en: 'yours faithfully' }, { listen: true, nl: 'de vensterbank', en: 'the windowsill' },

      // ---- looks: the dog, the bike by the door, the street lamp
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'trappenhuis', art: 'het', en: 'the stairwell', w: 'The last part decides: het huis, so het trappenhuis.' },
      { dehet: true, nl: 'deurmat', art: 'de', en: 'the doormat', w: 'The last part decides: de mat, so de deurmat.' },
    ] }]);
})();
