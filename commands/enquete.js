const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports = {
    category: 'Misc',
    description: 'Cria uma bonita pequena enquete',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<tema>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'tema',
        description: 'tema da enquete que as pessoas iram votar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({message, interaction, text}) => {
        try {
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
            .setDescription(text)
            .setAuthor(`Novo voto de ${message ? message.author.username : interaction.user.username}`, message ? message.author.avatarURL() : interaction.user.avatarURL())
           .setFooter('by Falcão ❤️')
   
           if (message) {
               answer = await message.reply({
                   embeds: [embed]
               })
               answer.react('👍')
               answer.react('👎')
           } else {
               answer = await interaction.reply({
                   embeds: [embed],
                   fetchReply: true
               })
               answer.react('👍')
               answer.react('👎')
           }
        } catch (error) {
            console.log('voto', error)
        }
    }
}