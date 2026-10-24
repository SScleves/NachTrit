# The exact orchestration scripts and prompts that produced the work so far

These are the Workflow scripts the laptop agent ran (JavaScript for Claude Code's Workflow tool:
`agent(prompt, {model, effort, schema})`, `pipeline`, `parallel`, `phase`). You will not run
them as-is, but every brief, rule, schema and acceptance test that worked is in them verbatim:
- nachtrit-town-content-*.js and nachtrit-towns-sequential.js: the writer, auditor and
  spot-check prompts for a town's eight levels (this is the content pipeline to copy).
- nachtrit-vocab-*.js: the earlier content pass that lengthened the first 25 levels and wrote
  Zeeland, Utrecht and Den Haag.
- nachtrit-fares-design-*.js and nachtrit-fares-build-*.js: how fares were designed and built.
- nachtrit-look-*.js: the intro-art director, painters, critics and the road-readability job.
- nachtrit-world-art-*.js and nachtrit-world-art-v2/v3.js: the 3D art briefs (atmosphere,
  composition, props, materials, critique loop). v3 is the one the stopped artists were running.
