const Discord = require('discord.js')
const functions = require('../functions.js')
const Board = require('tictactoe-board')

module.exports =  {
    category: 'Economia',
    description: 'desafie um usuario para um jogo da velha, o vencedor leva tudo',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    expectedArgs: '<usuario> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    options: [{
        name: 'usuario',
        description: 'o usuario que você ira desafiar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    },
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }   
    ],
    callback: async ({message, interaction, client, args}) => {
        try {
            var board = new Board.default()
            functions.createUser(message ? message.author.id : interaction.user.id)
            const author = message ? message.author : interaction.user
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            functions.createUser(args[0])
            const member = await functions.getMember(message ? message : interaction, args[0])
            if (member.user != author) {
                try {
                    var bet = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                } 
                if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= bet && await functions.readFile(member.user.id, 'Falcoins') >= bet && bet > 0) {
                    if (message) {
                        var answer = await message.reply({
                            content: `${author.username} chamou ${member.user.username} para um jogo da velha apostando ${await functions.format(bet)} falcoins :older_woman:`
                        })
                    } else {
                        var answer = await interaction.reply({
                            content: `${author.username} chamou ${member.user.username} para um jogo da velha apostando ${await functions.format(bet)} falcoins :older_woman:`,
                            fetchReply: true
                        })
                    }
                    answer.react('✅')
                    answer.react('🚫')
    
                    const filter = (reaction, user) => {
                        return user.id === member.user.id && user.id !== client.user.id
                    }
    
                    const collector = answer.createReactionCollector({
                        filter,
                        max: 1,
                        time: 1000 * 300
                    })
    
                    collector.on('end', async collected => {
                        if (collected.size === 0) {
                            if (message) {
                                message.reply({
                                    content: `Jogo da velha cancelado. ${member} demorou muito para aceitar! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Jogo da velha cancelado. ${member} demorou muito para aceitar! :confounded:`
                                })
                            }
                            return
                        } else if (collected.first()._emoji.name === '🚫') {
                            if (message) {
                                message.reply({
                                    content: `Jogo da velha cancelado. ${member} recusou o desafio! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Jogo da velha cancelado. ${member} recusou o desafio! :confounded:`
                                })
                            }
                        }else {
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Jogo da velha')
                            .setDescription(`turno de: **${author.username} [${board.currentMark()}]**`)
                            .addField('\u200B', `:one: | :two: | :three: \n────────\n:four: | :five: | :six: \n────────\n:seven: | :eight: | :nine:`)
                            .setFooter('by Falcão ❤️')
                            .setColor('#0099ff')
                            if (message) {
                                var answer2 = await message.reply({
                                    embeds: [embed]
                                }) 
                            } else {
                                var answer2 = await interaction.reply({
                                    embeds: [embed],
                                    fetchReply: true
                                })
                            }
                            await answer2.react('1️⃣')
                            await answer2.react('2️⃣')
                            await answer2.react('3️⃣')
                            await answer2.react('4️⃣')
                            await answer2.react('5️⃣')
                            await answer2.react('6️⃣')
                            await answer2.react('7️⃣')
                            await answer2.react('8️⃣')
                            await answer2.react('9️⃣')

                            const filter2 = (reaction, user) => {
                                if (user.id === author.id && user.id !== client.user.id && board.currentMark() === 'X') {
                                    return true
                                } else if (user.id === member.user.id && user.id !== client.user.id && board.currentMark() === 'O') {
                                    return true
                                }
                            }
            
                            const collector2 = answer2.createReactionCollector({
                                filter: filter2,
                                max: 9,
                                time: 1000 * 60 * 60
                            })

                            collector2.on('collect', async reaction => {
                                if (reaction._emoji.name === '1️⃣') {
                                    board = board.makeMove(1, board.currentMark())
                                } else if (reaction._emoji.name === '2️⃣') {
                                    board = board.makeMove(2, board.currentMark())
                                } else if (reaction._emoji.name === '3️⃣') {
                                    board = board.makeMove(3, board.currentMark())
                                } else if (reaction._emoji.name === '4️⃣') {
                                    board = board.makeMove(4, board.currentMark())
                                } else if (reaction._emoji.name === '5️⃣') {
                                    board = board.makeMove(5, board.currentMark())
                                } else if (reaction._emoji.name === '6️⃣') {
                                    board = board.makeMove(6, board.currentMark())
                                } else if (reaction._emoji.name === '7️⃣') {
                                    board = board.makeMove(7, board.currentMark())
                                } else if (reaction._emoji.name === '8️⃣') {
                                    board = board.makeMove(8, board.currentMark())
                                } else if (reaction._emoji.name === '9️⃣') {
                                    board = board.makeMove(9, board.currentMark())
                                }

                                const embed2 = new Discord.MessageEmbed()
                                .setTitle('Jogo da velha')
                                .setDescription(`turno de: **${board.currentMark() === 'X' ? author.username : member.user.username} [${board.currentMark()}]**`)
                                .addField('\u200B', `${board.isPositionTaken(1) ? (board.markedBoardPositionValue(1) === 'X' ? ':x:' : ':o:') : ':one:'} | ${board.isPositionTaken(2) ? (board.markedBoardPositionValue(2) === 'X' ? ':x:' : ':o:') : ':two:'} | ${board.isPositionTaken(3) ? (board.markedBoardPositionValue(3) === 'X' ? ':x:' : ':o:') : ':three:'} \n────────\n${board.isPositionTaken(4) ? (board.markedBoardPositionValue(4) === 'X' ? ':x:' : ':o:') : ':four:'} | ${board.isPositionTaken(5) ? (board.markedBoardPositionValue(5) === 'X' ? ':x:' : ':o:') : ':five:'} | ${board.isPositionTaken(6) ? (board.markedBoardPositionValue(6) === 'X' ? ':x:' : ':o:') : ':six:'} \n────────\n${board.isPositionTaken(7) ? (board.markedBoardPositionValue(7) === 'X' ? ':x:' : ':o:') : ':seven:'} | ${board.isPositionTaken(8) ? (board.markedBoardPositionValue(8) === 'X' ? ':x:' : ':o:') : ':eight:'} | ${board.isPositionTaken(9) ? (board.markedBoardPositionValue(9) === 'X' ? ':x:' : ':o:') : ':nine:'}`)
                                .setFooter('by Falcão ❤️')
                                .setColor('#0099ff')

                                await answer2.edit({
                                    embeds: [embed2]
                                })

                                if (board.isGameOver()) {
                                    collector2.stop()
                                }
                            })

                            collector2.on('end', async collected => {
                                if (board.hasWinner()) {
                                    const embed2 = new Discord.MessageEmbed()
                                    .setTitle('Jogo da velha')
                                    .setDescription(`**${board.winningPlayer() === 'X' ? author.username : member.user.username} ganhou ${bet} falcoins**`)
                                    .addField('\u200B', `${board.isPositionTaken(1) ? (board.markedBoardPositionValue(1) === 'X' ? ':x:' : ':o:') : ':one:'} | ${board.isPositionTaken(2) ? (board.markedBoardPositionValue(2) === 'X' ? ':x:' : ':o:') : ':two:'} | ${board.isPositionTaken(3) ? (board.markedBoardPositionValue(3) === 'X' ? ':x:' : ':o:') : ':three:'} \n────────\n${board.isPositionTaken(4) ? (board.markedBoardPositionValue(4) === 'X' ? ':x:' : ':o:') : ':four:'} | ${board.isPositionTaken(5) ? (board.markedBoardPositionValue(5) === 'X' ? ':x:' : ':o:') : ':five:'} | ${board.isPositionTaken(6) ? (board.markedBoardPositionValue(6) === 'X' ? ':x:' : ':o:') : ':six:'} \n────────\n${board.isPositionTaken(7) ? (board.markedBoardPositionValue(7) === 'X' ? ':x:' : ':o:') : ':seven:'} | ${board.isPositionTaken(8) ? (board.markedBoardPositionValue(8) === 'X' ? ':x:' : ':o:') : ':eight:'} | ${board.isPositionTaken(9) ? (board.markedBoardPositionValue(9) === 'X' ? ':x:' : ':o:') : ':nine:'}`)
                                    .setFooter('by Falcão ❤️')
                                    .setColor('#0099ff')
                                    if(board.winningPlayer() === 'X') {
                                        embed2.setDescription(`${author.username} ganhou ${bet} falcoins`)
                                        functions.changeJSON(author.id, 'Falcoins', bet)
                                        functions.changeJSON(author.id, 'Vitorias', 1)
                                        functions.changeJSON(member.id, 'Falcoins', -bet)
                                    } else {
                                        embed2.setDescription(`${member.user.username} ganhou ${bet} falcoins`)
                                        functions.changeJSON(member.id, 'Falcoins', bet)
                                        functions.changeJSON(member.id, 'Vitorias', 1)
                                        functions.changeJSON(author.id, 'Falcoins', -bet)
                                    }
                                    await answer2.edit({
                                        embeds: [embed2]
                                    })  
                                } else {
                                    const embed2 = new Discord.MessageEmbed()
                                    .setTitle('Jogo da velha')
                                    .setDescription(`**O jogo empatou**`)
                                    .addField('\u200B', `${board.isPositionTaken(1) ? (board.markedBoardPositionValue(1) === 'X' ? ':x:' : ':o:') : ':one:'} | ${board.isPositionTaken(2) ? (board.markedBoardPositionValue(2) === 'X' ? ':x:' : ':o:') : ':two:'} | ${board.isPositionTaken(3) ? (board.markedBoardPositionValue(3) === 'X' ? ':x:' : ':o:') : ':three:'} \n────────\n${board.isPositionTaken(4) ? (board.markedBoardPositionValue(4) === 'X' ? ':x:' : ':o:') : ':four:'} | ${board.isPositionTaken(5) ? (board.markedBoardPositionValue(5) === 'X' ? ':x:' : ':o:') : ':five:'} | ${board.isPositionTaken(6) ? (board.markedBoardPositionValue(6) === 'X' ? ':x:' : ':o:') : ':six:'} \n────────\n${board.isPositionTaken(7) ? (board.markedBoardPositionValue(7) === 'X' ? ':x:' : ':o:') : ':seven:'} | ${board.isPositionTaken(8) ? (board.markedBoardPositionValue(8) === 'X' ? ':x:' : ':o:') : ':eight:'} | ${board.isPositionTaken(9) ? (board.markedBoardPositionValue(9) === 'X' ? ':x:' : ':o:') : ':nine:'}`)
                                    .setFooter('by Falcão ❤️')
                                    .setColor('#0099ff')
                                    await answer2.edit({
                                        embeds: [embed2]
                                    })  
                                }
                            })
                        }
                    })
                } else if (bet <= 0) {
                    return `${bet} não é um valor válido... :rage:`
                } else {
                    return 'Saldo insuficiente em uma das contas! :grimacing:'
                }
            } else {
                return 'Você não pode jogar com você mesmo, espertinho :rage:'
            }
        } catch (error) {
            console.log(`velha: ${error}`)
        }
    }
}   