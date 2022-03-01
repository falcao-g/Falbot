const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Fun',
    description: 'Send someone to horny jail',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<usuario>',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'user',
        description: 'the poor soul that will be sent to horny jail',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({instance, guild, message, interaction, user, args}) => {
        try {
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .setImage('https://i.kym-cdn.com/photos/images/original/002/051/072/a4c.gif')
            .setFooter({text: 'by Falcão ❤️'})
           if (message) {
               return embed
           } else {
               const member = await functions.getMember(guild, args[0])
               await interaction.reply({
                   content: `${member}` + instance.messageHandler.get(guild, "BONKED") + `${user.username}`,
                   embeds: [embed]
               })
           }
        } catch (error) {
            console.error(`Bonk: ${error}`)
        }
    }
}