const { SlashCommandBuilder } = require('discord.js');
const { checkIfUserIsPremium } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('patreon')
		.setDescription('Commands exclusive to Patreon supporters')
		.setDescriptionLocalizations({
			'pt-BR': 'Comandos exclusivos para apoiadores do Patreon',
			'es-ES': 'Comandos exclusivos para los partidarios de Patreon',
		})
		.addSubcommand((subcommand) =>
			subcommand
				.setName('name')
				.setNameLocalizations({
					'pt-BR': 'nome',
					'es-ES': 'nombre',
				})
				.setDescription('Change your name globally in the bot')
				.setDescriptionLocalizations({
					'pt-BR': 'Altere seu nome globalmente no bot',
					'es-ES': 'Cambia tu nombre globalmente en el bot',
				})
				.addStringOption((option) =>
					option
						.setName('name')
						.setNameLocalizations({
							'pt-BR': 'nome',
							'es-ES': 'nombre',
						})
						.setDescription('The new name')
						.setDescriptionLocalizations({
							'pt-BR': 'O novo nome',
							'es-ES': 'El nuevo nombre',
						})
						.setRequired(true)
						.setMinLength(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('color')
				.setNameLocalizations({
					'pt-BR': 'cor',
					'es-ES': 'color',
				})
				.setDescription('Change your embed color globally in the bot')
				.setDescriptionLocalizations({
					'pt-BR': 'Altere sua cor de embed globalmente no bot',
					'es-ES': 'Cambia tu color de embed globalmente en el bot',
				})
				.addStringOption((option) =>
					option
						.setName('color')
						.setNameLocalizations({
							'pt-BR': 'cor',
							'es-ES': 'color',
						})
						.setDescription('The new color (hex)')
						.setDescriptionLocalizations({
							'pt-BR': 'A cor nova (hexadecimal)',
							'es-ES': 'El nuevo color (hexadecimal)',
						})
						.setRequired(true)
						.setMinLength(1)
				)
		)
		.setDMPermission(false),
	execute: async ({ interaction, client, instance, member }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const { userSchema } = instance;
			const subcommand = interaction.options.getSubcommand();

			if (!(await checkIfUserIsPremium(member.id, client))) {
				const embed = instance.createEmbed('#F0F0F0').addFields({
					name: instance.getMessage(interaction, 'NOT_PREMIUM_DESC'),
					value: instance.getMessage(interaction, 'NOT_PREMIUM_DESC2'),
					inline: false,
				});

				return await instance.editReply(interaction, {
					embeds: [embed],
				});
			}

			if (subcommand === 'name') {
				const name = interaction.options.getString('name');
				await userSchema.findByIdAndUpdate(member.id, { 'premium.displayName': name });

				const embed = instance
					.createEmbed(await instance.getUserDisplay('displayColor', member))
					.setTitle(instance.getMessage(interaction, 'PATREON_NAME', { NAME: name }));
				await instance.editReply(interaction, {
					embeds: [embed],
				});
			} else if (subcommand === 'color') {
				const color = interaction.options.getString('color');

				//check if the color is a valid hex color
				if (!/^#[0-9A-F]{6}$/i.test(color)) {
					return await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', { VALUE: color }),
					});
				}
				await userSchema.findByIdAndUpdate(member.id, { 'premium.displayColor': color });

				const embed = instance
					.createEmbed(color)
					.setTitle(instance.getMessage(interaction, 'PATREON_COLOR', { COLOR: color }));
				await instance.editReply(interaction, {
					embeds: [embed],
				});
			}
		} catch (error) {
			console.error(`patreon: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
