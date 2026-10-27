# Spot-checks: Nijmegen (levels 115 to 122) and Amsterdam (levels 123 to 130)

Branch `dt/content-nijmegen-amsterdam`, backlog C1. Every file went through three passes in sequence: written, then audited
as a native Netherlands-Dutch teacher (every sentence, every distractor, the tier fence, articles, no exclamation marks),
then spot-checked: six items per file drawn with a seeded generator (seed 20261024; three builds, one word, one read,
one listen per file), each checked again with a fresh eye. The numbers below are for pass 3; the pass 2 findings are
listed per town because they were fixed before the sample was drawn.

## Nijmegen (tier 12, B1 to B2, 16 words)

### Pass 2, the audit: 10 findings, all fixed in place

| File | Finding | Fix |
|---|---|---|
| L115 | The saying was written as "Doe maar normaal, dan doe je al gek genoeg"; the standard form (Van Dale) is "Doe maar gewoon". Its fork "Doe normaal maar" was weak. | Now "Doe maar gewoon, [dan doe je / dan je doet] al [gek genoeg / genoeg gek]". |
| L115 | "De buurvrouw vroeg [of / dat] de studenten wat zachter konden doen": "vragen dat" is a request form in Belgian Dutch, so a Flemish speaker could say the distractor with the same meaning. | Distractor is now "om". The other "vroeg [of / dat]" forks ask real yes-or-no questions (nuts in the sauce, a moment, wanting to walk), where "dat" is wrong everywhere; kept. |
| L117 | Plain read "Nijmegen ligt net onder de Waal" reads as lying under the river. | "Nijmegen ligt op de zuidoever van de Waal". |
| L117 | Why line said er "never comes last". | Now "It does not go at the end." |
| L118 | "Pardon, mag ik [er even langs / even er langs / er langs even]": "Mag ik even erlangs?" is good Dutch, so "even er langs" was the right sentence with a spelling slip. | Option removed; the fork is now [er even langs / er langs even]. |
| L118 | Why line for "dan val je" claimed the main clause always starts with its verb, dan included. | Reworded: the main clause may start with dan, and the verb follows it. |
| L119 | "Kun je [er even naar kijken / er naar even kijken]": "ernaar even kijken" is marginal rather than wrong. | Distractor is now the English order "er even kijken naar". |
| L119 | "De stagiair heeft er bij dat dashboard met de pet naar gegooid" was clumsy. | "Bij dat dashboard heeft de stagiair er met de pet naar gegooid." |
| L121 | Why line said welkom never changes its form (een welkome gast does). | "After zijn the adjective welkom gets no ending." |
| L121 | Rule plusq used in a read without its guarded definition in the file. | Guard added (same text as the existing definition). |

Also checked across all eight files: no exclamation marks; "te laat" everywhere (the "Ik ben laat" class); no reflexive
forks; every modal is followed by a bare infinitive and every "om" by "te"; every V2 fork's distractor puts the subject
before the verb after a fronted phrase, which is wrong in Netherlands Dutch; the tier fence (no builds with three forks,
nothing from tier 13); max 16 words per build. The rule definitions printed by the loader are unchanged for every existing
id; four ids are new (idioom, samen, formeel, datum) and are defined with the same text in every file.

### Pass 3, the spot-check: 48 items, 0 errors

| File | Items checked | Errors found | Fixed |
|---|---|---|---|
| L115 Thuis | hondenmand build, voordeur/dakraam build, Wij danken u ... Hoogachtend build, de zolder, read De huisbaas kijkt de kat uit de boom, listen de Waalbrug | 0 | none needed |
| L116 De winkels | Er zijn geen wandelsokken build, derde dinsdag van juli build, Zegt u het maar build, de korting, read Dat is wel duur, hè?, listen € 15,95 | 0 | none needed |
| L117 Eten en drinken | Gelderse rookworst / andere koek build, erwtensoep / het bruine café build, Bent u klaar om te bestellen build, de bitterbal, read Vierdaagsefeesten, listen de Vierdaagsefeesten | 0 | none needed |
| L118 Het station | er even langs build, op het nippertje build, uw vervoersbewijs build, de overstap, read Neem maar gewoon de volgende trein, hoor, listen de wandelaar | 0 | none needed |
| L119 Het werk | koffieautomaat / koffieapparaat build, het wachtwoord build, Mocht u nog vragen hebben build, de foutmelding, read Het voorstel viel in het water, listen de deadline | 0 | none needed |
| L120 De sport | zwaarder build, Op de derde dag lopen de wandelaars build, zet nog even door build, de blessure, read de benen uit het lijf, listen de Goffert | 0 | none needed |
| L121 De mensen | verjaardagsfeest build, buurtfeest / buurtapp build, Kom maar even binnen build, de Nijmegenaar, read snoep langs de route, listen de Stevenskerk | 0 | none needed |
| L122 De Vierdaagse | Waalbrug naar Elst build, het Vierdaagsekruis build, op van de zenuwen build, het Vierdaagsekruis (word), read Paola komt wel, listen tienduizenden wandelaars | 0 | none needed |

