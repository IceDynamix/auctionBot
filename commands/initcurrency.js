module.exports = {
    data: {
        name: "initcurrency",
        description: "Sets the currency for all bidders",
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
        const bidders = interaction.guild.roles.cache.get(process.env.BIDDER_ROLE_ID).members.map(m => m.id);

        db.run(`DELETE
                FROM bidders`);

        const amount = interaction.options.get("amount").value;
        db.run(`INSERT INTO bidders (discord_id, currency)
                VALUES ${ bidders.map(id => `(${ id }, ${ amount })`).join(",") }`)

        interaction.reply(`Set all bidders currency to ${ amount }`);
    },
    permissions: [
        {
            id: process.env.ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}