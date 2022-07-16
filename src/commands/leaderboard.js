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
        name:'money',
        description: 'View users ranked by falcoins',
        type: "SUB_COMMAND",
        options: [{name: "type", description: "server or global", type: "STRING", choices: [{name: "server", value: "server"}, {name: "global", value: "global"}], required: true}]
    }, {
        name:'rank',
        description: 'View users ranked by ranks',
        type: "SUB_COMMAND",
        options: [{name: "type", description: "server or global", type: "STRING", choices: [{name: "server", value: "server"}, {name: "global", value: "global"}], required: true}]
    }, {
        name:'wins',
        description: 'View users ranked by wins',
        type: "SUB_COMMAND",
        options: [{name: "type", description: "server or global", type: "STRING", choices: [{name: "server", value: "server"}, {name: "global", value: "global"}], required: true}]
    }
    ],
    callback: async ({client, user, guild, args, interaction, instance}) => {
        try {
            rank = []
            if (!interaction) {scope = args[1].toLowerCase()} else {scope = interaction.options.getString("type").toLowerCase()}
            if (!interaction) {type = args[0].toLowerCase()} else {type = interaction.options.getSubcommand()}
            
            switch (type) {
                case 'money':
                case 'dinheiro':
                    if (scope === 'server') {
                        users = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)
        
                        for (useri of users) {
                            if (await getMember(guild, useri['_id']) &&  rank.length < 10) {
                                rank.push(useri)
                            }
                        }
                    } else {
                        rank = await userSchema.find({}).sort({ 'falcoins': -1 }).limit(10)
                    }
                    var embed = new MessageEmbed()
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
                case 'rank':
                    if (scope === 'server') {
                        users = await userSchema.find({}).sort({ 'rank': -1 }).limit(10)
        
                        for (useri of users) {
                            if (await getMember(guild, useri['_id']) &&  rank.length < 10) {
                                rank.push(useri)
                            }
                        }
                    } else {
                        rank = await userSchema.find({}).sort({ 'rank': -1 }).limit(10)
                    }
                    var embed = new MessageEmbed()
                    .setColor(await getRoleColor(guild, user.id))
                    .setFooter({text: 'by Falcão ❤️'})
                    for (let i = 0; i < rank.length; i++) {
                        try {
                            user = await client.users.fetch(rank[i]['_id'])
                            embed.addField(`${i + 1}º - ${user.username} rank:`, `${instance.messageHandler.get(guild, rank[i]['rank'])}`, false)
                        } catch {
                            embed.addField(`${i + 1}º - Unknown user rank:`, `${instance.messageHandler.get(guild, rank[i]['rank'])}`, false)
                        }
                    }
                    return embed

                    case 'wins':
                        if (scope === 'server') {
                            users = await userSchema.find({}).sort({ 'vitorias': -1 }).limit(10)
            
                            for (useri of users) {
                                if (await getMember(guild, useri['_id']) &&  rank.length < 10) {
                                    rank.push(useri)
                                }
                            }
                        } else {
                            rank = await userSchema.find({}).sort({ 'vitorias': -1 }).limit(10)
                        }
                        var embed = new MessageEmbed()
                        .setColor(await getRoleColor(guild, user.id))
                        .setFooter({text: 'by Falcão ❤️'})
                        for (let i = 0; i < rank.length; i++) {
                            try {
                                user = await client.users.fetch(rank[i]['_id'])
                                embed.addField(`${i + 1}º - ${user.username} `  + instance.messageHandler.get(guild, "VITORIAS").toLowerCase() + ':', `${await format(rank[i]['vitorias'])}`, false)
                            } catch {
                                embed.addField(`${i + 1}º - Unknown user ` + instance.messageHandler.get(guild, "VITORIAS").toLowerCase() + ':', `${await format(rank[i]['vitorias'])}`, false)
                            }
                        }
                        return embed
                default:
                    return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
        } catch (error) {
                console.error(`rank: ${error}`)
        }
    }
}   