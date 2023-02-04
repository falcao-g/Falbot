const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	randint,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("russianroulette")
		.setDescription("Play with your friend, last to survive wins")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'amount of falcoins to play with (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		try {
			await interaction.deferReply()
			var falcoins = interaction.options.getString("falcoins")
			try {
				var bet = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
			}
			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				var pot = bet
				const embed = new EmbedBuilder()
					.setDescription(
						Falbot.getMessage(guild, "ROLETARUSSA_DESCRIPTION", {
							USER: user,
							BET: format(pot),
						})
					)
					.setColor("#0099ff")
					.addFields({
						name: Falbot.getMessage(guild, "JOGADORES"),
						value: `${user}`,
						inline: false,
					})
					.setFooter({ text: "by Falcão ❤️" })

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("join")
						.setEmoji("✅")
						.setStyle("Success")
				)

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				})

				await changeDB(user.id, "falcoins", -bet)

				var users = [user]
				var names = [user]
				mensagens = Falbot.getMessage(guild, "RUSROL")

				const filter = async (btInt) => {
					return (
						(await readFile(btInt.user.id, "falcoins")) >= bet &&
						!users.includes(btInt.user)
					)
				}

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60,
				})

				collector.on("collect", async (i) => {
					await changeDB(i.user.id, "falcoins", -bet)
					users.push(i.user)
					names.push(i.user)
					pot += bet
					embed.setDescription(
						Falbot.getMessage(guild, "ROLETARUSSA_DESCRIPTION", {
							USER: user,
							BET: format(pot),
						})
					)
					embed.data.fields[0] = {
						name: Falbot.getMessage(guild, "JOGADORES"),
						value: `${names.join("\n")}`,
						inline: false,
					}
					await i.update({
						embeds: [embed],
					})
				})

				collector.on("end", async () => {
					while (users.length > 1) {
						var luck = randint(0, users.length - 1)
						var eliminated = users[luck]
						names[luck] = `~~${names[luck]}~~ :skull:`
						users.splice(luck, 1)
						embed.setDescription(
							Falbot.getMessage(guild, "ROLETARUSSA_DESCRIPTION2", {
								BET: format(pot),
							}) +
								`\n${eliminated} ${mensagens[randint(0, mensagens.length - 1)]}`
						)

						embed.data.fields[0] = {
							name: Falbot.getMessage(guild, "JOGADORES"),
							value: `${names.join("\n")}`,
							inline: false,
						}

						await interaction.editReply({
							embeds: [embed],
						})
						await new Promise((resolve) => setTimeout(resolve, 5000))
					}
					var winner = users[0]
					await changeDB(winner.id, "falcoins", pot)
					await changeDB(winner.id, "vitorias")
					embed
						.setDescription(
							Falbot.getMessage(guild, "ROLETARUSSA_DESCRIPTION3", {
								BET: format(pot),
								USER: winner,
								SALDO: await readFile(winner.id, "falcoins", true),
							})
						)
						.setColor(await getRoleColor(guild, winner.id))

					await interaction.editReply({
						embeds: [embed],
					})
				})
			} else if (bet <= 0) {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: bet,
					}),
				})
			} else {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`russianroulette: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
