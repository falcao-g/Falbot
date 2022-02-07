const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'loja com itens que podem te ajudar a ganhar mais falcoins',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    expectedArgs: '[numero] [quantidade]',
    expectedArgsTypes: ['NUMBER', 'NUMBER'],
    options: [
    {
        name: 'numero',
        description: 'numero do item que você deseja comprar',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        choices: [{name: 1, value: 1}, {name: 2, value: 2}, {name: 3, value: 3}]
    },
    {
        name: 'quantidade',
        description: 'quantos desse item você deseja comprar',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }
    ],
    callback: async ({message, interaction, user, args}) => {
        try {
            if (args[0] === undefined && args[1] === undefined) {
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                .setTitle('**Loja**')
                .addFields({
                    name: 'Item número 1: Caixa',
                    value: 'Pelo custo de 5.000 falcoins você compra uma caixa que pode ser aberta usando uma chave',
                    inline: false
                }, {
                    name: 'Item número 2: Chave',
                    value: 'Pelo custo de 20.000 falcoins você compra uma chave que pode ser usada para abrir uma caixa',
                    inline: false
                }, {
                    name: 'Item número 3: Aumento de lootbox',
                    value: 'Pelo custo de 50.000 falcoins você aumenta seu ganho na lootbox em 1000 falcoins',
                    inline: false
                }, {
                    name: '\u200b',
                    value: 'Use `?loja [numero] [quantidade]` para comprar um item',
                })
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else {
                item = parseInt(args[0])
                if (item <= 0 || item > 3 || item != item) {
                    return 'item inválido! :rage:'
                }
    
                amount = parseInt(args[1] || 1)
                if (amount <= 0 || amount != amount) {
                    return 'quantidade inválida! coloque um número positivo ou deixe em branco para comprar 1 :face_with_monocle:'
                }
    
                if (amount > 100) {
                    return 'calma lá amigão, o limite é 100 itens por vez :wink:'
                }

                if (item === 1) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 5000 * amount) {
                        for (let i = 0; i < amount; i++) {
                            functions.changeJSON(user.id, 'Falcoins', -5000 * amount)
                            functions.changeJSON(user.id, 'Caixas', 1 * amount)
                        }
                        return `Parabéns! Você comprou ${amount} caixas :star_struck:`
                    } else {
                        return 'você não tem falcoins suficiente para comprar esse item! :rage:'
                    }
                } else if (item === 2) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 20000 * amount) {
                        functions.changeJSON(user.id, 'Falcoins', -20000 * amount)
                        functions.changeJSON(user.id, 'Chaves', 1 * amount)
                        return `Parabéns! Você comprou ${amount} chaves :star_struck:`
                    } else {
                        return 'você não tem falcoins suficiente para comprar esse item! :rage:'
                    }
                } else if (item === 3) {
                    if (await functions.readFile(user.id, 'Falcoins') >= 50000 * amount) {
                        functions.changeJSON(user.id, 'Falcoins', -50000 * amount)
                        functions.changeJSON(user.id, 'Lootbox', 1000 * amount)
                        return `Parabéns! Você comprou ${amount} aumentos da lootbox :star_struck:`
                    } else {
                        return 'você não tem falcoins suficiente para comprar esse item! :rage:'
                    }
                } 
            }
        } catch (error) {
            console.error(`loja: ${error}`)
        }
    }
}   