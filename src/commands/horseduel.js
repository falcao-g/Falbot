const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	randint,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Challenge other users to a horse duel",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "falcoins",
			description:
				'the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({
		instance,
		guild,
		interaction,
		client,
		member,
		user,
		args,
	}) => {
		try {
			await interaction.deferReply()
			const author = user

			try {
				var bet = await specialArg(args[0], user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "VALOR_INVALIDO", {
						VALUE: args[0],
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= bet) {
				var pot = bet
				const embed = new MessageEmbed()
					.setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
					.setDescription(
						instance.messageHandler.get(guild, "CAVALGADA_DESAFIO", {
							USER: member.displayName,
						})
					)
					.setColor("#0099ff")
					.addFields(
						{
							name: instance.messageHandler.get(guild, "APOSTA"),
							value: `${await format(pot)} Falcoins`,
							inline: false,
						},
						{
							name: instance.messageHandler.get(guild, "JOGADORES"),
							value: `${author}`,
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })

				var answer = await interaction.editReply({
					embeds: [embed],
					fetchReply: true,
				})

				answer.react("✅")

				await changeDB(author.id, "falcoins", -bet)

				var users = [author]
				var path = ["- - - - -"]

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
					path.push("- - - - -")
					pot += bet
					embed.fields[0] = {
						name: instance.messageHandler.get(guild, "APOSTA"),
						value: `${await format(pot)} Falcoins`,
						inline: false,
					}
					embed.fields[1] = {
						name: instance.messageHandler.get(guild, "JOGADORES"),
						value: `${users.join("\n")}`,
						inline: false,
					}
					await interaction.editReply({
						embeds: [embed],
					})
				})

				collector.on("end", async () => {
					while (true) {
						var luck = randint(0, users.length - 1)
						path[luck] = path[luck].slice(0, -2)

						var frase = ""
						for (let i = 0; i < path.length; i++) {
							frase += `${users[i]}\n:checkered_flag: ${path[i]}:horse_racing:\n`
						}

						var embed2 = new MessageEmbed()
							.setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
							.addFields(
								{
									name: instance.messageHandler.get(guild, "APOSTA"),
									value: `${await format(pot)} Falcoins`,
									inline: false,
								},
								{
									name: instance.messageHandler.get(guild, "JOGADORES"),
									value: `${frase}`,
									inline: false,
								}
							)
							.setFooter({ text: "by Falcão ❤️" })
						await interaction.editReply({
							embeds: [embed2],
						})
						await new Promise((resolve) => setTimeout(resolve, 250))

						if (path.includes("")) {
							break
						}
					}

					for (let i = 0; i < path.length; i++) {
						if (path[i] === "") {
							var winner = users[i]
							break
						}
					}

					await changeDB(winner.id, "falcoins", pot)
					await changeDB(winner.id, "vitorias")
					var embed3 = new MessageEmbed()
						.setTitle(instance.messageHandler.get(guild, "CAVALGADA"))
						.setDescription(
							instance.messageHandler.get(guild, "GANHOU", {
								WINNER: winner,
								FALCOINS: await format(pot),
							})
						)
						.setColor(3066993)
						.addFields({
							name: instance.messageHandler.get(guild, "SALDO_ATUAL"),
							value: `${await readFile(winner.id, "falcoins", true)} falcoins`,
						})
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.followUp({
						embeds: [embed3],
					})
				})
			} else {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`Cavalgada: ${error}`)
		}
	},
}
