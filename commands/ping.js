const { ADMIN_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "ping",
        description: "Replies with Pong!",
    },
    handler: async (interaction, _) => await interaction.reply("Pong!"),
}
