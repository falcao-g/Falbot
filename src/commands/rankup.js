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
        try {
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

                //prepare the perks string
                var perks = ''

                //give the perks to the user
                if (new_rank.perks.includes('bank')) {
                    perks += instance.messageHandler.get(guild, "RANKUP_BANK")
                    await changeDB(user.id, 'limite_banco', 100000)
                } else if (new_rank.perks.includes('caixa')) {
                    perks += instance.messageHandler.get(guild, "RANKUP_CAIXA")
                    await changeDB(user.id, 'caixas', 1)
                    await changeDB(user.id, 'chaves', 1)
                } else if (new_rank.perks.includes('lootbox')) {
                    perks += instance.messageHandler.get(guild, "RANKUP_LOOTBOX")
                    await changeDB(user.id, 'lootbox', 1000)
                }

                const embed = new MessageEmbed()
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
        } catch (err) {
            console.error(`rankup: ${err}`)
        }
    }
}