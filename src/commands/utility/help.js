const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setNameLocalizations({
			'pt-BR': 'ajuda',
			'es-ES': 'ayuda',
		})
		.setDescription('Show commands help and information')
		.setDescriptionLocalizations({
			'pt-BR': 'Mostra informações sobre os comandos e sistemas do bot',
			'es-ES': 'Mira información sobre los comandos y sistemas del bot',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('page')
				.setNameLocalizations({
					'pt-BR': 'página',
					'es-ES': 'página',
				})
				.setDescription('which help page you want to see')
				.setDescriptionLocalizations({
					'pt-BR': 'qual página de ajuda você quer ver',
					'es-ES': 'qué página de ayuda quieres ver',
				})
				.setRequired(false)
				.addChoices(
					{
						name: '💠 introduction',
						name_localizations: { 'pt-BR': '💠 introdução', 'es-ES': '💠 introducción' },
						value: 'introduction',
					},
					{
						name: '📚 all commands',
						name_localizations: { 'pt-BR': '📚 todos os comandos', 'es-ES': '📚 todos los comandos' },
						value: 'allcommands',
					},
					{ name: '📈 ranks', value: 'ranks' },
					{
						name: '💸 economy',
						name_localizations: { 'pt-BR': '💸 economia', 'es-ES': '💸 economía' },
						value: 'economy',
					},
					{
						name: '🎉 fun',
						name_localizations: { 'pt-BR': '🎉 diversão', 'es-ES': '🎉 diversión' },
						value: 'fun',
					},
					{
						name: '📝 utils',
						name_localizations: { 'pt-BR': '📝 úteis', 'es-ES': '📝 útil' },
						value: 'utils',
					},
					{
						name: '🎒 items and inventory',
						name_localizations: { 'pt-BR': '🎒 items e inventário', 'es-ES': '🎒 artículos e inventario' },
						value: 'items',
					},
					{
						name: '🏪 market',
						name_localizations: { 'pt-BR': '🏪 mercado', 'es-ES': '🏪 mercado' },
						value: 'market',
					},
					{
						name: '🏞️ farm',
						name_localizations: { 'pt-BR': '🏞️ fazenda', 'es-ES': '🏞️ granja' },
						value: 'farm',
					}
				)
		),
	execute: async ({ interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			if (interaction.options !== undefined) {
				var page = interaction.options.getString('page');
			} else {
				var page = interaction.values[0];
			}

			const embed = instance.createEmbed(7419530);
			if (page === 'introduction') {
				embed.addFields({
					name: instance.getMessage(interaction, 'WELCOME'),
					value: instance.getMessage(interaction, 'HELP_INTRODUCTION2'),
				});
			} else if (page === 'allcommands') {
				embed.setTitle(instance.getMessage(interaction, 'ALL_COMMANDS'));
				embed.addFields({
					name: instance.getMessage(interaction, 'TOO_MANY'),
					value: instance.getMessage(interaction, 'LINK_COMMANDS'),
				});
			} else if (page === 'ranks') {
				embed.setTitle(':chart_with_upwards_trend: Ranks');
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_RANK'),
					value: instance.getMessage(interaction, 'HELP_RANK2'),
				});
			} else if (page === 'economy') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_ECONOMY2'),
					value: instance.getMessage(interaction, 'HELP_ECONOMY3'),
				});
			} else if (page === 'fun') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_FUN'),
					value: instance.getMessage(interaction, 'HELP_FUN2'),
				});
			} else if (page === 'utils') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_UTILS'),
					value: instance.getMessage(interaction, 'HELP_UTILS2'),
				});
			} else if (page === 'items') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_ITEMS'),
					value: instance.getMessage(interaction, 'HELP_ITEMS2'),
				});
			} else if (page === 'market') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_MARKET'),
					value: instance.getMessage(interaction, 'HELP_MARKET2'),
				});
			} else if (page === 'farm') {
				embed.addFields({
					name: instance.getMessage(interaction, 'HELP_FARM'),
					value: instance.getMessage(interaction, 'HELP_FARM2'),
				});
			} else {
				embed.setTitle(instance.getMessage(interaction, 'FALBOT_WELCOME'));
				embed.addFields(
					{
						name: ':diamond_shape_with_a_dot_inside: ' + instance.getMessage(interaction, 'INTRODUCTION'),
						value: instance.getMessage(interaction, 'HELP_INTRODUCTION'),
						inline: true,
					},
					{
						name: ':books: ' + instance.getMessage(interaction, 'COMMANDS_ALL'),
						value: instance.getMessage(interaction, 'COMMANDS_ALL2'),
						inline: true,
					},
					{
						name: ':chart_with_upwards_trend: Ranks',
						value: instance.getMessage(interaction, 'HELP_RANK3'),
						inline: true,
					},
					{
						name: ':money_with_wings: ' + instance.getMessage(interaction, 'ECONOMY'),
						value: instance.getMessage(interaction, 'HELP_ECONOMY'),
						inline: true,
					},
					{
						name: ':tada: ' + instance.getMessage(interaction, 'FUN'),
						value: instance.getMessage(interaction, 'HELP_FUN3'),
						inline: true,
					},
					{
						name: ':pencil: ' + instance.getMessage(interaction, 'UTILS'),
						value: instance.getMessage(interaction, 'HELP_UTILS3'),
						inline: true,
					},
					{
						name: ':school_satchel: ' + instance.getMessage(interaction, 'ITEMS'),
						value: instance.getMessage(interaction, 'HELP_ITEMS3'),
						inline: true,
					},
					{
						name: ':convenience_store: ' + instance.getMessage(interaction, 'MARKET'),
						value: instance.getMessage(interaction, 'HELP_MARKET3'),
						inline: true,
					},
					{
						name: ':park: ' + instance.getMessage(interaction, 'FARM'),
						value: instance.getMessage(interaction, 'HELP_FARM3'),
						inline: true,
					}
				);
			}
			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('help')
					.setPlaceholder(instance.getMessage(interaction, 'PICK_PAGE'))
					.addOptions(
						{
							label: instance.getMessage(interaction, 'INTRODUCTION'),
							value: 'introduction',
							emoji: '💠',
						},
						{
							label: instance.getMessage(interaction, 'COMMANDS_ALL'),
							value: 'allcommands',
							emoji: '📚',
						},
						{
							label: 'Ranks',
							value: 'ranks',
							emoji: '📈',
						},
						{
							label: instance.getMessage(interaction, 'ECONOMY'),
							value: 'economy',
							emoji: '💸',
						},
						{
							label: instance.getMessage(interaction, 'FUN'),
							value: 'fun',
							emoji: '🎉',
						},
						{
							label: instance.getMessage(interaction, 'UTILS'),
							value: 'utils',
							emoji: '📝',
						},
						{
							label: instance.getMessage(interaction, 'ITEMS'),
							value: 'items',
							emoji: '🎒',
						},
						{
							label: instance.getMessage(interaction, 'MARKET'),
							value: 'market',
							emoji: '🏪',
						},
						{
							label: instance.getMessage(interaction, 'FARM'),
							value: 'farm',
							emoji: '🏞️',
						}
					)
			);
			await instance.editReply(interaction, { embeds: [embed], components: [row] });
		} catch (error) {
			console.error(`Help: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
