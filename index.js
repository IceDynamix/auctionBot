require("dotenv").config();
const database = require("./modules/database");
const bot = require("./modules/discord");

async function main() {
    const db = await database.connect();
    await bot.run(db);
}

main().then();