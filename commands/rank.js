const Discord = require('discord.js')
const functions = require('../functions.js')
const fs = require("fs");
const config = require("../config/config.json");
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
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        choices: [{name: 'global', value: 'global'}, {name: 'local', value: 'local'}]
    }
    ],
    callback: async ({client, user, guild, args}) => {
        try {
                rank = []
                if (args[0] === 'local') {
                    users = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)

                    for (useri of users) {
                        if (await functions.getMember(guild, useri['_id'])) {
                            rank.push(useri)
                      }
                    }
                } else {
                    rank = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)
                }
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(guild, user.id))
                .setFooter({text: 'by Falcão ❤️'})
                for (let i = 0; i < rank.length; i++) {
                    try {
                        user = await client.users.fetch(rank[i]['_id'])
                        embed.addField(`${i + 1}º - ${user.username} falcoins:`, `${await functions.format(rank[i]['falcoins'])}`, false)
                    } catch {
                        embed.addField(`${i + 1}º - Unknown user falcoins:`, `${await functions.format(rank[i]['falcoins'])}`, false)
                    }
                }
                return embed
        } catch (error) {
                console.error(`rank: ${error}`)
        }
    }
}   