const Discord = require('discord.js')
const Roll = require('roll')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Misc',
    description: 'Rola dados para você',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<dados>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'dados',
        description: 'dados que eu vou rolar para você',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({message, interaction, user, text}) => {
        try {
            const roll = new Roll()
            text = text.replace(/\s/g,'')
    
            if (!roll.validate(text)) {
                const messageInteraction = message ? message : interaction
                messageInteraction.reply({
                    content: `${text} não é um dado válido`
                })
            } else {
                rolled = roll.roll(text).result
                rolled = rolled.toString()
        
                if (message) {
                    message.reply({
                        content: `**${rolled}**`
                    })
                }else {
                    embed = new Discord.MessageEmbed()
                    .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                    .addFields({
                        name: 'Dados:',
                        value: text,
                        inline: false
                    },
                    {
                        name: 'Resultado:',
                        value: `**${rolled}**`,
                        inline: false
                    })
                    .setFooter({text: 'by Falcão ❤️'})
                    interaction.reply({
                        embeds: [embed]
                    })
                }
            }
        } catch(error) {
            console.error(`roll: ${error}`)
        }
    }
}