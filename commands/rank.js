const Discord = require('discord.js')
const functions = require('../functions.js')
const fs = require("fs");
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'mostra o rank do servidor atual ou global',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    expectedArgs: '[escopo]',
    expectedArgsTypes: ['STRING'],
    options: [{
        name:'escopo',
        description: 'use "global" para ver o rank global, use "local" para ver o rank local',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, client, user, args}) => {
        try {
                var users = JSON.parse(fs.readFileSync("falbot.json", "utf8"));
                rank = []
                if (args[0] === 'local') {
                    for (useri in users) {
                        if (await functions.getMember(message ? message : interaction, useri)) {
                          if(!rank.length) {
                              rank.push(useri)
                          } else {
                              size = rank.length
                              for (let i = 0; i < size;i++) {
                                  if (users[useri]['Falcoins'] > users[rank[i]]['Falcoins']) {
                                      rank.splice(i, 0, useri)
                                      break;
                                  }
                              }
                              if (rank.length === size) {
                                  rank.push(useri)
                              }
                          }
                        }
                      }
                } else {
                    for (useri in users) {
                        if(!rank.length) {
                            rank.push(useri)
                        } else {
                            size = rank.length
                            for (let i = 0; i < size;i++) {
                                if (users[useri]['Falcoins'] > users[rank[i]]['Falcoins']) {
                                    rank.splice(i, 0, useri)
                                    break;
                                }
                            }
                            if (rank.length === size) {
                                rank.push(useri)
                            }
                        }
                      }
                }
                top10 = rank
                top10.splice(10)
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
                .setFooter({text: 'by Falcão ❤️'})
                for (let i = 0; i < top10.length; i++) {
                    try {
                        user = await client.users.fetch(top10[i])
                        embed.addField(`${i + 1}º - ${user.username} falcoins:`, `${await functions.format(users[top10[i]]['Falcoins'])}`, false)
                    } catch {
                        embed.addField(`${i + 1}º - Unknown user falcoins:`, `${await functions.format(users[top10[i]]['Falcoins'])}`, false)
                    }
                }
                return embed
        } catch (error) {
                console.error(`rank: ${error}`)
        }
    }
}   