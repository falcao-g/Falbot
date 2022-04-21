const Discord = require('discord.js')
const functions = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['luta'],
    category: 'Economia',
    description: 'challenge someone to a fight, win the fight and get the money',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 2,
    expectedArgs: '<user> <falcoins>',
    expectedArgsTypes: ['USER', 'STRING'],
    options: [{
        name: 'user',
        description: 'the user to challenge',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    },
    {
        name: 'falcoins',
        description: 'the amount of falcoins to bet',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }   
    ],
    callback: async ({instance, guild, message, interaction, user, args}) => {
        try {
            const author = user
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            var member = await functions.getMember(guild, args[0])
            if (member.user != author) {
                try {
                    var bet = await functions.specialArg(args[1], user.id, "falcoins")
                } catch {
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[1]})
                } 
                if (await functions.readFile(user.id, 'falcoins') >= bet && await functions.readFile(member.user.id, 'falcoins') >= bet && bet > 0) {
                    if (message) {
                        var answer = await message.reply({
                            content: instance.messageHandler.get(guild, "LUTA_CONVITE", {USER: author.username, USER2: member.user.username, FALCOINS: await functions.format(bet)}),
                        })
                    } else {
                        var answer = await interaction.reply({
                            content: instance.messageHandler.get(guild, "LUTA_CONVITE", {USER: author.username, USER2: member.user.username, FALCOINS: await functions.format(bet)}),
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
                                    content: instance.messageHandler.get(guild, "LUTA_CANCELADO_DEMOROU", {VALUE: member})
                                }) 
                            } else {
                                interaction.followUp({
                                    content: instance.messageHandler.get(guild, "LUTA_CANCELADO_DEMOROU", {VALUE: member})
                                })
                            }
                        } else if (collected.first()._emoji.name === '🚫') {
                            if (message) {
                                message.reply({
                                    content: instance.messageHandler.get(guild, "LUTA_CANCELADO_RECUSOU", {VALUE: member})
                                }) 
                            } else {
                                interaction.followUp({
                                    content: instance.messageHandler.get(guild, "LUTA_CANCELADO_RECUSOU", {VALUE: member})
                                })
                            }
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
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "ATAQUE", {VALUE: luck}), false)
                                    } else if (attack === 'stun') {
                                        if (order[enemy]['escudo'] != true) {
                                            order[enemy]['hp'] -= luck
                                            order[enemy]['stunned'] = true
                                        }
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "ATAQUE_NOCAUTE", {VALUE: luck}), false)
                                    } else if (attack === 'roubo de vida') {
                                        if (order[enemy]['escudo'] != true) {
                                            order[enemy]['hp'] -= luck
                                            order[me]['hp'] += luck
                                        }
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "ROUBO_VIDA", {VALUE: luck}), false)
                                    } else if (attack === 'cura') {
                                        order[i]['hp'] += luck
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "CURA", {VALUE: luck}), false)
                                    } else if (attack === 'self') {
                                        order[i]['hp'] -= luck
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "SELF", {VALUE: luck}), false)
                                    } else if (attack === 'escudo') {
                                        order[i]['escudo'] = true
                                        embed.addField(`${order[i]['name']} ` + instance.messageHandler.get(guild, "ATACA"), `${order[i]['mention']} ` + instance.messageHandler.get(guild, "SE_PROTEGE"), false)
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
                            .setFooter({text: 'by Falcão ❤️'})
                            if (order[0]['hp'] <= 0) {
                                await functions.changeDB(order[0]['id'], 'falcoins', -bet)
                                await functions.changeDB(order[1]['id'], 'falcoins', bet)
                                await functions.changeDB(order[1]['id'], 'vitorias')
                                embed2.addField(`${order[1]['name']}` + instance.messageHandler.get(guild, "GANHO"), instance.messageHandler.get(guild, "LUTA_DERROTOU", {USER: order[0]['mention']}), false)
                                embed2.addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.readFile(order[1]['id'], 'falcoins', true)} falcoins`)
                            }  else if (order[1]['hp'] <= 0) {
                                await functions.changeDB(order[1]['id'], 'falcoins', -bet)
                                await functions.changeDB(order[0]['id'], 'falcoins', bet)
                                await functions.changeDB(order[0]['id'], 'vitorias')
                                embed2.addField(`${order[0]['name']}` + instance.messageHandler.get(guild, "GANHO"), instance.messageHandler.get(guild, "LUTA_DERROTOU", {USER: order[1]['mention']}), false)
                                embed2.addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.readFile(order[0]['id'], 'falcoins', true)} falcoins`)
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
                } else {
                    return instance.messageHandler.get(guild, "INSUFICIENTE_CONTAS")
                }
            } else {
                return instance.messageHandler.get(guild, "NAO_JOGAR_SOZINHO")
            }
        } catch (error) {
            console.error(`fight: ${error}`)
        }
    }
}   