const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'Guarda ou tira seus falcoins do banco, dinheiro no banco aumenta diariamente.',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    testOnly: config.testOnly,
    expectedArgs: '<opção> <falcoins>',
    expectedArgsTypes: ['STRING', 'STRING'],
    options: [{
        name:'opção',
        description: 'se você ira depositar ou sacar falcoins do banco',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [{name: 'depositar', value: 'depositar'}, {name: 'sacar', value: 'sacar'}]
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira depositar ou sacar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, user, args}) => {
        try {
            if (message) {args[0] = args[0].toLowerCase()}
            if (args[0] == 'depositar') {
                try {
                    var quantity = await functions.specialArg(args[1], user.id, "Falcoins")
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                }
    
                if (await functions.readFile(user.id, 'Falcoins') >= quantity && quantity > 0) {
                    functions.takeAndGive(user.id, user.id, 'Falcoins', 'Banco', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(`Você depositou ${await functions.format(quantity)} falcoins :smiley:`)
                     .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField('Saldo atual', `${await functions.format(await functions.readFile(user.id, "Falcoins"))} falcoins`, inline=false)
                     .addField('Banco', `você tem ${await functions.format(await functions.readFile(user.id, "Banco"))} falcoins no banco`)
                     .setFooter({text: 'by Falcão ❤️'})
    
                    return embed
                } else if (quantity <= 0) {
                    return `${args[1]} não é um valor válido... :rage:`
    
                } else {
                    return `você não tem falcoins suficientes! :rage:`
                }
            } else if (args[0] == 'sacar') {
                try {
                    var quantity = await functions.specialArg(args[1], user.id, "Banco")
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                }
    
                if (await functions.readFile(user.id, 'Banco') >= quantity && quantity > 0) {
                    functions.takeAndGive(user.id, user.id, 'Banco', 'Falcoins', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(`Você sacou ${await functions.format(quantity)} falcoins :smiley:`)
                     .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField('Saldo atual', `${await functions.format(await functions.readFile(user.id, "Falcoins"))} falcoins`, inline=false)
                     .addField('Banco', `você tem ${await functions.format(await functions.readFile(user.id, "Banco"))} falcoins no banco`)
                     .setFooter({text: 'by Falcão ❤️'})
    
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
            console.error(`banco: ${error}`)
        }
    }
}   
