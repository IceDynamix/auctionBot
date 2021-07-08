module.exports = {
    data: {
        name: "ping",
        description: "Replies with Pong!",
    },
    handler: async interaction => await interaction.reply("Pong!"),
}