module.exports = {
    data: {
        name: "echo",
        description: "Replies with your input!",
        options: [{
            name: "input",
            type: "STRING",
            description: "The input to echo back",
            required: true,
        }],
    },
    handler: async interaction => {
        const input = interaction.options.get("input").value;
        await interaction.reply(input);
    },
}