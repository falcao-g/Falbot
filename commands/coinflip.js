const Discord = require('discord.js')
const config = require("../config/config.json")

module.exports = {
    category: 'Misc',
    description: 'Faz um cara ou coroa',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<quantidade>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantidade',
        description: 'quantidade de cara ou coroa que o bot vai fazer (padrão é 1)',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({instance, guild, args}) => {
        try {
            times = parseInt(args[0]) || 1
            if (times <= 1000) {
                let caras = 0
                let coroas = 0
                for (var i = 0; i < times; i++) {
                    if (Math.random() > 0.5) {
                        caras = ++caras
                    } else {
                        coroas = ++coroas
                    }
                }
        
                return instance.messageHandler.get(guild, "COINFLIP", {CARAS: caras, COROAS: coroas, TIMES: times})
            } else {
                return instance.messageHandler.get(guild, "COINFLIP_LIMITE")
            }
        } catch (error) {
            console.error(`Coinflip: ${error}`)
        }
    }
}