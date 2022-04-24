const {MessageEmbed} = require('discord.js')
const {getMember, getRoleColor, format} = require('../utils/functions.js')
const {testOnly} = require("../config.json")
const userSchema = require('../schemas/user-schema.js');

module.exports =  {
    category: 'Economia',
    description: 'show the global or local ranking of users',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    expectedArgs: '[scope]',
    expectedArgsTypes: ['SUB_COMMAND'],
    options: [{
        name:'local',
        description: 'show this server\'s falcoins ranking',
        type: "SUB_COMMAND",
    },
    {
        name:'global',
        description: 'show the global falcoins ranking',
        type: "SUB_COMMAND",
    }
    ],
    callback: async ({client, user, guild, args, interaction}) => {
        try {
            rank = []
            if (!interaction) {scope = args[0].toLowerCase()} else {scope = interaction.options.getSubcommand()}
            if (scope === 'local') {
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