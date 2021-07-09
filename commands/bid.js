module.exports = {
    data: {
        name: "bid",
        description: "Bid on the currently auctioned player!",
        defaultPermission: false,
        options: [{
            name: "amount",
            type: "INTEGER",
            description: "Amount of currency to bid",
            required: true,
        }],
    },
    handler: async () => {
        // Logic is handled in newsale.js via an InteractionCollector
        // TODO find a way for bid not to do anything unless an auction is active
    },
    permissions: [
        {
            id: process.env.BIDDER_ROLE_ID,
            type: "ROLE",
            permission: true,
        },
    ],
}