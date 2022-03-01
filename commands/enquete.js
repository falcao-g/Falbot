const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    name: 'poll',
    aliases: ['enquete'],
    category: 'Fun',
    description: 'Create a little pretty poll',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<theme>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'theme',
        description: 'theme of the poll',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({instance, guild, message, interaction, user, text}) => {
        try {
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
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
            console.error(`enquete: ${error}`)
        }
    }
}