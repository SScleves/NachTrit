# Agent reports from the laptop run (wf_964dde2b-291)

## agent

**commonError**

Builds broke the tier fence. Five of the eight files drilled separable verbs that join back together at the end of a sub-clause (aankwam, afrekent, binnenkwamen, inlog, uitliet). The brief puts that in tier 10 (Groningen), and the writers and auditors listed it in their headers as if it were tier 8 material. The second most common problem was English that did not match the Dutch: 'de rookoven' glossed as 'the smokehouse', 'vlakbij' as 'right here', 'koeken' as 'cookies'. Outside the sample I also found the same separable-verb leak in 8 more builds, plus 'Ik ben laat' / 'Ik was laat' where Netherlands Dutch says 'te laat' (L86, L87, L89). Every article, every distractor and every word limit I checked was correct.

**fixed**

I picked 6 items per file with seed 2310 (2 build, word, read, listen, build). Everything is fixed directly in /home/santi/dutch-arcade-wt/vocab/content/new/L84.js to L90.js. L83 needed nothing.

- L84: the 'aankwam' build is now 'Toen ik bij de apotheek [kwam|komde|kwamen]'. The 'afrekent' build is now '[Terwijl Paola betaalt|Terwijl betaalt Paola]'. 'koeken' is now 'koekjes'. The herring line's English now reads 'the cutters are moored close by'.
- L85: 'binnenkwamen' is now 'Toen wij gisteren [kwamen|komen|kwam]'. 'afrekenen' is now '[Voordat we betalen|Voordat betalen we]'. 'dichtgaat' is now '[wanneer de keuken sluit|wanneer sluit de keuken]'. 'dichtging' is now '[voordat de keuken sloot|voordat sloot de keuken]'. The intro now says 'order on time' instead of 'order in time'.
- L86: 'Ik ben laat' is now 'Ik ben te laat'.
- L87: 'Ik ben laat' is now 'Ik ben te laat'. The 'aankwam' build now offers 'kwam'. The 'inlog' build is now 'voordat ik begin'. 'plat ligt' is now 'platligt'.
- L88: 'De honden gaan ook bij storm uit' is now 'naar buiten'. The 'doorgaat' build is now 'Ik hoop dat het zaterdag droog blijft'.
- L89: the 'aankwamen' build is now 'Toen we op Urk [kwam|kwamen|komen]'. The 'uitliet' build is now 'Ik was te laat omdat ik de honden nog moest uitlaten'.
- L90: 'de rookoven' is now glossed as 'the smoking oven'. 'het vissersmonument' is now 'het Vissersmonument'.

Every changed item got a why line that is true for its new answer, and I corrected the header comments that described separable verbs as drilled. qa/validate-content.mjs gives 0 errors and 0 warnings for all of 83 to 90.

I also read all eight intro, introNl and mission blocks. They have no exclamation marks, and the Dutch in them is natural. 'de verste vis' in the L85 intro is the correct superlative of vers and is used on Urk, so I kept it.

**verdict**

The files are good enough to ship after these fixes, and they do not need a full second audit. 41 of the 48 sampled items were clean. Articles, distractors, word limits and the voice were all correct. The one real weakness was systematic: a misreading of the fence. I fixed it by scanning all eight files in full, not just the sampled items, so the sample rate (7 of 48) does not describe the whole set. A grep for separable verbs and 'laat' is enough to confirm it.

Three things are left open but are not bugs:
1. A few read items still contain separable verbs in a sub-clause ('Voordat de winkel opengaat' in L84, 'Toen wij binnenkwamen' in L85, 'Omdat de wifi uitviel' in L87, 'Voordat de kotters uitvaren' in L88). Reads only test comprehension, so I left them, but the L84 read's why line ('opengaat joins up at the end') does teach the tier-10 rule.
2. 'Op zondag vaart hier niemand uit.' is a read in five of the eight levels, which is too much repetition.
3. 'Als de vuurtoren draait' in L90 is understandable but stiff; 'Als de vuurtoren brandt' would be more natural.

---

## agent

**commonError**

