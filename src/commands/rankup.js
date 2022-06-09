const {MessageEmbed} = require('discord.js')
const {readFile, changeDB} = require('../utils/functions.js')
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
    callback: async ({instance, guild, user}) => {
        var rank = await readFile(user.id, 'rank')

        for (level of levels) {
            if (level.rank == rank) {
                rank = level
            }
        }

        if (rank.falcoinsToLevelUp === undefined) {
            return instance.messageHandler.get(guild, "MAX_RANK", {USER: user})
        } else if (await readFile(user.id, 'falcoins') < rank.falcoinsToLevelUp) {
            return instance.messageHandler.get(guild, "NO_MONEY_RANK", {FALCOINS: rank.falcoinsToLevelUp - await readFile(user.id, 'falcoins')})
        } else {
            for (index in levels) {
                if (levels[index].rank === rank.rank) {
                    var new_rank = levels[Number(index) + 1]
                }
            }

            await changeDB(user.id, 'falcoins', -rank.falcoinsToLevelUp)
            await changeDB(user.id, 'rank', new_rank.rank, true)

            //prepare the perks string
            var perks = ''

            //give the perks to the user
            if (new_rank.perks.includes('bank')) {
                perks += instance.messageHandler.get(guild, "RANKUP_BANK")
                await changeDB(user.id, 'limite_banco', 100000)
            }

            const embed = new MessageEmbed()
             .setColor("AQUA")
             .addFields({
                name: "Rank Up!",
                value: instance.messageHandler.get(guild, "RANKUP_SUCESS", {RANK: new_rank.rank, FALCOINS: rank.falcoinsToLevelUp})
            }, {
                name: instance.messageHandler.get(guild, "RANKUP_PERKS"),
                value: perks
            })

            return embed
        }
    }
}