const {testOnly} = require("../config.json")

module.exports = {
    category: 'Fun',
    description: 'Flip a coin',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    minArgs: 1,
    expectedArgs: '<quantity>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantity',
        description: 'quantity of coins to flip',
        required: false,
        type: "NUMBER"
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