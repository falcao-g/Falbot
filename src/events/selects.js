module.exports = (client, instance) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return

        if (interaction.customId === "page") {
            guild = interaction.member.guild
            instance.commandHandler.getCommand('help').callback({instance, guild, interaction})
        }
    })
}