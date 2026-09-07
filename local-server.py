from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# load .env if present
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())

GMAIL_USER         = os.environ['GMAIL_USER']
GMAIL_APP_PASSWORD = os.environ['GMAIL_APP_PASSWORD']
TO_EMAIL           = os.environ['TO_EMAIL']

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def do_OPTIONS(self):
        self._cors(204)

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))

        msg = MIMEMultipart()
        msg['From']    = f"5am Earth <{GMAIL_USER}>"
        msg['To']      = TO_EMAIL
        msg['Subject'] = f"New inquiry from {body.get('name','')}"
        msg.attach(MIMEText("\n".join([
            f"Name: {body.get('name','')}",
            f"Organization: {body.get('org','')}",
            f"Email: {body.get('email','')}",
            f"Role: {body.get('role','')}",
            f"Message:\n{body.get('interest','')}",
        ]), 'plain'))

        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.sendmail(GMAIL_USER, TO_EMAIL, msg.as_string())
            print(f"Email sent to {TO_EMAIL}")
            self._cors(200)
            self.wfile.write(b'{"id":"local-ok"}')
        except Exception as e:
            print("Gmail error:", e)
            self._cors(500)
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def _cors(self, code):
        self.send_response(code)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.end_headers()

print("Local mail server running on http://localhost:3001")
HTTPServer(('localhost', 3001), Handler).serve_forever()
