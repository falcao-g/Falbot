const Discord = require('discord.js')

module.exports = {
    category: 'Misc',
    description: 'Limpa x mensagens do canal atual',
    slash: 'both',
    cooldown: '1s',
    permissions: ['ADMINISTRATOR'],
    guildOnly: true,
    expectedArgs: '[quantidade]',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantidade',
        description: 'quantidade de mensagens que o bot ira deletar (máximo de 100)',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({message, interaction, channel, args}) => {
        try {
            ctx = message ? message : interaction
            amount = parseInt(args[0]) || 1

            if (message) {
                await message.delete()
            }
    
            if (amount > 100) {amount = 100}
    
            const messages = await channel.messages.fetch({limit: amount})
            const {size} = messages
            messages.forEach((message) => message === undefined ? null : message.delete())

            const reply = `${size} mensagens deletadas`

            if (interaction) {
                return reply
            }

            channel.send(reply)
        } catch (error) {
            console.log('limpa:', error)
        }
    }
}
