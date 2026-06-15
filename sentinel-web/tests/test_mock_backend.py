import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading

# Stateful mock data
DATA = {
    "users": [
        {"user_id": "mock-admin-id", "email": "admin@sentinel.com", "display_name": "Admin Operator", "role": "ADMIN", "email_verified": 1, "created_at": "2026-06-01T10:00:00Z"},
        {"user_id": "mock-user-id", "email": "user@sentinel.com", "display_name": "Jane Doe", "role": "USER", "email_verified": 1, "created_at": "2026-06-01T10:05:00Z"}
    ],
    "emergencies": [
        {"id": 1, "user_email": "user@sentinel.com", "latitude": 12.9716, "longitude": 77.5946, "status": "ACTIVE", "created_at": "2026-06-15T09:12:00Z"}
    ],
    "contacts": [
        {"id": 1, "user_email": "user@sentinel.com", "contact_name": "Mom", "contact_phone": "+91 98765 43210"}
    ],
    "reports": [
        {"id": 1, "user_email": "user@sentinel.com", "report_type": "Poor Lighting", "severity": 2, "latitude": 12.9720, "longitude": 77.5950, "description": "Dark alleyway near subway station", "created_at": "2026-06-15T09:10:00Z"}
    ],
    "hotspots": [
        {"latitude": 12.9720, "longitude": 77.5950, "risk_score": 65, "severity": 2, "report_type": "Poor Lighting"}
    ]
}

class MockBackendHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = self.path
        
        # Match contacts
        match_contacts = re.match(r"^/contacts/(.+)$", parsed_path)
        if match_contacts:
            email = re.search(r"/contacts/(.+)$", parsed_path).group(1)
            import urllib.parse
            email = urllib.parse.unquote(email)
            user_contacts = [c for c in DATA["contacts"] if c["user_email"] == email]
            self._send_json(200, user_contacts)
            return

        # Match emergency history
        match_history = re.match(r"^/emergency/history/(.+)$", parsed_path)
        if match_history:
            email = re.search(r"/emergency/history/(.+)$", parsed_path).group(1)
            import urllib.parse
            email = urllib.parse.unquote(email)
            user_emergencies = [e for e in DATA["emergencies"] if e["user_email"] == email]
            self._send_json(200, user_emergencies)
            return

        # Simple matches
        if parsed_path == "/emergency/active":
            active = [e for e in DATA["emergencies"] if e["status"] == "ACTIVE"]
            self._send_json(200, active)
        elif parsed_path == "/reports/all" or parsed_path == "/dashboard/reports":
            self._send_json(200, DATA["reports"])
        elif parsed_path == "/dashboard/users":
            self._send_json(200, DATA["users"])
        elif parsed_path == "/dashboard/hotspots":
            self._send_json(200, DATA["hotspots"])
        elif parsed_path == "/dashboard/stats":
            active_sos = len([e for e in DATA["emergencies"] if e["status"] == "ACTIVE"])
            stats = {
                "total_users": len(DATA["users"]),
                "total_reports": len(DATA["reports"]),
                "active_emergencies": active_sos,
                "total_contacts": len(DATA["contacts"])
            }
            self._send_json(200, stats)
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            req_data = json.loads(body) if body else {}
        except Exception:
            req_data = {}

        parsed_path = self.path

        if parsed_path == "/auth/login":
            email = req_data.get("email")
            user = next((u for u in DATA["users"] if u["email"] == email), None)
            if user:
                self._send_json(200, user)
            else:
                # auto-create regular user or return error
                self._send_json(400, {"detail": "Email not registered. Please register first."})

        elif parsed_path == "/auth/register":
            email = req_data.get("email")
            name = req_data.get("display_name")
            uid = req_data.get("firebase_uid")
            
            # Check if user already exists
            if any(u["email"] == email for u in DATA["users"]):
                self._send_json(400, {"detail": "Email already registered."})
                return

            new_user = {
                "user_id": f"web-{uid or 'rand'}",
                "email": email,
                "display_name": name,
                "role": "USER",
                "email_verified": 1,
                "created_at": "2026-06-15T09:00:00Z"
            }
            DATA["users"].append(new_user)
            self._send_json(200, new_user)

        elif parsed_path == "/contacts/add":
            email = req_data.get("user_email")
            name = req_data.get("contact_name")
            phone = req_data.get("contact_phone")
            new_contact = {
                "id": len(DATA["contacts"]) + 1,
                "user_email": email,
                "contact_name": name,
                "contact_phone": phone
            }
            DATA["contacts"].append(new_contact)
            self._send_json(200, new_contact)

        elif parsed_path == "/emergency/trigger":
            email = req_data.get("user_email")
            lat = req_data.get("latitude")
            lng = req_data.get("longitude")
            new_emergency = {
                "id": len(DATA["emergencies"]) + 1,
                "user_email": email,
                "latitude": float(lat),
                "longitude": float(lng),
                "status": "ACTIVE",
                "created_at": "2026-06-15T09:15:00Z"
            }
            DATA["emergencies"].append(new_emergency)
            self._send_json(200, new_emergency)

        elif parsed_path == "/reports/submit":
            email = req_data.get("user_email")
            rep_type = req_data.get("report_type")
            sev = req_data.get("severity")
            lat = req_data.get("latitude")
            lng = req_data.get("longitude")
            desc = req_data.get("description")
            
            new_report = {
                "id": len(DATA["reports"]) + 1,
                "user_email": email,
                "report_type": rep_type,
                "severity": int(sev),
                "latitude": float(lat),
                "longitude": float(lng),
                "description": desc,
                "created_at": "2026-06-15T09:16:00Z"
            }
            DATA["reports"].append(new_report)
            
            # Add to hotspots
            new_hotspot = {
                "latitude": float(lat),
                "longitude": float(lng),
                "risk_score": 40 + int(sev)*20,
                "severity": int(sev),
                "report_type": rep_type
            }
            DATA["hotspots"].append(new_hotspot)
            self._send_json(200, new_report)

        elif parsed_path.startswith("/dashboard/resolve/"):
            emergency_id_str = parsed_path.split("/")[-1]
            try:
                emergency_id = int(emergency_id_str)
                for e in DATA["emergencies"]:
                    if e["id"] == emergency_id:
                        e["status"] = "RESOLVED"
                self._send_json(200, {"status": "success"})
            except ValueError:
                self._send_json(400, {"detail": "Invalid emergency ID."})

        else:
            self.send_response(444)
            self._send_cors_headers()
            self.end_headers()

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

def run_mock_server():
    server_address = ('127.0.0.1', 8000)
    httpd = HTTPServer(server_address, MockBackendHandler)
    print("Mock Backend Server running on http://127.0.0.1:8000")
    httpd.serve_forever()

if __name__ == "__main__":
    run_mock_server()
