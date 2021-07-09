module.exports = {
    data: {
        name: "team",
        description: "View your team",
        defaultPermission: false,
    },
    handler: async (interaction, db) => {
        const rows = await db.all(`
            SELECT *
            FROM players p,
                 bids b
            WHERE p.user_id = b.player_id
              AND b.final_bidder = '${ interaction.user.id }';`,
        );

        if (!rows.length) {
            interaction.reply({ content: "You have not bought any players so far!", ephemeral: true });
            return;
        }

        interaction.reply({ content: rows.map(p => `${ p.username } ($${ p.sale_value })`).join("\n") })
    }
    ,
    permissions: [
        {
            id: process.env.BIDDER_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}