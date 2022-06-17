const {MessageEmbed} = require('discord.js')
const {readFile, changeDB, rankPerks} = require('../utils/functions.js')
const {testOnly} = require("../config.json")
const levels = require('../utils/json/levels.json')

module.exports =  {
    aliases: ['levelup'],
    category: 'Economia',
    description: 'Increase your rank',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    options: [{
        name: 'rankup',
        description: 'Increase your rank',
        type: "SUB_COMMAND"
    }, {
        name: 'view',
        description: 'View upcoming ranks',
        type: "SUB_COMMAND"
    }, {
        name: 'all',
        description: 'View all ranks',
        type: "SUB_COMMAND"
    }],
    callback: async ({instance, guild, user, interaction, args}) => {
        try {
            if (!interaction) {type = args[0].toLowerCase()} else {type = interaction.options.getSubcommand()}

            switch (type) {
                case 'rankup':
                    var rank_number = await readFile(user.id, 'rank')
                    rank = levels[rank_number - 1]

                    if (rank.falcoinsToLevelUp === undefined) {
                        return instance.messageHandler.get(guild, "MAX_RANK", {USER: user})
                    } else if (await readFile(user.id, 'falcoins') < rank.falcoinsToLevelUp) {
                        return instance.messageHandler.get(guild, "NO_MONEY_RANK", {FALCOINS: rank.falcoinsToLevelUp - await readFile(user.id, 'falcoins')})
                    } else {
                        new_rank = levels[rank_number]

                        await changeDB(user.id, 'falcoins', -rank.falcoinsToLevelUp)
                        await changeDB(user.id, 'rank', rank_number + 1, true)

                        //give the perks to the user
                        if (new_rank.perks.includes('bank')) {
                            await changeDB(user.id, 'limite_banco', 100000)
                        } else if (new_rank.perks.includes('caixa')) {
                            await changeDB(user.id, 'caixas', 1)
                            await changeDB(user.id, 'chaves', 1)
                        } else if (new_rank.perks.includes('lootbox')) {
                            await changeDB(user.id, 'lootbox', 1000)
                        }

                        perks = await rankPerks(new_rank, instance, guild)

                        var embed = new MessageEmbed()
                        .setColor("AQUA")
                        .addFields({
                            name: "Rank Up!",
                            value: instance.messageHandler.get(guild, "RANKUP_SUCESS", {RANK: instance.messageHandler.get(guild, String(rank_number + 1)), FALCOINS: rank.falcoinsToLevelUp})
                        }, {
                            name: instance.messageHandler.get(guild, "RANKUP_PERKS"),
                            value: perks
                        })

                        return embed
                    }
                case 'view':
                    if (await readFile(user.id, 'rank') === 10) {
                        return instance.messageHandler.get(guild, "MAX_RANK", {USER: user})
                    }

                    var rank_number = await readFile(user.id, 'rank')
                    quantity = 10 - rank_number
                    if (quantity > 3) {quantity = 3}

                    var embed = new MessageEmbed()
                    .setColor("DARK_PURPLE")
                    .setTitle(instance.messageHandler.get(guild, "UPCOMING_RANKS"))

                    embed.addField(
                        instance.messageHandler.get(guild, String(rank_number)) + ' - ' + levels[rank_number - 1].falcoinsToLevelUp + ' Falcoins' + instance.messageHandler.get(guild, "CURRENT_RANK"),
                        await rankPerks(levels[rank_number - 1], instance, guild),
                        false
                    )

                    for (var i = 0; i < quantity; i++) {
                        if (levels[rank_number + i].falcoinsToLevelUp === undefined) {
                            embed.addField(
                                instance.messageHandler.get(guild, String(rank_number + i + 1)) + ' - Max Rank',
                                await rankPerks(levels[rank_number + i], instance, guild),
                                false
                            )
                        } else {
                            embed.addField(
                                instance.messageHandler.get(guild, String(rank_number + i + 1)) + ' - ' + levels[rank_number + i].falcoinsToLevelUp + ' Falcoins',
                                await rankPerks(levels[rank_number + i], instance, guild),
                                false
                            )
                        }    
                    }

                    return embed
                case 'all':
                    var embed = new MessageEmbed()
                    .setColor("DARK_PURPLE")

                    ranks = ''
                    for (var i = 0; i < levels.length; i++) {
                        if (levels[i].falcoinsToLevelUp === undefined) {
                            ranks += `**${instance.messageHandler.get(guild, String(i + 1))}** - Max Rank\n`
                        } else {
                            ranks += `**${instance.messageHandler.get(guild, String(i + 1))}** - ${levels[i].falcoinsToLevelUp} falcoins\n`
                        }
                    }

                    embed.addField(instance.messageHandler.get(guild, "ALL_RANKS"), ranks)
                    return embed
                default:
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: type})
            }
        } catch (err) {
            console.error(`ranks: ${err}`)
        }
    }
}