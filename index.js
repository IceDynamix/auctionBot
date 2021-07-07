require("dotenv").config();
const database = require("./modules/database");
const bot = require("./modules/discord");

async function main() {
    await database.connect();
    await bot.run();
}

main().then();