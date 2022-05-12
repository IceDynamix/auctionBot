const { ADMIN_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "ping",
        description: "Replies with Pong!",
        defaultPermission: false
    },
    handler: async (interaction, _) => await interaction.reply("Pong!"),
    permissions: [
        {
            id: ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true
        }
    ]
}