# Every note the laptop agent held about Nachtrit

Dumped verbatim so nothing is lost. Memory files first, then session insights.

## Memory files (as stored on the laptop)

---
name: nachtrit-dutch-arcade
description: "Nachtrit, the horror runner that teaches Dutch, at /home/santi/dutch-arcade; where everything lives, how to resume after a reboot or limit, standing decisions"
metadata:
  node_type: memory
  type: project
---

**Nachtrit** (started 21 Oct 2026): Three.js runner, Santi cycles a haunted Netherlands and rides through signposts to learn Dutch. Read `/home/santi/dutch-arcade/ROADMAP.md` first (the full plan, who does what, order of work), then `STORY.md`, `MAP.md`, `CONTENT-BRIEF.md`, `FARES-SPEC.md`, `IDEAS.md`.

**Resume after a reboot or limit:** `/home/santi/dutch-arcade/serve-all.sh` restarts servers (8765 main, 8767 fares, 8768 art, 8769 vocab; 8770 world; 8766 is qa/receiver.mjs: `node qa/receiver.mjs` for frame grabs from Santi's Chrome via `window.NRsnap()`). Worktrees live in `/home/santi/dutch-arcade-wt/{look,fares,vocab,world}` (branches look, fares, vocab, world); /tmp is wiped on reboot, never put work there. Backup: `git bundle create /home/santi/dutch-arcade-wt/nachtrit-backup.bundle --all` and copy to /opt/media/. GitHub: https://github.com/SScleves/NachTrit (public), pushed with push-github.sh, see [[nachtrit-push-always]]. Azure Speech key goes in `/home/santi/.config/nachtrit/azure.env` (Santi has to recover his Azure account first).

**State (23 Oct 2026, evening):** on main: ride, six fork kinds, look pipeline, map of 13 towns, levels for the first 7 towns (Rotterdam 75-82 merged, spot-check 48/48 right), 14-panel pixel intro (4 joke panels are placeholders until painted), fares and euros, pitched roofs and gables, visible road, lamp/night mechanic (night deepens with progress, wisps are the fuel; constants in `TUNE` / `window.NRTUNE` in index.html, balance bot `qa/lampbot.js`; measured: collecting wisps ends with 35-60 lamp, ignoring them dies at 75-90 percent on tier 3+). Validator and dump now read content/new and content/extra sources directly. In flight (workflow ids change, check /workflows): 3D world art v2 (branch world, worktree /home/santi/dutch-arcade-wt/world, port 8770, four Opus artists in sequence: atmosphere, composition, props, materials, then critic loop to score 8; reference code for the artists is in /home/santi/dutch-arcade-wt/refcode, MIT repo PhiloLabs/fable51-worlds); intro paintings (branch look); six remaining towns Urk, Texel, Groningen, Maastricht, Nijmegen, Amsterdam written one after another into branch vocab (levels 83-130). After they finish: `cd vocab && node qa/build-content.mjs && node qa/validate-content.mjs`, commit, merge main into vocab, merge vocab into main, then merge world into main (resolve index.html carefully, keep the lamp mechanic) and confirm in Santi's Chrome with NRbright/NRsnap. Reference luma targets from his concept art: A 64, D 52; start of a level should be 50-60, deep night 30-38.
Santi's complaint: bug fixing is not the quality jump in graphics he asked for; the world pass is the answer and the target is "really really close" to his concept PNGs in reference/. Standing art brief: detail behind the houses (three layers), town research visible in the world, Amsterdam red light district (clean and funny), concept-art style map.

**Standing rules:** laptop is an Intel iGPU: no per-object lights, never read a render target being written (caused a black screen), confirm every rendering change in Santi's own Chrome with `NRbright()`/`NRsnap()`, the headless harness is software GL and misses real GPU bugs. At most two headless-browser jobs at once. `nachtrit.progress` holds numbers only. No exclamation marks. English UI, Dutch game text. Netherlands Dutch (hoeft niet te, moet niet = shouldn't). Santi hit his usage limit three times by running too many max-effort agents at once: use Sonnet for bulk writing and checks, Opus for engineering and art, Fable for story editing and final review, effort high not max.
Commit trailer follows whichever model is active (system reminder gives it).
---
name: nachtrit-push-always
description: Santi wants every Nachtrit change pushed to GitHub (SScleves/NachTrit) without asking
metadata:
  type: feedback
