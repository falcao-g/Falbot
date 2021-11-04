const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['níquel'],
    category: 'Economia',
    description: 'aposte seu dinheiro no caça-níquel',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<falcoins>',
    expectedArgsTypes: ['STRING'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`niquel {ARGUMENTS}',
    options: [
    {
        name: 'falcoins',
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, args}) => {
        try {
            try {
                var bet = await functions.specialArg(args[0], message ? message.author.id : interaction.user.id)
            } catch {
                if (message) {
                    message.reply({
                        content: `${args[0]} não é um valor válido... :rage:`
                    })
                } else {
                    interaction.reply({
                        content: `${args[0]} não é um valor válido... :rage:`
                    })
                }
            }
            if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= bet && bet > 0) {
                const emojis = [':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:',':dollar:', ':coin:', ':moneybag:', ':gem:', ':money_mouth:']
                const emoji1 = emojis[functions.randint(0, emojis.length-1)]
                const emoji2 = emojis[functions.randint(0, emojis.length-1)]
                const emoji3 = emojis[functions.randint(0, emojis.length-1)]
    
                const embed = new Discord.MessageEmbed()
                 .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                 .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                 .addField('-------------------\n | :dollar: | :dollar: | :dollar: |\n-------------------', '--- **GIRANDO** ---')
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
    
                emoji11 = [':dollar:']
                emoji22 = [':dollar:']
                for (let i = 0; i < emojis.length; i++) {
                    index = i - 1
                    var emoji = emojis[i]
                    emoji11[0] = emoji
                    emoji22[0] = emoji
                    if (emoji === emoji1 && emoji11.length === 1) {
                        emoji11.push(emoji)
                    } else if (emoji === emoji2 && index > 4 && emoji22.length === 1) {
                        emoji22.push(emoji)
                    }
                    embed.fields[0] = {'name': `-------------------\n | ${emoji11.slice(-1)} | ${emoji22.slice(-1)} | ${emoji} |\n-------------------`, 'value': '--- **GIRANDO** ---'}
                    await answer.edit({
                        embeds: [embed]
                    })
                    if (emoji === emoji3 && index > 9) {break;}
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
    
                arrayEmojis = [emoji1, emoji2, emoji3]
                var dollar = await functions.count(arrayEmojis, ':dollar:')
                var coin = await functions.count(arrayEmojis, ':coin:')
                var moneybag = await functions.count(arrayEmojis, ':moneybag:')
                var gem = await functions.count(arrayEmojis, ':gem:')
                var money_mouth = await functions.count(arrayEmojis, ':money_mouth:')
    
                if (dollar == 3) {
                    var winnings = 3.5
                } else if (coin == 3) {
                    var winnings = 2.5
                } else if (moneybag == 3) {
                    var winnings = 4.5
                } else if (gem == 3) {
                    var winnings = 5
                } else if (money_mouth == 3) {
                    var winnings = 2
                } else if (dollar == 2) {
                    var winnings = 1.5
                } else if (coin == 2) {
                    var winnings = 1
                } else if (moneybag == 2) {
                    var winnings = 3
                } else if (gem == 2) {
                    var winnings = 4
                } else if (money_mouth == 2) {
                    var winnings = 0.5
                } else {
                    var winnings = 0
                }
                var profit = parseInt(bet * winnings)
                await functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', profit-bet)
    
                if (profit > 0) {
                    var embed2 = new Discord.MessageEmbed()
                     .setColor(3066993)
                     .addFields({
                         name: `-------------------\n | ${emoji11.slice(-1)} | ${emoji22.slice(-1)} | ${emoji} |\n-------------------`,
                         value: '--- **Você ganhou!** ---',
                         inline: false
                     }, {
                         name: 'Ganhos',
                         value: `${await functions.format(profit)} falcoins`,
                         inline: true
                     })
                } else {
                    var embed2 = new Discord.MessageEmbed()
                     .setColor(15158332)
                     .addFields({
                         name: `-------------------\n | ${emoji11.slice(-1)} | ${emoji22.slice(-1)} | ${emoji} |\n-------------------`,
                         value: '--- **Você perdeu!** ---',
                         inline: false
                     }, {
                         name: 'Perdas',
                         value: `${await functions.format(bet)} falcoins`,
                         inline: true
                     })
                }
                embed2.setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
                embed2.addField('Saldo atual', `${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') + profit-bet)}`)
                embed2.setFooter('by Falcão ❤️')
                await answer.edit({
                    embeds: [embed2]
                })
            } else if (bet <= 0) {
                    return `${bet} não é um valor válido... :rage:`
            } else {
                    return `você não tem falcoins suficientes para esta aposta! :rage:`
                }
        } catch (error) {
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('niquel:', error)
            }
        }
    }
}   