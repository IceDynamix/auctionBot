const { BIDDER_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "balance",
        description: "Check your current balance",
    },
    handler: async (interaction, db) => {
        const row = await db.get(`
                    SELECT balance
                    FROM bidders
                    WHERE discord_id = ?`,
            interaction.user.id,
        );

        const content = row ? `Current balance: ${row.balance}` : "No currency set, please ping an admin to set your currency";
        interaction.reply({ content, ephemeral: true });
    },
}
