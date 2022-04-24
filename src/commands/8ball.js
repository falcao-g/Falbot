const {MessageEmbed} = require('discord.js')
const {randint, getRoleColor} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports = {
    aliases: ["bola8"],
    category: 'Fun',
    description: 'Forecast your future',
    expectedArgs: '<pergunta>',
    minArgs: 1,
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    minArgs: 1,
    expectedArgs: '<pergunta>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'question',
        description: 'the question you want to ask the 8ball',
        required: true,
        type: "STRING"
    }],
    callback: async ({instance, guild, interaction, user, text}) => {
        try {
            answers = instance.messageHandler.get(guild, "8BALL")
            let answer = `${answers[randint(0, answers.length-1)]}`
            const embed = new MessageEmbed()
             .setColor(await getRoleColor(guild, user.id))
             .setAuthor({name: instance.messageHandler.get(guild, "BOLA8"), iconURL: "https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png"})
             if (interaction) { embed.addField(instance.messageHandler.get(guild, "PERGUNTA"), text, false)}
             embed.addField(instance.messageHandler.get(guild, "PREVISAO"), answer, false)
             .setFooter({text: 'by Falcão ❤️'})
            return embed
        } catch (error) {
            console.error(`8ball: ${error}`)
        }
    }
}