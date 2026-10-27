# No-cache static server for the NachTrit clone, bound to localhost only.
# usage: py serve-local.py <root> [port]
import functools, http.server, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, *args):
        pass

class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128   # two browsers loading ~35 scripts each overflow the default queue of 5

root = sys.argv[1]
port = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
handler = functools.partial(NoCache, directory=root)
Server(('127.0.0.1', port), handler).serve_forever()
