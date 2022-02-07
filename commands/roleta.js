const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'aposte seu dinheiro na roleta',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 2,
    expectedArgs: '<tipo> <falcoins>',
    expectedArgsTypes: ['STRING', 'STRING'],
    options: [{
        name:'tipo',
        description: 'tipo de aposta <preto/vermelho/verde>, <0-36>, <altos/baixos>, <par/impar>',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, user, args}) => {
        try {
            args[0] = args[0].toLowerCase()
            if (args[0] === 'ímpar') {args[0] = 'impar'}
    
            if (args[0] == 'preto' || args[0] == 'vermelho' || args[0] == 'verde' || args[0] == 'altos' || args[0] == 'baixos' || args[0] == 'par' || args[0] == 'impar' || (parseInt(args[0]) >=0 && parseInt(args[0]) <= 36)) {
                try {
                    var bet = await functions.specialArg(args[1], user.id)
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                }
    
                if (await functions.readFile(user.id, 'Falcoins') >= bet && bet > 0) {
    
                    const types = {
                        verde: [0],
                        vermelho: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
                        preto: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
                        baixos: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
                        altos: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
                        impar: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
                        par: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
                        number: [parseInt(args[0])]
                    }
    
                    if (parseInt(args[0]) === parseInt(args[0])) {
                        var type = types['number']
                        var profit = bet * 35
                    } else {
                        var type = types[args[0]]
                        var profit = bet * 2
                    }
    
                    const luck = functions.randint(0, 36)
    
                    if (type.includes(luck)) {
                        functions.changeJSON(user.id, 'Falcoins', profit-bet)
                        var embed = new Discord.MessageEmbed()
                         .setColor(3066993)
                         .setAuthor({name: user.username, iconURL: user.avatarURL()})
                         .addFields({
                             name: 'Você ganhou! :sunglasses:',
                             value: `O bot rolou **${luck}**`,
                             inline: true
                         }, {
                             name: '\u200b',
                             value: '\u200b',
                             inline: true
                         }, {
                             name:'Lucros',
                             value:`${await functions.format(profit)} falcoins`,
                             inline: true
                         })
                         .addField('Saldo atual', `${await functions.format(await functions.readFile(user.id, 'Falcoins'))} falcoins`, false)
                    } else {
                        functions.changeJSON(user.id, 'Falcoins', -bet  )
                        var embed = new Discord.MessageEmbed()
                         .setColor(15158332)
                         .setAuthor({name: user.username, iconURL: user.avatarURL()})
                         .addFields({
                             name: 'Você perdeu! :pensive:',
                             value: `O bot rolou **${luck}**`,
                             inline: true
                         }, {
                             name: '\u200b',
                             value: '\u200b',
                             inline: true
                         }, {
                             name:'Perdas',
                             value:`${await functions.format(bet)} falcoins`,
                             inline: true
                        })
                        embed.addField('Saldo atual', `${await functions.format(await functions.readFile(user.id, 'Falcoins'))} falcoins`, false)
                    }
                    embed.setFooter({text: 'by Falcão ❤️'})
                    return embed
                } else if (bet <= 0) {
                    return `${bet} não é um valor rápido... :rage:`
                } else {
                    return `${user} você não tem falcoins suficiente para esta aposta! :rage:`
                }
            } else {
                return `${args[0]} não é um tipo de aposta válido`
            }
        } catch (error) {
            console.error(`roleta: ${error}`)
        }
    }
}   