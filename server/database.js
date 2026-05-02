const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'fooddonation.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('donor', 'charity')),
    organization TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    food_type TEXT NOT NULL CHECK(food_type IN ('prepared', 'packaged', 'produce', 'bakery', 'dairy', 'other')),
    quantity TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_date TEXT NOT NULL,
    pickup_time_start TEXT NOT NULL,
    pickup_time_end TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'picked_up', 'completed', 'expired')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donation_id INTEGER NOT NULL,
    charity_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'picked_up', 'completed', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id),
    FOREIGN KEY (charity_id) REFERENCES users(id)
  );
`);

module.exports = db;
