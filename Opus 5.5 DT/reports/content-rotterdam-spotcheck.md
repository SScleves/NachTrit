# Agent reports from the laptop run (wf_0e71d666-eb7)

## agent

**commonError**

None of the 48 sampled items was wrong. With seed 20261023 I took 6 items per file (2 build, 2 word, 1 read, 1 listen) and checked each for article, spelling, naturalness, the tier 7 fence and the 12-word limit, that every distractor is wrong Dutch, and that every why line is true. All 48 passed. I then read all eight files in full, including every intro, introNl and mission line, which were all clean. That full read turned up 9 problems in items outside the sample, in L76, L78, L79, L80 and L81.

The most common error (6 of the 9) was a distractor that is valid Dutch:
- Transitive vervelen: "De honden verveelden ons / me / je" means "the dogs bored us / me / you". This is in L76, L79 and L81.
- "Mag ik ons even voorstellen?" is natural Dutch (L81).
- The two infinitives in reverse order, "letten kunnen" (L78), "vasthouden kunnen" and "reserveren willen" (L80). This order is Flemish or old-fashioned, but a native speaker can say it.

The other three:
- A false why line in L78: "zou sits in slot 2" in "Zou je even op mijn koffer kunnen letten?", where zou is in slot 1.
- A tier-10 phrase in tier 7 in L81: "Volgens mij heb jij gelijk".
- An unnatural sentence in L78: "Deze trein is rechtstreeks".

Separately, the QA tools never actually checked these levels. index.html does not load content/new/*.js, so `node qa/validate-content.mjs 75` reports "0 errors, 0 warnings" without testing anything. To get a real check I loaded L75 to L82 through a copy of index.html in my scratchpad.

**fixed**

All fixes were made in place in /home/santi/dutch-arcade-wt/vocab/content/new/. Nothing was committed.
- L76.js: the bored dogs fork 'verveelden ons' became 'zich verveelden' (wrong word order).
- L78.js: the suitcase fork ['kunnen letten','letten kunnen'] became ['kunnen letten','kan letten'], and its why line is corrected ("After zou both verbs stand at the end as infinitives... kan is the present tense"). "Deze trein is rechtstreeks, u hoeft niet over te stappen" became "Dit is een directe trein, u hoeft niet over te stappen", with the English updated to match.
- L79.js: the bored dogs fork ['zich','ons','me'] became ['zich','zij'], and the why line now explains that zij is a subject word.
- L80.js: 'vasthouden kunnen' became 'te kunnen vasthouden', and 'reserveren willen' became 'te willen reserveren'. Both why lines now add "and no te". The golf line "Jij ligt het verst, dus jij mag eerst" became "Jij ligt het verst van de vlag, dus jij mag eerst", so the English prompt makes sense without golf context. That was a clarity change, not an error.
- L81.js: the bored dogs fork ['zich','je','me'] became ['zich','zij']. The voorstellen fork ['me','zich','ons'] became ['me','zich']. "Volgens mij heb jij gelijk" became "Eigenlijk heb jij gelijk" (English: "Actually, you are right."), with a new why line. The header comments no longer claim opinions.
- L82.js: the English for "Na de oorlog bouwden ze de stad weer op" is now "After the war they rebuilt the city." Polish only.

Afterwards all eight levels loaded through the scratch harness at /tmp/claude-1000/-opt-media/a2f6333f-6024-4b71-a114-77973ea4f7f4/scratchpad/vroot. qa/validate-content.mjs ended with 0 errors and 0 warnings for each, and `node --check` passes on the edited files.

**verdict**

Good enough to ship once these fixes are in. A full second audit is not needed. The Dutch is clean and natural: articles and spelling are right, the 't kofschip and irregular past forms are correct, the why lines are accurate, the content stays inside tier 7, and all eight intro, introNl and mission lines are in the right voice with no exclamation marks. The errors that got past two earlier passes are one specific kind: a distractor that is grammatical Dutch with a different meaning. In this town that happened with reflexive verbs that can also take an object (vervelen, voorstellen) and with two infinitives in reverse order (letten kunnen). So instead of a full re-audit I would do one targeted pass over the reflexive and zou/modal forks in the other towns.

Two smaller points for whoever owns QA:
- The validator needs to load content/new/ (index.html or the qa scripts). Until then, "0 errors" on these ids means nothing was checked.
- Comparatives use three rule ids across the files (vergr in L76–78, vergelijk in L75, L79, L81 and L82, and vergl in L80), and the zou rule has three different vault-note links. A player's mistakes on comparatives will be split across three rules.