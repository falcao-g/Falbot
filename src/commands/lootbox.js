const {readFile, changeDB} = require('../utils/functions.js')
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
            const quantity = await readFile(user.id, 'lootbox')
            changeDB(user.id, 'falcoins', quantity)
            return instance.messageHandler.get(guild, "LOOTBOX", {FALCOINS: quantity})
        } catch (error) {
            console.error(`lootbox: ${error}`)
        }
    }
}