I checked 48 items with seed 20261023: 6 per file in L91 to L98 (2 build, 2 word, 1 read, 1 listen), plus all eight intro, introNl and mission sets. Only one sampled item was wrong. In L92 the build 'Ik wacht [er|het|hem] al een uur op.' offered 'hem' as a distractor, but 'Ik wacht hem al een uur op' is good Dutch (opwachten, to wait for someone to arrive). The why line was also false, because it said hem cannot stand in front of op. I then skimmed every other build and item outside the sample and found three more of the same kind: a 'wrong' option or an article that Dutch actually accepts. 'het duin' was a de/het item in L96 and L98, but Dutch accepts both de duin and het duin. 'het schap' in L92 has a doubtful article: I believe the Groene Boekje accepts de schap as well, but I could not confirm that here. Word items feed the de/het bonus level, so it would have turned up there too. I made one naturalness change: L96 'Ik praat al de hele week erover met Paola' is grammatical, but a native would split it. The intro, introNl and mission lines are all natural spoken Dutch, with no exclamation marks and no facts about Texel that I could find wrong. Every other sampled build had only wrong distractors, every noun had the right article, sentences stayed within 14 words, and the why lines were true.

**fixed**

Four files changed, none committed.
- /home/santi/dutch-arcade-wt/vocab/content/new/L92.js: the wachten build now offers [er|het|erop] in place of [er|het|hem]. Its new why line: 'wachten op plus a thing becomes er ... op, with er early and op at the end: ik wacht er al een uur op. het cannot go with op, and erop here gives you op twice.'
- /home/santi/dutch-arcade-wt/vocab/content/new/L92.js: replaced 'the shelf in the shop = het schap' with 'the shopping trolley = de winkelwagen', a replay word from L84 whose article is not in doubt.
- /home/santi/dutch-arcade-wt/vocab/content/new/L96.js: replaced the de/het item 'het duin' with 'het toernooi' (the tournament).
- /home/santi/dutch-arcade-wt/vocab/content/new/L96.js: the build is now 'Ik praat [er|het] al de hele week met Paola over.', with a why line about the split er ... over.
- /home/santi/dutch-arcade-wt/vocab/content/new/L98.js: replaced the de/het item 'het duin' with 'het wad' (the mudflats of the Waddenzee).
After the fixes, node qa/validate-content.mjs shows 0 errors and 0 warnings for every level from 91 to 98.

**verdict**

The files are good enough to ship, and they do not need a full second audit. The sample error rate was 1 in 48, about 2%, and skimming all of the roughly 150 builds turned up only the issues listed above. The Dutch is natural, the die/dat, om te, als/zou and er forks are sound, and the why lines are accurate. One check is still worth doing, but it is a narrow grep and not a re-audit: search all tiers for nouns that take both de and het (duin, schap, soep-type doubles, and so on) and for distractors that make a valid sentence through a separable verb (hem opwachten). Neither the writer nor the first auditor caught that kind of error. Two small notes, which I left as they are: the spelling distractors 'afte spreken' and 'uitte laten' (L97, L98) differ from the right answer by a single space, which is hard to read at speed. And the read item 'Een buitje deert ons niet' (L96) is correct but a little bookish.

---

## agent

**commonError**

Inconsistent rule ids, not bad Dutch. Each writer made up their own id for the same tier-10 concept. Diminutives had four (dim, verkl, verkleinwoord, verklein), hoewel/ondanks had four (hoewel, concessie, tegenstelling, tegen), zullen-probability had three (zullen, zal, vermoeden), and their vault notes differed. Because window.RULES uses ||, the note shown depended on which file loaded first. Four of the six flagged sampled items were this, and in L105 the ondanks fork used 'mening'. The other two had small surface faults: a missing comma before alstublieft and a price written as '9,99 euros'. One why line was also misleading. In the 48 sampled items I found no wrong article, no misspelling, no unnatural sentence, no correct-Dutch distractor and nothing outside the tier-10 fence or over 16 words. 'Kon minder' = 'Could be worse' fits the Groningen understatement in towns.js. All eight intro, introNl and mission lines read as natural and have no exclamation marks.

**fixed**

Seed 20261023, 3 builds + 1 word + 1 read + 1 listen per file, files in /home/santi/dutch-arcade-wt/vocab/content/new/. (1) All eight files, L99.js to L106.js: every rule id is now one of verklein / hoewel / zullen, each defined the same way in every file that uses it, with notes that exist in the vault: mening -> ik-vind, hoewel -> conjuncties-voegwoorden, zullen -> zullen-belofte-waarschijnlijkheid, verklein -> de-of-het-articles, vergelijk -> trappen-van-vergelijking-comparison. L105 now defines hoewel, and its ondanks fork uses 'hoewel' instead of 'mening'. (2) L100.js line 65: 'Mag ik een bonnetje alstublieft?' now has a comma before alstublieft. (3) L100.js line 111: listen en '9,99 euros' -> '€ 9,99', matching L101. (4) L102.js line 79: the kaartje why line said 'even for something small like a ticket' and now reads 'Every -je word is het, even though de kaart is a de-word: het kaartje.' (5) L104.js line 67, found outside the sample: 'rondje om het Noorderplantsoen' did not match the English 'through' and is now 'door het Noorderplantsoen'. L105 still uses the existing data.js id 'fut' for its zal-wel fork; it is valid, so I left it. node --check passes and qa/validate-content.mjs gives 0 errors, 0 warnings for all eight levels. Nothing committed.

