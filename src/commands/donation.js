const {Constants} = require('discord.js')
const {getMember, specialArg, readFile, format, takeAndGive} = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['doar', 'doacao'],
    category: 'Economia',
    description: 'Donate x falcoins to a user',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 2,
    expectedArgs: '<usuario> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    options: [{
        name:'user',
        description: 'user to donate to',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.USER
    },
    {
        name: 'falcoins',
        description: 'amount of falcoins to donate',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({instance, guild, message, interaction, user, args}) => {
        try {
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            args[0] = await getMember(guild, args[0])
            
            try {
                var quantity = await specialArg(args[1], user.id, "falcoins")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
            }
            
            if (await readFile(user.id, 'falcoins') >= quantity) {
                await takeAndGive(user.id, args[0].user.id, 'falcoins', 'falcoins', quantity)
                return instance.messageHandler.get(guild, "DOAR", {FALCOINS: await format(quantity), USER: args[0]})
            } else {
                if (message) {
                    return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                } else {
                    interaction.reply({
                        content: instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES"),
                        ephemeral: true
                    })
                }
            }
        } catch (error) {
            console.error(`donation: ${error}`)
        }
    }
}