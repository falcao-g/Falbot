const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Misc',
    description: 'Prevê o seu futuro',
    expectedArgs: '<pergunta>',
    minArgs: 1,
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<pergunta>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'pergunta',
        description: 'a pergunta que a bola 8 mágica responderá',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({message, interaction, user, text}) => {
        try {
            const answers = [
                "certamente.",
                "sem dúvida.",
                "sim, definitivamente.",
                "você pode contar com isso.",
                "a meu ver, sim.",
                "provavelmente.",
                "sim.",
                "absolutamente.",
                "destino nublado, tente de novo.",
                "pergunte de novo mais tarde.",
                "melhor não te dizer agora.",
                "não posso prever agora.",
                "se concentre e pergunte de novo.",
                "não conte com isso.",
                "não.",
                "minhas fontes dizem que não.",
                "cenário não muito bom.",
                "muito duvidoso.",
                "as chances não são boas."
            ]
            let answer = `${answers[functions.randint(0, answers.length-1)]}`
            const embed = new Discord.MessageEmbed()
             .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
             .setAuthor({name: 'Bola 8 mágica', iconURL: "https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png"})
             if (interaction) { embed.addField('Pergunta:', text, false)}
             embed.addField('Previsão:', answer, false)
             .setFooter({text: 'by Falcão ❤️'})
            return embed
        } catch (error) {
            console.error(`Bola8: ${error}`)
        }
    }
}