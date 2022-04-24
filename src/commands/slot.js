const {MessageEmbed} = require('discord.js')
const pick = require('pick-random-weighted')
const {specialArg, readFile, changeDB, getRoleColor, count, format} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ['niquel', 'níquel'],
    category: 'Economia',
    description: 'bet your money in the slot machine',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    minArgs: 1,
    expectedArgs: '<falcoins>',
    expectedArgsTypes: ['STRING'],
    options: [
    {
        name: 'falcoins',
        description: 'amount of falcoins to bet',
        required: true,
        type: "STRING"
    }
    ],
    callback: async ({instance, guild, message, interaction, client, user, args}) => {
        try {
            guild = client.guilds.cache.get('742332099788275732')
            emojifoda = await guild.emojis.fetch('926953352774963310')
            try {
                var bet = await specialArg(args[0], user.id, "falcoins")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
            if (await readFile(user.id, 'falcoins') >= bet && bet > 0) {
                const choices = [[':money_mouth:', 30], [':gem:', 10], [':moneybag:', 15], [':coin:', 25], [':dollar:', 20]]
                const emoji1 = pick(choices)
                const emoji2 = pick(choices)
                const emoji3 = pick(choices)
    
                const embed = new MessageEmbed()
                 .setColor(await getRoleColor(guild, user.id))
                 .setAuthor({name: user.username, iconURL: user.avatarURL()})
                 .addField(`-------------------\n | ${emojifoda} | ${emojifoda} | ${emojifoda} |\n-------------------`, `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`)
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
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emojifoda} | ${emojifoda} |\n-------------------`, 'value': `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`}
                await answer.edit({embeds: [embed]})
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emoji2} | ${emojifoda} |\n-------------------`, 'value': `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`}
                await answer.edit({embeds: [embed]})
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`, 'value': `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`}
                await answer.edit({embeds: [embed]})

                arrayEmojis = [emoji1, emoji2, emoji3]
                var dollar = await count(arrayEmojis, ':dollar:')
                var coin = await count(arrayEmojis, ':coin:')
                var moneybag = await count(arrayEmojis, ':moneybag:')
                var gem = await count(arrayEmojis, ':gem:')
                var money_mouth = await count(arrayEmojis, ':money_mouth:')
    
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
                await changeDB(user.id, 'falcoins', profit-bet)
    
                if (profit > 0) {
                    var embed2 = new MessageEmbed()
                     .setColor(3066993)
                     .addFields({
                         name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
                         value: `--- **${instance.messageHandler.get(guild, "VOCE_GANHOU")}** ---`,
                         inline: false
                     }, {
                         name: instance.messageHandler.get(guild, "GANHOS"),
                         value: `${await format(profit)} falcoins`,
                         inline: true
                     })
                } else {
                    var embed2 = new MessageEmbed()
                     .setColor(15158332)
                     .addFields({
                         name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
                         value: `--- **${instance.messageHandler.get(guild, "VOCE_PERDEU")}** ---`,
                         inline: false
                     }, {
                         name: instance.messageHandler.get(guild, "PERDAS"),
                         value: `${await format(bet)} falcoins`,
                         inline: true
                     })
                }
                embed2.setAuthor({name: user.username, iconURL: user.avatarURL()})
                embed2.addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `${await readFile(user.id, 'falcoins', true)}`)
                embed2.setFooter({text: 'by Falcão ❤️'})
                await answer.edit({
                    embeds: [embed2]
                })
            } else {
                    return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
                }
        } catch (error) {
            console.error(`slot: ${error}`)
        }
    }
}   