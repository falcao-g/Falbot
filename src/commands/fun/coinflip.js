const { randint } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setNameLocalizations({
			'pt-BR': 'caraoucoroa',
			'es-ES': 'caraocruz',
		})
		.setDescription('Flip a coin')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue cara ou coroa',
			'es-ES': 'Tira una moneda',
		})
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName('quantity')
				.setNameLocalizations({
					'pt-BR': 'quantidade',
					'es-ES': 'cantidad',
				})
				.setDescription('quantity of coins to flip')
				.setDescriptionLocalizations({
					'pt-BR': 'quantidade de moedas para girar',
					'es-ES': 'cantidad de monedas para tirar',
				})
				.setMinValue(1)
				.setRequired(true)
		),
	execute: async ({ interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const times = interaction.options.getInteger('quantity');
			const caras = randint(0, times);
			const coroas = times - caras;

			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'COINFLIP', {
					CARAS: caras,
					COROAS: coroas,
					TIMES: times,
				}),
			});
		} catch (error) {
			console.error(`Coinflip: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
