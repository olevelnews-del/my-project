# HSC Academic Hub — Backend Operations Guide

## Overview
The HSC Academic Hub backend is structured as a light polyglot architecture:
- **Python Flask Backend (`backend-python/`):** Business logic, SQLite operations (`hsc.db`), Security layer (JWT + Rate Limiting + bcrypt). Runs on **Port 5000**.
- **Node.js Express Backend (`backend-node/`):** Fast API aggregator for Dashboard and high-throughput endpoints. Runs on **Port 3000**.
- **Frontend Static Server:** Serves static HTML/JS/CSS assets. Runs on **Port 8000** (or via Cloudflare Pages / Python `http.server`).

---

## Quick Start / How to Run

### 1. Initialize & Start Python Logic Backend (Port 5000)
```bash
cd backend-python
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 2. Start Node.js Express Fast API (Port 3000)
```bash
cd backend-node
npm install
npm start
```

### 3. Start Frontend Local Server (Port 8000)
```bash
python3 -m http.server 8000
```

---

## Environment Configuration
Copy `.env.example` to `.env` in `backend-python/` or set environment variables:
- `JWT_SECRET`: Secret key for student tokens.
- `ADMIN_PASSWORD_HASH`: SHA-256 hash of admin password.
- `BKASH_MERCHANT_ID`: Merchant number (01616200174).
