const {MessageEmbed} = require('discord.js')
const {getRoleColor} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports = {
    aliases: ['enquete'],
    category: 'Fun',
    description: 'Create a little pretty poll',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    minArgs: 1,
    expectedArgs: '<theme>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'theme',
        description: 'theme of the poll',
        required: true,
        type: "STRING"
    }],
    callback: async ({instance, guild, message, interaction, user, text}) => {
        try {
            const embed = new MessageEmbed()
            .setColor(await getRoleColor(guild, user.id))
            .setDescription(text)
            .setAuthor({name: instance.messageHandler.get(guild, "ENQUETE", {USER: user.username}), iconURL: user.avatarURL()})
            .setFooter({text: 'by Falcão ❤️'})
   
           if (message) {
               answer = await message.reply({
                   embeds: [embed]
               })
           } else {
               answer = await interaction.reply({
                   embeds: [embed],
                   fetchReply: true
               })
           }
           answer.react('👍')
           answer.react('👎')
        } catch (error) {
            console.error(`poll: ${error}`)
        }
    }
}