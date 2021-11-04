const Discord = require('discord.js')
const functions = require('../functions.js')
const fs = require("fs");

module.exports =  {
    category: 'Economia',
    description: 'mostra o rank do servidor atual ou global',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    expectedArgs: '[escopo]',
    expectedArgsTypes: ['STRING'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`rank {ARGUMENTS}',
    options: [{
        name:'escopo',
        description: 'use "global" para ver o rank global, use "local" para ver o rank local',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, args, client}) => {
        try {
                var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));
                rank = []
                if (args[0] === 'local') {
                    for (user in users) {
                        if (await functions.getMember(message ? message : interaction, user)) {
                          if(!rank.length) {
                              rank.push(user)
                          } else {
                              size = rank.length
                              for (let i = 0; i < size;i++) {
                                  if (users[user]['Falcoins'] > users[rank[i]]['Falcoins']) {
                                      rank.splice(i, 0, user)
                                      break;
                                  }
                              }
                              if (rank.length === size) {
                                  rank.push(user)
                              }
                          }
                        }
                      }
                } else {
                    for (user in users) {
                        if(!rank.length) {
                            rank.push(user)
                        } else {
                            size = rank.length
                            for (let i = 0; i < size;i++) {
                                if (users[user]['Falcoins'] > users[rank[i]]['Falcoins']) {
                                    rank.splice(i, 0, user)
                                    break;
                                }
                            }
                            if (rank.length === size) {
                                rank.push(user)
                            }
                        }
                      }
                }
                top10 = rank
                top10.splice(10)
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                .setFooter('by Falcão ❤️')
                for (let i = 0; i < top10.length; i++) {
                    try {
                        user = await client.users.fetch(top10[i])
                        embed.addField(`${i + 1}º - ${user.username} falcoins:`, `${await functions.format(users[top10[i]]['Falcoins'])}`, false)
                    } catch {
                        embed.addField(`${i + 1}º - Usuário desconhecido falcoins:`, `${await functions.format(users[top10[i]]['Falcoins'])}`, false)
                    }
                }
                return embed
        } catch (error) {
                console.log('rank:', error)
        }
    }
}   