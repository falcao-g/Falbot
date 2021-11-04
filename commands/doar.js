const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Doa x Falcoins para o usuário marcado',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    expectedArgs: '<usuario> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`doar {ARGUMENTS}',
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
            args[0] = await functions.getMember(message ? message : interaction, args[0])
            if (await functions.readFile(args[0].user.id) === undefined) {
                return 'Esse usuário não possui um regisro :confused:'
            }
            const quantity = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
            if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= quantity) {
                await functions.takeAndGive(message ? message.author.id : interaction.user.id, args[0].user.id, 'Falcoins', 'Falcoins', quantity)
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
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('doar:', error)
            }
        }
    }
}