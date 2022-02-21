const { ADMIN_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "echo",
        description: "Replies with your input!",
        options: [{
            name: "input",
            type: "STRING",
            description: "The input to echo back",
            required: true,
        }],
    },
    handler: async (interaction, _) => {
        const input = interaction.options.get("input").value;
        await interaction.reply(input);
    },
    permissions: [
        {
            id: ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}