const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	randint,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Challenge other users to a horse race",
	slash: true,
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
	callback: async ({ instance, guild, interaction, client, user, args }) => {
		try {
			await interaction.deferReply()

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
					.setDescription(
						instance.messageHandler.get(guild, "CAVALGADA_DESCRIPTION", {
							USER: user,
							BET: await format(pot),
						})
					)
					.setColor("#0099ff")
					.addFields({
						name: instance.messageHandler.get(guild, "JOGADORES"),
						value: `${user}`,
						inline: false,
					})
					.setFooter({ text: "by Falcão ❤️" })

				var answer = await interaction.editReply({
					embeds: [embed],
					fetchReply: true,
				})

				answer.react("✅")

				await changeDB(user.id, "falcoins", -bet)

				var users = [user]
				var path = ["- - - - -"]

				const filter = async (reaction, newUser) => {
					return (
						(await readFile(newUser.id, "falcoins")) >= bet &&
						reaction.emoji.name === "✅" &&
						newUser.id !== client.user.id &&
						!users.includes(newUser)
					)
				}

				const collector = answer.createReactionCollector({
					filter,
					time: 1000 * 60,
				})

				collector.on("collect", async (reaction, newUser) => {
					await changeDB(newUser.id, "falcoins", -bet)
					users.push(newUser)
					path.push("- - - - -")
					pot += bet
					embed.setDescription(
						instance.messageHandler.get(guild, "CAVALGADA_DESCRIPTION", {
							USER: user,
							BET: await format(pot),
						})
					)
					embed.fields[0] = {
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
							frase += `${users[i]}\n:checkered_flag: ${path[i]}:horse_racing:\n\n`
						}

						embed.setDescription(
							instance.messageHandler.get(guild, "CAVALGADA_DESCRIPTION2", {
								BET: await format(pot),
							})
						)

						embed.fields[0] = {
							name: "\u200b",
							value: `${frase}`,
							inline: false,
						}

						await interaction.editReply({
							embeds: [embed],
						})

						if (path[luck] === "") {
							var winner = users[luck]
							break
						}

						await new Promise((resolve) => setTimeout(resolve, 250))
					}

					await changeDB(winner.id, "falcoins", pot)
					await changeDB(winner.id, "vitorias")
					embed.setColor(await getRoleColor(guild, winner.id)).setDescription(
						instance.messageHandler.get(guild, "CAVALGADA_DESCRIPTION3", {
							BET: await format(pot),
							USER: winner,
							SALDO: await readFile(winner.id, "falcoins", true),
						})
					)

					await interaction.editReply({
						embeds: [embed],
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
