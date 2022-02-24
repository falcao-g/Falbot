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
        choices: [{name: 'depositar/deposit', value: 'depositar'}, {name: 'sacar/withdraw', value: 'sacar'}]
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira depositar ou sacar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({instance, guild, message, interaction, user, args}) => {
        try {
            if (message) {args[0] = args[0].toLowerCase()}
            if (args[0] == 'depositar') {
                try {
                    var quantity = await functions.specialArg(args[1], user.id, "Falcoins")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                }
    
                if (await functions.readFile(user.id, 'Falcoins') >= quantity && quantity > 0) {
                    functions.takeAndGive(user.id, user.id, 'Falcoins', 'Banco', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(instance.messageHandler.get(guild, "BANCO_DEPOSITOU", {VALUE: await functions.format(quantity)}))
                     .setColor(await functions.getRoleColor(guild, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.format(await functions.readFile(user.id, "Falcoins"))} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO"), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await functions.format(await functions.readFile(user.id, "Banco"))}))
                     .setFooter({text: 'by Falcão ❤️'})
    
                    return embed
                } else {
                    return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                }
            } else if (args[0] == 'sacar') {
                try {
                    var quantity = await functions.specialArg(args[1], user.id, "Banco")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                }
    
                if (await functions.readFile(user.id, 'Banco') >= quantity && quantity > 0) {
                    functions.takeAndGive(user.id, user.id, 'Banco', 'Falcoins', quantity)
    
                    const embed = new Discord.MessageEmbed()
                     .setTitle(instance.messageHandler.get(guild, "BANCO_SACOU", {VALUE: await functions.format(quantity)}))
                     .setColor(await functions.getRoleColor(guild, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL", {VALUE: await functions.format(quantity)}), `${await functions.format(await functions.readFile(user.id, "Falcoins"))} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO", {VALUE: await functions.format(quantity)}), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await functions.format(await functions.readFile(user.id, "Banco"))}))
                     .setFooter({text: 'by Falcão ❤️'})
    
                     return embed
                } else {
                    return instance.messageHandler.get(guild, "BANCO_INSUFICIENTE")
                }
            } else {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
        } catch (error) {
            console.error(`banco: ${error}`)
        }
    }
}   
