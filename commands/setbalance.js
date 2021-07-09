module.exports = {
    data: {
        name: "setbalance",
        description: "Sets the balance for a single user",
        defaultPermission: false,
        options: [{
            name: "amount",
            type: "INTEGER",
            description: "The amount of currency to set to",
            required: true,
        }, {
            name: "user",
            type: "USER",
            description: "The user to set the currency for",
            required: true,
        }],
    },
    handler: async (interaction, db) => {
        const { member } = interaction.options.get("user");
        if (!member.roles.cache.get(process.env.BIDDER_ROLE_ID)) {
            await interaction.reply("Mentioned user is not a bidder!");
            return;
        }
        const amount = interaction.options.get("amount").value;

        db.run(`REPLACE INTO bidders (discord_id, balance)
                VALUES ('${ member.id }', ${ amount })`)

        await interaction.reply(`Set currency of ${ member.displayName } to ${ amount }`);
    },
    permissions: [
        {
            id: process.env.ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}