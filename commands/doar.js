const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'Doa x Falcoins para o usuário marcado',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 2,
    expectedArgs: '<usuario> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    options: [{
        name:'usuario',
        description: 'o usuario que você vai doar os falcoins',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira doar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
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
            args[0] = await functions.getMember(message ? message : interaction, args[0])
            
            try {
                var quantity = await functions.specialArg(args[1], user.id)
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
            }
            
            if (await functions.readFile(user.id, 'Falcoins') >= quantity) {
                functions.takeAndGive(user.id, args[0].user.id, 'Falcoins', 'Falcoins', quantity)
                return instance.messageHandler.get(guild, "DOAR", {FALCOINS: await functions.format(quantity), USER: args[0]})
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
            console.error(`Doar: ${error}`)
        }
    }
}