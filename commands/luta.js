const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'desafie um usuario para uma luta, o vencedor leva tudo',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 2,
    expectedArgs: '<usuario> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`luta {ARGUMENTS}',
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
    callback: async ({message, interaction, args}) => {
        try {
            const author = message ? message.author : interaction.user
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
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
                            content: `${author.username} chamou ${member.user.username} para uma luta apostando ${await functions.format(bet)} falcoins :smiling_imp:`
                        })
                    } else {
                        var answer = await interaction.reply({
                            content: `${author.username} chamou ${member.user.username} para uma luta apostando ${await functions.format(bet)} falcoins :smiling_imp:`,
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
                                    content: `Duelo cancelado. ${member} demorou muito para aceitar! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Duelo cancelado. ${member} demorou muito para aceitar! :confounded:`
                                })
                            }
                            return
                        } else if (collected.first()._emoji.name === '🚫') {
                            if (message) {
                                message.reply({
                                    content: `Duelo cancelado. ${member} recusou o duelo! :confounded:`
                                }) 
                            } else {
                                interaction.channel.send({
                                    content: `Duelo cancelado. ${member} recusou o duelo! :confounded:`
                                })
                            }
                            return
                        } else {
                            const attacks = ['instantâneo', 'stun', 'roubo de vida', 'cura', 'self', 'escudo']
                            const player_1 = {
                                hp: 100,
                                name: author.username,
                                stunned: false,
                                mention: author,
                                id: author.id,
                                escudo: false
                            }
                            const player_2 = {
                                hp: 100,
                                name: member.user.username,
                                stunned: false,
                                mention: member,
                                id: member.id,
                                escudo: false
                            }
                            const luck = Math.round(Math.random())
                            if (luck === 0) {
                                var order = [player_1, player_2]
                            } else {
                                var order = [player_2, player_1]
                            }
    
                            while (order[0]['hp'] > 0 && order[1]['hp'] > 0) {
                                for (let i = 0; i < order.length; i++) {
                                    if (order[0]['hp'] <= 0 || order[1]['hp'] <= 0) {break}
    
                                    if (order[i]['stunned'] === true) {
                                        order[i]['stunned'] = false
                                        continue
                                    }
    
                                    if (order[i]['escudo'] === true) {
                                        order[i]['escudo'] = false
                                    }
    
                                    const attack = attacks[functions.randint(0, attacks.length-1)]
                                    const luck = functions.randint(1,50)
    
                                    if (i === 0) {
                                        var embed = new Discord.MessageEmbed()
                                        .setColor(3447003)
                                        var me = 0
                                        var enemy =  1
                                    } else {
                                        var embed = new Discord.MessageEmbed()
                                        .setColor(15105570)
                                        var me = 1
                                        var enemy =  0
                                    }
    
                                    if (attack === 'instantâneo') {
                                        if (order[enemy]['escudo'] != true) {
                                            order[enemy]['hp'] -= luck
                                        }
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} dá **${luck}** de dano ao inimigo`, false)
                                    } else if (attack === 'stun') {
                                        if (order[enemy]['escudo'] != true) {
                                            order[enemy]['hp'] -= luck
                                            order[enemy]['stunned'] = true
                                        }
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} dá **${luck}** de dano ao inimigo e o deixa nocauteado`, false)
                                    } else if (attack === 'roubo de vida') {
                                        if (order[enemy]['escudo'] != true) {
                                            order[enemy]['hp'] -= luck
                                            order[me]['hp'] += luck
                                        }
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} rouba **${luck}** de vida do inimigo`, false)
                                    } else if (attack === 'cura') {
                                        order[i]['hp'] += luck
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} se cura em **${luck}** de vida`, false)
                                    } else if (attack === 'self') {
                                        order[i]['hp'] -= luck
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} acidentalmente dá **${luck}** de dano em si mesmo`, false)
                                    } else if (attack === 'escudo') {
                                        order[i]['escudo'] = true
                                        embed.addField(`${order[i]['name']} ataca`, `[${attack}] ${order[i]['mention']} se protege`, false)
                                    }
    
                                    if (order[i]['hp'] > 100) {
                                        order[i]['hp'] = 100
                                    }
    
                                    embed.addField('HP', `${order[0]['mention']}: ${order[0]['hp']} hp\n${order[1]['mention']}: ${order[1]['hp']} hp`)
                                    if (message) {
                                        var answer = await message.channel.send({
                                            embeds: [embed]
                                        })
                                    } else {
                                        var answer = await interaction.channel.send({
                                            embeds: [embed]
                                        })
                                    }
                                    await new Promise(resolve => setTimeout(resolve, 2500));
                                }
                            }
                            const embed2 = new Discord.MessageEmbed()
                            .setColor(3066993)
                            .setFooter('by Falcão ❤️')
                            if (order[0]['hp'] <= 0) {
                                await functions.takeAndGiveAndWin(order[0]['id'], order[1]['id'], 'Falcoins', 'Falcoins', bet)
                                embed2.addField(`${order[1]['name']} ganhou`, `Você derrotou ${order[0]['mention']} em uma luta`, false)
                                embed2.addField('Saldo atual', `${await functions.format(await functions.readFile(order[1]['id'], 'Falcoins') + bet)} falcoins`)
                            }  else if (order[1]['hp'] <= 0) {
                                await functions.takeAndGiveAndWin(order[0]['id'], order[1]['id'], 'Falcoins', 'Falcoins', bet)
                                embed2.addField(`${order[1]['name']} ganhou`, `Você derrotou ${order[0]['mention']} em uma luta`, false)
                                embed2.addField('Saldo atual', `${await functions.format(await functions.readFile(order[1]['id'], 'Falcoins') + bet)} falcoins`)
                            }
                            if (message) {
                                await message.channel.send({
                                    embeds: [embed2]
                                })
                            } else {
                                await interaction.channel.send({
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
                return 'Você não pode lutar com você mesmo, espertinho :rage:'
            }
        } catch (error) {
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'algum dos participantes não possui um registro! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('luta:', error)
            }
        }
    }
}   