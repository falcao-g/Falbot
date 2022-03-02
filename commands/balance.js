const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['credits', 'sobre'],
    category: 'Economia',
    description: 'Show your balance or of another user',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    expectedArgs: '[user]',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'user',
        description: 'the user you want to get info about, leave blank to get your balance',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({instance, guild, message, user, args}) => {
        try {
            if (message && args[0]) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            const member = args[0] ? (await functions.getMember(guild, args[0])).user : user
            const userFile = await functions.readFile(member.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, member.id))
            .setAuthor({name: member.username, iconURL: member.avatarURL()})
            .setFooter({text: 'by Falcão ❤️'})
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(userFile['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: ' + instance.messageHandler.get(guild, 'VITORIAS'),
                value: `${await functions.format(userFile['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: ' + instance.messageHandler.get(guild, 'BANCO'),
                value: `${await functions.format(userFile['Banco'])}`,
                inline: true
            }, {
                name: ':gift: ' + instance.messageHandler.get(guild, 'CAIXAS'),
                value: `${await functions.format(userFile['Caixas'])}`,
                inline: true
            }, {
                name: ':key: ' + instance.messageHandler.get(guild, 'CHAVES'),
                value: `${await functions.format(userFile['Chaves'])}`,
                inline: true
            }) 
    
            return embed
        } catch (error) {
                console.error(`sobre: ${error}`)
        }
    }
}