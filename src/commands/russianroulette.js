const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	randint,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	aliases: ["roletarussa"],
	category: "Economia",
	description: "Play with your friend, last to survive wins",
	slash: "both",
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	minArgs: 1,
	expectedArgs: "<falcoins>",
	expectedArgsTypes: ["STRING"],
	options: [
		{
			name: "falcoins",
			description:
				'amount of falcoins to play with (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({
		instance,
		guild,
		message,
		interaction,
		client,
		user,
		args,
		member,
	}) => {
		try {
			const author = user
			try {
				var bet = await specialArg(args[0], user.id, "falcoins")
			} catch {
				return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
					VALUE: args[1],
				})
			}
			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				var pot = bet
				const embed = new MessageEmbed()
					.setTitle(instance.messageHandler.get(guild, "ROLETA_RUSSA"))
					.setDescription(
						`${member.displayName}` +
							instance.messageHandler.get(guild, "ROLETA_RUSSA_COMECOU")
					)
					.setColor("#0099ff")
					.addFields(
						{
							name: instance.messageHandler.get(guild, "APOSTA"),
							value: `${pot} Falcoins`,
							inline: false,
						},
						{
							name: instance.messageHandler.get(guild, "JOGADORES"),
							value: `${author}`,
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
				if (message) {
					var answer = await message.reply({
						embeds: [embed],
					})
				} else {
					var answer = await interaction.reply({
						embeds: [embed],
						fetchReply: true,
					})
				}
				answer.react("✅")
				await changeDB(author.id, "falcoins", -bet)

				var users = [author]
				var names = [author]
				mensagens = instance.messageHandler.get(guild, "RUSROL")

				const filter = async (reaction, user) => {
					return (
						(await readFile(user.id, "falcoins")) >= bet &&
						reaction.emoji.name === "✅" &&
						user.id !== client.user.id &&
						!users.includes(user)
					)
				}

				const collector = answer.createReactionCollector({
					filter,
					time: 1000 * 60,
				})

				collector.on("collect", async (reaction, user) => {
					await changeDB(user.id, "falcoins", -bet)
					users.push(user)
					names.push(user)
					pot += bet
					embed.fields[0] = {
						name: instance.messageHandler.get(guild, "APOSTA"),
						value: `${pot} falcoins`,
						inline: false,
					}
					embed.fields[1] = {
						name: instance.messageHandler.get(guild, "JOGADORES"),
						value: `${names.join("\n")}`,
						inline: false,
					}
					answer.edit({
						embeds: [embed],
					})
				})

				collector.on("end", async () => {
					while (users.length > 1) {
						var luck = randint(0, users.length - 1)
						var eliminated = users[luck]
						names[luck] = `~~${names[luck]}~~ :skull:`
						users.splice(luck, 1)
						var embed2 = new MessageEmbed()
							.setTitle(instance.messageHandler.get(guild, "ROLETA_RUSSA"))
							.setDescription(
								`${eliminated} ${mensagens[randint(0, mensagens.length - 1)]}`
							)
							.addFields(
								{
									name: instance.messageHandler.get(guild, "APOSTA"),
									value: `${pot} Falcoins`,
									inline: false,
								},
								{
									name: instance.messageHandler.get(guild, "JOGADORES"),
									value: names.join("\n"),
									inline: false,
								},
								{
									name: instance.messageHandler.get(guild, "TEMPO_RESTANTE"),
									value: instance.messageHandler.get(guild, "ATIRANDO"),
									inline: false,
								}
							)
							.setFooter({ text: "by Falcão ❤️" })
						if (message) {
							var answer = await message.channel.send({
								embeds: [embed2],
							})
						} else {
							var answer = await interaction.channel.send({
								embeds: [embed2],
							})
						}
						await new Promise((resolve) => setTimeout(resolve, 5000))
					}
					var winner = users[0]
					await changeDB(winner.id, "falcoins", pot)
					await changeDB(winner.id, "vitorias")
					var embed3 = new MessageEmbed()
						.setTitle(instance.messageHandler.get(guild, "ROLETA_RUSSA"))
						.setDescription(`${winner} ganhou ${pot} falcoins`)
						.setColor(3066993)
						.addField(
							instance.messageHandler.get(guild, "SALDO_ATUAL"),
							`${await readFile(winner.id, "falcoins", true)} falcoins`,
							false
						)
						.setFooter({ text: "by Falcão ❤️" })
					if (message) {
						await message.reply({
							embeds: [embed3],
						})
					} else {
						await interaction.followUp({
							embeds: [embed3],
						})
					}
				})
			} else if (bet <= 0) {
				return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
					VALUE: bet,
				})
			} else {
				return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
			}
		} catch (error) {
			console.error(`russianroulette: ${error}`)
		}
	},
}
