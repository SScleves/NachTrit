#!/bin/bash
# Start every Nachtrit server that is not running: 8765 main, 8767 fares, 8768 art, 8769 vocab.
start() { ss -ltn | grep -q ":$2 " || (cd "$1" && nohup setsid python3 /home/santi/dutch-arcade/serve.py $2 > /home/santi/dutch-arcade-wt/server-$2.log 2>&1 < /dev/null & disown); }
start /home/santi/dutch-arcade 8765
[ -d /home/santi/dutch-arcade-wt/fares ] && start /home/santi/dutch-arcade-wt/fares 8767
[ -d /home/santi/dutch-arcade-wt/look ] && start /home/santi/dutch-arcade-wt/look 8768
[ -d /home/santi/dutch-arcade-wt/vocab ] && start /home/santi/dutch-arcade-wt/vocab 8769
[ -d /home/santi/dutch-arcade-wt/world ] && start /home/santi/dutch-arcade-wt/world 8770
[ -d /home/santi/dutch-arcade-wt/map ] && start /home/santi/dutch-arcade-wt/map 8771
sleep 1; ss -ltn | grep -E ':876[5-9] ' | awk '{print $4}'
