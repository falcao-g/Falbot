const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'Mostra as informações da pessoa marcada',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<sobre>',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'usuario',
        description: 'o usuario que você quer ver as informações',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({instance, guild, message, interaction, args}) => {
        try {
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            const member = await functions.getMember(message ? message : interaction, args[0])
            const user = await functions.readFile(member.user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, member.user.id))
            .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
            .setFooter({text: 'by Falcão ❤️'})
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(user['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: ' + instance.messageHandler.get(guild, 'VITORIAS'),
                value: `${await functions.format(user['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: ' + instance.messageHandler.get(guild, 'BANCO'),
                value: `${await functions.format(user['Banco'])}`,
                inline: true
            }, {
                name: ':gift: ' + instance.messageHandler.get(guild, 'CAIXAS'),
                value: `${await functions.format(user['Caixas'])}`,
                inline: true
            }, {
                name: ':key: ' + instance.messageHandler.get(guild, 'CHAVES'),
                value: `${await functions.format(user['Chaves'])}`,
                inline: true
            }) 
    
            return embed
        } catch (error) {
                console.error(`sobre: ${error}`)
        }
    }
}