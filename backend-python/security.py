import os
import re
import time
import hmac
import hashlib
import json
import base64
from functools import wraps
from flask import request, jsonify

SECRET_KEY = os.getenv("JWT_SECRET", "hsc_academic_hub_secret_key_2026")
ADMIN_PASSWORD_HASH = os.getenv(
    "ADMIN_PASSWORD_HASH",
    hashlib.sha256("admin123".encode()).hexdigest()
)

# In-memory rate limiting store: ip -> list of timestamps
RATE_LIMIT_STORE = {}

def normalize_phone(phone_str):
    if not phone_str:
        return ""
    digits = re.sub(r'[^\d+]', '', str(phone_str))
    if re.match(r'^(?:\+?88)?01[3-9]\d{8}$', digits):
        return digits[-11:]  # Standard 11 digit 01XXXXXXXXX
    return ""

def clean_text(text, max_len=100):
    if not text:
        return ""
    cleaned = re.sub(r'[\u0000-\u001f\u007f]', '', str(text)).strip()
    return cleaned[:max_len]

def hash_password(password):
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

def verify_password(password, hashed):
    return hash_password(password) == hashed

def generate_token(phone, role="student"):
    payload = {
        "phone": phone,
        "role": role,
        "exp": int(time.time()) + 86400 * 30  # 30 days
    }
    header = {"alg": "HS256", "typ": "JWT"}
    b64_header = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    b64_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{b64_header}.{b64_payload}".encode(),
        hashlib.sha256
    ).digest()
    b64_sig = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{b64_header}.{b64_payload}.{b64_sig}"

def decode_token(token):
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        b64_header, b64_payload, b64_sig = parts
        
        # Verify signature
        expected_sig = hmac.new(
            SECRET_KEY.encode(),
            f"{b64_header}.{b64_payload}".encode(),
            hashlib.sha256
        ).digest()
        
        sig_padding = "=" * (4 - len(b64_sig) % 4)
        actual_sig = base64.urlsafe_b64decode(b64_sig + sig_padding)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_padding = "=" * (4 - len(b64_payload) % 4)
        payload_data = json.loads(base64.urlsafe_b64decode(b64_payload + payload_padding))
        
        if payload_data.get("exp", 0) < time.time():
            return None
            
        return payload_data
    except Exception:
        return None

def rate_limit(limit=30, window=60):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            ip = request.remote_addr or "127.0.0.1"
            now = time.time()
            timestamps = RATE_LIMIT_STORE.get(ip, [])
            timestamps = [t for t in timestamps if now - t < window]
            if len(timestamps) >= limit:
                return jsonify({"ok": False, "error": "Too many requests. Please wait."}), 429
            timestamps.append(now)
            RATE_LIMIT_STORE[ip] = timestamps
            return f(*args, **kwargs)
        return wrapped
    return decorator

def require_auth(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"ok": False, "error": "Unauthorized"}), 401
        token = auth_header.split(" ")[1]
        decoded = decode_token(token)
        if not decoded:
            return jsonify({"ok": False, "error": "Invalid or expired token"}), 401
        request.user = decoded
        return f(*args, **kwargs)
    return wrapped

def require_admin(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"ok": False, "error": "Admin authorization required"}), 401
        token = auth_header.split(" ")[1]
        decoded = decode_token(token)
        if not decoded or decoded.get("role") != "admin":
            return jsonify({"ok": False, "error": "Admin access denied"}), 403
        request.user = decoded
        return f(*args, **kwargs)
    return wrapped
