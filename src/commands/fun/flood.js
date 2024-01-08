const { SlashCommandBuilder } = require('discord.js');
const { Flood } = require('falgames');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('flood')
		.setNameLocalizations({
			'pt-BR': 'enchente',
			'es-ES': 'inundación',
		})
		.setDescription('Play a game of flood')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue uma partida de enchente',
			'es-ES': 'Juega una partida de inundación',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			const Game = new Flood({
				message: interaction,
				isSlashGame: true,
				embed: {
					title: instance.getMessage(interaction, 'FLOOD_GAME'),
					color: '#6E0070',
				},
				difficulty: 13,
				timeoutTime: 60000,
				buttonStyle: 'PRIMARY',
				emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
				winMessage: instance.getMessage(interaction, 'FLOOD_WIN'),
				loseMessage: instance.getMessage(interaction, 'FLOOD_LOSE'),
				playerOnlyMessage: instance.getMessage(interaction, 'PLAYER_ONLY'),
			});

			Game.startGame();
		} catch (error) {
			console.error(`flood: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
