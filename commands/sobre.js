const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    name: 'about',
    aliases: ['sobre'],
    category: 'Economia',
    description: 'Show the info of another user',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<user>',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'user',
        description: 'the user you want to get info about',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({instance, guild, message, args}) => {
        try {
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            const member = await functions.getMember(guild, args[0])
            const user = await functions.readFile(member.user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, member.user.id))
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