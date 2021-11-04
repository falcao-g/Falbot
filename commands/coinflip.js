const Discord = require('discord.js')

module.exports = {
    category: 'Misc',
    description: 'Faz um cara ou coroa',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<quantidade>',
    expectedArgsTypes: ['NUMBER'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`coinflip {ARGUMENTS}',
    options: [{
        name: 'quantidade',
        description: 'quantidade de cara ou coroa que o bot vai fazer (padrão é 1)',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({message, interaction, args}) => {
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
        
                return `:coin: você tirou **${caras}** caras e **${coroas}** coroas jogando **${times}** vezes`
            } else {
                return 'calma lá amigão, o limite é 1000 vezes :wink:'
            }
        } catch (error) {
            console.log('coinflip:', error)
        }
    }
}