---

Push Nachtrit updates to https://github.com/SScleves/NachTrit after every verified commit (main and the work branches), no need to ask. Remote: `ssh://git@ssh.github.com:443/SScleves/NachTrit.git` (port 22 is blocked); `/home/santi/dutch-arcade/push-github.sh` pushes main plus look, fares, vocab, world. Playable at https://sscleves.github.io/NachTrit/ once Pages is on.

**Why:** Santi said (24 Oct 2026) "I prefer u can always update stuff, it makes it faster and easier"; he tests from other devices.
**How to apply:** after merging a verified change into main, run push-github.sh; never push unverified rendering changes to main. Related: [[nachtrit-dutch-arcade]].

## Session insights, in the order they were learned

- Port 8080 was Santi's qBittorrent; the game server moved to 8765. Never bind 8080.
- Santi's first reaction to the 3D game was "it lags too much"; the fix was the post pipeline
  at modest resolution (NRsetDPR), no per-object lights, merged geometry. Any regression there
  is the first thing he notices.
- The road was invisible for a day: ribbon triangles were wound downward and back-face culled.
- A black screen on his GPU came from the ink pass sampling the depth of the buffer being
  rendered; fixed by rendering the scene to its own sceneRT. The headless harness never saw it.
- Browser caching hid new content; serve.py sends no-cache headers. The 18 extra content files
  were not even loaded by index.html at one point: hence the generated bundles.
- `pkill -f` with a pattern that matches your own shell kills the shell. Use PIDs.
- Node 18 on the laptop: Vite 8 wants Node 20; TypeScript install was reverted until the code
  split exists.
- Usage limits were hit three times by running many max-effort agents in parallel; the laptop
  now runs few agents, high effort, never max. The remote agent has no such limit.
- /tmp is wiped on reboot; worktrees moved to /home/santi/dutch-arcade-wt. Concept image B was
  lost that way.
- The lamp used to be irrelevant (right answers gave +18, bot's minimum lamp was ~80). Santi
  asked for the dim-as-you-go mechanic; numbers in HANDOVER.md section 6.
- Later tier presets carried lampDecay up to 1.0 from before wisps mattered; a perfect bot died
  on Rotterdam. The cap at 0.6 fixed it. Difficulty above that comes from speed and obstacles.
- Luma: NRbright() on Santi's GPU gave 29 before the atmosphere pass, 59 after, 64 with the
  world WIP. Concept D measures 52, A 64. Deep night should land 30 to 38 and stay readable.
- Validator "0 errors" meant nothing for new levels until it read the sources; now fixed.
- Comparison rule id existed as vergr, vergl and vergelijk; unified to vergelijk.
- The intro art toolkit (intro/art.js) caches palette ramps; scene-shops churned it by passing
  unrounded strengths. Round to 1/20 and bound the cache (done on main).
- Playwright under SwiftShader runs the game at 2 to 12 fps; Santi's laptop load goes above
  50 with three headless browsers. Keep it to one or two.
- The Chrome CDP evaluate times out at 45 s; long bot runs must be chunked.
- Santi wants absolute paths and GitHub URLs for every file mentioned to him.
- Santi's phone is on Nord Meshnet; the laptop server is reachable at
  http://100.112.156.159:8765/ from it when the laptop is on. The live site is the simpler way.
- GitHub push works only over port 443 (ssh.github.com); port 22 is blocked on his network.
- Santi merged PR #1 (look) himself; he is comfortable merging on GitHub.

## Goals, in Santi's priority order as of today

1. The graphics and art must take a visible jump to his concept art (world, map, intro).
2. Writing mode.
3. All thirteen towns with content, then the vocabulary book and a save that travels.
4. Voice (needs his Azure key), audio, ending, phone polish.
