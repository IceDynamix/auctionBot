const Discord = require("discord.js");
const fs = require("fs");

function importCommands() {
    const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
    let commands = {};
    for (const file of commandFiles) {
        const command = require(`../commands/${ file }`);
        commands[command.data.name] = command;
    }
    return commands;
}

async function run() {
    let commands = importCommands();

    const intents = new Discord.Intents();
    intents.add("GUILDS", "GUILD_MESSAGES");
    const client = new Discord.Client({ intents });

    client.on("ready", async () => {
        console.log(`Logged in as ${ client.user.tag }!`);
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        await guild.commands.set(Object.entries(commands).map(([_, c]) => c.data));
        console.log(`Registered commands ${ Object.entries(commands).map(([name]) => name) }`)
    });

    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand()) return;
        const commandName = interaction.commandName.toLowerCase();
        console.log(`Received interaction "${ commandName }" from "${ interaction.user.username }"`)
        if (!(commandName in commands)) return;
        await commands[commandName].handler(interaction);
    });

    client.login(process.env.TOKEN).then();
}

module.exports = { run };