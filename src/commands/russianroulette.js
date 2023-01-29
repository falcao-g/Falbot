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
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Play with your friend, last to survive wins",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "falcoins",
			description:
				'amount of falcoins to play with (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ guild, interaction, client, user, args }) => {
		try {
			await interaction.deferReply()
			try {
				var bet = await specialArg(args[0], user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: args[1],
					}),
				})
			}
			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				var pot = bet
				const embed = new MessageEmbed()
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

				var answer = await interaction.editReply({
					embeds: [embed],
					fetchReply: true,
				})

				answer.react("✅")
				await changeDB(user.id, "falcoins", -bet)

				var users = [user]
				var names = [user]
				mensagens = Falbot.getMessage(guild, "RUSROL")

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
					names.push(newUser)
					pot += bet
					embed.setDescription(
						Falbot.getMessage(guild, "ROLETARUSSA_DESCRIPTION", {
							USER: user,
							BET: format(pot),
						})
					)
					embed.fields[0] = {
						name: Falbot.getMessage(guild, "JOGADORES"),
						value: `${names.join("\n")}`,
						inline: false,
					}
					await interaction.editReply({
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

						embed.fields[0] = {
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
		}
	},
}
