const { ADMIN_ROLE_ID, BIDDER_ROLE_ID } = require('../modules/config');

module.exports = {
    data: {
        name: "resetbalance",
        description: "Sets all bidders balance",
        defaultPermission: false,
        options: [{
            name: "amount",
            type: "INTEGER",
            description: "The amount of currency to set to",
            required: true,
        }],
    },
    handler: async (interaction, db) => {
        await interaction.guild.members.fetch();
        const bidders = interaction.guild.roles.cache.get(BIDDER_ROLE_ID).members.map(m => m.id);

        db.run(`DELETE
                FROM bidders`);

        const amount = interaction.options.get("amount").value;
        db.run(`INSERT INTO bidders (discord_id, balance)
                VALUES ${bidders.map(id => `(${id}, ${amount})`).join(",")}`)

        interaction.reply(`Set all bidders balance to ${amount}`);
    },
    permissions: [
        {
            id: ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}
