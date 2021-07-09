module.exports = {
    data: {
        name: "allbalance",
        description: "Check every bidders balance",
        defaultPermission: false,
    },
    handler: async (interaction, db) => {
        const rows = await db.all(`
            SELECT *
            FROM bidders`,
        );

        if (!rows) interaction.reply({ content: "No bidder has currency!", ephemeral: true });
        else {
            const output = [];
            await interaction.guild.members.fetch();
            for (const r of rows) {
                const member = interaction.guild.members.cache.get(r.discord_id);
                output.push(`${ member.displayName } ($${ r.balance })`);
            }
            interaction.reply({ content: output.join("\n") });
        }
    },
    permissions: [
        {
            id: process.env.ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}