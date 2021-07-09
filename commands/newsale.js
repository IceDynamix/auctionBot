const Discord = require("discord.js")

function checkBid(bidValue, bidInteraction, balance, teamMembers, saleValue, maxBid) {
    // TODO extract constants
    const minIncrement = 100;

    if (bidValue > maxBid) {
        bidInteraction.reply({
            content: `You're only allowed to bid up to a maximum of ${ maxBid } in an auction! Bid 9000 exactly in case you want to buy the player instantly.`,
            ephemeral: true,
        });
        return false;
    }

    if (bidValue > balance) {
        bidInteraction.reply({
            content: `You cannot bid more money than you currently possess! (${ balance })`,
            ephemeral: true,
        });
        return false;
    }

    if (teamMembers.length < 3 && bidValue > balance * 0.75) {
        bidInteraction.reply({
            content: `You cannot bid more than 75% of your remaining money (${ balance * 0.75 }) until you have at least 3 players!`,
            ephemeral: true,
        });
        return false;
    }

    if (bidValue < saleValue + minIncrement) {
        bidInteraction.reply({
            content: `You have to bid at least ${ saleValue + minIncrement } or higher!`,
            ephemeral: true,
        });
        return false;
    }

    if (bidValue % minIncrement !== 0) {
        bidInteraction.reply({
            content: `The bid was not an increment of ${ minIncrement }!`,
            ephemeral: true,
        });
        return false;
    }

    return true;
}

function initCollector(interaction, db, player) {
    // TODO extract constants
    const initialTimer = 20000;
    const idleTimer = 15000;
    const maxBid = 9000;

    let saleValue = 100;
    let lastBidder = null;

    const collector = new Discord.InteractionCollector(interaction.client, {
        channel: interaction.channel,
        time: initialTimer,
    });

    collector.on("collect", async bidInteraction => {
        if (!bidInteraction.isCommand()) return;
        if (bidInteraction.commandName.toLowerCase() !== "bid") return;

        const bidValue = bidInteraction.options.get("amount").value;
        const teamMembers = await db.all(`
            SELECT *
            FROM bids
            WHERE final_bidder = '${ bidInteraction.user.id }'`,
        );
        const { balance } = await db.get(`
            SELECT balance
            FROM bidders
            WHERE discord_id = '${ bidInteraction.user.id }'
        `);

        if (!checkBid(bidValue, bidInteraction, balance, teamMembers, saleValue)) return;

        saleValue = bidValue;
        lastBidder = interaction.user.id;
        bidInteraction.reply(`${ interaction.member.displayName } bids ${ bidValue }.`);

        if (bidValue === maxBid) collector.stop();
        collector.resetTimer({ time: idleTimer });
    });

    collector.on("end", async () => {
        if (lastBidder == null) {
            await interaction.followUp("No one has bid on the player.");
            await db.run(`
                UPDATE bids
                SET ongoing = FALSE
                WHERE ongoing = TRUE;
            `)
        } else {
            const bidderName = interaction.guild.members.cache.get(lastBidder).displayName;
            await interaction.followUp(`${ player.username } has been sold to ${ bidderName } for ${ saleValue }`);
            await db.run(`
                UPDATE bids
                SET sale_value   = ${ saleValue },
                    final_bidder = '${ lastBidder }',
                    ongoing      = FALSE
                WHERE ongoing = TRUE;
            `);
            await db.run(`
                UPDATE bidders
                SET balance = balance - ${ saleValue }
                WHERE discord_id = '${ lastBidder }';
            `);
        }
    });
}

module.exports = {
    data: {
        name: "newsale",
        description: "Create a new sale",
        defaultPermission: false,
    },
    handler: async (interaction, db) => {
        const ongoing = await db.get(`
            SELECT *
            FROM bids
            WHERE ongoing = TRUE`,
        );

        if (ongoing) {
            interaction.reply("There is already a sale ongoing!")
            return;
        }

        // Random available player
        const player = await db.get(`
            SELECT *
            FROM players
            WHERE user_id NOT IN (SELECT player_id FROM bids)
            ORDER BY RANDOM()
            LIMIT 1;`,
        );

        if (!player) {
            interaction.reply("No more players to auction!");
            return;
        }

        // create bid
        await db.run(`
            INSERT INTO bids (player_id, sale_value, ongoing, start_time)
            VALUES (?, 100, TRUE, datetime('now'))
        `, player.user_id)

        // TODO player embed
        interaction.reply(player.username)

        initCollector(interaction, db, player);
    },
    permissions: [
        {
            id: process.env.ADMIN_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}