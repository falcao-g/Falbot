const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Doa x Falcoins para o usuário marcado',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: false,
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
    callback: async ({message, interaction, args}) => {
        try {
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            functions.createUser(message ? message.author.id : interaction.user.id)
            functions.createUser(args[0])
            args[0] = await functions.getMember(message ? message : interaction, args[0])
            const quantity = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
            if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= quantity) {
                functions.takeAndGive(message ? message.author.id : interaction.user.id, args[0].user.id, 'Falcoins', 'Falcoins', quantity)
                return `:handshake: ${await functions.format(quantity)} falcoins transferidos com sucesso para ${args[0]}`
            } else {
                if (message) {
                    return `você não tem falcoins suficiente para esta doação! :rage:`
                } else {
                    interaction.reply({
                        content: ` você não tem falcoins suficiente para esta doação! :rage:`,
                        ephemeral: true
                    })
                }
            }
        } catch (error) {
            console.log('doar:', error)
        }
    }
}
