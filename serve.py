# Local server for Nachtrit that tells browsers not to cache, so a reload always gets the current game.
# usage: python3 serve.py [port]   (default 8765)
import http.server, sys
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
http.server.ThreadingHTTPServer(('0.0.0.0', port), NoCache).serve_forever()
