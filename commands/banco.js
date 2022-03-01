const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    name: "bank",
    aliases: ["banco"],
    category: 'Economia',
    description: 'Deposit or withdraw your falcoins from the bank, money in the bank increase daily.',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    testOnly: config.testOnly,
    expectedArgs: '<option> <falcoins>',
    expectedArgsTypes: ['STRING', 'STRING'],
    options: [{
        name:'option',
        description: 'if you are going to deposit or withdraw falcoins',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [{name: 'deposit', value: 'deposit'}, {name: 'withdraw', value: 'withdraw'}]
    },
    {
        name: 'falcoins',
        description: 'the amount of falcoins you want to deposit or withdraw',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({instance, guild, message, user, args}) => {
        try {
            if (message) {args[0] = args[0].toLowerCase()}
            if (args[0] == 'depositar' || args[0] == 'deposit') {
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
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.readFile(user.id, "Falcoins", true)} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO"), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await functions.readFile(user.id, "Banco", true)}))
                     .setFooter({text: 'by Falcão ❤️'})
    
                    return embed
                } else {
                    return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                }
            } else if (args[0] == 'sacar' || args[0] == 'withdraw') {
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
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.readFile(user.id, "Falcoins", true)} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO"), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await functions.readFile(user.id, "Banco", true)}))
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
