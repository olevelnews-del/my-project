import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "hsc.db"
SCHEMA_PATH = Path(__file__).parent.parent / "shared" / "db-schema.sql"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if SCHEMA_PATH.exists():
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema_sql = f.read()
        conn = get_db()
        conn.executescript(schema_sql)
        conn.commit()
        conn.close()
        print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
