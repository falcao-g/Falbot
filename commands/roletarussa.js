const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'jogue com seus amigos, ultimo sobrevivente ganha!',
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
    }],
    callback: async ({message, interaction, client, user, args}) => {
        try {
            functions.createUser(user.id)
            const author = user
                try {
                    var bet = await functions.specialArg(args[0], user.id)
                } catch {
                    return `${args[1]} não é um valor válido... :rage:`
                } 
                if (await functions.readFile(user.id, 'Falcoins')) {
                    var pot = bet
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Roleta russa')
                    .setDescription(`${author.username} começou uma roleta russa`)
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
                    var names = [author]
                    mensagens = ['morreu', 'colocou a cabeça no lugar errado', 'viajou pro EUA', 'não tinha o high ground', 'descobriu que o chão era lava', 'descobriu que a terra é plana', 'não usou máscara']
    
                    const filter = async (reaction, user) => {
                        return await functions.readFile(user.id, 'Falcoins') >= bet && reaction.emoji.name === '✅' && user.id !== client.user.id && !users.includes(user) 
                    }
    
                    const collector = answer.createReactionCollector({
                        filter,
                        time: 1000 * 60
                    })

                    collector.on('collect', async (reaction, user) => {
                        functions.changeJSON(user.id, 'Falcoins', -bet)
                        users.push(user)
                        names.push(user)
                        pot += bet
                        embed.fields[0] = {"name": "Aposta", "value": `${pot} falcoins`, "inline": false}
                        embed.fields[1] = {"name": "Jogadores", "value": `${names.join('\n')}`, "inline": false}
                        answer.edit({
                            embeds: [embed]
                        })
                    })
    
                    collector.on('end', async () => {
                        while (users.length > 1) {
                            var luck = functions.randint(0, users.length - 1)
                            var eliminated = users[luck]
                            names[luck] = `~~${names[luck]}~~ :skull:`
                            users.splice(luck, 1)
                            var embed2 = new Discord.MessageEmbed()
                             .setTitle('Roleta russa')
                             .setDescription(`${eliminated} ${mensagens[functions.randint(0, mensagens.length -1)]}`)
                             .addFields({
                                name: 'Aposta',
                                value: `${pot} Falcoins`,
                                inline: false
                             }, {
                                name: 'Jogadores',
                                value: names.join('\n'),
                                inline: false
                             }, {
                                 name: 'Tempo restante',
                                 value: 'atirando em alguém em 5 segundos',
                                 inline: false
                             })
                             .setFooter('by Falcão ❤️')
                            if (message) {
                                var answer = await message.channel.send({
                                    embeds: [embed2]
                                })
                            } else {
                                var answer = await interaction.channel.send({
                                    embeds: [embed2]
                                })
                            }
                            await new Promise(resolve => setTimeout(resolve, 5000));
                        }
                        var winner = users[0]
                        functions.changeJSON(winner.id, 'Falcoins', pot)
                        functions.changeJSON(winner.id, 'Vitorias')
                        var embed3 = new Discord.MessageEmbed()
                        .setTitle('Roleta russa')
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
            console.error(`roletarussa: ${error}`)
        }
    }
}   