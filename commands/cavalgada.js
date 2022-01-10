const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'desafie um usuario para uma cavalgada, o vencedor leva tudo',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<falcoins>',
    expectedArgsTypes: ['STRING'], 
    options: [
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }   
    ],
    callback: async ({message, interaction, client, args}) => {
        try {
            functions.createUser(message ? message.author.id : interaction.user.id)
            const author = message ? message.author : interaction.user
            try {
                var bet = await functions.specialArg(args[0], message ? message.author.id : interaction.user.id)
            } catch {
                return `${args[1]} não é um valor válido... :rage:`
            } 
            if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= bet) {
                var pot = bet
                const embed = new Discord.MessageEmbed()
                .setTitle('Cavalgada')
                .setDescription(`${author.username} começou uma cavalgada`)
                .setColor('#0099ff')
                .addFields({
                    name: 'Aposta',
                    value: `${pot} Falcoins`,
                    inline: false
                }, {
                    name: 'Jogadores',
                    value: `${author}`,
                    inline: false
                })
                .setFooter('by Falcão ❤️')
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
                functions.changeJSON(author.id, 'Falcoins', -bet)

                var users = [author]
                var path = ['- - - - -']

                const filter = async (reaction, user) => {
                    return await functions.readFile(user.id, 'Falcoins') >= bet && reaction.emoji.name === '✅'  && user.id !== client.user.id && !users.includes(user)
                }

                const collector = answer.createReactionCollector({
                    filter,
                    time: 1000 * 60
                })

                collector.on('collect', async (reaction, user) => {
                    functions.changeJSON(user.id, 'Falcoins', -bet)
                    users.push(user)
                    path.push('- - - - -')
                    pot += bet
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle('Cavalgada')
                    .setDescription(`${author.username} te desafia para uma corrida de cavalos!`)
                    .setColor('#0099ff')
                    .addFields({
                        name: 'Aposta',
                        value: `${pot} Falcoins`,
                        inline: false
                    }, {
                        name: 'Jogadores',
                        value: `${users.join('\n')}`,
                        inline: false
                    })
                .setFooter('by Falcão ❤️')
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
                        .setTitle('Calvagada')
                        .addFields({
                            name: 'Aposta',
                            value: `${pot} Falcoins`,
                            inline: false
                        }, {
                            name: 'Jogadores',
                            value: `${frase}`,
                            inline: false
                        })
                        .setFooter('by Falcão ❤️')
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
                functions.changeJSON(winner.id, 'Falcoins', pot)
                functions.changeJSON(winner.id, 'Vitorias')
                var embed3 = new Discord.MessageEmbed()
                .setTitle('Cavalgada')
                .setDescription(`${winner} ganhou ${pot} falcoins`)
                .setColor(3066993)
                .addField('Saldo atual', `${await functions.format(await functions.readFile(winner.id, 'Falcoins'))} falcoins`, false)
                .setFooter('by Falcão ❤️')
                if (message) {
                    await message.reply({
                        embeds: [embed3]
                    })
                } else {
                    await interaction.channel.send({
                        embeds: [embed3]
                    })
                }
                })
                
            } else if (bet <= 0) { 
                return `${bet} não é um valor válido... :rage:`
            } else {
                return 'Saldo insuficiente!'
            }
        } catch (error) {
            console.log('cavalgada:', error)
        }
    }
}   