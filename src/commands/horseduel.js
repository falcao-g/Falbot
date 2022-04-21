const Discord = require('discord.js')
const functions = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['cavalgada'],
    category: 'Economia',
    description: 'challenge other users to a horse duel',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<falcoins>',
    expectedArgsTypes: ['STRING'], 
    options: [
    {
        name: 'falcoins',
        description: 'the amount of falcoins to bet',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }   
    ],
    callback: async ({instance, guild, message, interaction, client, user, args}) => {
        try {
            const author = user
            try {
                var bet = await functions.specialArg(args[0], user.id, "falcoins")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            } 
            if (await functions.readFile(user.id, 'falcoins') >= bet) {
                var pot = bet
                const embed = new Discord.MessageEmbed()
                .setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
                .setDescription(instance.messageHandler.get(guild, "CAVALGADA_DESAFIO", {USER: author.username}))
                .setColor('#0099ff')
                .addFields({
                    name: instance.messageHandler.get(guild, "APOSTA"),
                    value: `${pot} Falcoins`,
                    inline: false
                }, {
                    name: instance.messageHandler.get(guild, "JOGADORES"),
                    value: `${author}`,
                    inline: false
                })
                .setFooter({text: 'by Falcão ❤️'})
                if (message) {
                    var answer = await message.reply({
                        embeds: [embed]
                    })
                } else {
                    var answer = await interaction.reply({
                        embeds: [embed],
                        fetchReply: true
                    })
                }
                answer.react('✅')
                await functions.changeDB(author.id, 'falcoins', -bet)

                var users = [author]
                var path = ['- - - - -']

                const filter = async (reaction, user) => {
                    return await functions.readFile(user.id, 'falcoins') >= bet && reaction.emoji.name === '✅'  && user.id !== client.user.id && !users.includes(user)
                }

                const collector = answer.createReactionCollector({
                    filter,
                    time: 1000 * 60
                })

                collector.on('collect', async (reaction, user) => {
                    await functions.changeDB(user.id, 'falcoins', -bet)
                    users.push(user)
                    path.push('- - - - -')
                    pot += bet
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
                    .setDescription(instance.messageHandler.get(guild, "CAVALGADA_DESAFIO", {USER: author.username}))
                    .setColor('#0099ff')
                    .addFields({
                        name: instance.messageHandler.get(guild, "APOSTA"),
                        value: `${pot} Falcoins`,
                        inline: false
                    }, {
                        name: instance.messageHandler.get(guild, "JOGADORES"),
                        value: `${users.join('\n')}`,
                        inline: false
                    })
                .setFooter({text: 'by Falcão ❤️'})
                    answer.edit({
                        embeds: [embed2]
                    })
                })

                collector.on('end', async () => {
                    loop1:
                    while (true) {
                        var luck = functions.randint(0, users.length - 1)
                        path[luck] = path[luck].slice(0, -2)

                        var frase = ''
                        for (let i = 0; i < path.length; i++) {
                            frase += `${users[i]}\n:checkered_flag: ${path[i]}:horse_racing:\n`
                        }

                        var embed2 = new Discord.MessageEmbed()
                        .setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
                        .addFields({
                            name: instance.messageHandler.get(guild, "APOSTA"),
                            value: `${pot} Falcoins`,
                            inline: false
                        }, {
                            name: instance.messageHandler.get(guild, "JOGADORES"),
                            value: `${frase}`,
                            inline: false
                        })
                        .setFooter({text: 'by Falcão ❤️'})
                        await answer.edit({
                            embeds: [embed2]
                        })
                        await new Promise(resolve => setTimeout(resolve, 250));

                        for (let i = 0; i < path.length; i++) {
                            if (path[i] === '') {
                                break loop1;
                            }
                        }
                    }
                        for (let i = 0; i < path.length; i++) {
                            if (path[i] === '') {
                                var winner_path = i
                                break
                        }
                }
                var winner = users[winner_path]
                await functions.changeDB(winner.id, 'falcoins', pot)
                await functions.changeDB(winner.id, 'vitorias')
                var embed3 = new Discord.MessageEmbed()
                .setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
                .setDescription(instance.messageHandler.get(guild, "GANHOU", {WINNER: winner, FALCOINS: pot}))
                .setColor(3066993)
                .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await functions.readFile(winner.id, 'falcoins', true)} falcoins`, false)
                .setFooter({text: 'by Falcão ❤️'})
                if (message) {
                    await message.reply({
                        embeds: [embed3]
                    })
                } else {
                    await interaction.followUp({
                        embeds: [embed3]
                    })
                }
                })
            } else {
                return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
            }
        } catch (error) {
            console.error(`Cavalgada: ${error}`)
        }
    }
}   