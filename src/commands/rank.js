const {Constants, MessageEmbed} = require('discord.js')
const {getMember, getRoleColor, format} = require('../utils/functions.js')
const config = require("../config.json")
const userSchema = require('../schemas/user-schema.js');

module.exports =  {
    category: 'Economia',
    description: 'show the global or local ranking of users',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    expectedArgs: '[scope]',
    expectedArgsTypes: ['STRING'],
    options: [{
        name:'scope',
        description: 'show the global or local ranking',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.STRING,
        choices: [{name: 'global', value: 'global'}, {name: 'local', value: 'local'}]
    }
    ],
    callback: async ({client, user, guild, args}) => {
        try {
                rank = []
                if (args[0] === 'local') {
                    users = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)

                    for (useri of users) {
                        if (await getMember(guild, useri['_id']) &&  rank.length < 10) {
                            rank.push(useri)
                      }
                    }
                } else {
                    rank = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)
                }
                const embed = new MessageEmbed()
                .setColor(await getRoleColor(guild, user.id))
                .setFooter({text: 'by Falcão ❤️'})
                for (let i = 0; i < rank.length; i++) {
                    try {
                        user = await client.users.fetch(rank[i]['_id'])
                        embed.addField(`${i + 1}º - ${user.username} falcoins:`, `${await format(rank[i]['falcoins'])}`, false)
                    } catch {
                        embed.addField(`${i + 1}º - Unknown user falcoins:`, `${await format(rank[i]['falcoins'])}`, false)
                    }
                }
                return embed
        } catch (error) {
                console.error(`rank: ${error}`)
        }
    }
}   