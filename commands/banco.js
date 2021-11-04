const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Guarda ou tira seus falcoins do banco',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    expectedArgs: '<opção> <falcoins>',
    expectedArgsTypes: ['STRING', 'STRING'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`banco {ARGUMENTS}',
    options: [{
        name:'opção',
        description: 'se você ira depositar ou sacar falcoins do banco',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira depositar ou sacar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, args}) => {
        try {
            args[0] = args[0].toLowerCase()
            if (args[0] == 'depositar') {
                try {
                    var quantity = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
                } catch {
                    if (message) {
                        message.reply({
                            content: `${args[1]} não é um valor válido... :rage:`
                        })
                    } else {
                        interaction.reply({
                            content: `${args[1]} não é um valor válido... :rage:`
                        })
                    }
                }
    
                if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= quantity && quantity > 0) {
                    functions.takeAndGive(message ? message.author.id : interaction.user.id, message ? message.author.id : interaction.user.id, 'Falcoins', 'Banco', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(`Você depositou ${await functions.format(quantity)} falcoins :smiley:`)
                     .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                     .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                     .addField('Saldo atual', `${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, "Falcoins") - quantity)} falcoins`, inline=false)
                     .addField('Banco', `você tem ${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, "Banco") + quantity)} falcoins no banco`)
                     .setFooter('by Falcão ❤️')
    
                    return embed
                } else if (quantity <= 0) {
                    return `${args[1]} não é um valor válido... :rage:`
    
                } else {
                    return `você não tem falcoins suficientes! :rage:`
                }
            } else if (args[0] == 'sacar') {
                try {
                    var quantity = await functions.specialArgBank(args[1], message ? message.author.id : interaction.user.id)
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                }
    
                if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Banco') >= quantity && quantity > 0) {
                    functions.takeAndGive(message ? message.author.id : interaction.user.id, message ? message.author.id : interaction.user.id, 'Banco', 'Falcoins', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(`Você sacou ${await functions.format(quantity)} falcoins :smiley:`)
                     .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                     .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                     .addField('Saldo atual', `${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, "Falcoins") + quantity)} falcoins`, inline=false)
                     .addField('Banco', `você tem ${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, "Banco") - quantity)} falcoins no banco`)
                     .setFooter('by Falcão ❤️')
    
                     return embed
                } else if (quantity <= 0) {
                    return `${args[1]} não é um valor válido... :rage:`
                } else {
                    return `você não tem falcoins suficientes no banco! :rage:`
                }
            } else {
                return `${args[0]} não é um valor válido... :rage:`
            }
        } catch (error) {
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('banco:', error)
            }
        }
    }
}   