Error rate in the sample: 0 of 48. Across the whole town, counting the audit: 10 problems in 430 items, all fixed.
The weak spot was the same as in earlier towns, distractors that a native can say (a Belgian "vragen dat", a spelling
variant of "even erlangs"), not grammar in the answers.

Facts used and where they were checked (October 2026): the Vierdaagse since 1909, the hundredth in 2016, the third
Tuesday of July, 30, 40 or 50 km, the Wedren, the Via Gladiola on the Friday, the Dag van Elst over the Waalbrug, the pink
Wednesday, the seven hills to Groesbeek, the army's pontoon bridge at Cuijk, no edition in 2020 and 2021, over a million
festival visitors (organisers, NOS, Wikipedia); Knotsenburg at carnaval; the Snelbinder (2004); De Oversteek (2013) and
its lamps for the soldiers of 1944, told once in a plain read; the Lange Hezelstraat, called the oldest shopping street
in the country; the Honig soup factory on the Waal; the Goffert stadium of NEC; the Zevenheuvelenloop in November.
Nijmegen lies south of the Waal, so the food level says friet.

Draft handling: `content/pending/L118.js` and `L122.js` were reused as the base of L118 and L122 and then removed. L122 is
named De Vierdaagse, as CONTENT-BRIEF.md names Nijmegen's own place; the draft called it De Waalbrug.

Frame: `qa/out/content-frames/n115.png` (GPU, Intel Iris Xe, `shot=8&level=115&lane=1`): errors 0, luma 63, 639 draw
calls. The Waalbrug arch stands on the skyline; the fork on screen is "Komt u | Kom u".

Later tidy-up in the Amsterdam commit: L121 lost an unused `datum` guard; no item changed.

## Amsterdam (tier 13, B1 to B2, 18 words)

Places: thuis 123 (a canal house in the Jordaan), winkels 124 (the Albert Cuyp, the Negen Straatjes, the flower market),
eten 125 (herring, a brown café, a proeflokaal, the snack wall, a rijsttafel; patat, not friet), station 126 (Centraal,
the ferries, the trams, the Damrak), werk 127 (the Herengracht and the Zuidas; the end of English as the office language),
sport 128 (the Amstel, the Vondelpark, the Olympic Stadium, the ArenA, the Dam tot Damloop), mensen 129 named De Wallen,
eigen 130 De grachten, the finale.

De Wallen: CONTENT-BRIEF.md names it Amsterdam's own place, but BACKLOG.md C1 and the task make De grachten the eigen and
the end of the game, so De Wallen is the mensen place: tourists and locals, their two registers. It stays clean on purpose:
neon, alleys, the Trompettersteeg, the Oude Kerk, bollards, bikes, tall locals, a guide with an umbrella, nothing else.

### Pass 2, the audit: 9 findings, all fixed in place

| File | Finding | Fix |
|---|---|---|
| L125 | "om te kijken naar de wedstrijd" was the distractor, but a PP after the infinitive is acceptable spoken Dutch. | Distractor is now "om naar de wedstrijd kijken" (no te). |
| L127 | "Ik stuur de mail even naar je [door / over]": oversturen exists and means to send over. | The fork now tests the particle: [even naar je door / naar je door even]. |
| L128 | "de lat hoog zetten" turns up as a variant of "leggen". | Distractor is now "legt de stok". |
| L128 | The Vondelpark line claimed a separate cycle path, which I could not back. | Now "In het Vondelpark loop je hard op de paden rond de vijvers." |
| L129 | "Kunt u [iets langzamer / iets langzaam / iets meer langzaam] praten": "iets langzaam" is too close to the answer. | Option removed. |
| L129 | "spreekt vier talen, en Nederlands eerst" was not natural. | "spreekt vier talen". |
| L130 | "Natuurlijk: hond." broke the game's own rule that every noun carries its article; the uit/buiten fork had rule sep. | "Natuurlijk: de hond."; rule woord. |
| L126 | Header comment garbled ("afvlopen"). | Rewritten. |
| L124, L127, L128, L130 | Rule bookkeeping: plusq (L128) and vergelijk (L130) used without a guard; unused guards in L124 and L127. | Guards added or removed; every file now guards exactly the ids it uses, with the existing text. |

