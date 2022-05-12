const { ADMIN_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "allbalance",
        description: "Check every bidders balance",
    },
    handler: async (interaction, db) => {
        const rows = await db.all(`
            SELECT *
            FROM bidders`,
        );

        if (!rows.length) interaction.reply({ content: "No bidder has currency!", ephemeral: true });
        else {
            const output = [];
            await interaction.guild.members.fetch();
            for (const r of rows) {
                const member = interaction.guild.members.cache.get(r.discord_id);
                output.push(`${member.displayName} ($${r.balance})`);
            }
            interaction.reply({ content: output.join("\n") });
        }
    }
}
