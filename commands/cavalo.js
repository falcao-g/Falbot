const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'adivinhe qual cavalo é o vencedor',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: false,
    minArgs: 2,
    expectedArgs: '<numedo_do_cavalo> <falcoins>',
    expectedArgsTypes: ['NUMBER', 'STRING'],
    options: [{
        name: 'numero_do_cavalo',
        description: 'numero do cavalo que você vai apostar (1-5)',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
        choices: [{name: 1, value: 1}, {name: 2, value: 2}, {name: 3, value: 3}, {name: 4, value: 4}, {name: 5, value: 5}]
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, args}) => {
        try {
            functions.createUser(message ? message.author.id : interaction.user.id)
            try {
                var bet = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
            } catch {
                return `${args[1]} não é um valor válido... :rage:`
            }
            if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= bet && bet > 0) {
                if (args[0] >= 1 && args[0] <= 5) {
                    let horse1 = '- - - - -'
                    let horse2 = '- - - - -'
                    let horse3 = '- - - - -'
                    let horse4 = '- - - - -'
                    let horse5 = '- - - - -'
                    const embed = new Discord.MessageEmbed()
                     .addField('Cavalo', `:checkered_flag: ${horse1} :horse_racing:\n\u200b\n:checkered_flag: ${horse2} :horse_racing:\n\u200b\n:checkered_flag: ${horse3} :horse_racing:\n\u200b\n:checkered_flag: ${horse4} :horse_racing:\n\u200b\n:checkered_flag: ${horse5} :horse_racing:`)
                     .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                     .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                     .setFooter('by Falcão ❤️')
                    
                    if (message) {
                        answer = await message.reply({
                            embeds: [embed]
                        })
                    } else {
                        answer = await interaction.reply({
                            embeds: [embed],
                            fetchReply: true
                        })
                    }
        
                    for (let i = 0; i <= 21; i++) {
                        let run = functions.randint(1, 5)
                        if (run === 1) {
                            horse1 = horse1.slice(0, -2)
                        } else if (run === 2) {
                            horse2 = horse2.slice(0, -2)
                        } else if (run === 3) {
                            horse3 = horse3.slice(0, -2)
                        } else if (run === 4) {
                            horse4 = horse4.slice(0, -2)
                        }else {
                            horse5 = horse5.slice(0, -2)
                        }
    
                        embed.fields[0] = {'name': 'Cavalo', 'value': `:checkered_flag: ${horse1} :horse_racing:\n\u200b\n:checkered_flag: ${horse2} :horse_racing:\n\u200b\n:checkered_flag: ${horse3} :horse_racing:\n\u200b\n:checkered_flag: ${horse4} :horse_racing:\n\u200b\n:checkered_flag: ${horse5} :horse_racing:`}
                        await answer.edit({
                            embeds: [embed]
                        })
    
                        if (horse1 === '' || horse2 === '' || horse3 === '' || horse4 === '' || horse5 === '') {break}
                        await new Promise(resolve => setTimeout(resolve, 250));
                    }
    
                    if (horse1 === '') {
                        winner = '1'
                    } else if (horse2 === '') {
                        winner = '2'
                    } else if (horse3 === '') {
                        winner = '3'
                    } else if (horse4 === '') {
                        winner = '4'
                    } else {
                        winner = '5'
                    }
    
                    if (args[0] == winner) {
                        profit = bet * 5
                        functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', profit-bet)
                        var embed2 = new Discord.MessageEmbed()
                         .setColor(3066993)
                         .addField(`Cavalo ${winner} ganhou!`, `Você ganhou ${await functions.format(bet*5)} falcoins`, false)
                    } else {
                        profit = 0
                        functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', -bet)
                        var embed2 = new Discord.MessageEmbed()
                         .setColor(15158332)
                         .addField(`Cavalo ${winner} ganhou!`, `Você perdeu ${await functions.format(bet)} falcoins`, false)
                    }
    
                    embed2.addField('Saldo atual', `${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins'))} falcoins`, false)
                    embed2.setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                    embed2.setFooter('by Falcão ❤️')
                    if (message) {
                        await message.reply({
                            embeds: [embed2]
                        })
                    } else {
                    await interaction.followUp({
                        embeds: [embed2]
                    })
                    }
                }
            } else if (bet <= 0) {
                    return `${bet} não é um valor válido... :rage:`
            } else {
                    return `você não tem falcoins suficientes para esta aposta! :rage:`
                }
        } catch (error) {
            console.log('Cavalo:', error)
        }
    }
}   
