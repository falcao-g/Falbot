const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['loja', 'shop'],
    category: 'Economia',
    description: 'Show the store',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    expectedArgs: '[number] [quantity]',
    expectedArgsTypes: ['NUMBER', 'NUMBER'],
    options: [
    {
        name: 'number',
        description: 'number of the item you want to buy',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        choices: [{name: 1, value: 1}, {name: 2, value: 2}, {name: 3, value: 3}]
    },
    {
        name: 'quantity',
        description: 'how many items you want to buy',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }
    ],
    callback: async ({instance, guild, user, args}) => {
        try {
            if (args[0] === undefined && args[1] === undefined) {
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(guild, user.id))
                .setTitle('**Loja**')
                .addFields({
                    name: instance.messageHandler.get(guild, "ITEM_1"),
                    value: instance.messageHandler.get(guild, "ITEM_1_DESCRICAO"),
                    inline: false
                }, {
                    name: instance.messageHandler.get(guild, "ITEM_2"),
                    value: instance.messageHandler.get(guild, "ITEM_2_DESCRICAO"),
                    inline: false
                }, {
                    name: instance.messageHandler.get(guild, "ITEM_3"),
                    value: instance.messageHandler.get(guild, "ITEM_3_DESCRICAO"),
                    inline: false
                }, {
                    name: '\u200b',
                    value: instance.messageHandler.get(guild, "LOJA_USO_2"),
                })
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else {
                item = parseInt(args[0])
                if (item <= 0 || item > 3 || item != item) {
                    return instance.messageHandler.get(guild, "LOJA_ITEM_INVALIDO")
                }
    
                amount = parseInt(args[1] || 1)
                if (amount <= 0 || amount != amount) {
                    return instance.messageHandler.get(guild, "LOJA_QUANTIDADE_INVALIDA")
                }
    
                if (amount > 100) {
                    return instance.messageHandler.get(guild, "LOJA_LIMITE")
                }

                if (item === 1) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 5000 * amount) {
                        for (let i = 0; i < amount; i++) {
                            functions.changeJSON(user.id, 'Falcoins', -5000 * amount)
                            functions.changeJSON(user.id, 'Caixas', 1 * amount)
                        }
                        return instance.messageHandler.get(guild, "LOJA_COMPROU_CAIXA", {AMOUNT: amount})
                    } else {
                        return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                    }
                } else if (item === 2) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 20000 * amount) {
                        functions.changeJSON(user.id, 'Falcoins', -20000 * amount)
                        functions.changeJSON(user.id, 'Chaves', 1 * amount)
                        return instance.messageHandler.get(guild, "LOJA_COMPROU_CHAVE", {AMOUNT: amount})
                    } else {
                        return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                    }
                } else if (item === 3) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 50000 * amount) {
                        functions.changeJSON(user.id, 'Falcoins', -50000 * amount)
                        functions.changeJSON(user.id, 'Lootbox', 1000 * amount)
                        return instance.messageHandler.get(guild, "LOJA_COMPROU_AUMENTO", {AMOUNT: amount})
                    } else {
                        return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                    }
                } 
            }
        } catch (error) {
            console.error(`loja: ${error}`)
        }
    }
}   