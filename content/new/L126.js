// Nachtrit, Amsterdam (tier 13, B1 to B2): level 126 Het station. Amsterdam Centraal, the red brick station from 1889 on its
// artificial islands in the IJ and its thousands of wooden piles, the trams in front, the free ferries to Noord behind it, the
// bike garage under the water, the escalators, and the long walk down the Damrak to the Dam. Checking in and out, tickets,
// delays, the way into the city.
// New at tier 13 and drilled here: long builds with two and three forks, directions in the city (het Damrak aflopen, vanaf de
// Dam de tweede straat links, achter het station), the tourist register next to the local
// one (Pardon meneer, is deze plaats nog vrij; Pas op, gabber), subtle reading pairs (overstappen against uitstappen, niet
// verder, gratis against vrij, onder water against onder het water, net against netjes, over een kwartier), numbers and times
// (bijna negenduizend palen, 17.34 uur, spoor 15b), and the towns.js line Ik moet er bij de volgende halte uit.
// Review of every tier: V2 after a fronted phrase, the passive in the past, houten as a material adjective, vergeten with te
// and a separable verb, an indirect question with welk spoor, the conditional pluperfect (als ... was geweest, hadden we ...
// gehaald), laten liggen in the perfect (had laten liggen), waar ... op, zal wel with an infinitive, zijn with uitstappen,
// the comparative, particles on the escalator.
// Sources: dutch-lessons vault, _site/situations/directions (de weg vragen, rechtdoor, links, oversteken), polite-phrases
// (Pardon, mag ik er even langs, Kunt u mij helpen, ik zoek het station); _site/maps/H15 In de trein, MOC Tijd, dagen &
// maanden, MOC Voorzetsels; 02 - Grammar/V2 word order, bijzin, scheidbare werkwoorden, perfectum; level 118 for the replayed
// words (het perron, de vertraging, de overstap, de OV-chipkaart, de fietsenstalling); content/towns.js for Amsterdam (de
// halte, Ik moet er bij de volgende halte uit, Mag ik er even langs, de toerist, de fietsbel). Amsterdam Centraal: opened
// 1889, Cuypers, 8,687 wooden piles; the IJ ferries are free; GVB trams take no cash.
// New rules: weg (guarded, the same text in every Amsterdam file). omte, passief, pronadv, vergelijk and zullen are guarded
// copies of the existing definitions; the rest are in data.js and levels.js.
// New props: none. Only hond, fiets and nummer are used (not brug or water: het IJ and het pontje are in the word pool).
(() => {
  window.RULES.weg = window.RULES.weg || { name: 'Directions: linksaf, oversteken, tegenover', note: 'de-weg-wijzen' };
  window.RULES.omte = window.RULES.omte || { name: 'te + infinitive, om ... te', note: 'modale werkwoorden' };
  window.RULES.passief = window.RULES.passief || { name: 'The passive: wordt / werd / is + participle', note: 'worden' };
  window.RULES.pronadv = window.RULES.pronadv || { name: 'Pronominal adverbs: erbij, ermee, waar ... op', note: 'er-het-kleine-woord-met-veel-banen-the-little-word' };
  window.RULES.vergelijk = window.RULES.vergelijk || { name: 'Comparing: groter dan, het grootst', note: 'trappen-van-vergelijking-comparison' };
  window.RULES.zullen = window.RULES.zullen || { name: 'zullen: probably (zal wel)', note: 'zullen-belofte-waarschijnlijkheid' };
  const P = window.TIER_PRESET[13];
  const FK = (o, a, r, w) => ({ o, a, r, w });

  window.defineLevels([{ id: 126, act: 13, name: 'Het station', town: 'amsterdam', place: 'station', theme: 'square', ...P,
    intro: 'Amsterdam Centraal stands on thousands of wooden piles in the water. The station has never fallen over. The timetable has.',
    introNl: 'Amsterdam Centraal staat op duizenden houten palen in het water. Het station is nog nooit omgevallen. De dienstregeling wel.',
    mission: {
      where: 'Amsterdam Centraal, the red brick palace from 1889 on its islands in the IJ, the trams in front, the free ferries to Noord behind it, the bike garage under the water and the long walk down the Damrak to the Dam. Every tourist who arrives asks the same three questions, and now they ask them in Dutch.',
      carry: 'Two dogs on leads, an OV-chipkaart and a bank card that both want you to check out, a train ticket split to the cent with Paola, and the grammar book, still never opened. No helmet. On the ferry nobody wears one, and the ferry is free.',
      want: 'Since the mist the dead still check in and still forget to check out. They ask the way in long sentences and want the answer to the metre: past the Dam, the second street on the left, across the canal. They tell tourists where to stand on the escalator and tell locals when to get off: ik moet er bij de volgende halte uit. The women on the platform are still taller than you, and the trains are still late, but the announcements are in Dutch again.' },
    items: [
      // ---- builds: the tram, the escalator, getting off
      { en: 'I need to get off at the next stop.', parts: ['Ik moet er bij de', FK(['volgende', 'volgend'], 0, 'adj',
        'halte is a de-word, so the adjective takes -e: de volgende halte.'), 'halte', FK(['uit', 'op'], 0, 'woord',
        'eruit moeten is getting off. erop would be getting on.'), '.'] },
      { en: "Don't forget to check out, or you will pay too much.", parts: ['Vergeet niet', FK(['uit te checken', 'te uitchecken', 'uitchecken te'], 0, 'omte',
        'vergeten takes te, and with a separable verb te goes between the prefix and the verb: uit te checken.'), ',', FK(['anders betaal je', 'anders je betaalt'], 0, 'v2',
        'anders takes slot 1, so the verb comes right after it: anders betaal je.'), 'te veel.'] },
      { en: 'You can no longer pay cash on the tram, only with your bank card.', parts: ['In de tram', FK(['kun je', 'je kunt'], 0, 'v2',
        'In de tram fills slot 1, so the verb comes second: kun je.'), FK(['niet meer', 'nog niet'], 0, 'woord',
        'niet meer means no longer, it used to be possible. nog niet means not yet.'), 'contant betalen, alleen met je pinpas.'] },
      { en: 'Just stand on the right of the escalator, then people can get past.', parts: [FK(['Ga maar rechts', 'Ga rechts maar'], 0, 'soft',
        'maar comes straight after the verb in a friendly command: ga maar rechts staan.'), 'op de roltrap staan,', FK(['dan kunnen mensen erlangs', 'dan mensen kunnen erlangs'], 0, 'v2',
        'dan takes slot 1, so the verb comes right after it: dan kunnen mensen.'), '.'] },
      { en: 'The tram I was waiting for did not come.', parts: ['De tram', FK(['waar ik op wachtte', 'die ik op wachtte'], 0, 'pronadv',
        'wachten op a thing becomes waar ... op in a relative clause: de tram waar ik op wachtte. die cannot go with op.'), ',', FK(['kwam niet', 'niet kwam'], 0, 'v2',
        'The whole subject fills slot 1, so the verb comes next: kwam niet.'), '.'] },

      // ---- builds: the station, the ferry, the water
      { en: 'The station was built on almost nine thousand wooden piles.', parts: ['Het station', FK(['werd', 'wordt'], 0, 'passief',
        'It happened in the past, 1889, so werd: werd gebouwd.'), 'gebouwd op bijna', FK(['negenduizend', 'negentienhonderd'], 0, 'getal',
        'Nine thousand is negenduizend. negentienhonderd is 1900.'), FK(['houten', 'hout'], 0, 'adj',
        'A material before a noun takes -en: houten palen, like gouden ringen.'), 'palen.'] },
      { en: 'The ferry to Noord leaves from behind the station and is free.', parts: [FK(['Het', 'De'], 0, 'dehet',
        'Every -je word is het: het pontje.'), 'pontje naar Noord vertrekt', FK(['achter', 'na'], 0, 'weg',
        'achter is behind, a place. na is after, a time.'), 'het station en is gratis.'] },
      { en: 'The bike garage lies beneath the water, in front of the station.', parts: ['De fietsenstalling', FK(['ligt', 'legt'], 0, 'woord',
        'liggen is where something is. leggen is putting something down.'), FK(['onder het water', 'onder water'], 0, 'woord',
        'onder het water is beneath the water. onder water means flooded, which it is not, yet.'), ', voor het station.'] },
      { en: 'If the train had not been late, we would have caught the last ferry.', parts: ['Als de trein niet', FK(['te laat was geweest', 'laat was geweest'], 0, 'woord',
        'Late for a train or an appointment is te laat. laat alone means late in the day.'), ',', FK(['hadden we', 'we hadden'], 0, 'v2',
        'The als-clause fills slot 1, so the main clause starts with its verb: hadden we.'), FK(['het laatste pontje', 'de laatste pontje'], 0, 'dehet',
        'het pontje is a -je word, so het laatste pontje.'), 'nog gehaald.'] },
      { en: 'The train has just left; the next one goes in a quarter of an hour.', parts: ['De trein is', FK(['net', 'netjes'], 0, 'woord',
        'net means just now. netjes means neatly.'), 'vertrokken, de volgende gaat', FK(['over een kwartier', 'na een kwartier'], 0, 'woord',
        'over een kwartier is fifteen minutes from now. na een kwartier means after fifteen minutes of something else.'), '.'] },

      // ---- builds: tourists and locals, the way into town
      { en: 'Excuse me, how do I get to the Dam? Walk all the way down the Damrak, ten minutes.', parts: ['Pardon,', FK(['hoe kom ik bij de Dam', 'hoe ik kom bij de Dam'], 0, 'v2',
        'In a direct question the verb comes right after the question word: hoe kom ik.'), '?', FK(['Loop het Damrak helemaal af', 'Afloop het Damrak helemaal'], 0, 'sep',
        'aflopen splits in a command: loop ... af, with af at the end.'), ', tien minuten.'] },
      { en: 'From the Dam take the second street on the left and then cross the canal.', parts: ['Neem', FK(['vanaf', 'sinds'], 0, 'weg',
        'vanaf is from a place. sinds is since, for time.'), 'de Dam', FK(['de tweede straat links', 'de twee straat links'], 0, 'weg',
        'An order needs the ordinal: de tweede straat.'), 'en', FK(['steek daarna de gracht over', 'oversteek daarna de gracht'], 0, 'weg',
        'oversteken splits in a main clause and a command: steek ... over.'), '.'] },
      { en: 'Excuse me, sir, is this seat free?', parts: ['Pardon meneer, is', FK(['deze', 'dit'], 0, 'dehet',
        'plaats is a de-word, so deze plaats.'), 'plaats nog', FK(['vrij', 'gratis'], 0, 'woord',
        'A free seat is vrij. gratis means it costs nothing.'), '?'] },
      { en: "Watch out, mate, you're standing on the cycle path.", parts: [FK(['Pas op', 'Pas aan'], 0, 'woord',
        'oppassen is watch out. aanpassen is to adjust.'), ', gabber, je staat op', FK(['het', 'de'], 0, 'dehet',
        'fiets + pad: pad is het, so het fietspad.'), 'fietspad.'] },
      { en: 'Dear passengers, due to a disruption this train terminates at Amsterdam Centraal.', parts: ['Beste reizigers, door een storing', FK(['eindigt deze trein', 'deze trein eindigt'], 0, 'v2',
        'door een storing fills slot 1, so the verb comes second: eindigt deze trein.'), 'in Amsterdam Centraal.'] },

      // ---- builds: review of earlier tiers
      { en: 'Could you tell me which platform the train to Schiphol leaves from?', parts: ['Kunt u mij vertellen van', FK(['welk', 'welke'], 0, 'dehet',
        'spoor is a het-word, so welk: welk spoor.'), 'spoor', FK(['de trein naar Schiphol vertrekt', 'vertrekt de trein naar Schiphol'], 0, 'bijzin',
        'A question inside a question becomes a sub-clause, so the verb goes to the end.'), '?'] },
      { en: 'Paola said that she had left her umbrella on the ferry.', parts: ['Paola zei dat ze haar paraplu op het pontje', FK(['had laten liggen', 'had gelaten liggen', 'had laten gelegen'], 0, 'perf',
        'With laten plus another verb the perfect uses two infinitives: had laten liggen, never gelaten.'), '.'] },
      { en: 'The metro is faster, but the tram is more fun: you see more of the city.', parts: ['De metro is', FK(['sneller', 'snellere'], 0, 'vergelijk',
        'After is, with no noun following, the comparative has no -e: sneller.'), ', maar de tram is', FK(['leuker', 'meer leuk'], 0, 'vergelijk',
        'leuk becomes leuker. meer leuk is not Dutch.'), ': je ziet meer van de stad.'] },
      { en: 'The train will probably be late again, it is raining.', parts: ['De trein zal wel weer', FK(['vertraging hebben', 'vertraging heeft', 'vertraging te hebben'], 0, 'zullen',
        'zal takes a bare infinitive at the end: zal ... vertraging hebben. With wel it means probably.'), ', het regent.'] },
      { en: 'I always wait until everyone has got off.', parts: ['Ik wacht altijd tot iedereen', FK(['is uitgestapt', 'heeft uitgestapt', 'is uitgestaped'], 0, 'aux',
        'uitstappen is movement out of something, so zijn: is uitgestapt. stap ends in p, so -t.'), '.'] },

      // ---- words: the station, the ferry, the tram, five replayed from Nijmegen
      { w: 'the little ferry', nl: 'het pontje', wrong: 'de pontje' }, { w: 'the ferry', nl: 'de veerpont' },
      { w: 'the tram stop', nl: 'de tramhalte' }, { w: 'the underground', nl: 'de metro' },
      { w: 'the bank card', nl: 'de pinpas' }, { w: 'the check-in pole', nl: 'de incheckpaal' },
      { w: 'the IJ, the water behind the station', nl: 'het IJ', wrong: 'de IJ' }, { w: 'the wooden pile', nl: 'de paal' },
      { w: 'the station hall', nl: 'de stationshal' }, { w: 'the terminus', nl: 'het eindstation', wrong: 'de eindstation' },
      { w: 'the traveller', nl: 'de reiziger' }, { w: 'the timetable', nl: 'de dienstregeling' },
      { w: 'the track', nl: 'het spoor', wrong: 'de spoor' }, { w: 'the bike garage', nl: 'de fietsenstalling' },
      { w: 'the platform', nl: 'het perron', wrong: 'de perron' }, { w: 'the delay', nl: 'de vertraging' },
      { w: 'the change of trains', nl: 'de overstap' }, { w: 'the public transport card', nl: 'de OV-chipkaart' },

      // ---- reads: four subtle pairs, two plain lines
      { read: true, nl: 'U moet hier overstappen.', o: ['You have to change here.', 'You have to get off for good here.', 'You have to step over something here.'], a: 0, r: 'woord',
        w: 'overstappen is changing to another train or tram. Getting off for good is uitstappen.' },
      { read: true, nl: 'Deze tram rijdt niet verder.', o: ['This tram goes no further.', 'This tram is not running today.', 'This tram does not go far.'], a: 0, r: 'woord',
        w: 'niet verder means this is the end of the line. Not running today would be rijdt vandaag niet.' },
      { read: true, nl: 'Het pontje is gratis, maar je moet wel even wachten.', o: ['The ferry is free, but you do have to wait a bit.', 'The ferry is free, so you never have to wait.', 'The ferry costs a little, but you can get on at once.'], a: 0, r: 'soft',
        w: 'gratis means it costs nothing, and maar je moet wel even wachten means you still have to wait a while.' },
      { read: true, nl: 'De trein van 17.34 uur vertrekt vandaag van spoor 15b.', o: ['The 17:34 train leaves from platform 15b today.', 'The 7:34 train leaves from platform 15b today.', 'The 17:34 train arrives at platform 15b today.'], a: 0, r: 'getal',
        w: '17.34 uur is in the evening, and vertrekt means leaves, not arrives.' },
      { read: true, nl: 'Amsterdam Centraal werd in 1889 geopend en staat op bijna negenduizend houten palen.', en: 'Amsterdam Centraal opened in 1889 and stands on almost nine thousand wooden piles.' },
      { read: true, nl: 'Rechts staan, links gaan.', en: 'Stand on the right, walk on the left (on the escalator).' },

      // ---- listens: the station, the square, a time, the street to the Dam
      { listen: true, nl: 'het Centraal Station', en: 'the central station' }, { listen: true, nl: 'de Dam', en: 'the square in the centre' },
      { listen: true, nl: 'kwart over vijf', en: '5:15' }, { listen: true, nl: 'het Damrak', en: 'the street from the station to the Dam' },

      // ---- looks: the dog, a bike by the garage, the platform number
      { look: true, prop: 'hond', nl: 'de hond', en: 'the dog' }, { look: true, prop: 'fiets', nl: 'de fiets', en: 'the bike' },
      { look: true, prop: 'nummer', value: 15, nl: 'vijftien', en: '15' },

      // ---- de of het
      { dehet: true, nl: 'tramkaartje', art: 'het', en: 'the tram ticket', w: 'Every -je word is het: het tramkaartje.' },
      { dehet: true, nl: 'stationsklok', art: 'de', en: 'the station clock', w: 'The last part decides: de klok, so de stationsklok.' },
    ] }]);
})();
