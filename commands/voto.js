const Discord = require('discord.js')
const config = require("../config/config.json")
const functions = require('../functions.js')
const top = require('top.gg-core');

module.exports =  {
    category: 'Economia',
    description: 'Ganhe recompensas por votar no bot',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({message, interaction, client, args}) => {
        try {
            const topgg = new top.Client(config.Authorization)

            if (await topgg.isVoted(message ? message.author.id : interaction.user.id) && (Date.now() - await functions.readFile(message ? message.author.id : interaction.user.id, 'voto') > 43200000)) {
                functions.changeJSON(message ? message.author.id : interaction.user.id, 'voto', Date.now())
                functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', 5000)
                const embed = new Discord.MessageEmbed()
                .setColor(3066993) 
                .addField('Você ganhou', `**5000** falcoins`)
                .addField('Saldo atual', `**${await functions.format(await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins'))}** falcoins`)
                .setFooter('by Falcão ❤️')
                return embed
            } else if (await topgg.isVoted(message ? message.author.id : interaction.user.id) && (Date.now() - await functions.readFile(message ? message.author.id : interaction.user.id, 'voto') < 43200000)) {
                const embed = new Discord.MessageEmbed()
                .setColor(15158332) 
                .addField('Você já coletou sua recompensa hoje', `Recompensa: **5000** falcoins\nVocê pode coletar de novo em **${await functions.msToTime(43200000 - (Date.now() - await functions.readFile(message ? message.author.id : interaction.user.id, 'voto')))}**`)
                .setFooter('by Falcão ❤️')
                return embed
            } else {
                const embed = new Discord.MessageEmbed()
                .setTitle('Você precisa votar primeiro para conseguir sua recompensa')
                .setColor('#0099ff')
                .setDescription('[Você pode votar aqui](https://top.gg/bot/742331813539872798/vote)')
                .addField('Recompensa', '**5000** falcoins\nUse esse comando de novo após ter votado no bot')
                .setFooter('by Falcão ❤️')
                return embed
            }
        } catch (error) {
            console.log(`voto2: ${error}`)
        }
    }
}   
