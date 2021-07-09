module.exports = {
    data: {
        name: "balance",
        description: "Check your current balance",
        defaultPermission: false,
    },
    handler: async (interaction, db) => {
        db.get(`
                    SELECT currency
                    FROM bidders
                    WHERE discord_id = ?`,
            interaction.user.id,
            (err, row) => {
                if (err) {
                    console.error(err);
                    return
                }
                const content = row ? `Current balance: ${ row.currency }` : "No currency set, please ping an admin to set your currency";
                interaction.reply({ content, ephemeral: true });
            },
        );
    },
    permissions: [
        {
            id: process.env.BIDDER_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}