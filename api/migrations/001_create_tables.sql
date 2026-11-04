CREATE TABLE IF NOT EXISTS homes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    homeId TEXT NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    homeId TEXT NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS shares (
    id TEXT PRIMARY KEY,
    memberId TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    billId TEXT NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    -- Unix epoch
    paidAt INTEGER,

    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch()),

    UNIQUE (memberId, billId)
);


-- Auto Updated shares tuple when paidAt is updated 

CREATE TRIGGER shares_set_updated_at
AFTER UPDATE OF paidAt ON shares
BEGIN
    UPDATE shares
    SET updatedAt = unixepoch()
    WHERE id = NEW.id;
END;