module.exports = (client, instance) => {
    const {changeDB} = require('../utils/functions.js')
    const {MessageActionRow, MessageButton} = require('discord.js')
    client.on('interactionCreate', async interaction => {
        try {
            if (!interaction.isButton()) return

            guildUser = interaction.guild ? interaction.guild : interaction.user

            if (interaction.customId === "disableVoteReminder") {
                await changeDB(interaction.user.id, "voteReminder", false, true)
                await changeDB(interaction.user.id, "lastReminder", 0, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('enableVoteReminder')
                 .setLabel(instance.messageHandler.get(guildUser, "ENABLE_REMINDER"))
                 .setEmoji("🔔")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: instance.messageHandler.get(guildUser, "REMINDER_DISABLED"),
                    ephemeral: true,
                    components: [row]
                })
            }

            if (interaction.customId === "enableVoteReminder") {
                await changeDB(interaction.user.id, "voteReminder", true, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('disableVoteReminder')
                 .setLabel(instance.messageHandler.get(guildUser, "DISABLE_REMINDER"))
                 .setEmoji("🔕")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: instance.messageHandler.get(guildUser, "REMINDER_ENABLED"),
                    ephemeral: true,
                    components: [row]
                })
            }
        } catch (error) {
            console.error(`Button: ${error}`)
        }
    })
}