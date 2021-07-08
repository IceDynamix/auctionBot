const Discord = require("discord.js");

async function run() {
    const intents = new Discord.Intents();
    intents.add('GUILDS', 'GUILD_MESSAGES');
    const client = new Discord.Client({ intents });

    client.on("ready", async () => {
        console.log(`Logged in as ${ client.user.tag }!`);
        const data = [
            {
                name: "ping",
                description: "Replies with Pong!",
            },
            {
                name: "echo",
                description: "Replies with your input!",
                options: [{
                    name: "input",
                    type: "STRING",
                    description: "The input to echo back",
                    required: true,
                }],
            },
        ];

        const guild = await client.guilds.fetch("228404074721181696");
        await guild.commands.set(data);
    });

    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand()) return;

        switch (interaction.commandName.toLowerCase()) {
            case "ping":
                await interaction.reply("Pong!");
                break;
            case "echo":
                const input = interaction.options.get("input").value;
                await interaction.reply(input);
                break;
        }
    });

    client.login(process.env.TOKEN).then();
}


module.exports = { run };