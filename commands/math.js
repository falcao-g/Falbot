const Discord = require('discord.js')
const functions = require('../functions.js')
const math = require('mathjs')
const config = require("../config/config.json")

module.exports = {
    category: 'Misc',
    description: 'Faz um cálculo de matemática para você',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<expressão>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'expressão',
        description: 'a expressão matemática que eu irei calcular',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({message, interaction, user, text}) => {
        try {
            answer = await math.evaluate(text).toString()

            const embed = new Discord.MessageEmbed()
             .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
             if (interaction) { embed.addField('Expressão:', text, false)}
             embed.addField('Resultado:', answer, false)
             .setFooter({text: 'by Falcão ❤️'})
    
            return embed
        }catch (error) {
            console.error(`math: ${error}`)
        }
    }
}