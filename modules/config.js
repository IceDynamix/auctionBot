require("dotenv").config();

function parseIntOrThrow(str) {
    const i = parseInt(str);
    if(isNaN(i)) throw new Error(`${str} is not a number`);
    return i;
}

module.exports = {
    TOKEN: process.env.TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    BIDDER_ROLE_ID: process.env.BIDDER_ROLE_ID,
    INITIAL_TIMER: parseIntOrThrow(process.env.INITIAL_TIMER),
    IDLE_TIMER: parseIntOrThrow(process.env.IDLE_TIMER),
    MAX_BID: parseIntOrThrow(process.env.MAX_BID),
    MIN_INCREMENT: parseIntOrThrow(process.env.MIN_INCREMENT),
}