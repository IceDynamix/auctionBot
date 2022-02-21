require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    BIDDER_ROLE_ID: process.env.BIDDER_ROLE_ID,    
}