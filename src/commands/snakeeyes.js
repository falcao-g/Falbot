const {MessageEmbed} = require('discord.js')
const {specialArg, readFile, changeDB, getRoleColor, format, randint} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    category: 'Economia',
    description: 'Roll two dice, if either of them roll a one, you win',
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
        description: 'amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
        required: true,
        type: "STRING"
    }
    ],
    callback: async ({instance, guild, message, interaction, client, user, args}) => {
        try {
            guild = client.guilds.cache.get('742332099788275732')
            die1 = await guild.emojis.fetch('999796726711992350')
            die2 = await guild.emojis.fetch('999796728519733349')
            die3 = await guild.emojis.fetch('999796729882890320')
            die4 = await guild.emojis.fetch('999796734035230781')
            die5 = await guild.emojis.fetch('999796735629078629')
            die6 = await guild.emojis.fetch('999796745296953485')
            diegif = await guild.emojis.fetch('999795233808203846')
            try {
                var bet = await specialArg(args[0], user.id, "falcoins")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
            if (await readFile(user.id, 'falcoins') >= bet && bet > 0) {
                await changeDB(user.id, 'falcoins', -bet)
                const choices = [die1, die2, die3, die4, die5, die6]
                random1 = randint(1, 6)
                random2 = randint(1, 6)
                emoji1 = choices[random1-1]
                emoji2 = choices[random2-1]

                const embed = new MessageEmbed()
                 .setColor(await getRoleColor(guild, user.id))
                 .setAuthor({name: user.username, iconURL: user.avatarURL()})
                 .addField(`-------------------\n      | ${diegif} | ${diegif} |\n-------------------`, `--- **${instance.messageHandler.get(guild, "ROLANDO")}** ---`)
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
                embed.fields[0] = {'name': `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`, 'value': `--- **${instance.messageHandler.get(guild, "ROLANDO")}** ---`}
                await answer.edit({embeds: [embed]})
                await new Promise(resolve => setTimeout(resolve, 1500));
                embed.fields[0] = {'name': `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`, 'value': `--- **${instance.messageHandler.get(guild, "ROLANDO")}** ---`}
                await answer.edit({embeds: [embed]})
    
                if (random1 === 1 && random2 === 1) {
                    await changeDB(user.id, 'falcoins', bet*6)
                    var embed2 = new MessageEmbed()
                    .setColor("GOLD")
                    .addFields({
                        name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
                        value: `--- **${instance.messageHandler.get(guild, "VOCE_GANHOU")}** ---`,
                        inline: false
                    }, {
                        name: instance.messageHandler.get(guild, "GANHOS"),
                        value: `${await format(bet*5)} falcoins`,
                        inline: true
                    })
                } else if (random1 === 1 || random2 === 1) {
                    await changeDB(user.id, 'falcoins', bet*2)
                    var embed2 = new MessageEmbed()
                     .setColor(3066993)
                     .addFields({
                         name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
                         value: `--- **${instance.messageHandler.get(guild, "VOCE_GANHOU")}** ---`,
                         inline: false
                     }, {
                         name: instance.messageHandler.get(guild, "GANHOS"),
                         value: `${await format(bet)} falcoins`,
                         inline: true
                     })
                } else {
                    var embed2 = new MessageEmbed()
                     .setColor(15158332)
                     .addFields({
                         name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
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
            console.error(`snakeeyes: ${error}`)
        }
    }
}   