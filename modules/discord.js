const Discord = require("discord.js");

async function run() {
    const client = new Discord.Client();

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.login(process.env.TOKEN).then();
}

module.exports = { run };