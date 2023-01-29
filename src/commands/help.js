const { testOnly } = require("../config.json")
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js")

module.exports = {
	description: "Show commands help and information",
	slash: true,
	guildOnly: true,
	options: [
		{
			name: "page",
			description: "Which help page you want to see",
			required: false,
			type: "STRING",
			choices: [
				{ name: "💠 introduction", value: "introduction" },
				{ name: "📚 allcommands", value: "allcommands" },
				{ name: "📈 ranks", value: "ranks" },
				{ name: "💸 economy", value: "economy" },
				{ name: "🎉 fun", value: "fun" },
				{ name: "🌎 language", value: "language" },
				{ name: "📝 utils", value: "utils" },
			],
		},
	],
	testOnly,
	init: () => {
		const { Falbot } = require("../../index.js")
	},
	callback: async ({ guild, interaction }) => {
		try {
			await interaction.deferReply()
			if (interaction.options !== undefined) {
				var page = interaction.options.getString("page")
			} else {
				var page = interaction.values[0]
			}

			const embed = new MessageEmbed()
				.setColor("DARK_PURPLE")
				.setFooter({ text: "by Falcão ❤️" })
			if (page === "introduction") {
				embed.addFields({
					name: Falbot.getMessage(guild, "WELCOME"),
					value: Falbot.getMessage(guild, "HELP_INTRODUCTION2"),
				})
			} else if (page === "allcommands") {
				embed.setTitle(Falbot.getMessage(guild, "ALL_COMMANDS"))
				embed.addFields({
					name: Falbot.getMessage(guild, "TOO_MANY"),
					value: Falbot.getMessage(guild, "LINK_COMMANDS"),
				})
			} else if (page === "ranks") {
				embed.setTitle(":chart_with_upwards_trend: Ranks")
				embed.addFields({
					name: Falbot.getMessage(guild, "HELP_RANK"),
					value: Falbot.getMessage(guild, "HELP_RANK2"),
				})
			} else if (page === "economy") {
				embed.addFields({
					name: Falbot.getMessage(guild, "HELP_ECONOMY2"),
					value: Falbot.getMessage(guild, "HELP_ECONOMY3"),
				})
			} else if (page === "fun") {
				embed.addFields({
					name: Falbot.getMessage(guild, "HELP_FUN"),
					value: Falbot.getMessage(guild, "HELP_FUN2"),
				})
			} else if (page === "language") {
				embed.setTitle(Falbot.getMessage(guild, "HELP_LANGUAGE"))
				embed.addFields({
					name: Falbot.getMessage(guild, "HELP_LANGUAGE2"),
					value: Falbot.getMessage(guild, "HELP_LANGUAGE3"),
				})
			} else if (page === "utils") {
				embed.addFields({
					name: Falbot.getMessage(guild, "HELP_UTILS"),
					value: Falbot.getMessage(guild, "HELP_UTILS2"),
				})
			} else {
				embed.setTitle(Falbot.getMessage(guild, "FALBOT_WELCOME"))
				embed.addFields(
					{
						name:
							":diamond_shape_with_a_dot_inside: " +
							Falbot.getMessage(guild, "INTRODUCTION"),
						value: Falbot.getMessage(guild, "HELP_INTRODUCTION"),
						inline: true,
					},
					{
						name: ":books: " + Falbot.getMessage(guild, "COMMANDS_ALL"),
						value: Falbot.getMessage(guild, "COMMANDS_ALL2"),
						inline: true,
					},
					{
						name: ":chart_with_upwards_trend: Ranks",
						value: Falbot.getMessage(guild, "HELP_RANK3"),
						inline: true,
					},
					{
						name: ":money_with_wings: " + Falbot.getMessage(guild, "ECONOMY"),
						value: Falbot.getMessage(guild, "HELP_ECONOMY"),
						inline: true,
					},
					{
						name: ":tada: " + Falbot.getMessage(guild, "FUN"),
						value: Falbot.getMessage(guild, "HELP_FUN3"),
						inline: true,
					},
					{
						name: ":earth_americas: " + Falbot.getMessage(guild, "LANGUAGE"),
						value: Falbot.getMessage(guild, "HELP_LANGUAGE4"),
						inline: true,
					},
					{
						name: ":pencil: " + Falbot.getMessage(guild, "UTILS"),
						value: Falbot.getMessage(guild, "HELP_UTILS3"),
						inline: true,
					}
				)
			}
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId("page")
					.setPlaceholder(Falbot.getMessage(guild, "PICK_PAGE"))
					.addOptions(
						{
							label: Falbot.getMessage(guild, "INTRODUCTION"),
							value: "introduction",
							emoji: "💠",
						},
						{
							label: Falbot.getMessage(guild, "COMMANDS_ALL"),
							value: "allcommands",
							emoji: "📚",
						},
						{
							label: "Ranks",
							value: "ranks",
							emoji: "📈",
						},
						{
							label: Falbot.getMessage(guild, "ECONOMY"),
							value: "economy",
							emoji: "💸",
						},
						{
							label: Falbot.getMessage(guild, "FUN"),
							value: "fun",
							emoji: "🎉",
						},
						{
							label: Falbot.getMessage(guild, "LANGUAGE"),
							value: "language",
							emoji: "🌎",
						},
						{
							label: Falbot.getMessage(guild, "UTILS"),
							value: "utils",
							emoji: "📝",
						}
					)
			)
			await interaction.editReply({ embeds: [embed], components: [row] })
		} catch (error) {
			console.error(`Help: ${error}`)
		}
	},
}
