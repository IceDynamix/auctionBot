module.exports = {
    data: {
        name: "ping",
        description: "Replies with Pong!",
        defaultPermission: false
    },
    handler: async interaction => await interaction.reply("Pong!"),
    permissions: [
        {
            id: process.env.ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true
        }
    ]
}