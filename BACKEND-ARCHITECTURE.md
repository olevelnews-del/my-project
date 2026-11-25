# HSC Academic Hub — Backend & Polyglot Architecture

## Architecture Diagram (Text Diagram)

```
[ Frontend: HTML + CSS + JS (hsctutorbd.com) ]
         │
         ├───► Fast Dashboard / Real-Time API (Port 3000)
         │     └── Node.js (Express)
         │           │
         ├───► Main Business Logic & Security (Port 5000)
         │     └── Python (Flask) ◄── Security Layer (security.py: PyJWT, bcrypt, Rate Limiter)
         │           │
         └───────────┴───► Database Storage
                           └── SQLite (hsc.db) ── Shared Schema (shared/db-schema.sql)
```

---

## Language & Component Selection Rationale

### 1. Python (Flask) — Main Business & Security Backend
- **Role:** Handles core payment processing, SQLite data operations (progress, check-in, wrong-queue, scores), smart routine generation, and admin APIs.
- **Why Python:** Expressive, quick to implement complex logic (routine scheduling, weakness analysis), and light on resource consumption.
- **Security Choice (Python Security vs Java):**
  - **Decision:** Selected **Python Security** (`security.py` with PyJWT, bcrypt password hashing, input validation, and IP rate-limiting).
  - **Reasoning:** For an initial deployment scale of 500-10,000 students, Java Spring Boot introduces excessive RAM overhead (JVM) and heavy boilerplate without added value. Python security is lightweight, runs in-process with Flask, and avoids unnecessary multi-language network hops.

### 2. Node.js (Express) — Fast Dashboard & Proxy Layer
- **Role:** Provides high-throughput, low-latency API aggregation for the student dashboard (`GET /api/dashboard`), compiling streak, coverage, and daily tasks into 1 payload.
- **Why Node.js:** Non-blocking I/O ideal for handling multiple concurrent dashboard fetches and real-time polling updates. Seamless JSON-to-JSON integration with frontend JS.

### 3. SQLite (`hsc.db`) — Single Unified Database
- **Role:** Single source of truth for all student data, check-ins, payments, and progress.
- **Why SQLite:** Single file deployment (`hsc.db`), zero database server configuration overhead, instant backups, and 100% adequate for tens of thousands of query transactions/day.