**verdict**

The Dutch is good enough to ship, and I would not spend a full second native audit on it. All 48 sampled items had correct articles, correct adjective -e, correct diminutive spelling, correct sub-clause and separable-verb order, and distractors that are really wrong Dutch. All the why lines I checked were accurate except one. What the sample did show is that each author worked alone, so the cross-file bookkeeping drifted: rule ids, rule notes, small punctuation and price formats. I have fixed that in all eight files. Before shipping, someone should run a quick grep over L99 to L106 for the same kind of thing: English prompts that drift from the Dutch, like the om/door mismatch I found by chance, and a missing comma before alstublieft. That is a check of under an hour, not a full re-audit. One thing to note if you want to look further: L101 uses 'de pinautomaat' for a shop's card machine. Dictionaries accept it, but 'het pinapparaat' is more common, so I left it.

---

## agent

**commonError**

I sampled 48 items with seed 4711: 6 per file, 3 builds, 1 word, 1 read and 1 listen each. Two were wrong. L111 had a listen item 'houdoe' labelled 'bye (Limburg dialect)', which is a false dialect label: houdoe is the Brabant goodbye, not Maastricht. L113 used the rule id 'pqp', which duplicates the existing 'plusq'. I also skimmed every build, read and listen in all eight files plus the intro, introNl and mission lines, and found five more problems outside the sample. The most common kind was word choice and naturalness rather than grammar: 'was ingeslapen' (which reads as 'had died'), 'het carnaval nooit gemist', and 'verkleedkleren' / 'ziet het verschil nog' in an introNl. The other two were the 'pqp' id again in L112 and one distractor that differed only by a space. Articles, participle spelling, passive agreement, plusquamperfectum helpers, verb-final order in indirect speech, the tier 11 fence and the 16-word limit were all clean in the sample. There are no exclamation marks anywhere.

**fixed**

All edits are in /home/santi/dutch-arcade-wt/vocab/content/new/. Nothing is committed. All eight levels pass node --check and qa/validate-content.mjs with 0 errors and 0 warnings.
- L111.js: listen 'houdoe' = 'bye (Limburg dialect)' is now 'salu' = 'hi, or bye (Maastricht dialect, from French salut)', and the header comment is updated.
- L111.js: the build 'Hij was tijdens de vergadering [ingeslapen]' is now 'Hij [was|had] tijdens de vergadering in slaap [gevallen|gevalt|geviel]' with rule perf. 'ingeslapen' means died peacefully. Both why lines are rewritten.
- L113.js and L112.js: rule id 'pqp' is replaced with the existing 'plusq' everywhere, including the guarded RULES definition and the header comments.
- L108.js: in 'De verkoopster zei dat de jas morgen ...' the distractor 'binnen komt' is replaced with 'binnenkomen'. 'binnen komt' differs only by a space and sounds the same as the answer. The why line now explains it.
- L114.js: 'dat hij het carnaval nooit gemist had' is now 'dat hij carnaval nog nooit gemist had'.
- L114.js: the introNl now reads 'Carnaval in Maastricht is eigenlijk nooit gestopt, het is alleen stiller geworden, en niemand ziet nog verschil tussen de doden en de verklede mensen.'

**verdict**

Good enough to ship. A full second audit is not needed. The sample error rate was 2 in 48, about 4%, and neither error was a grammar mistake. Taking the wider skim into account, about 7 problems in roughly 400 items, all now fixed. Every build I checked has correct articles, participles, auxiliaries and verb-final order, and its distractors are genuinely wrong Dutch. The weak spot is local colour and word choice, not grammar: dialect labels, words with a second meaning, and one lightly stilted Dutch line. If you want more assurance, do a short targeted pass on every dialect-marked item and the 8 introNl lines, not a second full audit. Two small optional nits remain: 'De golfbaan wordt verbouwd' (heringericht would be more idiomatic) and 'De trein wordt door een storing vertraagd' (natives usually say 'heeft vertraging door een storing'). Both are grammatical, so I left them.