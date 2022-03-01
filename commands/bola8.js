const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports = {
    name: "8ball",
    aliases: ["bola8"],
    category: 'Fun',
    description: 'Forecast your future',
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
        name: 'question',
        description: 'the question you want to ask the 8ball',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    callback: async ({instance, guild, message, interaction, user, text}) => {
        try {
            if (instance.messageHandler.getLanguage(guild) === "portugues") {
                answers = [
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
            } else {
                answers = [
                    "certainly.",
                    "without a doubt.",
                    "yes, definitely.",
                    "you may rely on it.",
                    "as I see it, yes.",
                    "most likely.",
                    "yes.",
                    "absolutely.",
                    "cloudy future, ask again.",
                    "try again later.",
                    "better not tell you now.",
                    "focus and try again",
                    "don't count on it.",
                    "no.",
                    "my sources say no.",
                    "outlook not so good.",
                    "very doubtful.",
                    "not in a million years."
                ]
            }
            let answer = `${answers[functions.randint(0, answers.length-1)]}`
            const embed = new Discord.MessageEmbed()
             .setColor(await functions.getRoleColor(guild, user.id))
             .setAuthor({name: instance.messageHandler.get(guild, "BOLA8"), iconURL: "https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png"})
             if (interaction) { embed.addField(instance.messageHandler.get(guild, "PERGUNTA"), text, false)}
             embed.addField(instance.messageHandler.get(guild, "PREVISAO"), answer, false)
             .setFooter({text: 'by Falcão ❤️'})
            return embed
        } catch (error) {
            console.error(`Bola8: ${error}`)
        }
    }
}