const {MessageButton, MessageActionRow} = require('discord.js')
const {changeDB, readFile} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ['lembrete'],
    category: 'uteis',
    description: 'Toggle your vote reminder',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    callback: async ({instance, guild, user, message, interaction}) => {
        messageInteraction = message ? message : interaction
        try {
            if (await readFile(user.id, "voteReminder") === false) {
                await changeDB(user.id, "voteReminder", true, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('disableVoteReminderGUILD')
                 .setLabel(instance.messageHandler.get(guild, "DISABLE_REMINDER"))
                 .setEmoji("🔕")
                 .setStyle("PRIMARY")
                )

                messageInteraction.reply({
                    content: instance.messageHandler.get(guild, "REMINDER_ENABLED"),
                    ephemeral: true,
                    components: [row]
                })
            } else {
                await changeDB(user.id, "voteReminder", false, true)

                const row = new MessageActionRow()
                 .addComponents(
                new MessageButton()
                 .setCustomId('enableVoteReminderGUILD')
                 .setLabel(instance.messageHandler.get(guild, "ENABLE_REMINDER"))
                 .setEmoji("🔔")
                 .setStyle("PRIMARY")
                )
                
                messageInteraction.reply({
                    content: instance.messageHandler.get(guild, "REMINDER_DISABLED"),
                    ephemeral: true,
                    components: [row]
                })
            }
        } catch (error) {
            console.error(`reminder: ${error}`)
        }
    }
}   