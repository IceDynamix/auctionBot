const sqlite = require("sqlite3");
const parse = require("csv-parse");
const fs = require("fs");

let db = new sqlite.Database("./database.db");

console.log("Connected to database");

try {
    console.log("Creating fresh table");
    db.run(`
        CREATE TABLE IF NOT EXISTS players
        (
            user_id            INTEGER PRIMARY KEY,
            username           TEXT,
            country            TEXT,
            rank               INTEGER,
            badges             TEXT,
            badge_ranks        TEXT,
            bws                NUMERIC,
            tier               INTEGER,
            flag               TEXT,
            url                TEXT,
            image              TEXT,
            qualifier_seed     INTEGER,
            is_captain         INTEGER,
            has_been_auctioned INTEGER
        ) WITHOUT ROWID
    `);

    console.log("Importing players from players.tsv");
    fs.createReadStream("players.tsv")
        .pipe(parse({ delimiter: "\t" }))
        .on("data", data => {
            db.run(
                `
                    INSERT INTO players (user_id, username, country, rank, badges, badge_ranks, bws, tier, flag, url,
                                         image)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, data);
        });
    console.log("Finished importing players from players.tsv")
} catch {
}


