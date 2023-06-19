const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setNameLocalization("pt-BR", "ajuda")
		.setDescription("Show commands help and information")
		.setDescriptionLocalization("pt-BR", "Mostra informações sobre os comandos e sistemas do bot")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("page")
				.setNameLocalization("pt-BR", "página")
				.setDescription("which help page you want to see")
				.setDescriptionLocalization("pt-BR", "qual página de ajuda você quer ver")
				.setRequired(false)
				.addChoices(
					{
						name: "💠 introduction",
						name_localizations: { "pt-BR": "💠 introdução" },
						value: "introduction",
					},
					{
						name: "📚 all commands",
						name_localizations: { "pt-BR": "📚 todos os comandos" },
						value: "allcommands",
					},
					{ name: "📈 ranks", value: "ranks" },
					{
						name: "💸 economy",
						name_localizations: { "pt-BR": "💸 economia" },
						value: "economy",
					},
					{
						name: "🎉 fun",
						name_localizations: { "pt-BR": "🎉 diversão" },
						value: "fun",
					},
					{
						name: "📝 utils",
						name_localizations: { "pt-BR": "📝 úteis" },
						value: "utils",
					},
					{
						name: "🎒 items and inventory",
						name_localizations: { "pt-BR": "🎒 items e inventário" },
						value: "items",
					},
					{
						name: "⚙️ config",
						name_localizations: { "pt-BR": "⚙️ configuração" },
						value: "config",
					}
				)
		),
	execute: async ({ interaction, instance }) => {
		await interaction.deferReply()
		try {
			if (interaction.options !== undefined) {
				var page = interaction.options.getString("page")
			} else {
				var page = interaction.values[0]
			}

			const embed = new EmbedBuilder().setColor(7419530).setFooter({ text: "by Falcão ❤️" })
			if (page === "introduction") {
				embed.addFields({
					name: instance.getMessage(interaction, "WELCOME"),
					value: instance.getMessage(interaction, "HELP_INTRODUCTION2"),
				})
			} else if (page === "allcommands") {
				embed.setTitle(instance.getMessage(interaction, "ALL_COMMANDS"))
				embed.addFields({
					name: instance.getMessage(interaction, "TOO_MANY"),
					value: instance.getMessage(interaction, "LINK_COMMANDS"),
				})
			} else if (page === "ranks") {
				embed.setTitle(":chart_with_upwards_trend: Ranks")
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_RANK"),
					value: instance.getMessage(interaction, "HELP_RANK2"),
				})
			} else if (page === "economy") {
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_ECONOMY2"),
					value: instance.getMessage(interaction, "HELP_ECONOMY3"),
				})
			} else if (page === "fun") {
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_FUN"),
					value: instance.getMessage(interaction, "HELP_FUN2"),
				})
			} else if (page === "utils") {
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_UTILS"),
					value: instance.getMessage(interaction, "HELP_UTILS2"),
				})
			} else if (page === "items") {
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_ITEMS"),
					value: instance.getMessage(interaction, "HELP_ITEMS2"),
				})
			} else if (page === "config") {
				embed.addFields({
					name: instance.getMessage(interaction, "HELP_CONFIG"),
					value: instance.getMessage(interaction, "HELP_CONFIG2"),
				})
			} else {
				embed.setTitle(instance.getMessage(interaction, "FALBOT_WELCOME"))
				embed.addFields(
					{
						name: ":diamond_shape_with_a_dot_inside: " + instance.getMessage(interaction, "INTRODUCTION"),
						value: instance.getMessage(interaction, "HELP_INTRODUCTION"),
						inline: true,
					},
					{
						name: ":books: " + instance.getMessage(interaction, "COMMANDS_ALL"),
						value: instance.getMessage(interaction, "COMMANDS_ALL2"),
						inline: true,
					},
					{
						name: ":chart_with_upwards_trend: Ranks",
						value: instance.getMessage(interaction, "HELP_RANK3"),
						inline: true,
					},
					{
						name: ":money_with_wings: " + instance.getMessage(interaction, "ECONOMY"),
						value: instance.getMessage(interaction, "HELP_ECONOMY"),
						inline: true,
					},
					{
						name: ":tada: " + instance.getMessage(interaction, "FUN"),
						value: instance.getMessage(interaction, "HELP_FUN3"),
						inline: true,
					},
					{
						name: ":pencil: " + instance.getMessage(interaction, "UTILS"),
						value: instance.getMessage(interaction, "HELP_UTILS3"),
						inline: true,
					},
					{
						name: ":school_satchel: " + instance.getMessage(interaction, "ITEMS"),
						value: instance.getMessage(interaction, "HELP_ITEMS3"),
						inline: true,
					},
					{
						name: ":gear: " + instance.getMessage(interaction, "CONFIG"),
						value: instance.getMessage(interaction, "HELP_CONFIG3"),
						inline: true,
					}
				)
			}
			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("page")
					.setPlaceholder(instance.getMessage(interaction, "PICK_PAGE"))
					.addOptions(
						{
							label: instance.getMessage(interaction, "INTRODUCTION"),
							value: "introduction",
							emoji: "💠",
						},
						{
							label: instance.getMessage(interaction, "COMMANDS_ALL"),
							value: "allcommands",
							emoji: "📚",
						},
						{
							label: "Ranks",
							value: "ranks",
							emoji: "📈",
						},
						{
							label: instance.getMessage(interaction, "ECONOMY"),
							value: "economy",
							emoji: "💸",
						},
						{
							label: instance.getMessage(interaction, "FUN"),
							value: "fun",
							emoji: "🎉",
						},
						{
							label: instance.getMessage(interaction, "UTILS"),
							value: "utils",
							emoji: "📝",
						},
						{
							label: instance.getMessage(interaction, "ITEMS"),
							value: "items",
							emoji: "🎒",
						},
						{
							label: instance.getMessage(interaction, "CONFIG"),
							value: "config",
							emoji: "⚙️",
						}
					)
			)
			await interaction.editReply({ embeds: [embed], components: [row] })
		} catch (error) {
			console.error(`Help: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
