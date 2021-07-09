const Discord = require("discord.js");
const fs = require("fs");

function importCommands() {
    const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
    let commands = new Discord.Collection;
    for (const file of commandFiles) {
        const command = require(`../commands/${ file }`);
        commands.set(command.data.name, command);
    }
    return commands;
}

async function run(db) {
    let commands = importCommands();

    const intents = new Discord.Intents();
    intents.add("GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS");
    const client = new Discord.Client({ intents });

    client.on("ready", async () => {
        console.log(`Logged in as ${ client.user.tag }!`);

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const guildCommands = await guild.commands.set(commands.map(c => c.data));
        console.log(`Registered commands ${ commands.map((_, name) => name) }`);

        // Add IDs to commands dict
        for (const [id, command] of guildCommands.entries())
            commands.get(command.name).id = id;

        // Permission mapping
        const fullPermissions = commands.map(({ id, permissions }) => ({ id, permissions }));
        await guild.commands.permissions.set({ fullPermissions });
    });

    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand()) return;
        const commandName = interaction.commandName.toLowerCase();
        console.log(`Received interaction "${ commandName }" from "${ interaction.user.username }"`)
        await commands.get(commandName).handler(interaction, db);
    });

    client.login(process.env.TOKEN).then();
}

module.exports = { run };