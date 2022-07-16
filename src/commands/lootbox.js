const {readFile, changeDB, msToTime} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ['lb'],
    category: 'Economia',
    description: 'Claim your lootbox (available every 12 hours)',
    slash: 'both',
    cooldown: '12h',
    guildOnly: true,
    testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            cooldownSchema = instance._mongoConnection.models['wokcommands-cooldowns']
            userCooldown = await cooldownSchema.findOne({_id: {$regex: user.id}})
            if (userCooldown) {
                return instance.messageHandler.get(guild, "COOLDOWN", {COOLDOWN: await msToTime(userCooldown.cooldown * 1000)})
            }
            const quantity = await readFile(user.id, 'lootbox')
            changeDB(user.id, 'falcoins', quantity)
            return instance.messageHandler.get(guild, "LOOTBOX", {FALCOINS: quantity})
        } catch (error) {
            console.error(`lootbox: ${error}`)
        }
    }
}