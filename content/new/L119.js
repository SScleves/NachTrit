// Nachtrit, Nijmegen (tier 12, B1 to B2): level 119 Het werk. A desk in the old Honig soup factory on the Waal, now full of
// start-ups, with the river and the barges outside the window. The standup where nobody stands, a dashboard, an incident, a
// formal email to a client, the coffee machines, and the third week of July when half the office walks the Vierdaagse.
// New at tier 12 and drilled here: modal particles at work (mag ik je even storen, ik stuur het je wel even, kun je er even naar
// kijken), with the small pronoun before the particle; work idioms (op rolletjes lopen, op de lange baan schuiven, de spijker op de
// kop slaan, er met de pet naar gooien, in het water vallen in a read); compound nouns (de koffieautomaat against het
// koffieapparaat, het wachtwoord, de thuiswerkdag); the formal register of an email (Geachte heer, naar aanleiding van, Mocht u
// nog vragen hebben); dates (van dinsdag 21 tot en met vrijdag 24 juli, the third week of July).
// Review: V2 after a fronted phrase and after a toen-clause, the passive with worden, the plusquamperfectum with a separable
// participle, indirect speech with of, hoewel, die and dat, the adjective -e, 't kofschip.
// Still inside the fence: 16 words max, nothing from tier 13.
// Sources: dutch-lessons vault, 02 - Grammar/zachtmakers - wel even maar, scheidbare werkwoorden, bijzin - werkwoord naar het
// einde, V2 word order, de vs het; _site/situations/office (Heb je even, ik heb een korte vraag, Ik zit zo in een meeting, kan het
// straks, Werk ze nog); 04 - Phrases & Scenarios/De standup - tech talk, Koffiepraatje op kantoor; level 111 for the replayed words
// (het ticket, de back-up, de melding, de vrijmibo, de loonstrook, de stagiair); content/towns.js for Nijmegen (de Waal, de
// Vierdaagse, de wandelaar, het feest); the Honig soup factory on the Waal, now the Honigcomplex.
// New rules: idioom, samen, formeel, datum (guarded, same text in every Nijmegen and Amsterdam file). passief, indirect and
// hoewel are guarded copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, fiets and lamp are used (no word, listen or look answer here is a bike or a lamp).
(() => {
  window.RULES.idioom = window.RULES.idioom || { name: 'Idioms: fixed phrases', note: 'MOC Gevoel & uitdrukkingen' };
  window.RULES.samen = window.RULES.samen || { name: 'Compound nouns: one word, the last part decides', note: 'de vs het' };
  window.RULES.formeel = window.RULES.formeel || { name: 'Formal register: u, uw, Geachte, Hoogachtend', note: 'MOC Lidwoorden & voornaamwoorden' };
  window.RULES.datum = window.RULES.datum || { name: 'Dates: op dinsdag, in juli, sinds 1909', note: 'MOC Tijd, dagen & maanden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.indirect = window.RULES.indirect || { name: 'Indirect speech: zei dat, vroeg of', note: 'bijzin - werkwoord naar het einde' };
  window.RULES.hoewel = window.RULES.hoewel || { name: 'hoewel and ondanks: although, despite', note: 'conjuncties-voegwoorden' };
  const P = window.TIER_PRESET[12];
  const FK = (o, a, r, w, task) => (task ? { o, a, r, w, task } : { o, a, r, w });

  window.defineLevels([{ id: 119, act: 12, name: 'Het werk', town: 'nijmegen', place: 'werk', theme: 'street', ...P,
    intro: 'In the old soup factory on the Waal the dead now run start-ups. The standup still takes forty minutes, and nobody stands.',
    introNl: 'In de oude soepfabriek aan de Waal runnen de doden nu start-ups. De standup duurt nog steeds veertig minuten, en niemand staat.',
    mission: {
      where: 'A desk in the old Honig soup factory on the Waal, now full of start-ups, with a window on the river and the barges going past. The dogs have a basket under the desk, and at lunch they need a walk along the Waalkade. They always need a walk.',
      carry: 'A laptop at nine percent, two leads, a cake for a colleague split to the cent among the team, an email that starts with Geachte heer and never seems to end, and the grammar book, still never opened. No helmet, not even in the bike shed.',
      want: 'Since the mist the dead still come to work, and they still hold a standup where nobody stands. They ask for things with small words: mag ik je even storen, kun je er even naar kijken, ik stuur het je wel even. They write to clients with u, uw and naar aanleiding van, and they build the whole day out of compound words: de werkplek, het wachtwoord, de thuiswerkdag. In the third week of July half the office walks the Vierdaagse and the other half is at the party. The women in the meeting are still taller than you.' },
    items: [
      // ---- builds: particles at work, the small pronoun first
      { en: 'Can I bother you for a second?', parts: ['Mag ik', FK(['je even', 'even je'], 0, 'soft',
        'A small pronoun like je comes before even: mag ik je even storen.'), 'storen?'] },
      { en: "I'll just send it to you.", parts: ['Ik stuur', FK(['het je wel', 'wel het je'], 0, 'soft',
        'Small pronouns come before the particles: ik stuur het je wel even.'), 'even.'] },
      { en: 'Could you have a quick look at it?', parts: ['Kun je er even', FK(['naar kijken', 'kijken naar'], 0, 'soft',
        'naar stays in front of the verb at the end, never behind it as in English.'), '?'] },
      { en: "Got a minute? I've got a quick question.", parts: ['Heb je even? Ik heb een', FK(['korte', 'kort'], 0, 'adj',
        'vraag is a de-word, so the adjective takes -e, also after een: een korte vraag.'), 'vraag.'] },

      // ---- builds: work idioms
      { en: 'Since the fix everything has been running like clockwork.', parts: ['Sinds de fix', FK(['loopt alles', 'alles loopt'], 0, 'v2',
        'Sinds de fix fills slot 1, so the verb comes second: loopt alles.'), FK(['op rolletjes', 'op wieltjes'], 0, 'idioom',
        'op rolletjes lopen means to go smoothly. The saying only knows rolletjes.'), '.'] },
      { en: 'After the outage we put the release on the back burner.', parts: ['Na de storing schuiven we de release op de lange', FK(['baan', 'weg'], 0, 'idioom',
        'iets op de lange baan schuiven means to put it off; the saying always has baan.'), '.'] },
      { en: "You've hit the nail on the head.", parts: ['Je slaat de spijker op de', FK(['kop', 'hoofd'], 0, 'idioom',
        'de spijker op de kop slaan: a nail has a kop, never a hoofd.'), '.'] },
      { en: 'The intern did a sloppy job on that dashboard.', parts: ['Bij dat dashboard heeft de stagiair er met de', FK(['pet', 'hoed'], 0, 'idioom',
        'er met de pet naar gooien means doing it carelessly, and it is always the pet.'), 'naar gegooid.'] },

      // ---- builds: compound nouns
      { en: 'The coffee vending machine is broken, but the coffee maker still works.', parts: [FK(['De', 'Het'], 0, 'samen',
        'koffie + automaat: automaat is de, so de koffieautomaat.'), 'koffieautomaat is kapot, maar', FK(['het', 'de'], 0, 'samen',
        'koffie + apparaat: apparaat is het, so het koffieapparaat. Same coffee, different last part.'), 'koffieapparaat doet het nog.'] },
      { en: 'I have forgotten the password again.', parts: ['Ik ben', FK(['het', 'de'], 0, 'samen',
        'A compound takes the article of its last part: het woord, so het wachtwoord.'), 'wachtwoord weer vergeten.'] },
      { en: 'On Tuesday I work at home, that is my working-from-home day.', parts: ['Op dinsdag werk ik thuis, dat is mijn', FK(['thuiswerkdag', 'thuiswerksdag'], 0, 'samen', 'thuiswerk and dag are glued without a linking s: de thuiswerkdag.', 'spell'), '.'] },

      // ---- builds: a formal email
      { en: 'Dear Mr Jansen, further to our conversation I am sending you the quote.', parts: ['Geachte heer Jansen,', FK(['naar', 'door'], 0, 'formeel', 'naar aanleiding van is the fixed formal way to say further to.'), 'aanleiding van ons gesprek', FK(['stuur ik u', 'ik stuur u'], 0, 'v2',
        'The whole naar aanleiding phrase fills slot 1, so the verb comes second: stuur ik.'), 'de offerte.'] },
      { en: 'Should you have any questions, I would be glad to hear from you.', parts: [FK(['Mocht u', 'Mag u'], 0, 'formeel',
        'Mocht u ... hebben is a formal if, should you have.', 'verb'), 'nog vragen hebben, dan', FK(['hoor ik', 'ik hoor'], 0, 'v2',
        'dan takes slot 1 of the main clause, so the verb comes right after it.'), 'het graag.'] },

      // ---- builds: the Vierdaagse week
      { en: 'In the third week of July everyone takes time off.', parts: ['In de derde week van juli', FK(['neemt iedereen', 'iedereen neemt'], 0, 'v2',
        'The time phrase fills slot 1, so the verb comes second: neemt iedereen.'), 'vrij.'] },
      { en: 'I am off from Tuesday the 21st up to and including Friday the 24th of July.', parts: ['Ik ben vrij van dinsdag 21', FK(['tot en met', 'tot met', 'tot en'], 0, 'datum', 'tot en met means up to and including, always the three words together.'), 'vrijdag 24 juli.'] },

      // ---- builds: review of earlier tiers
      { en: 'The release is postponed until after the Vierdaagse.', parts: ['De release', FK(['wordt', 'worden'], 0, 'passief',
        'One release, so wordt plus the participle at the end.'), 'tot na de Vierdaagse', FK(['uitgesteld', 'uitgestelt'], 0, 'kof', 'stel ends in l, not a ketchup letter, so -d: uitgesteld.', 'spell'), '.'] },
      { en: 'When I logged in, my colleague had already solved the incident.', parts: ['Toen ik inlogde,', FK(['had mijn collega', 'mijn collega had'], 0, 'v2',
        'After a toen-clause the main clause starts with its verb: had mijn collega.'), 'het incident al', FK(['opgelost', 'oplossen', 'oplost'], 0, 'sep', 'After had the participle closes the clause: op + gelost.'), '.'] },
      { en: 'My manager asked whether I had a moment.', parts: ['Mijn manager vroeg', FK(['of', 'dat'], 0, 'indirect', 'A reported yes-or-no question starts with of.', 'word'), 'ik', FK(['even tijd had', 'had even tijd'], 0, 'bijzin',
        'of sends the verb to the end of its clause: even tijd had.'), '.'] },
      { en: 'Although I am off, I still read my email.', parts: [FK(['Hoewel', 'Ondanks'], 0, 'hoewel', 'hoewel opens a clause with its own verb; ondanks needs a noun.', 'word'), 'ik vrij ben,', FK(['lees ik', 'ik lees'], 0, 'v2',
        'The sub-clause fills slot 1, so the main clause starts with its verb: lees ik.'), 'toch mijn mail.'] },
      { en: 'The dashboard I built last week is now used by the whole team.', parts: ['Het dashboard', FK(['dat', 'die'], 0, 'diedat',
        'dashboard is a het-word, so the relative pronoun is dat.'), 'ik vorige week bouwde,', FK(['wordt', 'worden'], 0, 'passief',
        'One dashboard, so wordt: wordt gebruikt.'), 'nu door het hele team gebruikt.'] },

      // ---- words: the desk, the email, the factory, five replayed from Maastricht
      { w: 'the workplace, the desk', nl: 'de werkplek' }, { w: 'the password', nl: 'het wachtwoord', wrong: 'de wachtwoord' },
      { w: 'the error message', nl: 'de foutmelding' }, { w: 'the quote (for a client)', nl: 'de offerte' },
      { w: 'the client', nl: 'de klant' }, { w: 'the team meeting', nl: 'het teamoverleg', wrong: 'de teamoverleg' },
      { w: 'the coffee vending machine', nl: 'de koffieautomaat' }, { w: 'the meeting room', nl: 'de vergaderruimte' },
      { w: 'the working-from-home day', nl: 'de thuiswerkdag' }, { w: 'the leave, the time off', nl: 'het verlof', wrong: 'de verlof' },
      { w: 'the start-up', nl: 'de start-up' }, { w: 'the soup factory', nl: 'de soepfabriek' },
      { w: 'the intern', nl: 'de stagiair' }, { w: 'the ticket (in the backlog)', nl: 'het ticket', wrong: 'de ticket' },
      { w: 'the backup', nl: 'de back-up' }, { w: 'the alert', nl: 'de melding' },
      { w: 'the Friday drinks', nl: 'de vrijmibo' }, { w: 'the payslip', nl: 'de loonstrook' },

      // ---- reads: four traps with their own options, two plain lines
      { read: true, nl: 'Ik zit zo in een meeting, kan het straks?', o: ['I am about to go into a meeting, can it wait?', 'I am sitting in a meeting like this, can it be done now?', 'I was in a meeting, can you do it later?'], a: 0, r: 'woord',
        w: 'zo here means very soon, not like this, and straks means later today.' },
      { read: true, nl: 'Het voorstel viel in het water.', o: ['The proposal fell through.', 'The proposal fell into the river.', 'The proposal was soaked.'], a: 0, r: 'idioom',
        w: 'in het water vallen means a plan does not go ahead. Nothing got wet, not even in Nijmegen.' },
      { read: true, nl: 'Mocht u verhinderd zijn, dan verzoeken wij u dit tijdig te melden.', o: ['If you cannot come, please let us know in good time.', 'If you can come, please tell us in good time.', 'You may not come late, please be on time.'], a: 0, r: 'formeel',
        w: 'Mocht u ... zijn is a formal if, and verhinderd means unable to come. tijdig means in time.' },
      { read: true, nl: 'Dat is wel even wat anders.', o: ['That is really something else.', 'That is the same thing for a moment.', 'That will change in a minute.'], a: 0, r: 'soft',
        w: 'wel even does not mean a moment here: it stresses how different it is.' },
      { read: true, nl: 'Tot morgen, werk ze nog.', en: 'See you tomorrow, good luck with the rest of the work (a fixed goodbye between colleagues).' },
      { read: true, nl: 'In de oude soepfabriek van Honig aan de Waal zitten nu start-ups.', en: 'The old Honig soup factory on the Waal is now full of start-ups.' },

      // ---- listens: the factory, a deadline, a letter line, the dashboard
      { listen: true, nl: 'het Honigcomplex', en: 'the old soup factory on the Waal' }, { listen: true, nl: 'de deadline', en: 'the deadline' },
      { listen: true, nl: 'bij voorbaat dank', en: 'thanks in advance' }, { listen: true, nl: 'het dashboard', en: 'the dashboard' },

      // ---- looks: the dog under the desk, the bike outside, the desk lamp
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'lamp', nl: 'de lamp', en: 'the lamp' },

      // ---- de of het
      { dehet: true, nl: 'inlogscherm', art: 'het', en: 'the login screen', w: 'The last part decides: het scherm, so het inlogscherm.' },
      { dehet: true, nl: 'werkweek', art: 'de', en: 'the working week', w: 'The last part decides: de week, so de werkweek.' },
    ] }]);
})();