Also checked across all eight files: no exclamation marks; "te laat" where late means delayed; every distractor in a
V2, sub-clause, te and particle fork is ungrammatical, and every meaning distractor (huren against verhuren, pas against
al, vrij against gratis, onder water against onder het water, eindelijk against eigenlijk) gives a different sense from
the English prompt; one new rule id, weg, defined with the same text in every Amsterdam file; max 18 words per build.

### Pass 3, the spot-check: 48 items, 1 error

| File | Items checked | Errors found | Fixed |
|---|---|---|---|
| L123 Thuis | gejat build, belt aan / ons huis build, zelf hadden geverfd build, de hijsbalk, read Ze wonen hier al twintig jaar, listen de Westertoren | 1: the why line called jatten Amsterdam slang; it is general informal Dutch that came from Amsterdam Yiddish | Why line and header corrected |
| L124 De winkels | veel duurder build, vanaf maandag build, twee ons build, de cadeaubon, read Drie halen, twee betalen, listen € 14,80 | 0 | none needed |
| L125 Eten en drinken | rijsttafel passive build, de automatiek / oversteken build, Hebt u gereserveerd build, de haring, read the one-cent Tikkie, listen € 11,75 | 0 | none needed |
| L126 Het station | negenduizend houten palen build, waar ik op wachtte build, vanaf de Dam build, de tramhalte, read overstappen, listen de Dam | 0 | none needed |
| L127 Het werk | onder de knie build, het dashboard staat al build, zich verheugen op build, de omzet, read verzet naar vrijdag, listen de Herengracht | 0 | none needed |
| L128 De sport | opgewarmd build, de lat hoog leggen build, de tunnel onder het IJ build, de wielrenner, read geslaagd voor mijn zwemdiploma, listen zestien kilometer | 0 | none needed |
| L129 De Wallen | langste mensen build, volgen haar build, ingewijd in 1306 build, de steeg, read Op de Wallen is het altijd druk, listen de Oude Kerk | 0 | none needed |
| L130 De grachten | als ik het probeerde build, woonboten build, het grachtenpand waar build, de Prinsengracht, read De taal is eindelijk weer thuis, listen de klokken | 0 | none needed |

Error rate in the sample: 1 of 48, a label in a why line, not Dutch in a fork. Across the whole town, counting the audit:
8 problems in 423 items that touch the Dutch or the facts, plus the rule bookkeeping, all fixed.

Facts used and where they were checked (October 2026): Amsterdam Centraal opened 1889 on 8,687 wooden piles; the IJ
ferries are free; GVB trams take no cash; the Oude Kerk consecrated 1306; the Trompettersteeg about one metre wide;
Amsterdammertjes; 12,000 to 15,000 bikes fished out of the canals a year (not used in the end); canal houses lean forward
on purpose for the hoist; about 2,500 houseboats; the canal ring from 1612 and on the UNESCO list since 2010; the
Westertoren 85 metres with Maximilian's crown; the Magere Brug rebuilt 1934; the Albert Cuypmarkt since 1905 with about
260 stalls; the Olympic Stadium of 1928; the Johan Cruijff ArenA named in 2018; the Dam tot Damloop through the IJtunnel;
the Rembrandt statue by the Riekermolen. Amsterdam is in the Randstad, so the food level says patat, and a read says that
two hundred kilometres further south it is friet. Amsterdammers say het Singel; that is taught in a read, not a fork.

Frame: `qa/out/content-frames/a123.png` (GPU, Intel Iris Xe, `shot=8&level=123&lane=1`): errors 0, luma 59, 595 draw
calls. The street runs along the water as the gracht theme, with classic lanterns, gables and a tower on the skyline; the
fork on screen is the word item Mokum.

## Dutch I am not fully sure of

None of these is in a right answer; each is a distractor or a choice of wording that a second native reader could check.

- "Leuk je eens weer te zien" (L121) and "Je gaat wel toch mee" (L120) are offered as wrong word orders of weer eens and
  toch wel. I am confident about the fixed orders, less about whether nobody ever says the other one.
- "Ik ben vol" (L125) is offered as wrong next to "Ik zit vol"; some young speakers use it as an anglicism.
- "Bestel wat maar" (L125) and "Zeg u het maar" (L116) as wrong orders and forms; confident, not certain.
- "rood neon" (L129) treats neon as a het-word without an article, so no -e.
- "In verwachting van uw antwoord" (L116) is offered as wrong and explained as the pregnancy phrase.
- "tweeduizendhonderd" (L123) is the answer; "eenentwintighonderd" is also correct and is not offered.
- Facts I could only check once: spectators handing out sweets along the Vierdaagse route (L121, a read), the
  Zevenheuvelenloop in November (L120), and the Riekermolen lying on the right when you follow the Amstel south (L128).

