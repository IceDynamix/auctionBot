const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { parse } = require("csv-parse");
const fs = require("fs");

async function initPlayersTable(db) {
    await db.run(`
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

    const promisisArray = [];

    fs.createReadStream("players.tsv")
        .pipe(parse({ delimiter: "\t" }))
        .on("data", data => {
            const p = db.run(`
                INSERT INTO players (user_id, username, country, rank, badges, badge_ranks, bws, tier, flag,
                                     url, image, qualifier_seed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, data);
            promisisArray.push(p);
        });

    await Promise.all(promisisArray);
    console.log("Finished importing players from players.tsv")
}

function initBiddersTable(db) {
    return db.run(`
        CREATE TABLE IF NOT EXISTS bidders
        (
            discord_id TEXT PRIMARY KEY,
            balance    INTEGER DEFAULT 0
        ) WITHOUT ROWID
    `);
}

async function initBidsTable(db) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS bids
        (
            bid_id       INTEGER PRIMARY KEY,
            player_id    INTEGER,
            final_bidder TEXT,
            sale_value   INTEGER DEFAULT 0,
            start_time   TEXT,
            ongoing      BOOLEAN
        )
    `);

    await db.run(`DELETE
            FROM bids
            WHERE ongoing = TRUE`);
}

async function init(db) {
    const playersTable = await db.get(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'players';`);

    if (!playersTable) await initPlayersTable(db);

    await initBiddersTable(db);
    await initBidsTable(db);
}

async function connect() {
    let db = await open({ filename: "./database.db", driver: sqlite3.Database });
    console.log("Connected to database");
    await init(db);
    return db;
}

module.exports = { connect };