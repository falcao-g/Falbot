const Discord = require('discord.js')
const functions = require('../functions.js')
const pick = require('pick-random-weighted')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['níquel'],
    category: 'Economia',
    description: 'aposte seu dinheiro no caça-níquel',
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
        description: 'a quantidade de falcoins que você ira apostar',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, client, user, args}) => {
        try {
            guild = client.guilds.cache.get('742332099788275732')
            emojifoda = await guild.emojis.fetch('926953352774963310')
            try {
                var bet = await functions.specialArg(args[0], user.id)
            } catch {
                return `${args[0]} não é um valor válido... :rage:`
            }
            if (await functions.readFile(user.id, 'Falcoins') >= bet && bet > 0) {
                const choices = [[':money_mouth:', 30], [':gem:', 10], [':moneybag:', 15], [':coin:', 25], [':dollar:', 20]]
                const emoji1 = pick(choices)
                const emoji2 = pick(choices)
                const emoji3 = pick(choices)
    
                const embed = new Discord.MessageEmbed()
                 .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                 .setAuthor({name: user.username, iconURL: user.avatarURL()})
                 .addField(`-------------------\n | ${emojifoda} | ${emojifoda} | ${emojifoda} |\n-------------------`, '--- **GIRANDO** ---')
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
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emojifoda} | ${emojifoda} |\n-------------------`, 'value': '--- **GIRANDO** ---'}
                await answer.edit({embeds: [embed]})
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emoji2} | ${emojifoda} |\n-------------------`, 'value': '--- **GIRANDO** ---'}
                await answer.edit({embeds: [embed]})
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`, 'value': '--- **GIRANDO** ---'}
                await answer.edit({embeds: [embed]})

                arrayEmojis = [emoji1, emoji2, emoji3]
                var dollar = await functions.count(arrayEmojis, ':dollar:')
                var coin = await functions.count(arrayEmojis, ':coin:')
                var moneybag = await functions.count(arrayEmojis, ':moneybag:')
                var gem = await functions.count(arrayEmojis, ':gem:')
                var money_mouth = await functions.count(arrayEmojis, ':money_mouth:')
    
                if (dollar == 3) {
                    var winnings = 3
                } else if (coin == 3) {
                    var winnings = 2.5
                } else if (moneybag == 3) {
                    var winnings = 7
                } else if (gem == 3) {
                    var winnings = 10
                } else if (money_mouth == 3) {
                    var winnings = 2.5  
                } else if (dollar == 2) {
                    var winnings = 2
                } else if (coin == 2) {
                    var winnings = 2
                } else if (moneybag == 2) {
                    var winnings = 3
                } else if (gem == 2) {
                    var winnings = 5
                } else if (money_mouth == 2) {
                    var winnings = 0.5
                } else {
                    var winnings = 0
                }
                var profit = parseInt(bet * winnings)
                functions.changeJSON(user.id, 'Falcoins', profit-bet)
    
                if (profit > 0) {
                    var embed2 = new Discord.MessageEmbed()
                     .setColor(3066993)
                     .addFields({
                         name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
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
                         name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
                         value: '--- **Você perdeu!** ---',
                         inline: false
                     }, {
                         name: 'Perdas',
                         value: `${await functions.format(bet)} falcoins`,
                         inline: true
                     })
                }
                embed2.setAuthor({name: user.username, iconURL: user.avatarURL()})
                embed2.addField('Saldo atual', `${await functions.format(await functions.readFile(user.id, 'Falcoins'))}`)
                embed2.setFooter({text: 'by Falcão ❤️'})
                await answer.edit({
                    embeds: [embed2]
                })
            } else if (bet <= 0) {
                    return `${bet} não é um valor válido... :rage:`
            } else {
                    return `você não tem falcoins suficientes para esta aposta! :rage:`
                }
        } catch (error) {
            console.error(`niquel: ${error}`)
        }
    }
}   