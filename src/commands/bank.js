const {Constants, MessageEmbed} = require('discord.js')
const {specialArg, readFile, takeAndGive, format, getRoleColor} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ["banco"],
    category: 'Economia',
    description: 'Deposit or withdraw your falcoins from the bank, money in the bank increase daily.',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    testOnly,
    expectedArgs: '<option> <falcoins>',
    expectedArgsTypes: ['STRING', 'STRING'],
    options: [{
        name:'option',
        description: 'if you are going to deposit or withdraw falcoins',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
        choices: [{name: 'deposit', value: 'deposit'}, {name: 'withdraw', value: 'withdraw'}]
    },
    {
        name: 'falcoins',
        description: 'the amount of falcoins you want to deposit or withdraw',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({instance, guild, message, user, args}) => {
        try {
            if (message) {args[0] = args[0].toLowerCase()}
            if (args[0] == 'depositar' || args[0] == 'deposit') {
                try {
                    var quantity = await specialArg(args[1], user.id, "falcoins")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                }
    
                if (await readFile(user.id, 'falcoins') >= quantity && quantity > 0) {
                    await takeAndGive(user.id, user.id, 'falcoins', 'banco', quantity)
    
                    const embed = new MessageEmbed()
                     .setTitle(instance.messageHandler.get(guild, "BANCO_DEPOSITOU", {VALUE: await format(quantity)}))
                     .setColor(await getRoleColor(guild, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await readFile(user.id, "falcoins", true)} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO"), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await readFile(user.id, "banco", true)}))
                     .setFooter({text: 'by Falcão ❤️'})
    
                    return embed
                } else {
                    return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                }
            } else if (args[0] == 'sacar' || args[0] == 'withdraw') {
                try {
                    var quantity = await specialArg(args[1], user.id, "Banco")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                }
    
                if (await readFile(user.id, 'banco') >= quantity && quantity > 0) {
                    await takeAndGive(user.id, user.id, 'banco', 'falcoins', quantity)
    
                    const embed = new MessageEmbed()
                     .setTitle(instance.messageHandler.get(guild, "BANCO_SACOU", {VALUE: await format(quantity)}))
                     .setColor(await getRoleColor(guild, user.id))
                     .setAuthor({name: user.username, iconURL: user.avatarURL()})
                     .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await readFile(user.id, "falcoins", true)} falcoins`, inline=false)
                     .addField(instance.messageHandler.get(guild, "BANCO"), instance.messageHandler.get(guild, "BANCO_SALDO", {VALUE: await readFile(user.id, "banco", true)}))
                     .setFooter({text: 'by Falcão ❤️'})
    
                     return embed
                } else {
                    return instance.messageHandler.get(guild, "BANCO_INSUFICIENTE")
                }
            } else {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
        } catch (error) {
            console.error(`bank: ${error}`)
        }
    }
}   
