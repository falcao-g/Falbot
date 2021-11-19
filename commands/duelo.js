const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'desafie um usuario para uma cavalgada, o vencedor leva tudo',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: false,
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
    callback: async ({message, interaction, channel, args}) => {
        try {
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
            var member = await functions.getMember(message ? message : interaction, args[0])
            if (member.user != author) {
                try {
                    var bet = await functions.specialArg(args[1], message ? message.author.id : interaction.user.id)
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                } 
                if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= bet && await functions.readFile(member.user.id, 'Falcoins') >= bet && bet > 0) {
                    if (message) {
                        var answer = await message.reply({
                            content: `${author.username} chamou ${member.user.username} para uma cavalgada apostando ${await functions.format(bet)} falcoins :smiling_imp:`
                        })
                    } else {
                        var answer = await interaction.reply({
                            content: `${author.username} chamou ${member.user.username} para uma cavalgada apostando ${await functions.format(bet)} falcoins :smiling_imp:`,
                            fetchReply: true
                        })
                    }
                    answer.react('✅')
                    answer.react('🚫')
    
                    const filter = (reaction, user) => {
                        return user.id === member.user.id
                    }
    
                    const collector = answer.createReactionCollector({
                        filter,
                        max: 1,
                        time: 1000 * 60
                    })
    
                    collector.on('end', async collected => {
                        if (collected.size === 0) {
                            if (message) {
                                message.reply({
                                    content: `Cavalgada cancelada. ${member} demorou muito para aceitar! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Cavalgada cancelada. ${member} demorou muito para aceitar! :confounded:`
                                })
                            }
                            return
                        } else if (collected.first()._emoji.name === '🚫') {
                            if (message) {
                                message.reply({
                                    content: `Duelo cancelado. ${member} recusou a cavalgada! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Duelo cancelado. ${member} recusou a cavalgada! :confounded:`
                                })
                            }
                        } else {
                            player_1 = '- - - - -'
                            player_2 = '- - - - -'
                            const embed = new Discord.MessageEmbed()
                             .addField('Duelo', `:checkered_flag: ${player_1} :horse_racing: ${author}\n:checkered_flag: ${player_2} :horse_racing: ${member}`)
                             .setColor(10181046)
                             .setFooter('by Falcão ❤️')
                            if (message) {
                                var answer = await message.reply({
                                    embeds: [embed]
                                })
                            } else {
                                var answer = await interaction.channel.send({
                                    embeds: [embed]
                                })
                            }
    
                            for (let i = 0; i <= 9; i++) {
                                const run = Math.round(Math.random())
                                if (run === 0) {
                                    player_1 = player_1.slice(0, -2)
                                } else {
                                    player_2 = player_2.slice(0, -2)
                                }
    
                                embed.fields[0] = {'name': 'Duelo', 'value': `:checkered_flag: ${player_1} :horse_racing: ${author}\n:checkered_flag: ${player_2} :horse_racing: ${member}`}
                                await answer.edit({
                                    embeds: [embed]
                                })
    
                                if (player_1 === '' || player_2 === '') {break}
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
    
                            if (player_1 === '') {
                                winner = author
                                functions.changeJSON(member.user.id, 'Falcoins', -bet)
                                functions.changeJSON(author.id, 'Falcoins', bet)
                                functions.changeJSON(author.id, 'Vitorias')
                            } else {
                                winner = member.user
                                functions.changeJSON(author.id, 'Falcoins', -bet)
                                functions.changeJSON(member.user.id, 'Falcoins', bet)
                                functions.changeJSON(member.user.id, 'Vitorias')
                            }
                            const embed2 = new Discord.MessageEmbed()
                            .setColor(10181046)
                            .addFields({
                                name: `${winner.username} ganhou!`,
                                value: `Você ganhou ${await functions.format(bet)}`,
                                inline: false
                            }, {
                                name: 'Saldo atual',
                                value: `${await functions.format(await functions.readFile(winner.id, 'Falcoins'))} falcoins`,
                                inline: false
                            })
                            .setFooter('by Falcão ❤️')
                            if (message) {
                                await channel.send({
                                    embeds: [embed2]
                                })
                            } else {
                            await interaction.followUp({
                                embeds: [embed2]
                            })
                            }
                        }
                    })
                    
                } else if (bet <= 0) {
                    return `${bet} não é um valor válido... :rage:`
                } else {
                    return 'Saldo insuficiente em uma das contas! :grimacing:'
                }
            } else {
                return 'Você não pode cavalgar com você mesmo, espertinho :rage:'
            }
        } catch (error) {
            console.log('duelo:', error)
        }
    }
}   
