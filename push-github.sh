#!/bin/bash
# Push Nachtrit to https://github.com/SScleves/NachTrit (create the empty repo there first, no README).
# Then on GitHub: Settings > Pages > Deploy from a branch > main, / (root). The game will be at
# https://sscleves.github.io/NachTrit/
set -e
cd /home/santi/dutch-arcade
git push -u origin main
for b in look fares vocab world; do git push origin "$b" || true; done
echo "Pushed. Play at https://sscleves.github.io/NachTrit/ once Pages is on."
