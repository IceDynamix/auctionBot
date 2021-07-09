const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const parse = require("csv-parse");
const fs = require("fs");

function initPlayersTable(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS players
        (
            user_id        INTEGER PRIMARY KEY,
            username       TEXT,
            country        TEXT,
            rank           INTEGER,
            badges         TEXT,
            badge_ranks    TEXT,
            bws            NUMERIC,
            tier           INTEGER,
            flag           TEXT,
            url            TEXT,
            image          TEXT,
            qualifier_seed INTEGER
        ) WITHOUT ROWID
    `);

    console.log("Created players table");

    console.log("Importing players from players.tsv");
    fs.createReadStream("players.tsv")
        .pipe(parse({ delimiter: "\t" }))
        .on("data", data => {
            db.run(
                `
                    INSERT INTO players (user_id, username, country, rank, badges, badge_ranks, bws, tier, flag,
                                         url,
                                         image)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, data);
        });
    console.log("Finished importing players from players.tsv")
}

function initBiddersTable(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS bidders
        (
            discord_id INTEGER PRIMARY KEY,
            currency   TEXT DEFAULT 0
        ) WITHOUT ROWID
    `);
}

function initBidsTable(db) {
    db.run(`
        CREATE TABLE IF NOT EXISTS bids
        (
            bid_id       INTEGER PRIMARY KEY,
            player_id    INTEGER,
            final_bidder TEXT,
            currency     INTEGER DEFAULT 0,
            start_time   TEXT,
            end_time     TEXT
        )
    `);
}

async function init(db) {
    const playersTable = await db.get(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'players';`);

    if (!playersTable) initPlayersTable(db);

    initBiddersTable(db);
    initBidsTable(db);
}

async function connect() {
    let db = await open({ filename: "./database.db", driver: sqlite3.Database });
    console.log("Connected to database");
    await init(db);
    return db;
}

module.exports = { connect };