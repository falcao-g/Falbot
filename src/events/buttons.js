module.exports = (client, instance) => {
    const {changeDB} = require('../utils/functions.js')
    const {MessageActionRow, MessageButton} = require('discord.js')
    client.on('interactionCreate', async interaction => {
        try {
            if (!interaction.isButton()) return

            if (interaction.customId === "disableVoteReminderDM") {
                await changeDB(interaction.user.id, "voteReminder", false, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('enableVoteReminderDM')
                 .setLabel('Ativar Lembrete')
                 .setEmoji("🔔")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: "O lembrete para votar foi desativado.",
                    ephemeral: true,
                    components: [row]
                })
            }

            if (interaction.customId === "enableVoteReminderDM") {
                await changeDB(interaction.user.id, "voteReminder", true, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('disableVoteReminderDM')
                 .setLabel('Desativar Lembrete')
                 .setEmoji("🔕")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: "O lembrete para votar foi ativado.",
                    ephemeral: true,
                    components: [row]
                })
            }

            if (interaction.customId === "disableVoteReminderGUILD") {
                await changeDB(interaction.user.id, "voteReminder", false, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('enableVoteReminderGUILD')
                 .setLabel(instance.messageHandler.get(interaction.member.guild, "ENABLE_REMINDER"))
                 .setEmoji("🔔")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: instance.messageHandler.get(interaction.member.guild, "REMINDER_DISABLED"),
                    ephemeral: true,
                    components: [row]
                })
            }

            if (interaction.customId === "enableVoteReminderGUILD") {
                await changeDB(interaction.user.id, "voteReminder", true, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('disableVoteReminderGUILD')
                 .setLabel(instance.messageHandler.get(interaction.member.guild, "DISABLE_REMINDER"))
                 .setEmoji("🔕")
                 .setStyle("PRIMARY")
                )

                interaction.reply({
                    content: instance.messageHandler.get(interaction.member.guild, "REMINDER_ENABLED"),
                    ephemeral: true,
                    components: [row]
                })
            }
        } catch (error) {
            console.error(`Button: ${error}`)
        }
    })
}