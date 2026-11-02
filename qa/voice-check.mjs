// Compare voice/lines.json with the files in voice/: lines without a file, files without a line,
// that voice/ids.json lists exactly the rendered ids, and that the browser hash (voice/hash.js) gives the same id as lines.json.  exit 1 on any mismatch.
// usage: node qa/voice-check.mjs
import fs from 'node:fs'; import vm from 'node:vm';
const lines = JSON.parse(fs.readFileSync('voice/lines.json', 'utf8'));
const files = new Set(fs.readdirSync('voice').filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)));
const ids = new Set(lines.map(l => l.id));
const ctx = { window: {}, TextEncoder }; vm.createContext(ctx); vm.runInContext(fs.readFileSync('voice/hash.js', 'utf8'), ctx);
const noFile = lines.filter(l => !files.has(l.id)), noLine = [...files].filter(f => !ids.has(f));
const badHash = lines.filter(l => ctx.window.voiceId(l.voice, l.text) !== l.id);
const size = [...files].reduce((n, f) => n + fs.statSync(`voice/${f}.mp3`).size, 0);
console.log(`${lines.length} lines, ${files.size} files, ${(size / 1e6).toFixed(1)} MB`);
console.log(`lines without a file: ${noFile.length}`); noFile.slice(0, 20).forEach(l => console.log(`  ${l.id} ${l.voice} ${l.text}`));
console.log(`files without a line: ${noLine.length}`); noLine.slice(0, 20).forEach(f => console.log(`  voice/${f}.mp3`));
console.log(`browser hash mismatches: ${badHash.length}`); badHash.slice(0, 5).forEach(l => console.log(`  ${l.id} ${l.text}`));
const listedIds = fs.existsSync('voice/ids.json') ? JSON.parse(fs.readFileSync('voice/ids.json', 'utf8')) : [];
const want = lines.filter(l => files.has(l.id)).map(l => l.id).sort(), stale = want.join() !== [...listedIds].sort().join();
console.log(`voice/ids.json: ${listedIds.length} ids${stale ? ', STALE: run npm run voice:render to rewrite it' : ', up to date'}`);
process.exit(noFile.length || noLine.length || badHash.length || stale ? 1 : 0);
