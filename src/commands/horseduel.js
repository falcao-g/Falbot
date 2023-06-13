const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	randint,
	format,
	getRoleColor,
	buttons,
} = require("../utils/functions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("horseduel")
		.setNameLocalization("pt-BR", "corrida")
		.setDescription("Starts a horse race that other users can join")
		.setDescriptionLocalization(
			"pt-BR",
			"Inicie uma corrida de cavalos que outros usuários podem participar"
		)
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		await interaction.deferReply()
		try {
			const falcoins = interaction.options.getString("falcoins")
			try {
				var bet = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= bet) {
				var pot = bet
				const embed = new EmbedBuilder()
					.setDescription(
						instance.getMessage(guild, "CAVALGADA_DESCRIPTION", {
							USER: user,
							BET: format(pot),
						})
					)
					.setColor("#0099ff")
					.addFields({
						name: instance.getMessage(guild, "JOGADORES"),
						value: `${user}`,
						inline: false,
					})
					.setFooter({ text: "by Falcão ❤️" })

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [buttons(["accept", "skip"])],
					fetchReply: true,
				})

				await changeDB(user.id, "falcoins", -bet)

				var users = [user]
				var path = ["- - - - -"]

				const filter = async (btInt) => {
					return (
						instance.defaultFilter(btInt)
					)
				}

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60,
				})

				collector.on("collect", async (i) => {
					if (i.customId === "skip" && i.user.id === user.id && users.length > 1) {
						collector.stop()
					} else if (
						(await readFile(i.user.id, "falcoins")) >= bet &&
						!users.includes(i.user)
					) {
						await changeDB(i.user.id, "falcoins", -bet)
						users.push(i.user)
						path.push("- - - - -")
						pot += bet
						embed.setDescription(
							instance.getMessage(guild, "CAVALGADA_DESCRIPTION", {
								USER: user,
								BET: format(pot),
							})
						)
						embed.data.fields[0] = {
							name: instance.getMessage(guild, "JOGADORES"),
							value: `${users.join("\n")}`,
							inline: false,
						}
					}

					await i.update({
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
							instance.getMessage(guild, "CAVALGADA_DESCRIPTION2", {
								BET: format(pot),
							})
						)

						embed.data.fields[0] = {
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
						instance.getMessage(guild, "CAVALGADA_DESCRIPTION3", {
							BET: format(pot),
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
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`horseduel: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
