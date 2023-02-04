const { EmbedBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	getRoleColor,
	randint,
	changeDB,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("horse")
		.setDescription("bet in what horse is going to win")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("horse")
				.setDescription(
					"number of the horse you want to bet in, order is top to bottom"
				)
				.setRequired(true)
				.addChoices(
					{ name: "1", value: "1" },
					{ name: "2", value: "2" },
					{ name: "3", value: "3" },
					{ name: "4", value: "4" },
					{ name: "5", value: "5" }
				)
		)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		await interaction.deferReply()
		try {
			var horse = interaction.options.getString("horse")
			var falcoins = interaction.options.getString("falcoins")
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
			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				await changeDB(user.id, "falcoins", -bet)
				const horses = [
					"- - - - -",
					"- - - - -",
					"- - - - -",
					"- - - - -",
					"- - - - -",
				]
				const embed = new EmbedBuilder()
					.setDescription(
						instance.getMessage(guild, "CAVALO_DESCRIPTION", {
							BET: format(bet),
							HORSE: horse,
						})
					)
					.addFields({
						name: "\u200b",
						value: `**1.** :checkered_flag:  ${horses[0]} :horse_racing:\n\u200b\n**2.** :checkered_flag:  ${horses[1]} :horse_racing:\n\u200b\n**3.** :checkered_flag:  ${horses[2]} :horse_racing:\n\u200b\n**4.** :checkered_flag:  ${horses[3]} :horse_racing:\n\u200b\n**5.** :checkered_flag:  ${horses[4]}  :horse_racing:`,
					})
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				for (let i = 0; i <= 21; i++) {
					let run = randint(0, 4)
					horses[run] = horses[run].slice(0, -2)

					embed.data.fields[0] = {
						name: "\u200b",
						value: `**1.** :checkered_flag:  ${horses[0]} :horse_racing:\n\u200b\n**2.** :checkered_flag:  ${horses[1]} :horse_racing:\n\u200b\n**3.** :checkered_flag:  ${horses[2]} :horse_racing:\n\u200b\n**4.** :checkered_flag:  ${horses[3]} :horse_racing:\n\u200b\n**5.** :checkered_flag:  ${horses[4]} :horse_racing:`,
					}
					await interaction.editReply({
						embeds: [embed],
					})

					if (horses[run] === "") {
						var winner = String(run + 1)
						break
					}

					await new Promise((resolve) => setTimeout(resolve, 250))
				}

				if (horse == winner) {
					await changeDB(user.id, "falcoins", bet * 5)
					embed.setColor(3066993).setDescription(
						instance.getMessage(guild, "CAVALO_DESCRIPTION_WON", {
							BET: format(bet),
							HORSE: horse,
							FALCOINS: format(bet * 5),
							SALDO: await readFile(user.id, "falcoins", true),
						})
					)
				} else {
					embed.setColor(15158332).setDescription(
						instance.getMessage(guild, "CAVALO_DESCRIPTION_LOST", {
							BET: format(bet),
							HORSE: horse,
							SALDO: await readFile(user.id, "falcoins", true),
						})
					)
				}

				await interaction.editReply({
					embeds: [embed],
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`horse: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
