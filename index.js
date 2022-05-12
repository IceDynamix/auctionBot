require('./modules/config');
const database = require("./modules/database");
const bot = require("./modules/discord");

let discordClient;
let db;

async function main() {
    db = await database.connect();
    discordClient = await bot.run(db);
}

main().catch(console.error);

process.on('SIGTERM', () => process.emit('requestShutdown'));
process.on('SIGINT', () => process.emit('requestShutdown'));
process.once('requestShutdown', async () => {
    process.on('requestShutdown', () => console.log(`process ${process.pid} already shutting down...`));
    console.log('shutting down...');
    if (discordClient) {
        discordClient.destroy();
    }
    if (db) {
        await db.close();
    }
    console.log('Shutdown complete');
});
